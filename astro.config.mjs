// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain hardcode ở đây (KHÔNG import từ src/config/site.ts — file đó đã gitignore,
// astro.config.mjs phải build được ngay cả khi site.ts chưa tồn tại trên máy CI/CD).
// Domain là thông tin công khai nên không có vấn đề gì khi đặt thẳng ở config.
const DOMAIN = 'https://quatangtrungthu5sao.com';

export default defineConfig({
  site: DOMAIN,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /hop-vip có mặt trong sitemap nhưng priority thấp (ads không trỏ vào).
      serialize(item) {
        if (item.url.includes('/hop-vip')) item.priority = 0.3;
        else if (item.url.replace(DOMAIN, '').replace(/\/$/, '') === '') item.priority = 1.0;
        else item.priority = 0.8;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
