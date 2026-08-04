// Scroll-reveal nhẹ: thêm .is-visible khi [data-reveal] vào viewport, reveal 1 lần.
// CSS chỉ áp opacity/transform khi <html> có class "js" (xem global.css) — an toàn tuyệt
// đối nếu script này lỗi hoặc bị chặn, nội dung vẫn hiển thị bình thường.
const items = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  items.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((el) => observer.observe(el));
}
