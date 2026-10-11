/**
 * menu-sections.js
 * Author: Quy Duong (MSV: 252631030)
 * File: src/js/QuyDuong_252631030/menu-sections.js
 * 
 * Mục đích:
 *  - Logic tải dữ liệu từ src/data/data.json
 *  - Render giao diện danh sách Best Seller và Gợi ý hôm nay ăn gì
 *  - Xử lý hành vi thêm nhanh vào giỏ hàng
 * (Dữ liệu đã được tách hoàn toàn ra file src/data/data.json)
 */

// Đường dẫn tới file dữ liệu dùng chung
const DATA_JSON_PATH = "../data/data.json";
const BACKUP_DATA_JSON_PATH = "/src/data/data.json";

/**
 * Định dạng tiền tệ VNĐ (ví dụ: 45.000đ)
 */
function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

/**
 * Tạo phần tử DOM cho từng thẻ món ăn (tái sử dụng cấu trúc product-card)
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
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  imageFrame.appendChild(image);

  // Nhãn badge nếu có (ví dụ: Bán chạy, Combo)
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

  // Nút thêm vào giỏ hàng
  const addBtn = document.createElement("button");
  addBtn.className = "add-btn";
  addBtn.type = "button";
  addBtn.setAttribute("aria-label", `Thêm vào giỏ hàng ${product.name}`);
  addBtn.innerHTML = `<span>Thêm vào giỏ hàng</span>`;

  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Cập nhật số lượng giỏ hàng trên Header nếu có badge giỏ hàng
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
 * Render danh sách sản phẩm vào một container
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
 * Tải dữ liệu từ src/data/data.json và khởi tạo hiển thị
 */
async function loadMenuSectionsData() {
  let data = null;

  try {
    const response = await fetch(DATA_JSON_PATH);
    if (response.ok) {
      data = await response.json();
    } else {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
  } catch (err) {
    try {
      const retryResponse = await fetch(BACKUP_DATA_JSON_PATH);
      if (retryResponse.ok) {
        data = await retryResponse.json();
      }
    } catch (fallbackErr) {
      console.warn("Không thể tải data.json qua fetch (có thể do mở file trực tiếp qua giao thức file://):", fallbackErr);
    }
  }

  // Nếu tải được file data.json thành công
  if (data) {
    if (data.bestSeller) {
      renderProductGrid("menu-best-seller-grid", data.bestSeller);
    }
    if (data.suggestions) {
      renderProductGrid("menu-suggestion-grid", data.suggestions);
    }
  }
}

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", loadMenuSectionsData);
