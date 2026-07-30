/**
 * TrungThu2026-Tracking — Google Apps Script
 * 1) setup(): tạo 4 tab theo mục A3 (+ cột Mã đơn theo A1b) — chạy 1 lần.
 * 2) doPost(e): nhận form B2B từ landing page → ghi LEAD-B2B + notify.
 *
 * Cài đặt: sheets.new → Extensions → Apps Script → dán file này → chạy setup()
 * → Deploy → New deployment → Web app (Execute as: Me, Access: Anyone)
 * → copy URL vào PUBLIC_FORM_ENDPOINT trong .env của landing page.
 *
 * Bí mật (không nằm trong repo landing page):
 * Project Settings → Script Properties:
 *   NOTIFY_EMAIL        = email nhận thông báo lead (bắt buộc nếu muốn notify email)
 *   TELEGRAM_BOT_TOKEN  = (tùy chọn) token bot Telegram
 *   TELEGRAM_CHAT_ID    = (tùy chọn) chat id nhận notify
 */

var TABS = {
  'LEAD-B2B': ['Ngày', 'Nguồn', 'Tên', 'Cty', 'SĐT', 'Ngân sách/suất', 'SL',
               'Trạng thái', 'Ngày follow tiếp', 'Giá trị đơn', 'Mã đơn', 'Ghi chú'],
  'ĐƠN-B2C': ['Ngày', 'Kênh', 'Tên', 'SP', 'SL', 'Doanh thu', 'Mã đơn',
              'Đã giao?', 'Feedback?'],
  'CHI-ADS': ['Ngày', 'Meta C1', 'Meta C2', 'Meta C3', 'Google', 'Zalo',
              'Tổng ngày', 'Doanh thu ngày', 'ROAS'],
  'GEO-TEST': ['Ngày', 'Prompt 1', 'Prompt 2', 'Prompt 3', 'Prompt 4', 'Prompt 5',
               'Có được nhắc?', 'Nguồn nào đang được AI trích']
};

/** Chạy 1 lần: tạo/chuẩn hóa 4 tab + header + freeze + format. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('TrungThu2026-Tracking');
  Object.keys(TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var headers = TABS[name];
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#1a3c6e').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  });
  // Xóa Sheet1 mặc định nếu còn
  var s1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (s1 && ss.getSheets().length > 4) ss.deleteSheet(s1);
  // Validation cột Trạng thái LEAD-B2B
  var lead = ss.getSheetByName('LEAD-B2B');
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Mới', 'Đã gửi giá', 'Đang trình', 'Chốt', 'Rớt'], true).build();
  lead.getRange('H2:H1000').setDataValidation(rule);
  Logger.log('Setup xong: ' + ss.getUrl());
}

/** Endpoint nhận form B2B từ landing page. */
function doPost(e) {
  try {
    // Không tin cậy vào e.postData.type: Google có thể chuẩn hóa lại content-type
    // qua redirect nội bộ. Thử parse JSON trước (form gửi JSON.stringify), fallback
    // e.parameter nếu body không phải JSON hợp lệ.
    var d = {};
    var raw = e.postData && e.postData.contents;
    if (raw) {
      try {
        d = JSON.parse(raw);
      } catch (parseErr) {
        d = e.parameter || {};
      }
    } else {
      d = e.parameter || {};
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('LEAD-B2B');
    var now = Utilities.formatDate(new Date(), 'GMT+7', 'dd/MM/yyyy HH:mm');
    var nguon = (d.utm_source || 'landing') +
                (d.utm_campaign ? '/' + d.utm_campaign : '');
    sh.appendRow([now, nguon, d.ten || '', d.cong_ty || '', "'" + (d.sdt || ''),
                  d.ngan_sach || '', d.so_luong || '', 'Mới', '', '', '', '']);
    notify_(d, nguon, now);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function notify_(d, nguon, now) {
  var msg = '🔔 LEAD B2B MỚI (' + now + ')\n' +
    'Tên: ' + (d.ten || '?') + '\nCty: ' + (d.cong_ty || '?') +
    '\nSĐT: ' + (d.sdt || '?') + '\nNgân sách/suất: ' + (d.ngan_sach || '?') +
    '\nSL: ' + (d.so_luong || '?') + '\nNguồn: ' + nguon +
    '\n⏱ SLA: gọi + add Zalo trong 15 phút!';
  var props = PropertiesService.getScriptProperties();
  var email = props.getProperty('NOTIFY_EMAIL');
  if (email) MailApp.sendEmail(email, '🔔 Lead B2B mới — gọi trong 15 phút', msg);
  var token = props.getProperty('TELEGRAM_BOT_TOKEN');
  var chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (token && chatId) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      payload: JSON.stringify({ chat_id: chatId, text: msg })
    });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Test nhanh sau khi deploy: chạy hàm này rồi xem dòng mới trong LEAD-B2B. */
function testPost() {
  doPost({ postData: { type: 'application/json', contents: JSON.stringify({
    ten: 'Test', cong_ty: 'Cty Test', sdt: '0900000000',
    ngan_sach: '1,2–2,6tr', so_luong: '30–50', utm_source: 'test'
  }) } });
}
