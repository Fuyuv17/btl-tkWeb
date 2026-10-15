/**
 * menu-toppings.js
 * Author: Quy Duong (MSV: 252631030)
 * File: src/js/QuyDuong_252631030/menu-toppings.js
 * 
 * Mục đích:
 *  - Quản lý danh sách và dữ liệu Topping cho tất cả các thẻ món ăn trên menu.html
 *  - Tra cứu tùy chọn Topping từ data.json (category, bestSeller, suggestions) và Fallback Registry
 *  - Chia nhỏ code JS thành module riêng biệt dễ theo dõi và bảo trì
 */

// Bảng dữ liệu topping mặc định cho từng món ăn trên Menu
const DEFAULT_TOPPINGS_REGISTRY = {
  // 1. Cơm tấm sườn
  "com-tam-suon": [
    { name: "Trứng ốp la", price: 7000 },
    { name: "Thêm cơm", price: 5000 },
    { name: "Thêm sườn", price: 25000 },
    { name: "Thêm hành lá", price: 2000 }
  ],

  // 2. Cơm rang hải sản
  "com-rang-hai-san": [
    { name: "Trứng ốp la", price: 7000 },
    { name: "Thêm tôm hải sản", price: 15000 },
    { name: "Thêm cơm rang", price: 5000 },
    { name: "Thêm kim chi", price: 5000 }
  ],

  // 3. Cơm gà
  "com-ga": [
    { name: "Thêm đùi gà", price: 25000 },
    { name: "Trứng ốp la", price: 7000 },
    { name: "Thêm cơm", price: 5000 },
    { name: "Xốt cay ngọt", price: 5000 }
  ],

  // 4. Cơm sườn
  "com-suon": [
    { name: "Thêm sườn nướng", price: 25000 },
    { name: "Trứng ốp la", price: 7000 },
    { name: "Thêm cơm", price: 5000 },
    { name: "Mỡ hành", price: 2000 }
  ],

  // 5. Bún bò Huế
  "bun-bo-hue": [
    { name: "Thêm thịt bò", price: 20000 },
    { name: "Thêm chả lụa", price: 10000 },
    { name: "Thêm bún", price: 5000 },
    { name: "Trứng chần", price: 8000 }
  ],

  // 6. Chả giò
  "cha-gio": [
    { name: "Thêm 2 cuốn chả giò", price: 12000 },
    { name: "Xốt tương xí muội", price: 5000 },
    { name: "Xốt Mayonnaise", price: 5000 },
    { name: "Thêm rau thơm dưa leo", price: 3000 }
  ],

  // 7. Combo 1 - Cơm tấm sườn + nước
  "combo-1-com-tam-nuoc": [
    { name: "Trứng ốp la", price: 7000 },
    { name: "Nâng cấp nước ngọt lớn", price: 6000 },
    { name: "Thêm sườn nướng", price: 25000 },
    { name: "Canh rong biển", price: 8000 }
  ],

  // 8. Bún bò Huế đặc biệt
  "bun-bo-hue-dac-biet": [
    { name: "Thêm thịt bò bắp", price: 20000 },
    { name: "Thêm chả cua", price: 12000 },
    { name: "Thêm gân bò", price: 15000 },
    { name: "Thêm bún", price: 5000 },
    { name: "Trứng chần", price: 8000 }
  ],

  // 9. Cơm rang tôm
  "com-rang-tom": [
    { name: "Thêm tôm tươi", price: 15000 },
    { name: "Trứng ốp la", price: 7000 },
    { name: "Thêm cơm rang", price: 5000 },
    { name: "Xúc xích", price: 10000 }
  ],

  // 10. Khoai tây lắc phô mai
  "khoai-tay-lac-pho-mai": [
    { name: "Thêm bột phô mai", price: 5000 },
    { name: "Xốt phô mai béo", price: 7000 },
    { name: "Xúc xích lắc phô mai", price: 10000 },
    { name: "Nâng cấp size lớn", price: 10000 }
  ],

  // 11. Trà sữa trân châu
  "tra-sua-tran-chau": [
    { name: "Trân châu đường đen", price: 5000 },
    { name: "Trân châu trắng", price: 5000 },
    { name: "Thạch phô mai", price: 7000 },
    { name: "Pudding trứng", price: 7000 },
    { name: "Kem cheese", price: 8000 }
  ],

  // 12. Cơm gà nướng
  "com-ga-nuong": [
    { name: "Trứng ốp la", price: 7000 },
    { name: "Thêm cơm", price: 5000 },
    { name: "Thêm đùi gà nướng", price: 25000 },
    { name: "Xốt cay ngọt", price: 5000 }
  ]
};

/**
 * Tra cứu danh sách Topping theo productId và data.json
 * Ưu tiên:
 *  1. data.json -> danh mục cụ thể (com, combo, mi-bun, ...)
 *  2. data.json -> bestSeller
 *  3. data.json -> suggestions
 *  4. DEFAULT_TOPPINGS_REGISTRY
 * 
 * @param {string} productId Mã sản phẩm
 * @param {object} data Dữ liệu parse từ data.json
 * @returns {Array} Mảng các object { name, price }
 */
function findProductToppings(productId, data) {
  if (data && productId) {
    // 1. Kiểm tra trong danh mục sản phẩm (com, combo, mi-bun, do-an-vat, nuoc-uong)
    for (const catKey of Object.keys(data)) {
      if (data[catKey] && data[catKey].products && data[catKey].products[productId]) {
        const prod = data[catKey].products[productId];
        if (Array.isArray(prod.toppingOptions) && prod.toppingOptions.length > 0) {
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
  }

  // 4. Sử dụng fallback registry nếu chưa tìm thấy
  if (productId && DEFAULT_TOPPINGS_REGISTRY[productId]) {
    return DEFAULT_TOPPINGS_REGISTRY[productId];
  }

  return [];
}

// Gắn vào window để các file script khác (menu_popup.js, menu-sections.js) có thể gọi trực tiếp
if (typeof window !== "undefined") {
  window.DEFAULT_TOPPINGS_REGISTRY = DEFAULT_TOPPINGS_REGISTRY;
  window.findProductToppings = findProductToppings;
}

