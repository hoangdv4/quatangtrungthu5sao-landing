#!/usr/bin/env bash
# Submit URL(s) tới IndexNow (Bing/Yandex/... — Google không dùng giao thức này).
#
# Dùng sau mỗi lần cập nhật nội dung (giá, trang mới, sửa copy).
#
# Cách dùng:
#   ./scripts/indexnow.sh https://quatangtrungthu5sao.com/ https://quatangtrungthu5sao.com/hop-vip
#   ./scripts/indexnow.sh --all          # submit toàn bộ 8 trang mặc định
#
# Key đọc từ biến môi trường INDEXNOW_KEY hoặc file .env ở root repo.
# File key public/<INDEXNOW_KEY>.txt phải tồn tại và đã deploy trước khi chạy.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DOMAIN="quatangtrungthu5sao.com"

# Nạp INDEXNOW_KEY từ .env nếu chưa có sẵn trong môi trường.
if [ -z "${INDEXNOW_KEY:-}" ] && [ -f "$ROOT_DIR/.env" ]; then
  INDEXNOW_KEY="$(grep -E '^INDEXNOW_KEY=' "$ROOT_DIR/.env" | head -n1 | cut -d'=' -f2- | tr -d '\r')"
fi

if [ -z "${INDEXNOW_KEY:-}" ]; then
  echo "Lỗi: thiếu INDEXNOW_KEY (đặt trong .env hoặc export INDEXNOW_KEY=...)." >&2
  exit 1
fi

KEY_FILE="$ROOT_DIR/public/${INDEXNOW_KEY}.txt"
if [ ! -f "$KEY_FILE" ]; then
  echo "Lỗi: không tìm thấy $KEY_FILE — key phải khớp tên file key trong public/." >&2
  exit 1
fi

if [ "${1:-}" = "--all" ]; then
  URLS=(
    "https://$DOMAIN/"
    "https://$DOMAIN/banh-trung-thu-sheraton-ha-noi"
    "https://$DOMAIN/banh-trung-thu-intercontinental-landmark72"
    "https://$DOMAIN/banh-trung-thu-melia-ha-noi"
    "https://$DOMAIN/banh-trung-thu-renaissance-sai-gon"
    "https://$DOMAIN/banh-trung-thu-sofitel-sai-gon"
    "https://$DOMAIN/banh-trung-thu-hilton-sai-gon"
    "https://$DOMAIN/banh-trung-thu-nikko-sai-gon"
  )
else
  if [ "$#" -eq 0 ]; then
    echo "Dùng: $0 <url> [url2 ...]  hoặc  $0 --all" >&2
    exit 1
  fi
  URLS=("$@")
fi

# Dựng mảng JSON "urlList" từ URLS mà không cần jq.
URL_LIST_JSON=$(printf '"%s",' "${URLS[@]}")
URL_LIST_JSON="[${URL_LIST_JSON%,}]"

PAYLOAD=$(cat <<EOF
{
  "host": "$DOMAIN",
  "key": "$INDEXNOW_KEY",
  "keyLocation": "https://$DOMAIN/${INDEXNOW_KEY}.txt",
  "urlList": $URL_LIST_JSON
}
EOF
)

echo "Submit ${#URLS[@]} URL tới IndexNow..."
HTTP_CODE=$(curl -s -o /tmp/indexnow-response.txt -w '%{http_code}' \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")

echo "HTTP $HTTP_CODE"
cat /tmp/indexnow-response.txt 2>/dev/null || true
echo

case "$HTTP_CODE" in
  200|202) echo "OK — đã submit thành công." ;;
  400) echo "Lỗi 400 — payload không hợp lệ." >&2; exit 1 ;;
  403) echo "Lỗi 403 — key không khớp hoặc file key không truy cập được." >&2; exit 1 ;;
  422) echo "Lỗi 422 — URL không thuộc host khai báo." >&2; exit 1 ;;
  429) echo "Lỗi 429 — bị giới hạn tần suất, thử lại sau." >&2; exit 1 ;;
  *) echo "Mã trạng thái không mong đợi: $HTTP_CODE" >&2; exit 1 ;;
esac
