const USERS_STORAGE_KEY = "Users";
const CURRENT_USER_STORAGE_KEY = "CurrentUser";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(?!00)[0-9]{10,11}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{6,}$/;

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("standalone-register-form");
  if (!registerForm) return;

  const firstNameInput = document.getElementById("page-reg-ho");
  const lastNameInput = document.getElementById("page-reg-ten");
  const phoneInput = document.getElementById("page-reg-phone");
  const emailInput = document.getElementById("page-reg-email");
  const passwordInput = document.getElementById("page-reg-password");
  const confirmPasswordInput = document.getElementById("page-reg-repassword");
  const termsCheckbox = document.getElementById("page-reg-terms");
  const promoCheckbox = document.getElementById("page-reg-promo");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstNameValue = firstNameInput.value.trim();
    const lastNameValue = lastNameInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    if (!firstNameValue || !lastNameValue || !phoneValue || !passwordValue || !confirmPasswordValue) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (!PHONE_PATTERN.test(phoneValue)) {
      alert("Số điện thoại phải gồm 10–11 chữ số và không bắt đầu bằng '00'.");
      phoneInput.focus();
      return;
    }

    if (emailValue && !EMAIL_PATTERN.test(emailValue)) {
      alert("Email không đúng định dạng.");
      emailInput.focus();
      return;
    }

    if (!PASSWORD_PATTERN.test(passwordValue)) {
      alert("Mật khẩu cần ít nhất 6 ký tự, gồm chữ và số.");
      passwordInput.focus();
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      alert("Mật khẩu nhập lại không trùng khớp.");
      confirmPasswordInput.focus();
      return;
    }

    if (!termsCheckbox.checked) {
      alert("Vui lòng đồng ý với chính sách và điều khoản của cửa hàng.");
      termsCheckbox.focus();
      return;
    }

    let users;
    try {
      users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
    } catch (error) {
      alert("Dữ liệu tài khoản bị lỗi. Vui lòng xóa dữ liệu lỗi và thử lại.");
      return;
    }

    if (!Array.isArray(users)) {
      alert("Dữ liệu tài khoản không hợp lệ.");
      return;
    }

    const emailExists = emailValue && users.some(
      (user) => (user.email || "").toLowerCase() === emailValue
    );
    const phoneExists = users.some((user) => user.phone === phoneValue);
    if (emailExists || phoneExists) {
      alert("Email hoặc số điện thoại này đã được đăng ký.");
      return;
    }

    const fullName = `${firstNameValue} ${lastNameValue}`;
    const newUser = {
      ho: firstNameValue,
      ten: lastNameValue,
      fullName,
      fullname: fullName,
      phone: phoneValue,
      email: emailValue,
      password: passwordValue,
      newsletter: promoCheckbox.checked,
    };

    try {
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem("btl_registered_users", JSON.stringify(users));
      localStorage.setItem("btl_current_user", JSON.stringify(newUser));
    } catch (error) {
      alert("Không thể lưu dữ liệu tài khoản trên trình duyệt này.");
      return;
    }

    alert("Đăng ký thành công! Bạn đã được đăng nhập.");
    window.location.href = "../../index.html";
  });
});
