// FAQ chuẩn (E3) — dùng chung cho trang chủ + 7 trang GEO, và sinh schema FAQPage.
export interface FaqItem {
  q: string;
  a: string;
}

// 5 câu dùng chung cho mọi trang — không phụ thuộc thành phố.
export const FAQ_CHUAN: FaqItem[] = [
  {
    q: 'Bánh có phải chính hãng khách sạn không?',
    a: 'Nhận trực tiếp từ khách sạn, nguyên tem nguyên hộp, khách kiểm tra trước khi thanh toán.',
  },
  {
    q: 'Giá đã gồm VAT chưa, có hóa đơn không?',
    a: 'Giá niêm yết đã gồm VAT 8–10%, doanh nghiệp có hóa đơn đầy đủ.',
  },
  {
    q: 'Có in logo công ty được không?',
    a: 'Có — hộp thiết kế riêng cho đơn số lượng lớn, chốt trước 10/09.',
  },
  {
    q: 'Đặt số lượng lớn chiết khấu thế nào?',
    a: 'Báo giá riêng theo số lượng: cọc 50%, còn lại thanh toán trong 10 ngày sau giao.',
  },
  {
    q: 'Hạn sử dụng bao lâu?',
    a: 'Sheraton 25 ngày, các khách sạn khác 45 ngày kể từ ngày sản xuất.',
  },
];

/** Câu "Giao trong bao lâu?" phụ thuộc thành phố khách sạn — freeship nội thành đúng vùng. */
export function faqGiaoHang(thanhPho: 'Hà Nội' | 'Sài Gòn'): FaqItem {
  return {
    q: 'Giao trong bao lâu?',
    a: `Nội thành ${thanhPho} 24–48h, freeship; tỉnh 2–4 ngày (15.000–25.000đ/hộp).`,
  };
}

/** Sinh node schema.org FAQPage từ danh sách Q&A. */
export function faqSchema(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
