const cartStorageKey = "shoppingCart";

function readCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

function parseCartPrice(price) {
  if (typeof price === "number") return price;
  return Number(String(price || "").replace(/[^\d]/g, "")) || 0;
}

function formatCartPrice(price) {
  return `${Number(price || 0).toLocaleString("vi-VN")}đ`;
}

function getCartUnitPrice(item) {
  if (Number.isFinite(Number(item.basePrice))) {
    const toppingsTotal = (Array.isArray(item.toppings) ? item.toppings : [])
      .reduce((sum, topping) => sum + parseCartPrice(topping.price), 0);
    return Number(item.basePrice) + toppingsTotal;
  }
  return parseCartPrice(item.price);
}

document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.querySelector(".cart-list");
  const totalPriceElement = document.querySelector(".total-price");
  const subtotalElement = document.getElementById("subtotal");
  const paymentButton = document.querySelector(".payment-button");
  if (!cartList) return;

  const cart = readCartItems();

  function renderCart() {
    cartList.replaceChildren();

    if (!cart.length) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-cart";
      const cartIcon = document.createElement("img");
      cartIcon.src = "../assets/images/CaoQuynhAnh_252601009/cart.svg";
      cartIcon.alt = "";
      const emptyText = document.createElement("span");
      emptyText.textContent = "Giỏ hàng của bạn đang trống!";
      emptyItem.append(cartIcon, emptyText);
      cartList.appendChild(emptyItem);

      if (subtotalElement) subtotalElement.textContent = "0đ";
      if (totalPriceElement) totalPriceElement.textContent = "0đ";
      if (paymentButton) {
        paymentButton.textContent = "Thanh toán";
        paymentButton.disabled = true;
      }
      return;
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = getCartUnitPrice(item);
      subtotal += unitPrice * quantity;

      const listItem = document.createElement("li");
      listItem.className = "cart-item";

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "cart-item-left";
      const image = document.createElement("img");
      image.className = "cart-item-img";
      image.src = item.image || "../assets/images/CaoQuynhAnh_252601009/cart.svg";
      image.alt = item.name || "Sản phẩm";
      imageWrapper.appendChild(image);

      const info = document.createElement("div");
      info.className = "cart-item-info";
      const productInfo = document.createElement("div");
      productInfo.className = "product-info";

      const title = document.createElement("div");
      title.className = "cart-item-name";
      const heading = document.createElement("h3");
      heading.textContent = item.name || "Sản phẩm";
      title.appendChild(heading);

      const details = document.createElement("div");
      details.className = "cart-item-detail";
      if (item.color) {
        const color = document.createElement("p");
        color.textContent = `Màu: ${item.color}`;
        details.appendChild(color);
      }
      if (item.storage) {
        const storage = document.createElement("p");
        storage.textContent = `Dung lượng: ${item.storage}`;
        details.appendChild(storage);
      }
      if (item.size) {
        const sizeP = document.createElement("p");
        sizeP.textContent = `Kích cỡ: ${item.size}`;
        details.appendChild(sizeP);
      }
      if (item.sugar) {
        const sugarP = document.createElement("p");
        sugarP.textContent = `Lượng đường: ${item.sugar}`;
        details.appendChild(sugarP);
      }
      if (item.ice) {
        const iceP = document.createElement("p");
        iceP.textContent = `Lượng đá: ${item.ice}`;
        details.appendChild(iceP);
      }
      const unitPriceText = document.createElement("p");
      unitPriceText.className = "cart-item-price";
      unitPriceText.textContent = `Đơn giá: ${formatCartPrice(unitPrice)}`;
      details.appendChild(unitPriceText);

      productInfo.append(title, details);
      const toppings = Array.isArray(item.toppings) ? item.toppings : [];
      if (toppings.length) {
        const toppingBlock = document.createElement("div");
        toppingBlock.className = "cart-item-toppings";
        const toppingHeading = document.createElement("strong");
        toppingHeading.textContent = "Topping đã chọn";
        const toppingList = document.createElement("ul");
        toppings.forEach((topping) => {
          const toppingRow = document.createElement("li");
          toppingRow.textContent = `${topping.name} (+${formatCartPrice(topping.price)})`;
          toppingList.appendChild(toppingRow);
        });
        toppingBlock.append(toppingHeading, toppingList);
        productInfo.appendChild(toppingBlock);
      }

      if (item.note) {
        const note = document.createElement("p");
        note.className = "cart-item-note";
        const noteLabel = document.createElement("strong");
        noteLabel.textContent = "Ghi chú: ";
        note.append(noteLabel, document.createTextNode(item.note));
        productInfo.appendChild(note);
      }

      const controls = document.createElement("div");
      controls.className = "quanlity-control-unit";
      const quantityControl = document.createElement("div");
      quantityControl.className = "quantity-control";
      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.className = "decrease";
      decreaseButton.textContent = "−";
      decreaseButton.setAttribute("aria-label", `Giảm số lượng ${item.name}`);
      const quantityDisplay = document.createElement("span");
      quantityDisplay.className = "quantity";
      quantityDisplay.textContent = String(quantity);
      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.className = "increase";
      increaseButton.textContent = "+";
      increaseButton.setAttribute("aria-label", `Tăng số lượng ${item.name}`);
      quantityControl.append(decreaseButton, quantityDisplay, increaseButton);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-btn";
      removeButton.textContent = "Xóa";
      controls.append(quantityControl, removeButton);
      info.append(productInfo, controls);
      listItem.append(imageWrapper, info);
      cartList.appendChild(listItem);

      increaseButton.addEventListener("click", () => {
        item.quantity = quantity + 1;
        saveAndRender();
      });
      decreaseButton.addEventListener("click", () => {
        if (quantity > 1) item.quantity = quantity - 1;
        else if (confirm("Xóa sản phẩm này khỏi giỏ?")) cart.splice(index, 1);
        saveAndRender();
      });
      removeButton.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
          cart.splice(index, 1);
          saveAndRender();
        }
      });
    });

    if (subtotalElement) subtotalElement.textContent = formatCartPrice(subtotal);
    if (totalPriceElement) totalPriceElement.textContent = formatCartPrice(subtotal);
    if (paymentButton) {
      paymentButton.disabled = false;
      paymentButton.textContent = `Thanh toán (${cart.length} sản phẩm)`;
    }
  }

  function saveAndRender() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    renderCart();
  }

  renderCart();
});

