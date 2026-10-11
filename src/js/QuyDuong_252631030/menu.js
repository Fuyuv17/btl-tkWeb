/**
 * menu.js
 * Author: Quy Duong (MSV: 252631030)
 * File: src/js/QuyDuong_252631030/menu.js
 *
 * Mục đích:
 *   - Highlight category card tương ứng khi URL có hash (#com, #mi-bun, ...)
 *   - Cuộn mượt đến đúng card khi đến trang từ link anchor bên ngoài
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────────────────────
     1. XỬ LÝ SCROLL & HIGHLIGHT KHI CÓ HASH TRONG URL
     ──────────────────────────────────────────────────────── */
  function highlightFromHash() {
    const hash = window.location.hash; // vd: "#com"
    if (!hash) return;

    // Bỏ class active khỏi tất cả cards
    document.querySelectorAll('.category-card').forEach((card) => {
      card.classList.remove('category-card--active');
    });

    // Tìm card có id tương ứng với hash
    const target = document.querySelector(hash);
    if (!target || !target.classList.contains('category-card')) return;

    // Thêm class active để nổi bật
    target.classList.add('category-card--active');

    // Cuộn mượt đến card đó
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  // Chạy khi tải trang và khi hash thay đổi
  highlightFromHash();
  window.addEventListener('hashchange', highlightFromHash);


  /* ────────────────────────────────────────────────────────
     2. HOVER TOOLTIP — HIỆN MÔ TẢ KHI HOVER (tuỳ chọn mở rộng)
     ──────────────────────────────────────────────────────── */
  // (Để trống cho việc mở rộng sau — ví dụ: lazy load danh sách sản phẩm)


  /* ────────────────────────────────────────────────────────
     3. LOG DEBUG (chỉ bật trong môi trường development)
     ──────────────────────────────────────────────────────── */
  // console.log('[menu.js] Category cards initialized:', document.querySelectorAll('.category-card').length);

});
