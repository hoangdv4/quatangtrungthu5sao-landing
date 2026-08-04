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

/** Ảnh theo khách sạn (id trong pricing.json), sắp xếp theo tên file (01, 02, ...). */
export function anhKhachSan(hotelId: string): ImageMetadata[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/assets/${hotelId}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

/** Ảnh hộp SMA — dùng cho khối B2B trang chủ, không gắn khách sạn cụ thể. */
export const ANH_SMA: ImageMetadata[] = Object.entries(smaModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default);
