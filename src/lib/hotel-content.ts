// Nội dung biên tập riêng cho từng khách sạn (không có trong pricing.json):
// đoạn tư vấn "Nên chọn hộp nào?" + câu FAQ riêng của từng KS.
// Nguồn: data/site-content.md mục "Gợi ý câu tư vấn" + mục 2 (khuôn trang con).
import type { FaqItem } from './faq';

export interface HotelContent {
  tuVan: string;
  faqRieng: FaqItem[];
}

export const HOTEL_CONTENT: Record<string, HotelContent> = {
  sheraton: {
    tuVan:
      'Thanh 1 (889k) là hộp entry bán chạy nhất — hợp biếu số lượng cho nhân viên/đối tác phổ thông. An 2 kèm trà (1.548k) hợp biếu sếp tầm trung. Lưu ý HSD 25 ngày, đặt sát ngày biếu.',
    faqRieng: [
      {
        q: 'HSD bánh Sheraton bao lâu?',
        a: '25 ngày — ngắn hơn các khách sạn khác (45 ngày), nên đặt sát ngày biếu.',
      },
    ],
  },
  'intercontinental-lm72': {
    tuVan:
      'Classic Box 4 (1.026k) hợp ngân sách phổ thông; Luxury Box 8 (1.717k) nhiều bánh nhất phân khúc dưới 2tr — hợp biếu gia đình. Dòng Luxury kèm quà tặng cao cấp xem trang Hộp VIP.',
    faqRieng: [
      {
        q: 'Luxury Box 8 và Classic Box khác gì nhau?',
        a: 'Luxury Box 8 gồm 8 bánh 100gr trong hộp lớn hơn, phù hợp biếu gia đình hoặc đối tác cần số lượng bánh nhiều; Classic Box 4/6 gọn hơn, hợp biếu cá nhân.',
      },
    ],
  },
  melia: {
    tuVan:
      'Thiết kế đậm chất Á Đông, tên hộp ý nghĩa — hợp biếu đối tác lớn tuổi. Hai hộp entry 1.067k giá tốt nhất nhóm 4 bánh 120gr.',
    faqRieng: [
      {
        q: 'Nguyệt Viên Hà Thành và Nguyệt Hoa Lạc Thủy khác gì nhau?',
        a: 'Hai dòng hộp cùng cấu hình bánh và giá tương ứng, khác nhau ở thiết kế hộp và tên gọi — chọn theo gu thẩm mỹ.',
      },
    ],
  },
  renaissance: {
    tuVan:
      'Chỉ 2 mẫu, An Nhã (1.388k) kèm trà Kim Tuyên — lựa chọn gọn cho ngân sách 1,2–1,5tr.',
    faqRieng: [
      {
        q: 'Renaissance có nhiều mẫu hộp không?',
        a: 'Chỉ 2 mẫu — danh mục gọn, dễ chọn nhanh cho đơn số lượng lớn cần đồng bộ.',
      },
    ],
  },
  sofitel: {
    tuVan:
      'Deluxe (1.645k) kèm trà là mẫu cân bằng nhất; Premium 6 bánh (2.256k) sang trọng cho sếp.',
    faqRieng: [
      {
        q: 'Nên chọn Standard, Deluxe hay Premium?',
        a: 'Standard (1.236k) hợp biếu đại trà; Deluxe (1.645k) kèm trà cân bằng giá/hình thức; Premium (2.256k) 6 bánh phù hợp biếu sếp hoặc đối tác quan trọng.',
      },
    ],
  },
  hilton: {
    tuVan:
      'Tea Version (1.688k) an toàn cho mọi đối tượng; Wine Version (2.180k) kèm rượu vang cho đối tác thân.',
    faqRieng: [
      {
        q: 'Hilton chỉ có 2 mẫu hộp?',
        a: 'Đúng — Tea Version và Wine Version, cùng 4 bánh 150gr, khác phần quà tặng kèm theo.',
      },
    ],
  },
  nikko: {
    tuVan:
      'Tinh Gọn (1.288k) entry chuẩn Nhật; Gấu Hồng bản giới hạn (1.588k) độc lạ — hợp biếu khách hàng nữ/gia đình có trẻ nhỏ.',
    faqRieng: [
      {
        q: 'Nikko Gấu Hồng bản giới hạn có gì đặc biệt?',
        a: 'Thiết kế hộp giới hạn theo chủ đề, 4 bánh 120gr — phù hợp biếu tặng khách hàng nữ hoặc gia đình có trẻ nhỏ.',
      },
    ],
  },
};
