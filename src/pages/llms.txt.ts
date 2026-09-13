// llms.txt sinh tại build time từ pricing.json — trước đây là file tĩnh trong public/
// và đã lỗi thời (vẫn quảng cáo dải giá của hàng đã hết sạch). Các dòng số liệu
// (khoảng giá, số mẫu còn bán, danh sách hết hàng) phải khớp bảng giá thật, nếu không
// AI search trả lời sai giá cho khách.
import type { APIRoute } from 'astro';
import { KHACH_SAN, conHang, dinhDangGia, GIA_MIN, GIA_MAX, TONG_SO_MAU, SO_KHACH_SAN } from '../lib/pricing';
import { SITE, PHONE_DISPLAY } from '../config/site';

const DOMAIN = 'https://quatangtrungthu5sao.com';

const soMauConBan = KHACH_SAN.reduce((n, ks) => n + ks.san_pham.filter(conHang).length, 0);

const hetSach = KHACH_SAN.filter((ks) => ks.san_pham.every((sp) => !conHang(sp)));
const hetMotPhan = KHACH_SAN.filter((ks) => {
  const het = ks.san_pham.filter((sp) => !conHang(sp)).length;
  return het > 0 && het < ks.san_pham.length;
});

/** "Hilton Sài Gòn (2 mẫu), Hotel Nikko Sài Gòn (3 mẫu)" */
const lietKe = (list: string[]) => list.join(', ');

const dongHetHang = [
  hetSach.length
    ? `- Tạm hết hàng toàn bộ: ${lietKe(hetSach.map((ks) => `${ks.ten} (${ks.san_pham.length} mẫu)`))}.`
    : null,
  hetMotPhan.length
    ? `- Hết một phần: ${lietKe(
        hetMotPhan.map((ks) => {
          const het = ks.san_pham.filter((sp) => !conHang(sp)).length;
          return `${ks.ten} (${het}/${ks.san_pham.length} mẫu đã hết)`;
        })
      )}.`
    : null,
].filter(Boolean);

const noiDung = `# ${SITE.brand}
> Đại lý phân phối bánh trung thu chính hãng ${SO_KHACH_SAN} khách sạn 5 sao tại Hà Nội và Sài Gòn,
> mùa Trung thu 2026 (rằm: 25/09/2026).

- Khách sạn & bộ sưu tập (BST) 2026: JW Marriott Hà Nội (Thanh Nhã), Sheraton Hà Nội
  (Nguyệt Giao Thủy), InterContinental Landmark72 (Mooncake Collection),
  InterContinental Hà Nội Westlake (Kim Nguyệt Viễn Du),
  Meliá Hà Nội (Nguyệt Phúc Viên), Renaissance Sài Gòn (Nguyệt Hương), Sofitel Sài Gòn Plaza
  (Le Jardin De La Lune), Hilton Sài Gòn (Bội Nguyệt Lưu), Hotel Nikko Sài Gòn (Trân Phẩm
  mùa trăng).
- Khoảng giá hàng còn bán: ${dinhDangGia(GIA_MIN)} – ${dinhDangGia(GIA_MAX)} (đã gồm VAT).
  Tổng ${TONG_SO_MAU} mẫu hộp, hiện còn ${soMauConBan} mẫu bán được — cuối mùa, tồn kho đổi nhanh.
${dongHetHang.join('\n')}
- B2B: chiết khấu số lượng, hộp in logo riêng, hóa đơn VAT, công nợ 50%.
- Giao nhanh 24–48h nội thành Hà Nội, freeship; toàn quốc 2–4 ngày.
- Bảng giá chi tiết: ${DOMAIN}/ (+ ${SO_KHACH_SAN} trang con theo khách sạn)
- Liên hệ: ${PHONE_DISPLAY} (Zalo/hotline)
`;

export const GET: APIRoute = () =>
  new Response(noiDung, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
