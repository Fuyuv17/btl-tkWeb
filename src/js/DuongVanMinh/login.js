const USERS_STORAGE_KEY = "Users";
const CURRENT_USER_STORAGE_KEY = "CurrentUser";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("standalone-login-form");
  if (!loginForm) return;

  const accountInput = document.getElementById("page-login-account");
  const passwordInput = document.getElementById("page-login-password");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const accountValue = accountInput.value.trim();
    const passwordValue = passwordInput.value;
    if (!accountValue || !passwordValue) {
      alert("Vui lòng nhập email/số điện thoại và mật khẩu.");
      return;
    }

    let users;
    try {
      users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
    } catch (error) {
      alert("Dữ liệu tài khoản bị lỗi. Vui lòng đăng ký lại.");
      return;
    }

    if (!Array.isArray(users)) {
      alert("Dữ liệu tài khoản không hợp lệ.");
      return;
    }

    const normalizedAccount = accountValue.toLowerCase();
    const currentUser = users.find((user) => {
      const emailMatches = (user.email || "").toLowerCase() === normalizedAccount;
      const phoneMatches = user.phone === accountValue;
      return (emailMatches || phoneMatches) && user.password === passwordValue;
    });

    if (!currentUser) {
      alert("Email/số điện thoại hoặc mật khẩu không chính xác.");
      return;
    }

    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    localStorage.setItem("btl_current_user", JSON.stringify(currentUser));
    alert(`Xin chào ${currentUser.fullName || currentUser.fullname || "bạn"}! Đăng nhập thành công.`);
    window.location.href = "../../index.html";
  });
});
