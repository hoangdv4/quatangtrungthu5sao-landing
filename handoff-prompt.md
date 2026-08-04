# Handoff cho Claude Code — bước A2, deadline live 05/08

## Chuẩn bị (1 lần)

```bash
cd "D:\OneDrive\SVTECH\Hoang.Dinh\Trung thu 2026\landing-page"
# Cần: Node 20+, git. CLAUDE.md trong folder này sẽ tự được Claude Code đọc.
claude
```

Trước khi chạy Phase 1: copy `site.config.example.ts` → điền brand/SĐT/Zalo thật (Claude Code sẽ đặt vào `src/config/site.ts`).

## Phase 1 — Scaffold (paste vào Claude Code)

```text
Đọc CLAUDE.md, data/pricing.json và data/site-content.md. Scaffold Astro project
ngay trong folder này: Astro + Tailwind, output static, @astrojs/sitemap.
Tạo src/config/site.ts từ site.config.example.ts (giữ placeholder nếu tôi chưa điền),
.env từ .env.example, gitignore cả hai. Layout chung: header (logo text + nút Zalo),
footer theo Khối 7, floating nút Gọi + Zalo trên mobile, slot Meta Pixel + Google tag
đọc từ env PUBLIC_* (env trống thì không render script).
Dựng trang chủ / theo khung 7 khối trong data/site-content.md.
Chưa cần 7 trang con. npm run build phải pass, Lighthouse mobile ≥ 95.
```

## Phase 2 — 7 trang con + /hop-vip

```text
Tạo 7 trang con + /hop-vip theo khuôn trong data/site-content.md, data đổ từ
data/pricing.json (dùng ten_hien_thi + gia_da_vat, bảng HTML, KHÔNG ảnh bảng giá).
Mỗi trang: schema JSON-LD Product + Offer + FAQPage + LocalBusiness trong <head>,
meta title/description theo mẫu mục 6 (không chứa chữ "rượu"), dateModified.
Nhắc lại quy tắc C0 trong CLAUDE.md: tên hãng rượu không xuất hiện ở bất kỳ đâu.
Validate schema từng trang bằng cách in JSON-LD ra và tự kiểm tra cú pháp.
```

## Phase 3 — GEO plumbing + form

```text
1. public/robots.txt: allow GPTBot, OAI-SearchBot, Google-Extended, PerplexityBot,
   ClaudeBot, Bingbot (và mọi bot khác).
2. public/llms.txt theo draft mục 5 của data/site-content.md.
3. IndexNow: sinh key, đặt file key ở public/, viết scripts/indexnow.sh nhận danh
   sách URL và curl submit tới api.indexnow.org.
4. Form B2B (Khối 5): POST tới import.meta.env.PUBLIC_FORM_ENDPOINT bằng
   fetch mode:'no-cors' (Apps Script không trả CORS header — hiển thị success
   phía client sau khi gửi, không đọc response). Kèm hidden utm_source/utm_campaign
   đọc từ URL. Sau submit thành công: fire fbq('track','Lead') + gtag conversion.
   Click nút Zalo/Gọi: fire fbq('track','Contact') + gtag event.
```

## Phase 4 — Deploy Cloudflare Pages

```text
Hướng dẫn tôi từng bước: tạo repo git + push lên GitHub (private),
Cloudflare Pages connect repo (build: npm run build, output: dist),
khai báo env PUBLIC_* trong Pages Settings, trỏ nameserver domain
quatangtrungthu5sao.com về Cloudflare, add custom domain vào Pages project.
Sau khi live: checklist verify — https hoạt động, robots.txt/llms.txt/sitemap.xml
truy cập được, form test bắn vào Sheet, Pixel/tag fire (dùng Meta Pixel Helper).
```

## Sau khi live (thuộc B4, không chặn A2)

- Google Search Console: verify domain, submit sitemap.
- Bing Webmaster Tools: import từ GSC, submit sitemap + 8 URL thủ công.
- Chạy `scripts/indexnow.sh` với 8 URL.
- ~~Ảnh thật từ SALE KIT~~ → **ĐÃ THAY BẰNG FILE RIÊNG: dùng `handoff-prompt-phase5-anh-that.md`** (bản đầy đủ hơn: ảnh đủ 7/7 KS gồm Hilton, đổi tên hiển thị Hilton/Nikko/Renaissance/Sofitel sang Sài Gòn giữ nguyên URL, khai thác brochure trong folder Catalogue Khách Sạn). KHÔNG dùng prompt cũ ở dòng này nữa.

## Việc cần bạn tự làm (Claude Code không làm được)

| Việc | Ở đâu |
|---|---|
| Điền brand/SĐT/Zalo vào `src/config/site.ts` | máy bạn |
| Tạo Sheet + deploy Apps Script | `apps-script/HUONG-DAN.md` |
| Lấy Meta Pixel ID (B1) + Google tag ID (B2) → điền `.env` + Cloudflare | Meta BM / Google Ads |
| Mua/quản lý domain, đổi nameserver | registrar của bạn |
