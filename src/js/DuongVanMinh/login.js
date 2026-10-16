document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("standalone-login-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const account = document.getElementById("page-login-account").value.trim();
        const password = document.getElementById("page-login-password").value;

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;

        if (!account) {
            alert("Vui lòng nhập email hoặc số điện thoại!");
            return;
        }

        if (!password) {
            alert("Vui lòng nhập mật khẩu!");
            return;
        }
        if (!passwordRegex.test(password)) {
            alert("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số!");
            return;
        }

        // --- KIỂM TRA LOCALSTORAGE ---
        let users;
        try {
            users = JSON.parse(localStorage.getItem("Users") || "[]");
        } catch (error) {
            alert("Dữ liệu tài khoản bị lỗi. Vui lòng đăng ký lại.");
            return;
        }
        if (!Array.isArray(users)) {
            alert("Dữ liệu tài khoản không hợp lệ.");
            return;
        }

        const normalizedAccount = account.toLowerCase();
        const foundUser = users.find(user => {
            const emailMatches = (user.email || "").toLowerCase() === normalizedAccount;
            const phoneMatches = user.phone === account;
            return (emailMatches || phoneMatches) && user.password === password;
        });

        if (!foundUser) {
            alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
            return;
        }

        // --- ĐĂNG NHẬP THÀNH CÔNG ---
        localStorage.setItem("CurrentUser", JSON.stringify(foundUser));

        alert(`Xin chào ${foundUser.fullName || foundUser.fullname || "bạn"}! Đăng nhập thành công.`);
        window.location.href = "../../index.html";
    });
});
