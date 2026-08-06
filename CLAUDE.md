# CLAUDE.md — Landing page `quatangtrungthu5sao.com`

## Bối cảnh

Landing page bán bánh trung thu chính hãng 7 khách sạn 5 sao (Hà Nội), phục vụ chiến dịch 10/08 → 24/09/2026. Hai phân khúc: B2C (mua lẻ biếu tặng) và B2B (doanh nghiệp đặt số lượng, cần VAT, hộp in logo). Chủ dự án là engineer (JNCIE-SP) — không ngại kỹ thuật, ghét over-engineering.

**Deadline: site live trước 05/08/2026.** Index Google/Bing cần 2–4 tuần để "ngấm" vào AI search (GEO) — mỗi ngày chậm là một ngày mất GEO.

## Stack (đã chốt — không đổi)

- **Astro** (output static) + **Tailwind CSS**. KHÔNG React, KHÔNG backend, KHÔNG CMS.
- Hosting: **Cloudflare Pages**, deploy bằng git push. Domain `quatangtrungthu5sao.com` trỏ nameserver về Cloudflare.
- Form B2B: POST tới Google Apps Script Web App (code sẵn trong `apps-script/Code.gs`) → ghi Google Sheet + notify.
- Nút Zalo/Gọi: link thường (`https://zalo.me/<SĐT>`, `tel:`) + fire event tracking khi click.

## Nguồn dữ liệu — quy tắc bất di bất dịch

- **`data/pricing.json` là single source of truth về giá.** KHÔNG hardcode giá trong component. Giá hiển thị = `gia_da_vat`, luôn kèm chữ "đã gồm VAT".
- Trên mọi trang public dùng `ten_hien_thi`, KHÔNG dùng `ten_day_du` (đã sanitize tên rượu — xem Quy tắc rượu bên dưới).
- Thông tin liên hệ/thương hiệu: đọc từ `src/config/site.ts` (tạo từ `site.config.example.ts`) — một chỗ duy nhất, mọi trang import. File thật đã gitignore.
- Secrets/ID tracking: `.env` (theo `.env.example`), đã gitignore. Trên Cloudflare Pages khai báo trong Settings → Environment variables.

## Cấu trúc 8 trang

1. `/` — trang chủ theo khung 7 khối (nội dung sẵn trong `data/site-content.md`).
2. `/banh-trung-thu-sheraton-ha-noi`
3. `/banh-trung-thu-intercontinental-landmark72`
4. `/banh-trung-thu-melia-ha-noi`
5. `/banh-trung-thu-renaissance-sai-gon`
6. `/banh-trung-thu-sofitel-sai-gon`
7. `/banh-trung-thu-hilton-sai-gon`
8. `/banh-trung-thu-nikko-sai-gon`

Thêm: `/hop-vip` (các hộp kèm rượu mạnh — ads KHÔNG BAO GIỜ trỏ vào trang này).

Mỗi trang con dùng chung 1 layout, đổ data từ `pricing.json` theo `id` khách sạn. Khuôn nội dung từng trang: xem `data/site-content.md` (H1 → đoạn mở 40–60 từ trả lời thẳng → bảng giá HTML → tư vấn chọn hộp → FAQ → ngày cập nhật + liên hệ).

## ⚠️ Quy tắc rượu (C0 — vi phạm là bay tài khoản ads)

Rượu ≥15° cấm quảng cáo tại VN; Meta/Google/Zalo quét cả text lẫn ảnh:

| Vùng | Quy tắc |
|---|---|
| Trang đích của ads (trang chủ, trang con KS) | Không chữ "rượu" trong meta title/description/OG. Trong bảng giá dùng `ten_hien_thi` (đã sanitize: vang → "kèm rượu vang", rượu mạnh → "kèm quà tặng thượng hạng"). Không ảnh lộ chai |
| `/hop-vip` | Được ghi "kèm rượu vang/quà tặng cao cấp", vẫn KHÔNG nêu tên hãng rượu. Ads không trỏ vào, không đưa vào sitemap ưu tiên |
| Không bao giờ | Tên hãng rượu (Macallan, Glenfiddich, Lady Triệu...) xuất hiện ở bất kỳ đâu trên site |

## Checklist kỹ thuật (A2.2 — lý do chọn tự code thay vì Ladipage)

- [ ] Schema JSON-LD trong `<head>` từng trang: `Product` + `Offer` (giá thật từ pricing.json) + `FAQPage` + `LocalBusiness`. Validate bằng validator.schema.org + Google Rich Results Test.
- [ ] `robots.txt` tại root: allow `GPTBot`, `OAI-SearchBot`, `Google-Extended`, `PerplexityBot`, `ClaudeBot`, `Bingbot`.
- [ ] `llms.txt` tại root: ~10 dòng — bán gì, 7 khách sạn, khoảng giá 889k–7,7tr, USP (chính hãng, VAT, giao 24–48h HN), SĐT/Zalo.
- [ ] `sitemap.xml` (dùng `@astrojs/sitemap`) + `article:modified_time`/`dateModified` mỗi trang.
- [ ] Bảng giá là **bảng HTML chữ**, tuyệt đối không dùng ảnh chụp bảng — AI không đọc ảnh.
- [ ] Ảnh: WebP, lazy-load, tên file chứa từ khóa (`banh-trung-thu-sheraton-thanh-1.webp`), alt text đầy đủ. Ảnh thật từ SALE KIT có sau 06/08 — dùng placeholder trước, cấu trúc sẵn thư mục `src/assets/<hotel-id>/`.
- [ ] **IndexNow**: file key tại root + script `scripts/indexnow.sh` (curl submit URL mỗi lần cập nhật).
- [ ] Meta Pixel + Google tag trong layout chung (ID từ `.env`, biến `PUBLIC_*`). Event: `Lead` (submit form B2B), `Contact` (click Zalo/Gọi). Nếu env trống → không render script (dev không bắn event rác).
- [ ] Form B2B: POST JSON tới `PUBLIC_FORM_ENDPOINT`; câu hỏi: Tên, SĐT, Công ty, Ngân sách/suất (4 mức), Số lượng (3 mức); kèm hidden field UTM (`utm_source/campaign` đọc từ URL). Có trạng thái success/error, không redirect.
- [ ] Mobile-first — 80%+ traffic từ ads là mobile. Nút gọi + Zalo floating trên mobile.
- [ ] Footer: thương hiệu + SĐT + Zalo + khu vực giao — nhất quán 100% với fanpage/Zalo OA/GBP (quan trọng cho GEO).
- [ ] Core Web Vitals: không JS framework phía client, font hệ thống hoặc 1 font tự host, Lighthouse mobile ≥ 95.

## Không làm (chống over-engineer)

- Không giỏ hàng / thanh toán online — chốt đơn qua Zalo/hotline.
- Không CAPI server-side giai đoạn này (mục A2.3, làm sau 10/08 nếu rảnh).
- Không i18n, không dark mode, không animation nặng.

## Lệnh

```bash
npm run dev       # dev server
npm run build     # build static → dist/
npx wrangler pages deploy dist  # hoặc để Cloudflare Pages tự build từ git push
```
