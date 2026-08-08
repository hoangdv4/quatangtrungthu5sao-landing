// Vị bánh + kích thước hộp theo từng mẫu — nguồn: BANG-GIA-B2B-TRUNG-THU-2026.pdf
// (thông tin độc quyền so với đối thủ chỉ đăng giá).
// ⚠️ C0: chỉ liệt kê vị bánh/kích thước — TUYỆT ĐỐI không ghi tên hãng rượu (đã lược bỏ khỏi PDF gốc).
export interface FlavorGroup {
  /** Tên mẫu hộp (hoặc nhóm mẫu dùng chung vị) khớp ten_hien_thi/nhóm trong pricing.json. */
  ten: string;
  viBanh: string[];
  /** Ghi chú thêm, vd cách chọn vị. */
  ghiChu?: string;
}

export const HOTEL_FLAVORS: Record<string, FlavorGroup[]> = {
  sheraton: [
    {
      ten: 'Thanh 1 (4 bánh 100gr)',
      viBanh: ['Thập cẩm truyền thống', 'Việt quất', 'Khoai môn trứng muối & hạt bí', 'Đậu xanh sữa dừa sợi'],
    },
    {
      ten: 'Thanh 2 (4 bánh 150gr)',
      viBanh: ['Thập cẩm truyền thống', 'Việt quất', 'Hồng trà & trứng muối', 'Lá dứa & hạt điều'],
    },
    {
      ten: 'An 1 (6 bánh 100gr)',
      viBanh: [
        'Thập cẩm truyền thống',
        'Việt quất',
        'Khoai môn trứng muối & hạt bí',
        'Hồng trà & trứng muối',
        'Đậu xanh sữa dừa sợi',
        'Lá dứa & hạt điều',
      ],
    },
    {
      ten: 'An 2 (4 bánh 100gr + trà)',
      viBanh: ['Thập cẩm truyền thống', 'Việt quất', 'Hồng trà & trứng muối', 'Đậu xanh sữa dừa sợi'],
    },
    {
      ten: 'Phúc 1 / Phúc 2 / Phúc 3 (4 bánh 150gr, hộp VIP)',
      viBanh: ['Thập cẩm truyền thống', 'Việt quất', 'Khoai môn trứng muối & hạt bí', 'Lá dứa & hạt điều'],
    },
  ],
  'intercontinental-lm72': [
    {
      ten: 'Classic Box 4 / 6 · Luxury Box 8 · Luxury Box 6',
      ghiChu: 'Cùng bộ vị bánh cho mọi mẫu hộp — khác nhau ở số lượng bánh và kích thước hộp.',
      viBanh: [
        'Thập cẩm truyền thống',
        'Than tre nhân trà xanh & trứng muối',
        'Sen trắng, gừng & kem trứng muối',
        'Bò tiêu đen',
        'Đậu xanh & trứng muối',
        'Mơ Tây',
        'Khoai môn & trứng muối',
        'Bào ngư sốt XO',
        'Dừa & trứng muối',
        'Thập cẩm bò',
        'Mè đen & trứng muối',
      ],
    },
  ],
  melia: [
    {
      ten: 'Thanh Hoa Nguyệt Ảnh / Chu Tước Phúc Viên (4 bánh 120gr)',
      ghiChu: 'Khách chọn 4/7 vị cho hộp; 2 vị đặc biệt (đánh dấu *) giới hạn tối đa 1 bánh/hộp, phụ thu nếu chọn thêm.',
      viBanh: [
        'Đông trùng hạ thảo chà bông trứng muối*',
        'Bào ngư sốt XO*',
        'Thập cẩm truyền thống',
        'Mơ Tây',
        'Mè đen trứng muối',
        'Lava sen trứng chảy',
        'Lava sô-cô-la chảy',
      ],
    },
    {
      ten: 'Nguyệt Viên Hà Thành / Nguyệt Hoa Lạc Thủy (3 bánh 120gr, hộp thượng hạng)',
      ghiChu: 'Khách chọn 3/7 vị cho hộp; 2 vị đặc biệt (đánh dấu *) giới hạn tối đa 1 bánh/hộp, phụ thu nếu chọn thêm.',
      viBanh: [
        'Đông trùng hạ thảo chà bông trứng muối*',
        'Bào ngư sốt XO*',
        'Thập cẩm truyền thống',
        'Mơ Tây',
        'Mè đen trứng muối',
        'Lava sen trứng chảy',
        'Lava sô-cô-la chảy',
      ],
    },
  ],
  renaissance: [
    {
      ten: 'An Nhã · Bích Ngọc (4 bánh 220gr)',
      ghiChu: 'Cùng bộ vị bánh cho cả 2 mẫu hộp.',
      viBanh: ['Sò điệp than tre', 'Phật nhảy tường', 'Trà thiết Quan Âm', 'Hạt sen hạt phỉ'],
    },
  ],
  sofitel: [
    {
      ten: 'Sofitel Standard (4 bánh 150gr) · Deluxe (4 bánh 150gr + trà)',
      viBanh: ['Gà quay xốt X.O', 'Sữa dừa', 'Than tre & quýt Nhật', 'Trà Ô-long & hoa hồng'],
    },
    {
      ten: 'Sofitel Premium (6 bánh 150gr + trà)',
      viBanh: [
        'Gà quay xốt X.O',
        'Sữa dừa',
        'Than tre & quýt Nhật',
        'Trà Ô-long & hoa hồng',
        'Lá dứa phô mai',
        'Jambon thập cẩm',
      ],
    },
  ],
  hilton: [
    {
      ten: 'Hilton Tea Version · Wine Version (4 bánh 150gr)',
      ghiChu: 'Cùng bộ vị bánh cho cả 2 mẫu hộp.',
      viBanh: ['Đậu đỏ trứng muối', 'Hải sản xốt XO', 'Than tre trà xanh & hai loại hạt', 'Gà quay xốt Jambon'],
    },
  ],
  nikko: [
    {
      ten: 'Nikko Tinh Gọn · Tinh Tuyển · Gấu Hồng bản giới hạn',
      ghiChu: 'Cùng bộ vị bánh cho cả 3 mẫu hộp.',
      viBanh: [
        'Trà đen Hokkaido & caramel',
        'Sò điệp xốt X.O',
        'Trà xanh & quýt yuzu Nhật Bản',
        'Nấm truffle đen & hạt sen',
      ],
    },
  ],
};
