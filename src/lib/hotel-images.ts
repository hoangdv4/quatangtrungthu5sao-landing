// Ảnh thật từ SALE KIT (nguồn: ../SALE KIT TRUNG THU 2026/, chọn lọc theo quy tắc C0 —
// không ảnh lộ chai rượu/tên hãng rượu ở trang đích). Dùng import.meta.glob để tự động
// nạp toàn bộ ảnh trong src/assets/<hotel-id>/ mà không cần khai báo thủ công từng file.
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/*/banh-trung-thu-*.webp',
  { eager: true }
);

const smaModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/sma/*.webp',
  { eager: true }
);

// Ảnh đại diện từng SKU (nguồn: BAOGIA.xlsx, đã rà soát thủ công loại bỏ mọi ảnh
// lộ chai/ly rượu theo quy tắc C0 — SKU có rượu dùng ảnh hộp đóng nắp cùng dòng sản phẩm).
const skuModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/*/sku/sku-*.webp',
  { eager: true }
);

/** Ảnh theo khách sạn (id trong pricing.json), sắp xếp theo tên file (01, 02, ...). */
export function anhKhachSan(hotelId: string): ImageMetadata[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/assets/${hotelId}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

/** Ảnh đại diện của một SKU cụ thể (theo stt trong pricing.json), undefined nếu chưa có. */
export function layAnhSku(hotelId: string, stt: number): ImageMetadata | undefined {
  const suffix = `/assets/${hotelId}/sku/sku-${stt}.webp`;
  const entry = Object.entries(skuModules).find(([path]) => path.endsWith(suffix));
  return entry?.[1].default;
}

/** Ảnh hộp SMA — dùng cho khối B2B trang chủ, không gắn khách sạn cụ thể. */
export const ANH_SMA: ImageMetadata[] = Object.entries(smaModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default);

// Logo thật 7 khách sạn (thư mục /logo ở root repo, ngoài src/ — khách hàng có quyền dùng logo chính thức).
const logoModules = import.meta.glob<string>('../../logo/*.{svg,png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const LOGO_FILE_TO_ID: Record<string, string> = {
  sheraton: 'sheraton',
  intercontinental: 'intercontinental-lm72',
  melia: 'melia',
  renaissance: 'renaissance',
  sofitel: 'sofitel',
  hilton: 'hilton',
  nikko: 'nikko',
};

const LOGO_BY_ID: Record<string, string> = Object.fromEntries(
  Object.entries(logoModules).flatMap(([path, url]) => {
    const fileName = path.split('/').pop()?.replace(/\.(svg|png|jpe?g)$/i, '').toLowerCase() ?? '';
    const id = LOGO_FILE_TO_ID[fileName];
    return id ? [[id, url]] : [];
  })
);

/** Logo thật của khách sạn (SVG/PNG tại /logo), undefined nếu chưa map được. */
export function layLogo(hotelId: string): string | undefined {
  return LOGO_BY_ID[hotelId];
}
