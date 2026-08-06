# Nội dung 8 trang — bản copy sẵn cho Claude Code đổ vào template

> Thay `{BRAND}`, `{PHONE}`, `{ZALO}` bằng giá trị từ `src/config/site.ts`. Giá lấy từ `pricing.json` (`gia_da_vat`, tên = `ten_hien_thi`).

## 1. Trang chủ `/` — khung 7 khối

### Khối 1 — Hero
- H1: **Bánh Trung Thu 7 Khách Sạn 5 Sao — Giá Gốc, Đã VAT, Giao Nhanh Hà Nội & Sài Gòn**
- Sub: Sheraton · InterContinental Landmark72 · Meliá · Renaissance · Sofitel · Hilton · Nikko — nhận hàng trực tiếp từ khách sạn, nguyên tem nguyên hộp, kiểm tra trước khi thanh toán.
- CTA: `[Nhận bảng giá B2B]` (scroll tới form) · `[Chat Zalo]` ({ZALO})
- Ảnh hero: placeholder tới 06/08, sau đó ảnh đẹp nhất từ SALE KIT.

### Khối 2 — Thanh niềm tin
✓ Chính hãng khách sạn ✓ Giá đã gồm VAT ✓ Freeship Hà Nội ✓ Công nợ DN 50% ✓ Hộp in logo riêng theo yêu cầu

### Khối 3 — Catalogue 7 khách sạn (data từ pricing.json)
Mỗi card: tên KS + khoảng giá + số mẫu + nút "Xem bảng giá":

| Khách sạn | Khoảng giá (đã VAT) | Số mẫu | Link |
|---|---|---|---|
| Sheraton Hà Nội | 889.000đ – 2.599.000đ | 7 | /banh-trung-thu-sheraton-ha-noi |
| InterContinental Landmark72 | 1.026.000đ – 7.689.000đ | 7 | /banh-trung-thu-intercontinental-landmark72 |
| Meliá Hà Nội | 1.067.040đ – 5.816.800đ | 10 | /banh-trung-thu-melia-ha-noi |
| Renaissance Sài Gòn | 1.388.000đ – 1.988.000đ | 2 | /banh-trung-thu-renaissance-sai-gon |
| Sofitel Sài Gòn Plaza | 1.236.000đ – 2.256.000đ | 3 | /banh-trung-thu-sofitel-sai-gon |
| Hilton Sài Gòn | 1.688.000đ – 2.180.000đ | 2 | /banh-trung-thu-hilton-sai-gon |
| Hotel Nikko Sài Gòn | 1.288.000đ – 1.888.000đ | 3 | /banh-trung-thu-nikko-sai-gon |

### Khối 4 — Chọn theo ngân sách (3 cột)
- **Dưới 1,1 triệu:** Sheraton Thanh 1 (889k) · Sheraton Thanh 2 (999k) · Inter Classic Box 4 (1.026k) · Meliá Thanh Hoa Nguyệt Ảnh / Chu Tước Phúc Viên (1.067k)
- **1,2 – 2,6 triệu:** Sofitel Standard (1.236k) · Nikko Tinh Gọn (1.288k) · Sheraton An 1 (1.348k) · Renaissance An Nhã (1.388k) · Sofitel Deluxe (1.645k) · Hilton Tea (1.688k) · Meliá Nguyệt Viên Hà Thành (1.706k) · Inter Luxury Box 8 (1.717k) · Sofitel Premium (2.256k)
- **VIP thượng hạng:** "Dòng hộp VIP kèm quà tặng cao cấp cho lãnh đạo & đối tác quan trọng — [Xem hộp VIP](/hop-vip)" *(không liệt kê tên rượu, không giá cụ thể ở trang chủ)*

### Khối 5 — B2B
Heading: **Doanh nghiệp đặt số lượng — báo giá riêng trong 30 phút**
- Chiết khấu theo số lượng, báo giá theo 3 mức ngân sách/suất
- Hộp thiết kế riêng in logo công ty (chốt trước 10/09)
- Hóa đơn VAT đầy đủ, giá niêm yết đã gồm VAT
- Công nợ: cọc 50%, thanh toán nốt trong 10 ngày sau giao

