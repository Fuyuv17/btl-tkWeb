/**
 * ==========================================================================
 * XỬ LÝ CHUYỂN ĐỘNG VÀ TƯƠNG TÁC CHO PRODUCT POP-UP (BOTTOM SHEET)
 * Hiệu ứng: Trượt từ dưới lên (Slide-up from bottom to top)
 * Author: Quy Duong (MSV: 252631030)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tự động khởi tạo giao diện Pop-up nếu chưa có trong DOM
  initPopupDOM();

  // 2. Khai báo các phần tử DOM của Popup
  const overlay = document.getElementById("product-popup-overlay");
  const container = overlay.querySelector(".popup-container");
  const closeBtn = document.getElementById("popup-close-btn");
  const popupTitle = document.getElementById("popup-title");
  const popupDesc = document.getElementById("popup-desc");
  const popupPrice = document.getElementById("popup-price");
  const popupTotalPrice = document.getElementById("popup-total-price");
  const popupBadge = document.getElementById("popup-badge");
  const popupImg = document.getElementById("popup-img");
  const popupPlaceholder = document.getElementById("popup-placeholder");
  const qtyMinusBtn = document.getElementById("popup-qty-minus");
  const qtyPlusBtn = document.getElementById("popup-qty-plus");
  const qtyValue = document.getElementById("popup-qty-value");
  const noteInput = document.getElementById("popup-note");
  const submitBtn = document.getElementById("popup-submit");
  const toast = document.getElementById("popup-toast");
  const toastMsg = document.getElementById("popup-toast-msg");

  // Biến lưu trạng thái món ăn đang xem
  let currentItemPrice = 0;
  let currentQuantity = 1;
  let currentItemName = "";

  // 3. Hàm định dạng tiền tệ VNĐ (ví dụ: 69.000 ₫)
  function formatMoney(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  }

  // 4. Hàm cập nhật lại tổng tiền theo số lượng
  function updateSubtotal() {
    qtyValue.textContent = currentQuantity;
    const total = currentItemPrice * currentQuantity;
    popupTotalPrice.textContent = formatMoney(total);
  }

  // 5. Hàm mở Pop-up (kích hoạt chuyển động từ dưới lên trên)
  function openPopup(productCard) {
    // Trích xuất dữ liệu từ thẻ món ăn được click
    const titleEl = productCard.querySelector("h2");
    const descEl = productCard.querySelector(".product-info > p");
    const priceEl = productCard.querySelector(".price");
    const badgeEl = productCard.querySelector(".badge");
    const imgEl = productCard.querySelector(".product-image img");
    const rawPrice = productCard.dataset.price;

    currentItemName = titleEl ? titleEl.textContent.trim() : "Món ăn";
    popupTitle.textContent = currentItemName;
    popupDesc.textContent = descEl ? descEl.textContent.trim() : "";

    // Parse giá
    if (rawPrice && !isNaN(rawPrice)) {
      currentItemPrice = parseInt(rawPrice, 10);
    } else if (priceEl) {
      currentItemPrice = parseInt(priceEl.textContent.replace(/\D/g, ""), 10) || 0;
    } else {
      currentItemPrice = 0;
    }
    popupPrice.textContent = formatMoney(currentItemPrice);

    // Xử lý badge
    if (badgeEl && badgeEl.textContent.trim()) {
      popupBadge.textContent = badgeEl.textContent.trim();
      popupBadge.style.display = "block";
    } else {
      popupBadge.style.display = "none";
    }

    // Xử lý hình ảnh hoặc placeholder
    if (imgEl && imgEl.src) {
      popupImg.src = imgEl.src;
      popupImg.alt = currentItemName;
      popupImg.style.display = "block";
      popupPlaceholder.style.display = "none";
    } else {
      popupImg.style.display = "none";
      popupPlaceholder.style.display = "flex";
      popupPlaceholder.textContent = currentItemName.toUpperCase();
    }

    // Reset lại số lượng và ghi chú
    currentQuantity = 1;
    if (noteInput) noteInput.value = "";
    updateSubtotal();

    // Mở popup: Thêm class .active để kích hoạt transition trượt lên
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Khóa cuộn trang nền
  }

  // 6. Hàm đóng Pop-up (trượt xuống lại)
  function closePopup() {
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Mở lại cuộn trang
  }

  // 7. Hàm hiển thị Toast thông báo khi đặt món thành công
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // 8. Bắt sự kiện click vào từng sản phẩm (.product-card)
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Nếu click trúng nút "Đặt hàng" trực tiếp trên card thì không mở popup
      if (e.target.closest(".add-btn")) {
        return;
      }
      openPopup(card);
    });
  });

  // 9. Bắt sự kiện đóng Popup
  closeBtn.addEventListener("click", closePopup);

  // Click vào vùng mờ bên ngoài khung nội dung để đóng
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closePopup();
    }
  });

  // Nhấn phím Escape (ESC) để đóng
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closePopup();
    }
  });

  // 10. Tương tác tăng / giảm số lượng trong Popup
  qtyMinusBtn.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      updateSubtotal();
    }
  });

  qtyPlusBtn.addEventListener("click", () => {
    if (currentQuantity < 99) {
      currentQuantity++;
      updateSubtotal();
    }
  });

  // 11. Bấm nút Thêm vào giỏ hàng trong Popup
  submitBtn.addEventListener("click", () => {
    // Cập nhật số lượng giỏ hàng trên Header nếu có
    const cartCountEl = document.querySelector("#cart-count");
    if (cartCountEl) {
      let currentCart = parseInt(cartCountEl.textContent || "0", 10);
      if (isNaN(currentCart)) currentCart = 0;
      cartCountEl.textContent = currentCart + currentQuantity;
    }

    // Hiển thị thông báo
    showToast(`Đã thêm ${currentQuantity}x "${currentItemName}" vào giỏ hàng!`);

    // Đóng popup
    closePopup();
  });

  // 12. Hỗ trợ thao tác vuốt xuống (Swipe down) để đóng trên điện thoại / tablet
  let startY = 0;
  let currentY = 0;

  container.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    currentY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener("touchend", () => {
    // Nếu vuốt xuống quá 70px thì kích hoạt đóng popup
    if (currentY - startY > 70 && container.scrollTop <= 0) {
      closePopup();
    }
    startY = 0;
    currentY = 0;
  });
});

/**
 * Tạo cấu trúc DOM Pop-up tự động nếu chưa có sẵn trong HTML
 */
