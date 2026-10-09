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

    tabList.forEach((item, index) => {
      item.addEventListener('click', function (e) {
        const link = this.querySelector('a');
        const href = link ? link.getAttribute('href') : '';

        // Ngăn reload trang khi href rỗng hoặc '#'
        if (!href || href === '#' || href === '') {
          e.preventDefault();
        }

        // Bỏ active ở tất cả tab desktop và mobile
        desktopTabs.forEach((el) => el.classList.remove('active'));
        mobileTabs.forEach((el) => el.classList.remove('active'));

        // Đồng bộ kích hoạt tab tương ứng ở cả hai menu
        if (desktopTabs[index]) desktopTabs[index].classList.add('active');
        if (mobileTabs[index]) mobileTabs[index].classList.add('active');

        // Nếu click trên mobile thì tự động đóng menu drawer sau khi chọn
        if (isMobile) {
          setTimeout(closeMobileMenu, 200);
        }
      });
    });
  }

  // Khởi tạo sự kiện cho cả 2 danh sách tab
  setupTabs(desktopTabs, false);
  setupTabs(mobileTabs, true);

  // Mặc định luôn luôn active tab Trang chủ (vị trí đầu tiên)
  if (desktopTabs.length > 0) {
    desktopTabs.forEach((el) => el.classList.remove('active'));
    desktopTabs[0].classList.add('active');
  }
  if (mobileTabs.length > 0) {
    mobileTabs.forEach((el) => el.classList.remove('active'));
    mobileTabs[0].classList.add('active');
  }

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
