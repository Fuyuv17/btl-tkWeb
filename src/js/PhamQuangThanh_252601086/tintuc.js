// 🔹 Biến toàn cục xác định chiều cao header
function getHeaderHeight() {
  const header = document.querySelector("header");
  if (header) {
    return header.offsetHeight + 15;
  }
  return window.innerWidth < 1000 ? 65 : 135;
}

// 🔹 Hàm tiện dụng để cuộn tới section bất kỳ
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const offset =
    target.getBoundingClientRect().top + window.scrollY - getHeaderHeight();

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}

// 🔹 Danh sách liên kết nút điều hướng và section mục tiêu (Khuyến mãi, Món mới, Bí quyết)
const navButtons = [
  { btnId: "go-to-sale", sectionId: "salenews" },
  { btnId: "go-to-explore", sectionId: "explorenews" },
  { btnId: "go-to-trick", sectionId: "tricknews" },
];

// Gán sự kiện cuộn mượt cho các nút điều hướng
navButtons.forEach(({ btnId, sectionId }) => {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.addEventListener("click", (event) => {
      event.preventDefault();

      // Cập nhật class active cho tab
      document
        .querySelectorAll(".tintuc-tab-link, .menu-category-tab-link")
        .forEach((tab) => tab.classList.remove("is-active", "active"));
      btn.classList.add("is-active", "active");

      scrollToSection(sectionId);
    });
  }
});

// 🔹 Xử lý thông báo khi click vào chi tiết tin tức
function notifyUnderMaintenance(event) {
  if (event) event.stopPropagation();
  alert("Trang tin tức đang được bảo trì!");
}

// Gán sự kiện click cho các thẻ tin tức và nút đọc thêm
document.querySelectorAll(".tintuc-card, .read-more-btn").forEach((item) => {
  item.addEventListener("click", notifyUnderMaintenance);
});

