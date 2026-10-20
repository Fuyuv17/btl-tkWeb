/** Header, mobile menu and user session handling. */
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const overlay = document.getElementById('mobile-menu-backdrop');
  const closeButton = document.getElementById('mobile-menu-close');
  const closeMenu = () => { mobileMenu?.classList.remove('active'); overlay?.classList.remove('active'); document.body.style.overflow = ''; };
  const openMenu = () => { mobileMenu?.classList.add('active'); overlay?.classList.add('active'); document.body.style.overflow = 'hidden'; };
  menuButton?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  let startX = 0;
  mobileMenu?.addEventListener('touchstart', (event) => { startX = event.touches[0].clientX; }, { passive: true });
  mobileMenu?.addEventListener('touchmove', (event) => { if (event.touches[0].clientX - startX > 100) closeMenu(); }, { passive: true });
  mobileMenu?.querySelectorAll('.category-menu-items a').forEach((link) => link.addEventListener('click', closeMenu));

  const tabs = document.querySelectorAll('.category-menu-items');
  const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
  tabs.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;
    const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, '').toLowerCase();
    item.classList.toggle('active', linkPath === currentPath);
  });

  const header = document.querySelector('header');
  window.addEventListener('scroll', () => header?.classList.toggle('header-scrolled', window.scrollY > 20));

  let currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem('CurrentUser') || 'null'); } catch { localStorage.removeItem('CurrentUser'); }
  if (!currentUser || Object.keys(currentUser).length === 0) return;

  const userName = currentUser.fullName || currentUser.fullname || [currentUser.ho, currentUser.ten].filter(Boolean).join(' ') || currentUser.email || 'bạn';
  document.querySelectorAll('.login-icon').forEach((container) => {
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
      if (!confirm('Bạn có chắc chắn muốn đăng xuất không?')) return;
      localStorage.removeItem('CurrentUser');
      localStorage.removeItem('btl_current_user');
      alert('Đã đăng xuất thành công!');
      window.location.reload();
    });
    session.append(greeting, logoutButton);
    container.replaceChildren(session);
  });
});
