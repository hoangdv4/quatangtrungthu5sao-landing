// Lời tựa / brand story trích nguyên văn (chỉ phần tiếng Việt) từ brochure chính hãng
// trong SALE KIT TRUNG THU 2026/Catalogue Khách Sạn/ (pdftotext -enc UTF-8 -layout).
// Không viết lại — giữ nguyên câu chữ gốc của khách sạn.
export interface HotelStory {
  /** Tên bộ sưu tập (BST) như in trên brochure — dùng cho title/meta khi có. */
  ten_bst: string | null;
  loiTua: string | null;
  /** Tên file PDF trong public/catalogue/. null = chưa có bản nén dưới 25MiB (giới hạn Cloudflare Pages). */
  catalogue: string | null;
}

export const HOTEL_STORY: Record<string, HotelStory> = {
  sheraton: {
    // Brochure "Nguyệt Giao Thủy.pdf" là file scan/thiết kế đồ họa thuần —
    // không có text layer để trích (pdftotext trả về rỗng).
    ten_bst: 'Nguyệt Giao Thủy',
    loiTua: null,
    // File gốc 33.6MB, vượt giới hạn 25MiB/file của Cloudflare Pages — cần nén
    // (gs/Ghostscript) trước khi đăng lại. Tạm bỏ nút tải trên trang.
    catalogue: null,
  },
  'intercontinental-lm72': {
    ten_bst: null,
    loiTua:
      'Mùa thu chạm ngõ cũng là lúc ký ức về những mùa trăng sum vầy khẽ được đánh thức. Lấy cảm hứng từ vẻ đẹp an yên của thiên nhiên Việt Nam, bộ sưu tập bánh Trung Thu năm nay của InterContinental Hanoi Landmark72 mở ra câu chuyện về những cuộc hội ngộ thân quen dưới ánh trăng viên mãn, nơi từng đường nét thiết kế trở thành lời tự tình của mùa đoàn viên.',
    catalogue: 'catalogue-banh-trung-thu-intercontinental-lm72.pdf',
  },
  melia: {
    ten_bst: 'Nguyệt Phúc Viên',
    loiTua:
      'Khi vầng trăng tròn soi bóng trên mặt nước, cũng là lúc những ký ức đoàn viên được khơi mở trong từng hương vị thân quen. Mùa Trung thu năm nay, Meliá Hanoi trân trọng giới thiệu bộ sưu tập bánh Trung thu 2026 mang tên Nguyệt Phúc Viên là lời chúc cho một mùa trăng tròn đầy, an lành và viên mãn. Bộ sưu tập được gửi gắm trong ba thiết kế hộp quà mang đậm tinh thần Á Đông và dấu ấn Hà Nội: Chu Tước Phúc Viên, Thanh Hoa Nguyệt Ảnh và Nguyệt Viên Hà Thành. Mỗi hộp quà là một câu chuyện riêng, được kể bằng những biểu tượng tinh tế của mùa trăng: hình ảnh phượng hoàng vươn cánh giữa ánh nguyệt, biểu trưng cho phúc lành, thịnh vượng và vẻ đẹp cao quý; sắc sen thanh nhã gợi sự an yên, thuần khiết; ánh trăng viên mãn soi bóng trên mặt nước; cùng nét kiến trúc Hà Nội cổ kính được tái hiện đầy trang nhã.',
    // File gốc 25.9MB, vượt giới hạn 25MiB/file của Cloudflare Pages — cần nén
    // (gs/Ghostscript) trước khi đăng lại. Tạm bỏ nút tải trên trang.
    catalogue: null,
  },
  renaissance: {
    // "Nguyệt Hương" chỉ xuất hiện làm tiêu đề trang bìa — brochure không có
    // đoạn văn lời tựa (chỉ tên BST + bảng giá/chính sách).
    ten_bst: 'Nguyệt Hương',
    loiTua: null,
    catalogue: 'catalogue-banh-trung-thu-renaissance.pdf',
  },
  sofitel: {
    ten_bst: 'Le Jardin De La Lune',
    loiTua:
      "Cảm tác từ vẻ đẹp của đất trời khi vào Thu, Bộ sưu tập bánh trung thu 2026 'Le Jardin De La Lune' tái hiện khoảng vườn tre xanh tĩnh tại dưới ánh trăng đêm rằm. Không chỉ là nét giao hòa giữa thiên nhiên và nếp sống, đây còn là thức quà phong vị kết nối những tâm hồn đồng điệu.",
    catalogue: 'catalogue-banh-trung-thu-sofitel.pdf',
  },
  hilton: {
    ten_bst: 'Bội Nguyệt Lưu',
    loiTua:
      'Tọa lạc tại Công trường Mê Linh và kiêu hãnh hướng mình ra khúc quanh của dòng sông Sài Gòn, Hilton Saigon mở ra câu chuyện mùa trăng đầy cảm hứng mang tên Bội Nguyệt Lưu. Được khơi gợi từ chính dòng chảy ánh trăng chuyển động không ngừng ngay trước ô cửa khách sạn, bộ sưu tập tách mình khỏi những khuôn mẫu tĩnh lặng, hướng đến ngôn ngữ thiết kế tinh giản, phóng khoáng và thời thượng. Với thiết kế sang trọng ôm trọn những hương vị tuyển chọn, Bội Nguyệt Lưu là lựa chọn đầy trân quý để bạn gửi trao thành ý và cùng người thân lưu giữ những khoảnh khắc ấm áp đêm rằm.',
    catalogue: 'catalogue-banh-trung-thu-hilton.pdf',
  },
  nikko: {
    ten_bst: null,
    loiTua:
      'Tựa như những lời chúc được gửi gắm dưới ánh trăng rằm, Trân Phẩm mùa trăng là sự kết tinh của nghệ thuật chế tác và tấm lòng trân quý. Mỗi món quà trở thành biểu tượng của phúc lành, thịnh vượng, sự viên mãn và những mối gắn kết bền chặt theo thời gian.',
    catalogue: 'catalogue-banh-trung-thu-nikko.pdf',
  },
};
