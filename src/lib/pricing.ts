// Lớp truy cập DUY NHẤT tới data/pricing.json — single source of truth về giá.
// KHÔNG hardcode giá trong component; mọi nơi import từ đây.
import raw from '../../data/pricing.json';

export type LoaiRuou = 'vang' | 'manh' | null;

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
}

export interface KhachSan {
  id: string;
  ten: string;
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