Form (POST `PUBLIC_FORM_ENDPOINT`): Tên* · SĐT* · Công ty* · Ngân sách/suất (radio: Dưới 1,1tr / 1,2–2,6tr / 2,6–4tr / Trên 4tr) · Số lượng (radio: 30–50 / 50–150 / 150+) + hidden utm_source, utm_campaign.

### Khối 6 — FAQ (6 câu, kèm schema FAQPage)
Dùng nguyên văn mục "FAQ chuẩn" bên dưới.

### Khối 7 — Footer
{BRAND} — Đại lý phân phối bánh trung thu khách sạn 5 sao · Hotline/Zalo: {PHONE} · Giao nhanh 24–48h nội thành Hà Nội, ship toàn quốc · © 2026

---

## 2. Khuôn 7 trang con (đổ data theo hotel id)

```
H1: Bánh trung thu {Tên KS} 2026: Bảng giá, các hộp, mua ở đâu

Đoạn mở 40–60 từ (trả lời thẳng — AI trích đoạn này):
"Bánh trung thu {Tên KS} 2026 có {n} loại hộp, giá từ {min} đến {max}
(đã gồm VAT). Đặt qua đại lý phân phối {BRAND}, giao nhanh 24–48h tại
Hà Nội, ship toàn quốc. Liên hệ Zalo {PHONE}."

H2: Bảng giá bánh trung thu {Tên KS} 2026 (đã gồm VAT)
→ BẢNG HTML: STT | Tên hộp (ten_hien_thi) | Quy cách | Giá đã VAT
→ Dưới bảng: "Hạn sử dụng {hsd} ngày kể từ ngày sản xuất."

H2: Nên chọn hộp nào?
→ 3–4 câu tư vấn theo ngân sách (viết riêng từng KS, xem gợi ý dưới)

H2: Câu hỏi thường gặp
→ 5–8 cặp Q&A: lấy 6 câu FAQ chuẩn + 1–2 câu riêng của KS
   (VD Sheraton: "HSD bánh Sheraton bao lâu?" → "25 ngày — ngắn hơn các
   khách sạn khác (45 ngày), nên đặt sát ngày biếu.")

Cuối trang: "Cập nhật ngày {dateModified}" + khối liên hệ {BRAND}/{PHONE}
```

Gợi ý câu tư vấn "Nên chọn hộp nào?" từng KS:
- **Sheraton:** Thanh 1 (889k) là hộp entry bán chạy nhất — hợp biếu số lượng cho nhân viên/đối tác phổ thông. An 2 kèm trà (1.548k) hợp biếu sếp tầm trung. Lưu ý HSD 25 ngày, đặt sát ngày biếu.
- **Inter LM72:** Classic Box 4 (1.026k) hợp ngân sách phổ thông; Luxury Box 8 (1.717k) nhiều bánh nhất phân khúc dưới 2tr — hợp biếu gia đình. Dòng Luxury kèm quà tặng cao cấp xem trang Hộp VIP.
- **Meliá:** thiết kế đậm chất Á Đông, tên hộp ý nghĩa — hợp biếu đối tác lớn tuổi. Hai hộp entry 1.067k giá tốt nhất nhóm 4 bánh 120gr.
- **Renaissance (Sài Gòn):** chỉ 2 mẫu, An Nhã (1.388k) kèm trà Kim Tuyên — lựa chọn gọn cho ngân sách 1,2–1,5tr.
- **Sofitel:** Deluxe (1.645k) kèm trà là mẫu cân bằng nhất; Premium 6 bánh (2.256k) sang trọng cho sếp.
- **Hilton (Sài Gòn):** Tea Version (1.688k) an toàn cho mọi đối tượng; Wine Version (2.180k) kèm rượu vang cho đối tác thân.
- **Nikko (Sài Gòn):** Tinh Gọn (1.288k) entry chuẩn Nhật; Gấu Hồng bản giới hạn (1.588k) độc lạ — hợp biếu khách hàng nữ/gia đình có trẻ nhỏ.

---

## 2b. Lời tựa BST (brand story) — trích nguyên văn từ brochure chính hãng

