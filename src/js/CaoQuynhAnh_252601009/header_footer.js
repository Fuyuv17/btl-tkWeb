/**
 * Header & Footer JavaScript
 * - Mặc định luôn là tab Trang chủ, chỉ khi bấm mới active tab đó
 * - Đồng bộ active tab giữa desktop và mobile
 * - Xử lý toggle menu drawer bên phải cho điện thoại
 * - Hiệu ứng cuộn trang header
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================
     1. XỬ LÝ TOGGLE MENU MOBILE (DRAWER BÊN PHẢI)
  ======================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang khi mở menu
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  /* ========================================================
     2. XỬ LÝ ACTIVE TAB MENU (ĐỒNG BỘ CẢ DESKTOP VÀ MOBILE)
  ======================================================== */
  const desktopTabs = document.querySelectorAll('.top-menu-desktop .category-menu-items');
  const mobileTabs = document.querySelectorAll('.mobile-menu-list .category-menu-items');

  function setupTabs(tabList, isMobile = false) {
    if (!tabList || tabList.length === 0) return;

    tabList.forEach((item) => {
      item.addEventListener('click', function (e) {
        const link = this.querySelector('a');
        if (!link || !link.href) return;

        // Nếu click trên mobile thì tự động đóng menu drawer sau khi chọn
        if (isMobile) {
          closeMobileMenu();
        }
      });
    });
  }

  // Khởi tạo sự kiện cho cả 2 danh sách tab
  setupTabs(desktopTabs, false);
  setupTabs(mobileTabs, true);

  // Đặt trạng thái active theo trang hiện tại, không chặn điều hướng của liên kết.
  const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
  [...desktopTabs, ...mobileTabs].forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, '').toLowerCase();
    item.classList.toggle('active', linkPath === currentPath);
  });

  /* ========================================================
     3. HIỆU ỨNG SCROLL HEADER (Đổ bóng khi cuộn trang)
  ======================================================== */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }
});
