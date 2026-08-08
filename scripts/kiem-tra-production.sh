#!/usr/bin/env bash
# Kiểm tra site sau khi deploy lên Cloudflare Pages.
#
#   bash scripts/kiem-tra-production.sh                          # domain thật
#   bash scripts/kiem-tra-production.sh https://abc.pages.dev    # bản preview
#
# Kiểm tra những thứ CHỈ xác minh được trên production (không đo được ở local):
# HTTPS, nén brotli, cache CDN, canonical, redirect www, và 3 script tracking.

set -uo pipefail
BASE="${1:-https://quatangtrungthu5sao.com}"
BASE="${BASE%/}"

ok=0; loi=0
pass() { echo "  [OK]   $1"; ok=$((ok+1)); }
fail() { echo "  [LỖI]  $1"; loi=$((loi+1)); }

# Tìm chuỗi con trong biến. KHÔNG dùng `echo "$x" | grep -q`: grep -q thoát ngay
# khi khớp và đóng pipe trong lúc echo còn đang ghi, sinh SIGPIPE (exit 141) trên
# Git Bash/Windows — báo "không tìm thấy" dù chuỗi có thật. `case` là thuần bash,
# không pipe, không bao giờ dính lỗi này.
chua() { case "$1" in *"$2"*) return 0;; *) return 1;; esac; }
thuong() { echo "$1" | tr 'A-Z' 'a-z'; }

echo "Kiểm tra: $BASE"
echo "════════════════════════════════════════════════════════"

# ── 1. Trang phải truy cập được ──────────────────────────────
echo ""
echo "① Các trang trả về 200"
TRANG=(
  "/"
  "/banh-trung-thu-sheraton-ha-noi"
  "/banh-trung-thu-intercontinental-landmark72"
  "/banh-trung-thu-melia-ha-noi"
  "/banh-trung-thu-renaissance-sai-gon"
  "/banh-trung-thu-sofitel-sai-gon"
  "/banh-trung-thu-hilton-sai-gon"
  "/banh-trung-thu-nikko-sai-gon"
  "/hop-vip"
  "/so-sanh"
  "/tim-hop-qua"
  "/robots.txt"
  "/llms.txt"
  "/sitemap-index.xml"
)
# -L đi theo redirect: Cloudflare Pages trả 308 để thêm dấu / cuối, đó là
# hành vi bình thường chứ không phải lỗi. Cái cần biết là ĐÍCH có 200 không,
# và đi bao nhiêu nhịp (nhiều hơn 1 nhịp mới là dấu hiệu cấu hình sai).
for t in "${TRANG[@]}"; do
  read -r code hops < <(curl -sSL -o /dev/null -w "%{http_code} %{num_redirects}" --max-time 20 "$BASE$t" 2>/dev/null)
  if [ "$code" != "200" ]; then
    fail "$t trả về $code"
  elif [ "${hops:-0}" -gt 1 ]; then
    fail "$t phải qua $hops lần chuyển hướng mới tới nơi"
  else
    pass "$t${hops:+$([ "$hops" -eq 1 ] && echo ' (qua 1 redirect)')}"
  fi
done

# ── 2. HTTPS + redirect ──────────────────────────────────────
echo ""
echo "② HTTPS và tính nhất quán tên miền"
HTTP_CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 20 "http://${BASE#https://}/" 2>/dev/null)
case "$HTTP_CODE" in
  301|302|307|308) pass "HTTP tự chuyển sang HTTPS ($HTTP_CODE)" ;;
  200) fail "HTTP trả 200 — không ép chuyển HTTPS" ;;
  *) fail "HTTP trả $HTTP_CODE" ;;
esac

WWW=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 20 "https://www.${BASE#https://}/" 2>/dev/null)
FINAL=$(curl -sSL -o /dev/null -w "%{url_effective}" --max-time 20 "https://www.${BASE#https://}/" 2>/dev/null)
if [ "$WWW" = "200" ] && [ "$FINAL" = "https://www.${BASE#https://}/" ]; then
  fail "www và non-www đều trả 200 — trùng nội dung, nên chọn 1 bản"
else
  pass "www xử lý đúng (mã $WWW)"
fi

# ── 3. Nén + cache của Cloudflare ────────────────────────────
echo ""
echo "③ Nén và cache CDN (những thứ localhost không có)"
ENC=$(curl -sS -o /dev/null -D - -H "Accept-Encoding: br, gzip" --max-time 20 "$BASE/" 2>/dev/null | grep -i "^content-encoding:" | tr -d '\r' | awk '{print $2}')
[ -n "$ENC" ] && pass "HTML được nén ($ENC)" || fail "HTML KHÔNG được nén"

