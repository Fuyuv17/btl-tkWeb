/**
 * ==========================================================================
 * XỬ LÝ TRANG QUẢN LÝ TÀI KHOẢN (PROFILE.JS)
 * - Tải thông tin người dùng từ localStorage (btl_current_user)
 * - Hiển thị đúng dữ liệu mockup: Tên, Email, SĐT, Địa chỉ, Bản tin
 * - Xử lý chuyển tab trên Sidebar bên trái
 * - Chỉnh sửa thông tin liên hệ, đổi mật khẩu, đổi địa chỉ trực tiếp
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Lấy thông tin người dùng hiện tại
  let currentUser = getCurrentUserProfile();

  // 2. Điền thông tin lên giao diện
  renderUserProfile(currentUser);

  // 3. Xử lý chuyển tab Sidebar
  initProfileTabs();

  // 4. Xử lý các nút Chỉnh sửa / Thay đổi mật khẩu
  initProfileActions();

  // 5. Xử lý form Chỉnh sửa thông tin đầy đủ ở tab "THÔNG TIN TÀI KHOẢN"
  initFullInfoForm();
});

/**
 * Lấy dữ liệu người dùng từ localStorage, nếu chưa có thì dùng mẫu chuẩn mockup
 */
function getCurrentUserProfile() {
  const data = localStorage.getItem("btl_current_user");
  if (data) {
    try {
      const user = JSON.parse(data);
      if (user && user.fullName) return user;
    } catch (e) {}
  }

  // Mẫu mặc định khớp chính xác 100% với ảnh mockup của người dùng
  const defaultProfile = {
    ho: "Dương",
    ten: "Minh",
    fullName: "Dương Minh",
    email: "duongminhdzt@gmail.com",
    phone: "0987654321",
    address: "123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
    birthday: "2000-01-01",
    gender: "male",
    province: "HN",
    newsletter: true
  };

  // Nếu chưa đăng nhập, trả về dữ liệu mẫu để giao diện hiển thị đẹp như mockup
  return defaultProfile;
}

/**
 * Hiển thị dữ liệu lên các vị trí trong trang
 */
function renderUserProfile(user) {
  if (!user) return;

  const displayName = user.fullName || `${user.ho || ''} ${user.ten || ''}`.trim() || "Dương Minh";
  const email = user.email || "duongminhdzt@gmail.com";
  const phone = user.phone || "0987654321";
  const address = user.address || (user.province ? `Tỉnh / Thành phố: ${user.province}` : "Chưa cập nhật địa chỉ giao hàng");
  const isNewsletter = user.newsletter !== false;

  // Lời chào tiêu đề
  const welcomeEl = document.getElementById("profile-display-name");
  if (welcomeEl) welcomeEl.textContent = displayName;

  // Thông tin liên hệ
  const nameEl = document.getElementById("card-contact-name");
  if (nameEl) nameEl.textContent = displayName;

  const emailEl = document.getElementById("card-contact-email");
  if (emailEl) emailEl.textContent = email;

  const phoneEl = document.getElementById("card-contact-phone");
  if (phoneEl) phoneEl.textContent = phone;

  // Đăng ký nhận tin
  const newsletterEl = document.getElementById("card-newsletter-status");
  if (newsletterEl) {
    newsletterEl.textContent = isNewsletter
      ? 'Bạn đã đăng ký nhận "Bản Tin Chung".'
      : 'Bạn chưa đăng ký nhận Bản Tin Chung.';
  }

  // Địa chỉ giao hàng mặc định
  const addressEl = document.getElementById("card-default-address");
  if (addressEl) {
    addressEl.textContent = address;
  }

  // Điền vào form tab Thông tin tài khoản
  const formHo = document.getElementById("info-ho");
  const formTen = document.getElementById("info-ten");
  const formPhone = document.getElementById("info-phone");
  const formEmail = document.getElementById("info-email");
  const formBirthday = document.getElementById("info-birthday");
  const formGender = document.getElementById("info-gender");
  const formProvince = document.getElementById("info-province");

  if (formHo) formHo.value = user.ho || "";
  if (formTen) formTen.value = user.ten || user.fullName || "";
  if (formPhone) formPhone.value = phone;
  if (formEmail) formEmail.value = email;
  if (formBirthday && user.birthday) formBirthday.value = user.birthday;
  if (formGender && user.gender) formGender.value = user.gender;
  if (formProvince && user.province) formProvince.value = user.province;
}

/**
 * Chuyển tab trên Sidebar
 */
