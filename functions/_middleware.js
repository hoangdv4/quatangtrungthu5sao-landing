// Cloudflare Pages Function — chạy trước khi trả mọi trang tĩnh của Astro.
//
// Mục đích: cho phép content fanpage luôn dán link SẠCH
//   🌐 https://quatangtrungthu5sao.com
// mà vẫn tự động được gắn UTM khi khách bấm từ Facebook, không cần đổi link
// mỗi lần đăng bài. Không đụng vào link đã có UTM sẵn (ads, PR, Zalo...).
//
// Cách hoạt động: đọc header Referer (trình duyệt tự gửi khi bấm link từ
// Facebook) — nếu đúng là từ Facebook/Instagram và URL chưa có utm_source,
// redirect 302 ngầm sang bản có UTM rồi mới phục vụ trang.
//
// Giới hạn đã biết: một số trình duyệt trong app Facebook (nhất là iOS) đôi khi
// không gửi Referer đầy đủ vì lý do riêng tư — khi đó lượt truy cập sẽ không
// được gắn "facebook" (hiện thành "không rõ nguồn"), KHÔNG bị gắn nhầm sang
// kênh khác. Chấp nhận được vì đây chỉ áp dụng cho organic, không phải ads.

const FB_REFERER = /facebook\.com|fb\.watch|instagram\.com/i;

const DEFAULT_UTM = {
  utm_source: 'facebook',
  utm_medium: 'organic',
  utm_campaign: 'fanpage_post',
};

export async function onRequest(context) {
  const { request, next } = context;

  // Chỉ can thiệp vào điều hướng trang (document), không đụng ảnh/css/js/api —
  // tránh redirect thừa cho các request phụ trong lúc trang đã tải xong.
  const dest = request.headers.get('Sec-Fetch-Dest');
  if (dest && dest !== 'document') {
    return next();
  }

  const url = new URL(request.url);

  // Đã có UTM (ví dụ link ads Meta, PR, Zalo tự gắn sẵn) → không đụng vào.
  if (url.searchParams.has('utm_source')) {
    return next();
  }

  const referer = request.headers.get('Referer') || '';
  if (!FB_REFERER.test(referer)) {
    return next();
  }

  for (const [key, value] of Object.entries(DEFAULT_UTM)) {
    url.searchParams.set(key, value);
  }

  return Response.redirect(url.toString(), 302);
}
