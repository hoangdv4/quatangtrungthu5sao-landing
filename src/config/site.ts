// ĐÂY LÀ FILE THẬT — sinh từ site.config.example.ts. CÓ commit vào git
// (không gitignore): site build tĩnh cần file này tồn tại lúc build trên CI/CD
// (Cloudflare Pages), không có runtime nào khác để đọc config ngoài lúc build.
// MỘT chỗ duy nhất chứa thông tin thương hiệu/liên hệ, mọi trang import từ đây.
//
// Lưu ý: đây là thông tin HIỂN THỊ CÔNG KHAI trên website (khách phải thấy SĐT
// mới gọi được) — không có gì "bí mật" ở đây, tách riêng file chỉ để đổi
// brand/SĐT không cần sửa code rải rác.
//
// QUAN TRỌNG (GEO): brand + phone + khu vực phải giống HỆT 100% trên
// fanpage, Zalo OA, Google Business Profile và footer mọi trang.

export const SITE = {
  // Tên thương hiệu bán lẻ của BẠN (không phải tên khách sạn, không phải tên
  // công ty nguồn hàng).
  // Xuất hiện ở: logo text, footer, schema LocalBusiness, title các trang.
  brand: "Quà Tặng Trung Thu 5 Sao",

  domain: "https://quatangtrungthu5sao.com",

  phone: "0396679426",          // hotline, dùng cho tel: và hiển thị
  zalo: "https://zalo.me/2293658709074226764", // hoặc link OA: https://zalo.me/<OA_ID>
  email: "hoangdv4@gmail.com",                 // để trống nếu không dùng email trên site
  messenger: "https://m.me/quatangks",

  area: "Giao nhanh 24–48h nội thành Hà Nội — ship toàn quốc 2–4 ngày",

  // Schema LocalBusiness
  addressLocality: "Hà Nội",
  addressCountry: "VN",
} as const;

/** SĐT dạng chỉ số, dùng cho href="tel:" */
export const PHONE_TEL = SITE.phone.replace(/[^\d+]/g, "");

/** SĐT dạng dễ đọc: 0396 679 426 */
export const PHONE_DISPLAY = PHONE_TEL.replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3");