function initProfileTabs() {
  const navItems = document.querySelectorAll(".profile-nav-item");
  const tabPanes = document.querySelectorAll(".profile-tab-pane");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetTab = item.dataset.tab;
      if (!targetTab) return;

      navItems.forEach((i) => i.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      item.classList.add("active");
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add("active");

      // Cuộn lên đầu phần nội dung trên mobile
      if (window.innerWidth < 900) {
        document.querySelector(".profile-main-section")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/**
 * Xử lý các nút bấm Chỉnh sửa và Modal popup
 */
function initProfileActions() {
  const modalBackdrop = document.getElementById("profile-action-modal");
  const modalTitle = document.getElementById("profile-modal-title");
  const modalBody = document.getElementById("profile-modal-body");
  const modalClose = document.getElementById("profile-modal-close");
  const modalCancel = document.getElementById("profile-modal-cancel");
  const modalSubmit = document.getElementById("profile-modal-submit");

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove("active");
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalCancel) modalCancel.addEventListener("click", closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // 1. Chỉnh sửa Thông tin liên hệ (Tên, Email, SĐT)
  const btnEditContact = document.getElementById("link-edit-contact");
  if (btnEditContact) {
    btnEditContact.addEventListener("click", () => {
      const user = getCurrentUserProfile();
      modalTitle.textContent = "Chỉnh sửa thông tin liên hệ";
      modalBody.innerHTML = `
        <div class="profile-form-group" style="margin-bottom:12px;">
          <label class="profile-form-label">Họ và tên *</label>
          <input type="text" id="modal-input-name" class="profile-form-input" value="${user.fullName || ''}" required />
        </div>
        <div class="profile-form-group" style="margin-bottom:12px;">
          <label class="profile-form-label">Email *</label>
          <input type="email" id="modal-input-email" class="profile-form-input" value="${user.email || ''}" required />
        </div>
        <div class="profile-form-group">
          <label class="profile-form-label">Số điện thoại *</label>
          <input type="tel" id="modal-input-phone" class="profile-form-input" value="${user.phone || ''}" required />
        </div>
      `;

      modalSubmit.onclick = () => {
        const newName = document.getElementById("modal-input-name")?.value.trim();
        const newEmail = document.getElementById("modal-input-email")?.value.trim();
        const newPhone = document.getElementById("modal-input-phone")?.value.trim();

        if (!newName || !newEmail || !newPhone) {
          alert("Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại!");
          return;
        }

        user.fullName = newName;
        user.email = newEmail;
        user.phone = newPhone;
        updateUserStorage(user);
        renderUserProfile(user);
        closeModal();

        if (window.showAuthToast) {
          window.showAuthToast("Cập nhật thông tin liên hệ thành công!");
        } else {
          alert("Cập nhật thông tin liên hệ thành công!");
        }
      };

      modalBackdrop.classList.add("active");
    });
  }

  // 2. Thay đổi mật khẩu
  const btnChangePass = document.getElementById("link-change-password");
  if (btnChangePass) {
    btnChangePass.addEventListener("click", () => {
      const user = getCurrentUserProfile();
      modalTitle.textContent = "Thay đổi mật khẩu";
      modalBody.innerHTML = `
        <div class="profile-form-group" style="margin-bottom:12px;">
          <label class="profile-form-label">Mật khẩu hiện tại *</label>
          <input type="password" id="modal-pass-current" class="profile-form-input" placeholder="Nhập mật khẩu cũ" required />
        </div>
        <div class="profile-form-group" style="margin-bottom:12px;">
          <label class="profile-form-label">Mật khẩu mới *</label>
          <input type="password" id="modal-pass-new" class="profile-form-input" placeholder="Ít nhất 6 ký tự" required />
        </div>
        <div class="profile-form-group">
          <label class="profile-form-label">Xác nhận mật khẩu mới *</label>
          <input type="password" id="modal-pass-confirm" class="profile-form-input" placeholder="Nhập lại mật khẩu mới" required />
        </div>
      `;

      modalSubmit.onclick = () => {
        const curPass = document.getElementById("modal-pass-current")?.value;
        const newPass = document.getElementById("modal-pass-new")?.value;
        const confirmPass = document.getElementById("modal-pass-confirm")?.value;

        if (!curPass || !newPass || !confirmPass) {
          alert("Vui lòng nhập đầy đủ các trường mật khẩu!");
          return;
        }
        if (user.password && curPass !== user.password) {
          alert("Mật khẩu hiện tại không đúng!");
          return;
        }
        if (newPass.length < 6) {
          alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
          return;
        }
        if (newPass !== confirmPass) {
          alert("Xác nhận mật khẩu mới không khớp!");
          return;
        }

        user.password = newPass;
        updateUserStorage(user);
        closeModal();

        if (window.showAuthToast) {
          window.showAuthToast("Thay đổi mật khẩu thành công!");
        } else {
          alert("Thay đổi mật khẩu thành công!");
        }
      };

      modalBackdrop.classList.add("active");
    });
  }

  // 3. Chỉnh sửa nhận bản tin
  const btnEditNewsletter = document.getElementById("link-edit-newsletter");
  if (btnEditNewsletter) {
    btnEditNewsletter.addEventListener("click", () => {
      const user = getCurrentUserProfile();
      modalTitle.textContent = "Đăng ký nhận bản tin";
      modalBody.innerHTML = `
        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px;">
          <input type="checkbox" id="modal-check-newsletter" ${user.newsletter !== false ? 'checked' : ''} style="width:18px;height:18px;" />
          <span>Tôi muốn nhận "Bản Tin Chung" và các ưu đãi hấp dẫn qua Email</span>
        </label>
      `;

      modalSubmit.onclick = () => {
        const checked = document.getElementById("modal-check-newsletter")?.checked;
        user.newsletter = !!checked;
        updateUserStorage(user);
        renderUserProfile(user);
        closeModal();

        if (window.showAuthToast) {
          window.showAuthToast("Cập nhật đăng ký nhận tin thành công!");
        }
      };

      modalBackdrop.classList.add("active");
    });
  }

  // 4. Chỉnh sửa địa chỉ giao hàng
  const btnEditAddress = document.getElementById("link-edit-address");
  const btnManageAddress = document.getElementById("link-manage-address");

  function openAddressModal() {
    const user = getCurrentUserProfile();
    modalTitle.textContent = "Chỉnh sửa địa chỉ giao hàng";
    modalBody.innerHTML = `
      <div class="profile-form-group" style="margin-bottom:12px;">
        <label class="profile-form-label">Địa chỉ chi tiết (Số nhà, đường, phường, quận) *</label>
        <textarea id="modal-input-address" class="profile-form-input" style="height:70px;padding:8px 12px;font-family:inherit;" required>${user.address || ''}</textarea>
      </div>
      <div class="profile-form-group">
        <label class="profile-form-label">Tỉnh / Thành phố *</label>
        <select id="modal-select-province" class="profile-form-select">
          <option value="HN" ${user.province === 'HN' ? 'selected' : ''}>Hà Nội</option>
          <option value="HCM" ${user.province === 'HCM' ? 'selected' : ''}>TP. Hồ Chí Minh</option>
          <option value="DN" ${user.province === 'DN' ? 'selected' : ''}>Đà Nẵng</option>
          <option value="HP" ${user.province === 'HP' ? 'selected' : ''}>Hải Phòng</option>
          <option value="CT" ${user.province === 'CT' ? 'selected' : ''}>Cần Thơ</option>
          <option value="BD" ${user.province === 'BD' ? 'selected' : ''}>Bình Dương</option>
          <option value="other" ${user.province === 'other' ? 'selected' : ''}>Tỉnh thành khác</option>
        </select>
      </div>
    `;

    modalSubmit.onclick = () => {
      const newAddress = document.getElementById("modal-input-address")?.value.trim();
      const newProv = document.getElementById("modal-select-province")?.value;

      if (!newAddress) {
        alert("Vui lòng nhập địa chỉ chi tiết!");
        return;
      }

      user.address = newAddress;
      user.province = newProv;
      updateUserStorage(user);
      renderUserProfile(user);
      closeModal();

      if (window.showAuthToast) {
        window.showAuthToast("Cập nhật địa chỉ giao hàng thành công!");
      }
    };

    modalBackdrop.classList.add("active");
  }

  if (btnEditAddress) btnEditAddress.addEventListener("click", openAddressModal);
  if (btnManageAddress) btnManageAddress.addEventListener("click", openAddressModal);
}

/**
 * Xử lý form cập nhật toàn bộ trong tab "THÔNG TIN TÀI KHOẢN"
 */
function initFullInfoForm() {
  const form = document.getElementById("profile-full-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = getCurrentUserProfile();

    const ho = document.getElementById("info-ho")?.value.trim();
    const ten = document.getElementById("info-ten")?.value.trim();
    const phone = document.getElementById("info-phone")?.value.trim();
    const email = document.getElementById("info-email")?.value.trim();
    const birthday = document.getElementById("info-birthday")?.value;
    const gender = document.getElementById("info-gender")?.value;
    const province = document.getElementById("info-province")?.value;

    if (!ten || !phone || !email) {
      alert("Vui lòng điền tên, số điện thoại và email!");
      return;
    }

    user.ho = ho;
    user.ten = ten;
    user.fullName = `${ho} ${ten}`.trim();
    user.phone = phone;
    user.email = email;
    user.birthday = birthday;
    user.gender = gender;
    user.province = province;

    updateUserStorage(user);
    renderUserProfile(user);

    if (window.showAuthToast) {
      window.showAuthToast("Đã lưu thay đổi thông tin tài khoản thành công!");
    } else {
      alert("Đã lưu thay đổi thông tin tài khoản thành công!");
    }
  });
}

/**
 * Cập nhật đồng bộ vào cả btl_current_user và danh sách btl_registered_users
 */
function updateUserStorage(user) {
  localStorage.setItem("btl_current_user", JSON.stringify(user));

  // Cập nhật bản ghi trong btl_registered_users nếu có
  const usersJson = localStorage.getItem("btl_registered_users");
  if (usersJson) {
    try {
      const users = JSON.parse(usersJson);
      if (Array.isArray(users)) {
        const idx = users.findIndex(
          (u) =>
            (u.email && u.email.toLowerCase() === user.email?.toLowerCase()) ||
            (u.phone && u.phone === user.phone)
        );
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...user };
        } else {
          users.push(user);
        }
        localStorage.setItem("btl_registered_users", JSON.stringify(users));
      }
    } catch (e) {}
  }
}