// FORM THANH TOÁN

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("checkout-modal");
  const closeButton = document.querySelector(".close-btn");
  const paymentButton = document.querySelector(".payment-button");
  const cashButton = document.getElementById("cash-btn");
  const bankButton = document.getElementById("bank-btn");
  const qrSection = document.getElementById("qr-section");
  const checkoutForm = document.getElementById("checkout-form");
  if (!modal || !closeButton || !paymentButton || !cashButton || !bankButton || !qrSection || !checkoutForm) return;

  const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
    document.body.classList.remove("checkout-open");
  };

  paymentButton.addEventListener("click", () => {
    if (readCartItems().length === 0) return;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.body.classList.add("checkout-open");
  });
  closeButton.addEventListener("click", closeModal);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  cashButton.addEventListener("click", () => {
    cashButton.classList.add("active");
    bankButton.classList.remove("active");
    qrSection.style.display = "none";
  });
  bankButton.addEventListener("click", () => {
    bankButton.classList.add("active");
    cashButton.classList.remove("active");
    qrSection.style.display = "flex";
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("receiver-name").value.trim();
    const phone = document.getElementById("receiver-phone").value.trim();
    const address = document.getElementById("receiver-address").value.trim();
    if (!name || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }

    const method = cashButton.classList.contains("active") ? "Thanh toán tiền mặt" : "Chuyển khoản ngân hàng";
    alert(`Đơn hàng đã được xác nhận!\n\nNgười nhận: ${name}\nSố điện thoại: ${phone}\nĐịa chỉ: ${address}\nPhương thức: ${method}\n\nCảm ơn bạn đã mua hàng!`);
    localStorage.removeItem(cartStorageKey);
    checkoutForm.reset();
    closeModal();
    window.location.reload();
  });
});
