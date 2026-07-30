# Deploy Google Sheet + Apps Script (10 phút)

> Tôi không tạo trực tiếp được Sheet trong Google account của bạn, nhưng script `setup()` sẽ tự dựng toàn bộ — bạn chỉ cần dán và bấm chạy.

1. Mở `sheets.new` → tạo spreadsheet trống (tên gì cũng được, script sẽ tự đổi thành `TrungThu2026-Tracking`).
2. **Extensions → Apps Script** → xóa code mặc định, dán toàn bộ `Code.gs` → Save.
3. Chọn hàm `setup` → **Run** → cấp quyền khi hỏi. Kiểm tra Sheet: 4 tab LEAD-B2B / ĐƠN-B2C / CHI-ADS / GEO-TEST với header đúng mục A3 (+ cột "Mã đơn" theo A1b, dropdown Trạng thái).
4. **Project Settings → Script Properties**, thêm:
   - `NOTIFY_EMAIL` = email của bạn
   - (tùy chọn) `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — notify Telegram nhanh hơn email, phục vụ SLA 15 phút
5. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone** → Deploy → copy **Web app URL**.
6. Dán URL vào `.env` của landing page: `PUBLIC_FORM_ENDPOINT=<URL>`.
7. Test: chạy hàm `testPost` trong editor → thấy dòng mới trong LEAD-B2B + nhận email/Telegram là đạt. Sau khi site live, submit form thật trên mobile để test end-to-end (checklist TỔNG DUYỆT 09/08).

Lưu ý:
- Mỗi lần SỬA `doPost` phải **Deploy → Manage deployments → Edit → New version**, URL giữ nguyên.
- Form từ browser POST tới Apps Script sẽ bị CORS chặn đọc response nếu gọi kiểu `fetch` thường → trong landing dùng `fetch(url, {method:'POST', mode:'no-cors', body: JSON.stringify(data)})` và tự hiển thị success (không đọc response), hoặc POST dạng `application/x-www-form-urlencoded`. Claude Code sẽ xử lý chi tiết này (đã ghi trong handoff-prompt.md).
