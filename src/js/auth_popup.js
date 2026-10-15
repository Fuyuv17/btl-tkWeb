/**
 * ==========================================================================
 * POPUP & HỆ THỐNG ĐĂNG NHẬP / ĐĂNG KÝ (PHONG CÁCH JOLLIBEE)
 * - Tự động chèn DOM Modal cho các trang
 * - Quản lý tài khoản bằng LocalStorage: btl_registered_users
 * - Xác thực thông tin: CHỈ TÀI KHOẢN ĐÃ ĐĂNG KÝ VÀ ĐÚNG MẬT KHẨU MỚI ĐƯỢC ĐĂNG NHẬP
 * - Đăng ký thành công -> Tự động đăng nhập & cập nhật Header
 * - Nhấp vào Tên / Avatar ở Header -> Chuyển đến trang profile.html
 * - Bấm Đăng ký -> Mở popup Đăng ký ngay lập tức
 * ==========================================================================
 */

const USERS_STORAGE_KEY = "btl_registered_users";
const CURRENT_USER_KEY = "btl_current_user";

// Danh sách tài khoản mặc định sẵn có
const DEFAULT_ACCOUNTS = [
  {
    ho: "Dương",
    ten: "Minh",
    fullName: "Dương Minh",
    phone: "0987654321",
    email: "duongminhdzt@gmail.com",
    password: "admin",
    address: "123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
    birthday: "2000-01-01",
    gender: "male",
    province: "HN",
    newsletter: true,
    registeredAt: new Date().toISOString()
  },
  {
    ho: "Nguyễn",
    ten: "Quản Trị",
    fullName: "Quản Trị Viên",
    phone: "0901234567",
    email: "admin@gmail.com",
    password: "admin",
    address: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    birthday: "1998-10-10",
    gender: "male",
    province: "HN",
    newsletter: true,
    registeredAt: new Date().toISOString()
  }
];

/**
 * Lấy danh sách tài khoản đã đăng ký trong localStorage
 */
function getRegisteredUsers() {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return [...DEFAULT_ACCOUNTS];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_ACCOUNTS];
  } catch (e) {
    return [...DEFAULT_ACCOUNTS];
  }
}

/**
 * Lưu thêm người dùng mới vào localStorage
 */
function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Tìm tài khoản theo Email, Số điện thoại hoặc Họ tên / Username
 */
function findUserByAccount(account) {
  if (!account) return null;
  const clean = account.trim().toLowerCase();
  const cleanDigits = clean.replace(/[^0-9]/g, "");
  const users = getRegisteredUsers();

  return users.find((u) => {
    // 1. So khớp Email
    if (u.email && u.email.trim().toLowerCase() === clean) return true;

    // 2. So khớp Số điện thoại
    const uPhone = (u.phone || "").trim().toLowerCase();
    const uDigits = uPhone.replace(/[^0-9]/g, "");
    if (uDigits && cleanDigits && (uDigits === cleanDigits || uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits))) return true;
    if (uPhone && uPhone === clean) return true;

    // 3. So khớp Họ tên
    if (u.fullName && u.fullName.trim().toLowerCase() === clean) return true;
    if (u.ten && u.ten.trim().toLowerCase() === clean) return true;

    // 4. So khớp username
    if (u.email && u.email.split("@")[0].toLowerCase() === clean) return true;

    return false;
  }) || null;
}

/**
 * Lấy phiên đăng nhập hiện tại
 */
function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  try {
    const user = JSON.parse(data);
    return user && user.fullName ? user : null;
  } catch (e) {
    return null;
  }
}

/**
 * Lưu hoặc xóa phiên đăng nhập hiện tại
 */
function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

/**
 * Lấy đường dẫn logo tương ứng theo cấp thư mục hiện tại
 */