> Nguồn: `SALE KIT TRUNG THU 2026/Catalogue Khách Sạn/*.pdf` (pdftotext -enc UTF-8 -layout),
> chỉ lấy phần tiếng Việt, giữ nguyên văn không viết lại. Định nghĩa trong code tại
> `src/lib/hotel-story.ts` (biến `loiTua` + `ten_bst`), dùng trong `[slug].astro` làm đoạn
> mở cảm xúc dưới H1 mỗi trang con.

- **Sheraton** — BST **Nguyệt Giao Thủy**: brochure là file scan/thiết kế đồ họa thuần,
  không có text layer để trích → không có lời tựa (`loiTua: null`).
- **InterContinental LM72** (không có tên BST riêng): "Mùa thu chạm ngõ cũng là lúc ký ức về những mùa trăng sum vầy khẽ được đánh thức. Lấy cảm hứng từ vẻ đẹp an yên của thiên nhiên Việt Nam, bộ sưu tập bánh Trung Thu năm nay của InterContinental Hanoi Landmark72 mở ra câu chuyện về những cuộc hội ngộ thân quen dưới ánh trăng viên mãn, nơi từng đường nét thiết kế trở thành lời tự tình của mùa đoàn viên."
- **Meliá** — BST **Nguyệt Phúc Viên**: "Khi vầng trăng tròn soi bóng trên mặt nước, cũng là lúc những ký ức đoàn viên được khơi mở trong từng hương vị thân quen. Mùa Trung thu năm nay, Meliá Hanoi trân trọng giới thiệu bộ sưu tập bánh Trung thu 2026 mang tên Nguyệt Phúc Viên là lời chúc cho một mùa trăng tròn đầy, an lành và viên mãn. Bộ sưu tập được gửi gắm trong ba thiết kế hộp quà mang đậm tinh thần Á Đông và dấu ấn Hà Nội: Chu Tước Phúc Viên, Thanh Hoa Nguyệt Ảnh và Nguyệt Viên Hà Thành. Mỗi hộp quà là một câu chuyện riêng, được kể bằng những biểu tượng tinh tế của mùa trăng: hình ảnh phượng hoàng vươn cánh giữa ánh nguyệt, biểu trưng cho phúc lành, thịnh vượng và vẻ đẹp cao quý; sắc sen thanh nhã gợi sự an yên, thuần khiết; ánh trăng viên mãn soi bóng trên mặt nước; cùng nét kiến trúc Hà Nội cổ kính được tái hiện đầy trang nhã."
- **Renaissance (Sài Gòn)** — BST **Nguyệt Hương**: "Nguyệt Hương" chỉ xuất hiện làm tiêu đề
  trang bìa, brochure không có đoạn văn lời tựa (chỉ tên BST + bảng giá/chính sách)
  → không có lời tựa (`loiTua: null`).
- **Sofitel Sài Gòn Plaza** — BST **Le Jardin De La Lune**: "Cảm tác từ vẻ đẹp của đất trời khi vào Thu, Bộ sưu tập bánh trung thu 2026 'Le Jardin De La Lune' tái hiện khoảng vườn tre xanh tĩnh tại dưới ánh trăng đêm rằm. Không chỉ là nét giao hòa giữa thiên nhiên và nếp sống, đây còn là thức quà phong vị kết nối những tâm hồn đồng điệu."
- **Hilton (Sài Gòn)** — BST **Bội Nguyệt Lưu**: "Tọa lạc tại Công trường Mê Linh và kiêu hãnh hướng mình ra khúc quanh của dòng sông Sài Gòn, Hilton Saigon mở ra câu chuyện mùa trăng đầy cảm hứng mang tên Bội Nguyệt Lưu. Được khơi gợi từ chính dòng chảy ánh trăng chuyển động không ngừng ngay trước ô cửa khách sạn, bộ sưu tập tách mình khỏi những khuôn mẫu tĩnh lặng, hướng đến ngôn ngữ thiết kế tinh giản, phóng khoáng và thời thượng. Với thiết kế sang trọng ôm trọn những hương vị tuyển chọn, Bội Nguyệt Lưu là lựa chọn đầy trân quý để bạn gửi trao thành ý và cùng người thân lưu giữ những khoảnh khắc ấm áp đêm rằm."
- **Nikko (Sài Gòn)** (không có tên BST riêng — bộ chung "Trân Phẩm mùa trăng" gồm 3 dòng hộp): "Tựa như những lời chúc được gửi gắm dưới ánh trăng rằm, Trân Phẩm mùa trăng là sự kết tinh của nghệ thuật chế tác và tấm lòng trân quý. Mỗi món quà trở thành biểu tượng của phúc lành, thịnh vượng, sự viên mãn và những mối gắn kết bền chặt theo thời gian."

