// ==========================================
// HIỆU ỨNG BOX TRẮNG TRƯỢT MENU (JOLLIBEE TAB)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".top-menu-desktop");
  const items = document.querySelectorAll(".top-menu-desktop .category-menu-items");
  const indicator = document.querySelector(".menu-indicator");
  const activeItem = document.querySelector(".top-menu-desktop .category-menu-items.active");

  if (!menu || !indicator || items.length === 0) return;

  function updateIndicator(target) {
    if (!target) return;
    indicator.style.left = `${target.offsetLeft}px`;
    indicator.style.width = `${target.offsetWidth}px`;
  }

  // Khởi tạo vị trí mặc định tại Trang chủ
  updateIndicator(activeItem || items[0]);

  // Nếu có font chữ tùy chỉnh, cập nhật lại kích thước sau khi font tải xong
  if (document.fonts) {
    document.fonts.ready.then(() => {
      updateIndicator(activeItem || items[0]);
    });
  }

  // Khi hover sang từng mục: di chuyển box trắng sang mục đó
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      updateIndicator(item);
    });
  });

  // Khi rời chuột khỏi thanh menu: box trắng tự động quay về Trang chủ
  menu.addEventListener("mouseleave", () => {
    updateIndicator(activeItem || items[0]);
  });

  // Cập nhật lại vị trí nếu người dùng thay đổi kích thước cửa sổ
  window.addEventListener("resize", () => {
    const currentHover = document.querySelector(".top-menu-desktop .category-menu-items:hover");
    updateIndicator(currentHover || activeItem || items[0]);
  });
});
