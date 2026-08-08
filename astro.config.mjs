// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { PAGE_MODIFIED } from './src/lib/pricing.ts';

// Domain hardcode ở đây (KHÔNG import từ src/config/site.ts — file đó đã gitignore,
// astro.config.mjs phải build được ngay cả khi site.ts chưa tồn tại trên máy CI/CD).
// Domain là thông tin công khai nên không có vấn đề gì khi đặt thẳng ở config.
const DOMAIN = 'https://quatangtrungthu5sao.com';

export default defineConfig({
  site: DOMAIN,
  output: 'static',
  // Astro build mỗi trang thành thư mục (<slug>/index.html), nên Cloudflare Pages
  // luôn chuẩn hoá URL bằng cách thêm dấu / cuối và trả 308 cho bản không có.
  // Đặt 'always' để canonical + sitemap khai đúng URL mà server thật phục vụ —
  // nếu để 'ignore', Google nhận URL không / từ sitemap, bị 308 sang bản có /,
  // rồi trang đó lại khai canonical là bản không / → tín hiệu mâu thuẫn, chậm index.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // /hop-vip bị loại hoàn toàn (noindex, ads không trỏ vào — xem robots.txt).
      // /so-sanh vẫn ở sitemap nhưng priority thấp (không phải trang đích ads chính).
      // lastmod lấy từ PAGE_MODIFIED (src/lib/pricing.ts) — nguồn dùng chung với
      // dateModified trên từng trang, cập nhật ở đó khi nội dung đổi.
      filter: (page) => !page.includes('/hop-vip'),
      serialize(item) {
        // URL giữ nguyên dấu / cuối do trailingSlash:'always' sinh ra — đúng bản
        // mà Cloudflare phục vụ, khớp canonical, không tạo thêm nhịp 308.
        // Key của PAGE_MODIFIED không có dấu / cuối nên phải bỏ đi khi tra cứu.
        const path = item.url.replace(DOMAIN, '').replace(/\/$/, '') || '/';
        item.lastmod = PAGE_MODIFIED[path] ?? '2026-07-31';
        if (path === '/so-sanh') item.priority = 0.3;
        else if (path === '/') item.priority = 1.0;
        else item.priority = 0.8;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