function getLogoPath() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("/pages/") || path.includes("\\pages\\")) {
    return "../assets/images/CaoQuynhAnh_252601009/logo.jpg";
  }
  return "src/assets/images/CaoQuynhAnh_252601009/logo.jpg";
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tự động chèn DOM Modal nếu chưa có trong trang
  initAuthModalDOM();

  const overlay = document.getElementById("auth-modal-overlay");
  const modalContainer = document.getElementById("auth-modal-container");
  const closeBtn = document.getElementById("auth-close-btn");
  const loginView = document.getElementById("auth-login-view");
  const registerView = document.getElementById("auth-register-view");

  const toRegisterBtn = document.getElementById("auth-to-register");
  const toLoginBtn = document.getElementById("auth-to-login");

  const loginForm = document.getElementById("auth-login-form");
  const registerForm = document.getElementById("auth-register-form");

  const toast = document.getElementById("auth-toast");
  const toastMsg = document.getElementById("auth-toast-msg");
  const toastIcon = document.getElementById("auth-toast-icon");

  // 2. Hàm hiển thị Toast thông báo
  let toastTimer = null;
  function showAuthToast(message, type = "success") {
    if (!toast) return;
    toastMsg.textContent = message;
    if (toastIcon) {
      toastIcon.textContent = type === "error" ? "⚠️" : "✨";
    }
    toast.className = `auth-toast show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  // 3. Hàm mở Modal
  function openAuthModal(view = "login") {
    if (!overlay) return;
    if (view === "register") {
      loginView.style.display = "none";
      registerView.style.display = "block";
      modalContainer.classList.add("register-mode");
    } else {
      loginView.style.display = "block";
      registerView.style.display = "none";
      modalContainer.classList.remove("register-mode");
    }
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Khóa cuộn trang nền
  }

  // 4. Hàm đóng Modal
  function closeAuthModal() {
    if (!overlay) return;
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Mở lại cuộn trang
  }

  // 5. Chuyển đổi giữa Đăng nhập và Đăng ký trong Modal
  if (toRegisterBtn) {
    toRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginView.style.display = "none";
      registerView.style.display = "block";
      modalContainer.classList.add("register-mode");
    });
  }

  if (toLoginBtn) {
    toLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      registerView.style.display = "none";
      loginView.style.display = "block";
      modalContainer.classList.remove("register-mode");
    });
  }

  // 6. Đóng modal khi click ra ngoài hoặc bấm ESC hoặc nút (X)
  if (closeBtn) closeBtn.addEventListener("click", closeAuthModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAuthModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("active")) {
      closeAuthModal();
    }
  });

  // 7. Bắt sự kiện click vào các link Đăng nhập / Đăng ký trên toàn trang
  function bindAuthTriggers() {
    // 1. Các nút / link đăng ký
    const registerTriggers = document.querySelectorAll(
      ".register, .login-icon a.register, a[href*='register.html'], .auth-switch-link"
    );
    registerTriggers.forEach((el) => {
      if (el.dataset.authBound) return;
      el.dataset.authBound = "true";

      el.addEventListener("click", (e) => {
        // Nếu chưa đăng nhập -> luôn mở popup Đăng ký
        if (!getCurrentUser()) {
          e.preventDefault();
          openAuthModal("register");
        }
      });
    });

    // 2. Các nút / link đăng nhập
    const loginTriggers = document.querySelectorAll(
      ".login, .login-icon a.login, a[href*='login.html'], .reg-back-login, .reg-login-prompt a"
    );
    loginTriggers.forEach((el) => {
      if (el.dataset.authBound) return;
      el.dataset.authBound = "true";

      el.addEventListener("click", (e) => {
        if (!getCurrentUser()) {
          e.preventDefault();
          openAuthModal("login");
        }
      });
    });

    // 3. Icon tài khoản (hình tròn)
    const accountIcons = document.querySelectorAll(".login-icon a.icon-circle");
    accountIcons.forEach((el) => {
      if (el.dataset.authBound) return;
      el.dataset.authBound = "true";

      el.addEventListener("click", (e) => {
        if (!getCurrentUser()) {
          e.preventDefault();
          openAuthModal("login");
        }
      });
    });
  }

  // 8. Cập nhật giao diện Header theo trạng thái Đăng nhập / Chưa đăng nhập
  function renderHeaderAuthState() {
    const currentUser = getCurrentUser();
    const logoSrc = getLogoPath();
    const isPagesDir = window.location.pathname.toLowerCase().includes("/pages/") || window.location.pathname.toLowerCase().includes("\\pages\\");
    const profileHref = isPagesDir ? "profile.html" : "src/pages/profile.html";

    const loginIcons = document.querySelectorAll(".login-icon");

    loginIcons.forEach((wrap) => {
      if (currentUser) {
        wrap.innerHTML = `
          <a class="icon-circle" href="${profileHref}" title="Xem trang quản lý tài khoản: ${currentUser.fullName}">
            <img src="${logoSrc}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="avatar" />
          </a>
          <a href="${profileHref}" class="user-display-name" style="color:#ffffff;font-weight:700;font-size:13px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle;text-decoration:none;" title="Xem trang quản lý tài khoản">
            ${currentUser.fullName}
          </a>
          <button type="button" class="auth-logout-btn" style="background:none;border:none;color:#FFC522;font-size:12px;font-weight:700;cursor:pointer;margin-left:6px;text-decoration:underline;padding:0;" title="Đăng xuất khỏi tài khoản">
            Thoát
          </button>
        `;

        wrap.querySelector(".auth-logout-btn")?.addEventListener("click", (e) => {
          e.preventDefault();
          setCurrentUser(null);
          showAuthToast("Đã đăng xuất tài khoản!");
          renderHeaderAuthState();
        });
      } else {
        const loginHref = isPagesDir ? "login.html" : "src/pages/login.html";
        const registerHref = isPagesDir ? "register.html" : "src/pages/register.html";
        const iconPath = isPagesDir 
          ? "../assets/images/CaoQuynhAnh_252601009/login-icon.svg" 
          : "src/assets/images/CaoQuynhAnh_252601009/login-icon.svg";

        wrap.innerHTML = `
          <a class="icon-circle" href="${loginHref}" title="Tài khoản">
            <img src="${iconPath}" alt="Tài khoản" />
          </a>
          <a class="register" href="${registerHref}">Đăng kí</a>
          <span class="icons">/</span>
          <a class="login" href="${loginHref}">Đăng nhập</a>
        `;
      }
    });

    // Gắn lại sự kiện cho các nút mới tạo
    if (!currentUser) {
      bindAuthTriggers();
    }
  }

  // Khởi chạy cập nhật trạng thái Header khi tải trang
  renderHeaderAuthState();
  bindAuthTriggers();

  // 9. Xử lý Toggle xem mật khẩu (Ẩn / Hiện)
  document.querySelectorAll(".auth-password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
      } else {
        input.type = "password";
        btn.textContent = "👁️";
      }
    });
  });

  // 10. Hàm đo độ bảo mật mật khẩu khi gõ
  function attachPasswordStrength(inputId, textId, boxId) {
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);
    const box = document.getElementById(boxId);
    if (!input || !text || !box) return;

    input.addEventListener("input", () => {
      const val = input.value;
      if (!val) {
        text.innerHTML = "<strong>Không</strong>";
        box.className = "password-strength-box";
        return;
      }

      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 8) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[A-Z]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;

      if (score <= 1) {
        text.innerHTML = "<strong style='color:#ff4d4f;'>Yếu</strong>";
        box.className = "password-strength-box strength-weak";
      } else if (score <= 3) {
        text.innerHTML = "<strong style='color:#faad14;'>Trung bình</strong>";
        box.className = "password-strength-box strength-medium";
      } else {
        text.innerHTML = "<strong style='color:#52c41a;'>Mạnh</strong>";
        box.className = "password-strength-box strength-strong";
      }
    });
  }

  attachPasswordStrength("reg-password", "reg-strength-text", "reg-strength-box");
  attachPasswordStrength("page-reg-password", "page-reg-strength-text", "page-reg-strength-box");

  // 11. Xử lý logic ĐĂNG NHẬP (Chỉ cho phép tài khoản đã tồn tại và đúng mật khẩu)
  function handleLoginProcess(accountVal, passVal, onSuccess) {
    const account = accountVal ? accountVal.trim() : "";
    const password = passVal ? passVal.trim() : "";

    if (!account) {
      showAuthToast("Vui lòng nhập Email hoặc Số điện thoại!", "error");
      return false;
    }
    if (!password) {
      showAuthToast("Vui lòng nhập Mật khẩu!", "error");
      return false;
    }

    // 1. Kiểm tra tài khoản trong danh sách đăng ký
    const foundUser = findUserByAccount(account);

    if (!foundUser) {
      showAuthToast("Tài khoản chưa được đăng ký! Vui lòng bấm 'Đăng ký ngay'.", "error");
      return false;
    }

    // 2. Kiểm tra mật khẩu
    if ((foundUser.password || "").trim() !== password) {
      showAuthToast("Mật khẩu không chính xác! Vui lòng thử lại.", "error");
      return false;
    }

    // 3. Đăng nhập thành công -> lưu phiên đăng nhập
    setCurrentUser(foundUser);
    showAuthToast(`Đăng nhập thành công! Chào mừng ${foundUser.fullName || foundUser.ten}`);
    closeAuthModal();
    renderHeaderAuthState();

    if (typeof onSuccess === "function") {
      onSuccess(foundUser);
    }
    return true;
  }

  // Bắt sự kiện submit form Đăng nhập trong POPUP
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const accountInput = document.getElementById("login-account");
      const passInput = document.getElementById("login-password");
      handleLoginProcess(accountInput?.value, passInput?.value);
    });
  }

  // 12. Xử lý logic ĐĂNG KÝ TÀI KHOẢN MỚI
  function handleRegisterProcess(formData, onSuccess) {
    const { ho, ten, phone, email, pass, rePass, birthday, gender, province, terms } = formData;

    const trimmedHo = (ho || "").trim();
    const trimmedTen = (ten || "").trim();
    const trimmedPhone = (phone || "").trim();
    const trimmedEmail = (email || "").trim();

    if (!trimmedTen) {
      showAuthToast("Vui lòng nhập Tên của bạn!", "error");
      return false;
    }
    if (!trimmedPhone) {
      showAuthToast("Vui lòng nhập Số điện thoại!", "error");
      return false;
    }

    const cleanDigits = trimmedPhone.replace(/[^0-9]/g, "");
    if (cleanDigits.length < 8 || cleanDigits.length > 12) {
      showAuthToast("Số điện thoại không hợp lệ (cần từ 8 đến 12 số)!", "error");
      return false;
    }

    if (!pass || pass.length < 4) {
      showAuthToast("Mật khẩu phải có ít nhất 4 ký tự!", "error");
      return false;
    }
    if (pass !== rePass) {
      showAuthToast("Xác nhận mật khẩu không khớp!", "error");
      return false;
    }
    if (!terms) {
      showAuthToast("Bạn cần đồng ý với Chính sách & Quy định chung!", "error");
      return false;
    }

    // Kiểm tra tài khoản đã tồn tại hay chưa
    const existingUsers = getRegisteredUsers();
    const isExisted = existingUsers.some((u) => {
      const uPhoneClean = (u.phone || "").replace(/[^0-9]/g, "");
      const matchPhone = uPhoneClean && cleanDigits && uPhoneClean === cleanDigits;
      const matchEmail = trimmedEmail && u.email && u.email.trim().toLowerCase() === trimmedEmail.toLowerCase();
      return matchPhone || matchEmail;
    });

    if (isExisted) {
      showAuthToast("Số điện thoại hoặc Email này đã được đăng ký tài khoản!", "error");
      return false;
    }

    // Tạo đối tượng người dùng mới
    const fullName = trimmedHo ? `${trimmedHo} ${trimmedTen}` : trimmedTen;
    const newUser = {
      ho: trimmedHo,
      ten: trimmedTen,
      fullName: fullName,
      phone: trimmedPhone,
      email: trimmedEmail,
      password: pass,
      birthday: birthday || "",
      gender: gender || "",
      province: province || "",
      address: province ? `Khu vực: ${province}` : "Chưa cập nhật địa chỉ",
      newsletter: true,
      registeredAt: new Date().toISOString()
    };

    // 1. Lưu vào danh sách tài khoản đã đăng ký trong localStorage
    saveRegisteredUser(newUser);

    // 2. TỰ ĐỘNG ĐĂNG NHẬP NGAY CHO NGƯỜI DÙNG!
    setCurrentUser(newUser);
    renderHeaderAuthState();

    showAuthToast(`Đăng ký tài khoản thành công! Chào mừng ${fullName}`);
    closeAuthModal();

    if (typeof onSuccess === "function") {
      onSuccess(newUser);
    }
    return true;
  }

  // Bắt sự kiện submit form Đăng ký trong POPUP
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ho = document.getElementById("reg-ho")?.value;
      const ten = document.getElementById("reg-ten")?.value;
      const phone = document.getElementById("reg-phone")?.value;
      const email = document.getElementById("reg-email")?.value;
      const pass = document.getElementById("reg-password")?.value;
      const rePass = document.getElementById("reg-repassword")?.value;
      const birthday = document.getElementById("reg-birthday")?.value;
      const gender = document.getElementById("reg-gender")?.value;
      const province = document.getElementById("reg-province")?.value;
      const terms = document.getElementById("reg-terms")?.checked;

      handleRegisterProcess(
        { ho, ten, phone, email, pass, rePass, birthday, gender, province, terms }
      );
    });
  }

  // 13. Xử lý Form trên trang Đăng nhập độc lập (login.html)
  const standaloneLoginForm = document.getElementById("standalone-login-form");
  if (standaloneLoginForm) {
    standaloneLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const accountInput = document.getElementById("page-login-account");
      const passInput = document.getElementById("page-login-password");

      handleLoginProcess(accountInput?.value, passInput?.value, () => {
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 800);
      });
    });
  }

  // 14. Xử lý Form trên trang Đăng ký độc lập (register.html)
  const standaloneRegForm = document.getElementById("standalone-register-form");
  if (standaloneRegForm) {
    standaloneRegForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ho = document.getElementById("page-reg-ho")?.value;
      const ten = document.getElementById("page-reg-ten")?.value;
      const phone = document.getElementById("page-reg-phone")?.value;
      const email = document.getElementById("page-reg-email")?.value;
      const pass = document.getElementById("page-reg-password")?.value;
      const rePass = document.getElementById("page-reg-repassword")?.value;
      const birthday = document.getElementById("page-reg-birthday")?.value;
      const gender = document.getElementById("page-reg-gender")?.value;
      const province = document.getElementById("page-reg-province")?.value;
      const terms = document.getElementById("page-reg-terms")?.checked;

      handleRegisterProcess(
        { ho, ten, phone, email, pass, rePass, birthday, gender, province, terms },
        () => {
          setTimeout(() => {
            window.location.href = "profile.html";
          }, 800);
        }
      );
    });
  }

  // Hỗ trợ gọi mở popup từ ngoài qua window
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.showAuthToast = showAuthToast;
});

/**
 * Tự động tạo DOM cấu trúc Modal Đăng nhập / Đăng ký nếu chưa có sẵn
 */
function initAuthModalDOM() {
  if (document.getElementById("auth-modal-overlay")) return;

  const logoSrc = getLogoPath();

  const modalHTML = `
    <!-- Overlay mờ toàn màn hình -->
    <div id="auth-modal-overlay" class="auth-modal-overlay" aria-modal="true" role="dialog">
      <div id="auth-modal-container" class="auth-modal-container">
        
        <!-- Nút đóng tròn đỏ góc trên bên phải chuẩn form Jollibee -->
        <button type="button" id="auth-close-btn" class="auth-close-btn" aria-label="Đóng popup">&times;</button>
        
        <div class="auth-modal-content">
          
          <!-- ==============================================
               1. GIAO DIỆN ĐĂNG NHẬP (CHUẨN FORM JOLLIBEE ẢNH 1)
               ============================================== -->
          <div id="auth-login-view">
            <!-- Nửa trên màu Đỏ -->
            <div class="auth-red-section">
              <div class="auth-logo-wrap">
                <img src="${logoSrc}" alt="Logo Ăn Ngon" class="auth-logo-img" />
                <span class="auth-brand-name">Ăn Ngon</span>
              </div>
              
              <h2 class="auth-title">VUI LÒNG ĐĂNG NHẬP</h2>
              
              <form id="auth-login-form" autocomplete="on">
                <div class="auth-input-group">
                  <input type="text" id="login-account" class="auth-input" placeholder="Email / Số điện thoại" required />
                </div>
                
                <div class="auth-input-group">
                  <input type="password" id="login-password" class="auth-input" placeholder="Mật khẩu" required />
                  <button type="button" class="auth-password-toggle" aria-label="Xem mật khẩu">👁️</button>
                  <a href="#" class="auth-forgot-link">Quên mật khẩu?</a>
                </div>
              </form>
            </div>
            
            <!-- Nửa dưới màu Vàng -->
            <div class="auth-yellow-section">
              <button type="submit" form="auth-login-form" class="auth-submit-btn">ĐĂNG NHẬP</button>
              
              <p class="auth-switch-text">
                Bạn chưa có tài khoản? <a href="#" id="auth-to-register" class="auth-switch-link">Đăng ký ngay</a>
              </p>
            </div>
          </div>
          
          <!-- ==============================================
               2. GIAO DIỆN ĐĂNG KÝ (CHUẨN FORM ẢNH 2 & 3)
               ============================================== -->
          <div id="auth-register-view" style="display: none;">
            <div class="register-scrollable">
              <div class="register-title-head">
                <h2 class="register-main-title">ĐĂNG KÝ TÀI KHOẢN</h2>
              </div>
              
              <form id="auth-register-form">
                <div class="register-form-grid">
                  
                  <!-- Họ & Tên -->
                  <div class="reg-row">
                    <div class="reg-input-group">
                      <input type="text" id="reg-ho" class="reg-input" placeholder="Họ *" required />
                    </div>
                    <div class="reg-input-group">
                      <input type="text" id="reg-ten" class="reg-input" placeholder="Tên *" required />
                    </div>
                  </div>
                  
                  <!-- Số điện thoại -->
                  <div class="reg-input-group">
                    <input type="tel" id="reg-phone" class="reg-input" placeholder="Số điện thoại *" required />
                  </div>
                  
                  <!-- Email -->
                  <div class="reg-input-group">
                    <input type="email" id="reg-email" class="reg-input" placeholder="E-mail" />
                  </div>
                  
                  <!-- Mật khẩu & Độ bảo mật -->
                  <div class="reg-input-group">
                    <input type="password" id="reg-password" class="reg-input" placeholder="Mật khẩu *" required />
                    <div id="reg-strength-box" class="password-strength-box">
                      <span class="password-strength-text">Độ bảo mật: <span id="reg-strength-text"><strong>Không</strong></span></span>
                      <div class="password-strength-bar">
                        <span class="strength-dot"></span>
                        <span class="strength-dot"></span>
                        <span class="strength-dot"></span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Xác nhận mật khẩu -->
                  <div class="reg-input-group">
                    <input type="password" id="reg-repassword" class="reg-input" placeholder="Xác nhận mật khẩu *" required />
                  </div>
                  
                  <!-- Ngày sinh -->
                  <div class="reg-input-group">
                    <input type="date" id="reg-birthday" class="reg-input" placeholder="Ngày sinh *" required />
                  </div>
                  
                  <!-- Giới tính -->
                  <div class="reg-input-group">
                    <select id="reg-gender" class="reg-select" required>
                      <option value="" disabled selected>Chọn giới tính *</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  
                  <!-- Tỉnh thành -->
                  <div class="reg-input-group">
                    <select id="reg-province" class="reg-select" required>
                      <option value="" disabled selected>Chọn tỉnh thành *</option>
                      <option value="HN">Hà Nội</option>
                      <option value="HCM">TP. Hồ Chí Minh</option>
                      <option value="DN">Đà Nẵng</option>
                      <option value="HP">Hải Phòng</option>
                      <option value="CT">Cần Thơ</option>
                      <option value="BD">Bình Dương</option>
                      <option value="DNA">Đồng Nai</option>
                      <option value="QN">Quảng Ninh</option>
                      <option value="KH">Khánh Hòa</option>
                      <option value="other">Tỉnh thành khác</option>
                    </select>
                  </div>
                  
                  <!-- Checkbox điều khoản theo ảnh 3 -->
                  <div class="reg-checkbox-group">
                    <label class="reg-checkbox-item">
                      <input type="checkbox" id="reg-terms" required />
                      <span>Đồng ý với <a href="#">Chính sách, quy định chung</a> và <a href="#">Thông báo bảo mật cá nhân</a></span>
                    </label>
                    
                    <label class="reg-checkbox-item">
                      <input type="checkbox" id="reg-promo" />
                      <span>Nhận chương trình khuyến mãi qua email</span>
                    </label>
                  </div>
                  
                  <!-- Nút đăng ký & link quay lại đăng nhập -->
                  <div class="reg-action-row">
                    <button type="submit" class="reg-submit-btn">ĐĂNG KÝ</button>
                    <span class="reg-login-prompt">
                      Bạn đã có tài khoản? <a href="#" id="auth-to-login">Đăng nhập</a>
                    </span>
                  </div>
                  
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
    <!-- Toast thông báo -->
    <div id="auth-toast" class="auth-toast">
      <span id="auth-toast-icon">✨</span>
      <span id="auth-toast-msg">Thông báo</span>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
