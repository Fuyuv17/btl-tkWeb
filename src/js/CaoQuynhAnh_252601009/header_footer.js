/**
 * Header & Footer JavaScript
 * - Mặc định luôn là tab Trang chủ, chỉ khi bấm mới active tab đó
 * - Đồng bộ active tab giữa desktop và mobile
 * - Xử lý toggle menu drawer bên phải cho điện thoại
 * - Hiệu ứng cuộn trang header
 */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.header-search').forEach((searchForm) => {
    const searchInput = searchForm.querySelector('input[type="search"]');
    if (!searchInput) return;

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'search-clear-btn';
    clearButton.setAttribute('aria-label', 'Xóa nội dung tìm kiếm');
    clearButton.hidden = true;

    const clearIcon = document.createElement('img');
    const headerScript = document.querySelector('script[src*="header_footer.js"]');
    clearIcon.src = new URL('../../assets/images/CaoQuynhAnh_252601009/x.svg', headerScript?.src || window.location.href).href;
    clearIcon.alt = '';
    clearButton.appendChild(clearIcon);
    searchInput.insertAdjacentElement('afterend', clearButton);

    const updateClearButton = () => {
      clearButton.hidden = searchInput.value.length === 0;
    };
    searchInput.addEventListener('input', updateClearButton);
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      updateClearButton();
      searchInput.focus();
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    updateClearButton();
  });

  const authContainers = document.querySelectorAll('.login-icon');
  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem('CurrentUser') || 'null');
  } catch (error) {
    localStorage.removeItem('CurrentUser');
  }

  if (currentUser) {
    const userName = currentUser.fullName || currentUser.fullname ||
      [currentUser.ho, currentUser.ten].filter(Boolean).join(' ') || currentUser.email || 'bạn';

    authContainers.forEach((container) => {
      const session = document.createElement('div');
      session.className = 'user-session';

      const greeting = document.createElement('span');
      greeting.className = 'user-greeting';
      greeting.append('Xin chào, ');

      const name = document.createElement('span');
      name.className = 'user-name';
      name.textContent = userName;
      greeting.appendChild(name);

      const logoutButton = document.createElement('button');
      logoutButton.className = 'user-logout';
      logoutButton.type = 'button';
      logoutButton.textContent = 'Đăng xuất';
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('CurrentUser');
        localStorage.removeItem('btl_current_user');
        window.location.reload();
      });

      session.append(greeting, logoutButton);
      container.replaceChildren(session);
    });
  }

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
