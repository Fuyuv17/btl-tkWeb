/**
 * menu-toppings.js
 * Author: Quy Duong (MSV: 252631030)
 * File: src/js/QuyDuong_252631030/menu-toppings.js
 * 
 * Mục đích:
 *  - Quản lý và tra cứu tùy chọn Topping cho các món ăn hoàn toàn từ src/data/data.json
 *  - Không lưu trữ dữ liệu món ăn thô / hardcoded trong code JS
 *  - Cung cấp hàm tìm kiếm topping động theo productId trên toàn bộ data.json
 */

/**
 * Tra cứu danh sách Topping theo productId từ dữ liệu data.json
 * Quét qua:
 *  1. Các danh mục sản phẩm (data[catKey].products[productId])
 *  2. Mảng bestSeller
 *  3. Mảng suggestions
 *  4. Mảng indexProducts (cho trang chủ index.html)
 * 
 * @param {string} productId Mã sản phẩm
 * @param {object} data Dữ liệu parse từ data.json
 * @returns {Array} Mảng các object { name, price }
 */
function findProductToppings(productId, data) {
  if (!productId || !data || typeof data !== "object") {
    return [];
  }

  // 1. Kiểm tra trong các danh mục có dạng { products: { [id]: product } }
  for (const catKey of Object.keys(data)) {
    const category = data[catKey];
    if (category && category.products && typeof category.products === "object") {
      const prod = category.products[productId];
      if (prod && Array.isArray(prod.toppingOptions) && prod.toppingOptions.length > 0) {
        return prod.toppingOptions;
      }
    }
  }

  // 2. Kiểm tra trong mảng bestSeller
  if (Array.isArray(data.bestSeller)) {
    const match = data.bestSeller.find(item => item && item.id === productId);
    if (match && Array.isArray(match.toppingOptions) && match.toppingOptions.length > 0) {
      return match.toppingOptions;
    }
  }

  // 3. Kiểm tra trong mảng suggestions
  if (Array.isArray(data.suggestions)) {
    const match = data.suggestions.find(item => item && item.id === productId);
    if (match && Array.isArray(match.toppingOptions) && match.toppingOptions.length > 0) {
      return match.toppingOptions;
    }
  }

  // 4. Kiểm tra trong mảng indexProducts
  if (Array.isArray(data.indexProducts)) {
    const match = data.indexProducts.find(item => item && item.id === productId);
    if (match && Array.isArray(match.toppingOptions) && match.toppingOptions.length > 0) {
      return match.toppingOptions;
    }
  }

  return [];
}

/**
 * Tải dữ liệu data.json với hỗ trợ tự động tìm đúng đường dẫn tương đối
 * theo từng cấp thư mục của trang HTML hiện tại.
 */
async function loadMenuToppingsData() {
  const possiblePaths = [
    "../../data/data.json",
    "../data/data.json",
    "src/data/data.json",
    "./src/data/data.json",
    "/src/data/data.json"
  ];

  for (const path of possiblePaths) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }
  return null;
}

// Gắn vào window để các file script khác (menu_popup.js, menu-sections.js) gọi dùng chung
if (typeof window !== "undefined") {
  window.findProductToppings = findProductToppings;
  window.loadMenuToppingsData = loadMenuToppingsData;
}