# Không dùng `| head -1` ở đây: trên Git Bash/Windows, head đóng pipe sớm và
# SIGPIPE làm hỏng trạng thái grep của các lệnh sau (grep -q sẽ báo không tìm
# thấy dù chuỗi có thật). Lấy dòng đầu bằng sed -n 1p sau khi grep chạy hết.
ASSET=$(curl -sSL --max-time 20 "$BASE/" 2>/dev/null | grep -o '/_astro/[A-Za-z0-9._-]*\.css' | sed -n 1p)
if [ -n "$ASSET" ]; then
  CC=$(curl -sS -o /dev/null -D - --max-time 20 "$BASE$ASSET" 2>/dev/null | grep -i "^cache-control:" | tr -d '\r')
  CCL=$(thuong "$CC")
  { chua "$CCL" "immutable" || chua "$CCL" "max-age=31536000"; } \
    && pass "Asset cache dài hạn ($ASSET)" \
    || fail "Asset thiếu cache dài hạn: $CC"
else
  echo "  [bỏ qua] không tìm thấy file CSS để kiểm tra"
fi

# ── 4. SEO ───────────────────────────────────────────────────
echo ""
echo "④ Canonical, sitemap, JSON-LD"
# -L bắt buộc: không có nó sẽ đọc phải trang 308 rỗng và tưởng là thiếu thẻ.
# Canonical phải trùng URL CUỐI CÙNG sau redirect, nếu không Google nhận tín
# hiệu mâu thuẫn (sitemap trỏ A, A đẩy sang B, B lại tự khai mình là A).
for t in "/" "/banh-trung-thu-sheraton-ha-noi"; do
  HTML=$(curl -sSL --max-time 20 "$BASE$t" 2>/dev/null)
  THAT=$(curl -sSL -o /dev/null -w "%{url_effective}" --max-time 20 "$BASE$t" 2>/dev/null)
  CANON=$(echo "$HTML" | grep -o '<link rel="canonical" href="[^"]*"' | sed 's/.*href="//;s/"//')
  [ "$CANON" = "$THAT" ] && pass "canonical $t khớp URL thật" \
    || fail "canonical $t = '$CANON' nhưng URL thật là '$THAT'"

  chua "$HTML" 'application/ld+json' && pass "JSON-LD có trong $t" || fail "$t thiếu JSON-LD"
done

# /hop-vip phải noindex (quy tắc C0 — ads không trỏ vào)
HOPVIP=$(curl -sSL --max-time 20 "$BASE/hop-vip" 2>/dev/null)
[ "$(echo "$HOPVIP" | grep -ci 'name="robots"[^>]*noindex')" -gt 0 ] \
  && pass "/hop-vip có noindex" || fail "/hop-vip THIẾU noindex (quy tắc C0)"

# Sitemap index chỉ trỏ tới các sitemap con — phải kiểm tra cả bên trong chúng.
SM=$(curl -sSL --max-time 20 "$BASE/sitemap-index.xml" 2>/dev/null)
for con in $(echo "$SM" | grep -o 'https\?://[^<]*sitemap[^<]*\.xml'); do
  SM="$SM$(curl -sSL --max-time 20 "$con" 2>/dev/null)"
done
chua "$SM" "hop-vip" \
  && fail "/hop-vip lọt vào sitemap (không được phép)" || pass "/hop-vip không có trong sitemap"

# ── 5. Tracking ──────────────────────────────────────────────
echo ""
echo "⑤ Script tracking (phải có mặt trên production)"
HOME_HTML=$(curl -sSL --max-time 20 "$BASE/" 2>/dev/null)
for m in "connect.facebook.net:Meta Pixel" "googletagmanager.com:Google tag" "clarity.ms:Clarity"; do
  key="${m%%:*}"; ten="${m##*:}"
  chua "$HOME_HTML" "$key" && pass "$ten có mặt" || fail "$ten KHÔNG có — kiểm tra biến môi trường trên Cloudflare"
done

# ── 6. Quy tắc rượu C0 ───────────────────────────────────────
echo ""
echo "⑥ Quy tắc C0 — không lộ tên rượu trên trang đích ads"
HANG="Macallan Glenfiddich Chivas Hennessy Ballantine Johnnie Jack.Daniel Remy Martell"
for t in "/" "/banh-trung-thu-sheraton-ha-noi" "/banh-trung-thu-melia-ha-noi"; do
  H=$(curl -sSL --max-time 20 "$BASE$t" 2>/dev/null)
  dinh=""
  HL=$(thuong "$H")
  for w in $HANG; do chua "$HL" "$(thuong "$w")" && dinh="$dinh $w"; done
  # Trang đích ads: không được có chữ "rượu" trong meta title/description
  META=$(echo "$H" | grep -o '<meta name="description" content="[^"]*"'; echo "$H" | grep -o '<title>[^<]*</title>')
  chua "$(thuong "$META")" "rượu" && dinh="$dinh (chữ-rượu-trong-meta)"
  [ -z "$dinh" ] && pass "$t sạch" || fail "$t chứa:$dinh"
done

# ── Tổng kết ─────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════"
echo "Đạt: $ok    Lỗi: $loi"
[ "$loi" -eq 0 ] && echo "Tất cả đều đạt." || echo "Có $loi mục cần xử lý."
exit $([ "$loi" -eq 0 ] && echo 0 || echo 1)