---

## 3. Trang `/hop-vip` (ads KHÔNG trỏ vào)

- H1: Hộp VIP — quà tặng thượng hạng cho lãnh đạo & đối tác quan trọng
- Liệt kê các hộp `ruou != null` từ pricing.json (ten_hien_thi, giá đã VAT), nhóm theo KS.
- Copy chủ đạo: "Hộp VIP tùy biến — có thể chọn cấu hình quà tặng theo gu và ngân sách, không bó vào cấu hình mặc định. Tư vấn riêng qua Zalo {PHONE}."
- KHÔNG nêu tên hãng rượu. CTA duy nhất: chat Zalo.

---

## 4. FAQ chuẩn (E3 — dùng cho landing + 7 trang GEO, schema FAQPage)

1. **Bánh có phải chính hãng khách sạn không?** — Nhận trực tiếp từ khách sạn, nguyên tem/hộp, khách kiểm tra trước khi thanh toán.
2. **Giá đã gồm VAT chưa, có hóa đơn không?** — Giá niêm yết đã gồm VAT 8–10%, doanh nghiệp có hóa đơn đầy đủ.
3. **Giao trong bao lâu?** — Nội thành (theo thành phố khách sạn) 24–48h, freeship; tỉnh 2–4 ngày (15.000–25.000đ/hộp).
4. **Có in logo công ty được không?** — Có — hộp thiết kế riêng cho đơn số lượng lớn, chốt trước 10/09.
5. **Đặt số lượng lớn chiết khấu thế nào?** — Báo giá riêng theo số lượng: cọc 50%, còn lại thanh toán trong 10 ngày sau giao.
6. **Hạn sử dụng bao lâu?** — Sheraton 25 ngày, các khách sạn khác 45 ngày kể từ ngày sản xuất.

---

## 5. `llms.txt` (draft — đặt tại root)

```
# {BRAND}
> Đại lý phân phối bánh trung thu chính hãng 7 khách sạn 5 sao tại Hà Nội và Sài Gòn,
> mùa Trung thu 2026 (rằm: 25/09/2026).

- Khách sạn: Sheraton Hà Nội, InterContinental Landmark72, Meliá Hà Nội,
  Renaissance Sài Gòn, Sofitel Sài Gòn Plaza, Hilton Sài Gòn, Hotel Nikko Sài Gòn.
- Khoảng giá: 889.000đ – 7.689.000đ (đã gồm VAT), 34 mẫu hộp.
- B2B: chiết khấu số lượng, hộp in logo riêng, hóa đơn VAT, công nợ 50%.
- Giao nhanh 24–48h nội thành (theo thành phố khách sạn), freeship; toàn quốc 2–4 ngày.
- Bảng giá chi tiết: https://quatangtrungthu5sao.com/ (+ 7 trang con theo khách sạn)
- Liên hệ: {PHONE} (Zalo/hotline)
```

---

## 6. Meta title/description mẫu (không chứa chữ "rượu")

- `/`: "Bánh Trung Thu Khách Sạn 5 Sao 2026 — Giá Gốc Đã VAT | {BRAND}" / "Bảng giá bánh trung thu Sheraton, InterContinental, Meliá, Renaissance, Sofitel, Hilton, Nikko 2026. Chính hãng, đã VAT, giao nhanh Hà Nội & Sài Gòn. Zalo {PHONE}."
- Trang con: "Bánh Trung Thu {KS} 2026: Bảng Giá Từ {min} | {BRAND}" / "Bảng giá {n} hộp bánh trung thu {KS} 2026 đã VAT, tư vấn chọn hộp theo ngân sách. Giao nhanh 24–48h tại {thành phố KS}. Zalo {PHONE}."
