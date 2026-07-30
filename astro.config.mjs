// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain đọc từ site.ts để sitemap/canonical dùng chung một nguồn.
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.domain,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /hop-vip có mặt trong sitemap nhưng priority thấp (ads không trỏ vào).
      serialize(item) {
        if (item.url.includes('/hop-vip')) item.priority = 0.3;
        else if (item.url.replace(SITE.domain, '').replace(/\/$/, '') === '') item.priority = 1.0;
        else item.priority = 0.8;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