function initPopupDOM() {
  if (document.getElementById("product-popup-overlay")) {
    return; // Đã tồn tại, không tạo lại
  }

  const popupHTML = `
    <div id="product-popup-overlay" class="popup-overlay" aria-modal="true" role="dialog">
      <div class="popup-container">
        <div class="popup-drag-handle"></div>
        <button id="popup-close-btn" class="popup-close-btn" title="Đóng">&times;</button>
        
        <div class="popup-body">
          <div class="popup-media">
            <span id="popup-badge" class="popup-badge" style="display: none;"></span>
            <img id="popup-img" src="" alt="Ảnh món ăn" style="display: none;" />
            <div id="popup-placeholder" class="popup-placeholder">FOOD IMAGE</div>
          </div>

          <div class="popup-details">
            <h2 id="popup-title" class="popup-title">Tên món ăn</h2>
            <p id="popup-desc" class="popup-desc">Mô tả món ăn</p>
            
            <div class="popup-price-row">
              <span id="popup-price" class="popup-unit-price">0 ₫</span>
            </div>

            <div class="popup-qty-group">
              <span class="popup-qty-label">Số lượng:</span>
              <div class="popup-qty-controls">
                <button type="button" id="popup-qty-minus" class="popup-qty-btn" aria-label="Giảm">-</button>
                <span id="popup-qty-value" class="popup-qty-num">1</span>
                <button type="button" id="popup-qty-plus" class="popup-qty-btn" aria-label="Tăng">+</button>
              </div>
            </div>

            <div class="popup-note-box">
              <input type="text" id="popup-note" class="popup-note-input" placeholder="Ghi chú thêm (ví dụ: không cay, nhiều tương...)" />
            </div>

            <button type="button" id="popup-submit" class="popup-submit-btn">
              <span>Thêm vào giỏ hàng</span>
              <span id="popup-total-price">0 ₫</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="popup-toast" class="popup-toast">
      <span>🛒</span>
      <span id="popup-toast-msg">Đã thêm món vào giỏ hàng!</span>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", popupHTML);
}

