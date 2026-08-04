// Lớp truy cập DUY NHẤT tới data/pricing.json — single source of truth về giá.
// KHÔNG hardcode giá trong component; mọi nơi import từ đây.
import raw from '../../data/pricing.json';

export type LoaiRuou = 'vang' | 'manh' | null;

/** Màu chủ đạo hộp — enum cố định để UI filter không nổ số lựa chọn. */
export type MauSac = 'vàng' | 'xanh dương' | 'xanh rêu' | 'be/kem' | 'hồng/đỏ' | 'nâu/cam đất';

/** Chất liệu chủ đạo hộp (hộp có thể pha trộn — chọn 1 giá trị nổi bật nhất). */
export type ChatLieu = 'giấy/carton' | 'da/simili' | 'vải' | 'kim loại';

/** Đối tượng phù hợp biếu tặng — có thể nhiều giá trị/SKU. */
export type DoiTuong = 'đối tác' | 'khách VIP/lãnh đạo' | 'gia đình' | 'nhân viên/nội bộ';

export interface SanPham {
  stt: number;
  /** CHỈ dùng trong PDF B2B / tư vấn 1-1 — KHÔNG render ra trang public (quy tắc C0). */
  ten_day_du: string;
  /** Tên đã sanitize theo C0 — dùng trên mọi trang public. */
  ten_hien_thi: string;
  quy_cach: string;
  gia_chua_vat: number;
  vat: number;
  gia_da_vat: number;
  ruou: LoaiRuou;
  /** Suy luận từ ảnh thật + mô tả — đã qua rà soát thủ công (xem bảng duyệt trong PR). */
  mau_sac: MauSac;
  chat_lieu: ChatLieu;
  doi_tuong: DoiTuong[];
}

export interface KhachSan {
  id: string;
  ten: string;
  /** Thành phố đặt khách sạn — quyết định câu văn giao hàng/freeship theo đúng vùng. */
  thanh_pho: 'Hà Nội' | 'Sài Gòn';
  hsd_ngay: number;
  gia_tu: number;
  gia_den: number;
  san_pham: SanPham[];
}

export const KHACH_SAN = raw.khach_san as KhachSan[];

/** Slug trang con của từng khách sạn (khớp cấu trúc 8 trang trong CLAUDE.md). */
const SLUG: Record<string, string> = {
  sheraton: '/banh-trung-thu-sheraton-ha-noi',
  'intercontinental-lm72': '/banh-trung-thu-intercontinental-landmark72',
  melia: '/banh-trung-thu-melia-ha-noi',
  renaissance: '/banh-trung-thu-renaissance-ha-noi',
  sofitel: '/banh-trung-thu-sofitel',
  hilton: '/banh-trung-thu-hilton-ha-noi',
  nikko: '/banh-trung-thu-nikko-ha-noi',
};

export const duongDan = (id: string) => SLUG[id] ?? '/';

export const layKhachSan = (id: string) => KHACH_SAN.find((ks) => ks.id === id);

/** 889.000đ — định dạng giá VN, dùng thống nhất toàn site. */
export function dinhDangGia(gia: number): string {
  return new Intl.NumberFormat('vi-VN').format(gia) + 'đ';
}

/** Khoảng giá đã VAT của một khách sạn. */
export function khoangGia(ks: KhachSan): string {
  return `${dinhDangGia(ks.gia_tu)} – ${dinhDangGia(ks.gia_den)}`;
}

/** Giá thấp nhất / cao nhất toàn site (dùng cho llms.txt, meta, schema). */
export const GIA_MIN = Math.min(...KHACH_SAN.map((ks) => ks.gia_tu));
export const GIA_MAX = Math.max(...KHACH_SAN.map((ks) => ks.gia_den));
export const TONG_SO_MAU = KHACH_SAN.reduce((n, ks) => n + ks.san_pham.length, 0);

/** Hộp có quà tặng kèm (ruou != null) — chỉ hiển thị ở /hop-vip. */
export const coQuaTang = (sp: SanPham) => sp.ruou !== null;

/** Toàn bộ SKU của mọi khách sạn, kèm tham chiếu ngược tới khách sạn — dùng cho filter/concierge/so sánh. */
export const TAT_CA_SAN_PHAM: { ks: KhachSan; sp: SanPham }[] = KHACH_SAN.flatMap((ks) =>
  ks.san_pham.map((sp) => ({ ks, sp }))
);

/** Danh sách giá trị duy nhất, giữ nguyên thứ tự xuất hiện — dùng để render option filter mà không hardcode enum song song. */
function danhSachDuyNhat<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export const MAU_SAC_LIST = danhSachDuyNhat(TAT_CA_SAN_PHAM.map(({ sp }) => sp.mau_sac));
export const CHAT_LIEU_LIST = danhSachDuyNhat(TAT_CA_SAN_PHAM.map(({ sp }) => sp.chat_lieu));
export const DOI_TUONG_LIST = danhSachDuyNhat(TAT_CA_SAN_PHAM.flatMap(({ sp }) => sp.doi_tuong));
