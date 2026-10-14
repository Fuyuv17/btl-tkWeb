/**
 * menu-sections.js
 * Author: Quy Duong (MSV: 252631030)
 * File: src/js/QuyDuong_252631030/menu-sections.js
 * 
 * Mục đích:
 *  - Tải dữ liệu từ src/data/data.json và render danh sách Best Seller + Gợi ý hôm nay
 *  - Xử lý nút "Thêm vào giỏ hàng"
 */

// Đường dẫn file dữ liệu
const DATA_JSON_PATHS = [
  "../data/data.json",
  "../../data/data.json",
  "src/data/data.json",
  "./src/data/data.json",
  "/src/data/data.json"
];

/**
 * Tự động chuẩn hoá đường dẫn ảnh theo ngữ cảnh trang (pages/, categories/, hoặc root)
 */
function resolveImagePath(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const clean = path.replace(/^\/?(src\/)?/, "");
  const inCategories = window.location.pathname.includes("/categories/");
  const inPages = window.location.pathname.includes("/pages/");

  if (inCategories) {
    return "../../" + clean;
  }
  if (inPages) {
    return "../" + clean;
  }
  return "src/" + clean;
}

/**
 * Định dạng tiền tệ VNĐ (ví dụ: 45.000đ)
 */
function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

/**
 * Tạo phần tử DOM cho từng thẻ món ăn đúng giao diện ảnh
 */
function createProductCardElement(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.price = product.price;
  card.dataset.productId = product.id;

  // 1. Ảnh món ăn
  const imageFrame = document.createElement("div");
  imageFrame.className = "product-image";

  const image = document.createElement("img");
  image.src = resolveImagePath(product.image);
  image.alt = product.name;
  image.loading = "lazy";
  image.onerror = function () {
    if (!this.dataset.fallbackTried) {
      this.dataset.fallbackTried = "true";
      const filename = (product.image || "").split("/").pop();
      if (filename) {
        if (window.location.pathname.includes("/categories/")) {
          this.src = `../../assets/images/TruongQuyDuong_252631030/${filename}`;
        } else if (window.location.pathname.includes("/pages/")) {
          this.src = `../assets/images/TruongQuyDuong_252631030/${filename}`;
        } else {
          this.src = `src/assets/images/TruongQuyDuong_252631030/${filename}`;
        }
      }
    }
  };
  imageFrame.appendChild(image);

  // Nhãn badge nếu có (ví dụ: 👑 Bán chạy)
  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.innerHTML = `👑 ${product.badge}`;
    imageFrame.appendChild(badge);
  }

  // 2. Thông tin món ăn
  const info = document.createElement("div");
  info.className = "product-info";

  const title = document.createElement("h2");
  title.textContent = product.name;

  const desc = document.createElement("p");
  desc.textContent = product.description;

  const footer = document.createElement("div");
  footer.className = "product-card-footer";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatVND(product.price);

  const actions = document.createElement("div");
  actions.className = "product-actions";

  // Nút "Thêm vào giỏ hàng" kèm icon xe đẩy
  const addBtn = document.createElement("button");
  addBtn.className = "add-btn";
  addBtn.type = "button";
  addBtn.setAttribute("aria-label", `Thêm vào giỏ hàng ${product.name}`);
  addBtn.innerHTML = `🛒 <span>Thêm vào giỏ hàng</span>`;

  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Tăng số lượng giỏ hàng trên header
    const cartCountEl = document.querySelector("#cart-count");
    if (cartCountEl) {
      let current = parseInt(cartCountEl.textContent || "0", 10) || 0;
      cartCountEl.textContent = current + 1;
    }

    // Hiển thị toast thông báo
    const toast = document.getElementById("popup-toast");
    const toastMsg = document.getElementById("popup-toast-msg");
    if (toast && toastMsg) {
      toastMsg.textContent = `Đã thêm "${product.name}" vào giỏ hàng!`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });

  actions.appendChild(addBtn);
  footer.appendChild(price);
  footer.appendChild(actions);

  info.appendChild(title);
  info.appendChild(desc);
  info.appendChild(footer);

  card.appendChild(imageFrame);
  card.appendChild(info);

  return card;
}

/**
 * Render mảng sản phẩm vào grid
 */
function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(products)) return;

  container.innerHTML = "";
  products.forEach((product) => {
    container.appendChild(createProductCardElement(product));
  });
}

/**
 * Tải dữ liệu từ src/data/data.json
 */
async function loadMenuSectionsData() {
  let data = null;

  for (const path of DATA_JSON_PATHS) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        data = await response.json();
        break;
      }
    } catch (e) {}
  }

  if (data) {
    if (data.bestSeller) {
      renderProductGrid("menu-best-seller-grid", data.bestSeller);
    }
    if (data.suggestions) {
      renderProductGrid("menu-suggestion-grid", data.suggestions);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadMenuSectionsData);
