// Chuyển 3 ảnh gốc JW Marriott sang đúng quy cách site (WebP, tên file chứa từ khóa).
//
// CÁCH DÙNG:
//   1. Đặt 3 ảnh gốc (jpg/png/webp) vào thư mục  src/assets/marriott/goc/
//      với tên: 1.jpg (Hộp Cao Cấp), 2.jpg (Hộp Thượng Hạng), 3.jpg (Hộp Vinh Hoa)
//      — đuôi file gì cũng được, script tự tìm theo số thứ tự.
//   2. node scripts/xu-ly-anh-marriott.mjs
//
// Sinh ra:
//   src/assets/marriott/banh-trung-thu-marriott-0N.webp   (ảnh lớn 1600px — hero/bảng giá)
//   src/assets/marriott/sku/sku-N.webp                    (ảnh vuông 200px — bảng giá từng SKU)
//
// ⚠️ C0: ảnh số 3 (Hộp Vinh Hoa) lộ chai rượu → KHÔNG dùng làm ảnh SKU trên trang đích ads.
// Script tự bỏ qua sku-3; nếu có ảnh hộp đóng nắp không lộ chai thì đặt tên 3-an-toan.jpg.
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const THU_MUC = 'src/assets/marriott';
const GOC = path.join(THU_MUC, 'goc');
const SKU = path.join(THU_MUC, 'sku');

/** SKU nào được phép có ảnh đại diện riêng (quy tắc C0 — xem chú thích đầu file). */
const SKU_AN_TOAN = new Set([1, 2]);

const timAnh = (files, stt) =>
  files.find((f) => new RegExp(`^${stt}(-an-toan)?\\.(jpe?g|png|webp)$`, 'i').test(f));

const main = async () => {
  let files;
  try {
    files = await readdir(GOC);
  } catch {
    console.error(`Chưa có thư mục ${GOC}. Tạo thư mục và đặt 3 ảnh gốc tên 1/2/3 vào đó.`);
    process.exit(1);
  }

  await mkdir(SKU, { recursive: true });

  for (const stt of [1, 2, 3]) {
    const ten = timAnh(files, stt);
    if (!ten) {
      console.warn(`⚠ Thiếu ảnh số ${stt} trong ${GOC} — bỏ qua.`);
      continue;
    }
    const src = path.join(GOC, ten);
    const anhLon = path.join(THU_MUC, `banh-trung-thu-marriott-0${stt}.webp`);

    await sharp(src).resize(1600, null, { withoutEnlargement: true }).webp({ quality: 82 }).toFile(anhLon);
    console.log(`✓ ${anhLon}`);

    // Ảnh SKU: cắt vuông 200px. Bỏ qua SKU lộ chai trừ khi file đặt tên *-an-toan.
    if (SKU_AN_TOAN.has(stt) || ten.includes('-an-toan')) {
      const anhSku = path.join(SKU, `sku-${stt}.webp`);
      await sharp(src).resize(200, 200, { fit: 'cover' }).webp({ quality: 82 }).toFile(anhSku);
      console.log(`✓ ${anhSku}`);
    } else {
      console.log(`— Bỏ qua sku-${stt} (quy tắc C0: ảnh lộ chai rượu không dùng trên trang đích ads)`);
    }
  }
};

main();
