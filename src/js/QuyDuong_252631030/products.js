const productsScriptUrl = document.currentScript.src;
const productsDataUrl = new URL("../../data/data.json", productsScriptUrl);
const productImagesUrl = new URL("../../assets/images/TruongQuyDuong_252631030/", productsScriptUrl);
const cartStorageKey = "shoppingCart";
const checkoutPhonePattern = /^(?!00)[0-9]{10,11}$/;
const categoryOrder = ["combo", "com", "mi-bun", "do-an-vat", "nuoc-uong"];
const categoryFallbackImages = {
  combo: "ga_nuoc_chip_01.png",
  com: "comga_nuoc.jpg",
  "mi-bun": "spagetti_01.png",
  "do-an-vat": "chips_01.png",
  "nuoc-uong": "drinks_01.png",
};

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function getProductImage(product, fallbackImage = "ga_nuoc_chip_01.png") {
  return new URL(product.image || fallbackImage, productImagesUrl).href;
}

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function addToCart(product, options = {}) {
  const { quantity = 1, toppings = [], note = "", image = getProductImage(product, options.fallbackImage) } = options;
  if (!localStorage.getItem("CurrentUser")) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
    window.location.href = new URL("../../pages/login.html", productsScriptUrl).href;
    return false;
  }

  const toppingsTotal = toppings.reduce((sum, topping) => sum + Number(topping.price || 0), 0);
  const cartItem = {
    id: product.id,
    name: product.name,
    image,
    price: formatPrice(Number(product.price) + toppingsTotal),
    basePrice: Number(product.price),
    quantity,
    toppings,
    note,
    storage: "",
    color: "",
  };

  const cart = readCart();
  const existing = cart.find((item) =>
    item.id === cartItem.id &&
    JSON.stringify(item.toppings || []) === JSON.stringify(cartItem.toppings) &&
    (item.note || "") === cartItem.note
  );
  if (existing) existing.quantity = (Number(existing.quantity) || 0) + quantity;
  else cart.push(cartItem);

  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  return true;
}

function openProductDetails(productId) {
  const detailsUrl = new URL("../../pages/products.html", productsScriptUrl);
  detailsUrl.searchParams.set("id", productId);
  window.location.href = detailsUrl.href;
}

// Xử lý mở modal thanh toán và đặt hàng cho sản phẩm
function openCheckoutModal(product, options = {}) {
  const {
    quantity = 1,
    toppings = [],
    note = "",
    image = getProductImage(product, options.fallbackImage),
  } = options;

  if (!localStorage.getItem("CurrentUser")) {
    alert("Vui lòng đăng nhập để đặt hàng!");
    window.location.href = new URL("../../pages/login.html", productsScriptUrl).href;
    return;
  }

  const checkoutModal = document.getElementById("product-checkout-modal");
  const checkoutForm = document.getElementById("product-checkout-form");
  const checkoutQr = document.getElementById("product-checkout-qr");
  if (!checkoutModal || !checkoutForm) return;

  const checkoutRadioButtons = checkoutForm.querySelectorAll('input[name="product-payment-method"]');
  const qrImageUrl = new URL("../../assets/images/CaoQuynhAnh_252601009/qr.jpg", productsScriptUrl).href;

  const qrImg = checkoutQr?.querySelector("img");
  if (qrImg) qrImg.src = qrImageUrl;

  // Điền trước thông tin người nhận nếu đã đăng nhập
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("CurrentUser") || "null");
  } catch (_) {}

  const nameInput = document.getElementById("product-receiver-name");
  const phoneInput = document.getElementById("product-receiver-phone");
  if (currentUser) {
    if (nameInput && !nameInput.value) {
      nameInput.value = currentUser.fullName || currentUser.fullname ||
        [currentUser.ho, currentUser.ten].filter(Boolean).join(" ") ||
        currentUser.email || "";
    }
    if (phoneInput && !phoneInput.value) {
      phoneInput.value = currentUser.phone || "";
    }
  }

  // Cập nhật tóm tắt đơn hàng
  const toppingsTotal = toppings.reduce((sum, topping) => sum + Number(topping.price || 0), 0);
  const totalPrice = (Number(product.price || 0) + toppingsTotal) * quantity;

  const summaryImg = document.getElementById("checkout-product-image");
  if (summaryImg) {
    summaryImg.src = image;
    summaryImg.alt = product.name;
  }
  const summaryName = document.getElementById("checkout-product-name");
  if (summaryName) summaryName.textContent = `${product.name} × ${quantity}`;
  const summaryOptions = document.getElementById("checkout-product-options");
  if (summaryOptions) {
    summaryOptions.textContent = toppings.length
      ? `Topping: ${toppings.map((topping) => topping.name).join(", ")}`
      : (note ? `Ghi chú: ${note}` : "Không chọn topping");
  }
  const summaryTotal = document.getElementById("checkout-product-total");
  if (summaryTotal) summaryTotal.textContent = formatPrice(totalPrice);

  // Đăng ký sự kiện đóng modal và đổi phương thức thanh toán một lần duy nhất
  if (!checkoutModal.dataset.eventsBound) {
    checkoutModal.dataset.eventsBound = "true";

    checkoutModal.querySelector(".checkout-close")?.addEventListener("click", () => {
      checkoutModal.hidden = true;
      document.body.classList.remove("checkout-open");
    });

    checkoutModal.addEventListener("click", (event) => {
      if (event.target === checkoutModal) {
        checkoutModal.hidden = true;
        document.body.classList.remove("checkout-open");
      }
    });

    checkoutRadioButtons.forEach((radio) => radio.addEventListener("change", () => {
      if (checkoutQr) checkoutQr.hidden = radio.value !== "transfer" || !radio.checked;
    }));
  }

  // Xử lý gửi form đặt hàng
  checkoutForm.onsubmit = (event) => {
    event.preventDefault();
    const receiverName = document.getElementById("product-receiver-name").value.trim();
    const receiverPhone = document.getElementById("product-receiver-phone").value.trim();
    const receiverAddress = document.getElementById("product-receiver-address").value.trim();

    if (!checkoutPhonePattern.test(receiverPhone)) {
      alert("Số điện thoại phải gồm 10–11 chữ số và không bắt đầu bằng '00'.");
      document.getElementById("product-receiver-phone").focus();
      return;
    }

    const paymentMethod = checkoutForm.querySelector('input[name="product-payment-method"]:checked').value;
    const orderItem = {
      id: product.id,
      name: product.name,
      image,
      price: formatPrice(Number(product.price || 0) + toppingsTotal),
      basePrice: Number(product.price || 0),
      quantity,
      toppings,
      note,
      storage: "",
      color: "",
    };

    const orders = (() => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        return Array.isArray(savedOrders) ? savedOrders : [];
      } catch (error) {
        return [];
      }
    })();

    orders.push({
      receiverName,
      receiverPhone,
      receiverAddress,
      paymentMethod,
      items: [orderItem],
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Đặt hàng thành công!\n\nNgười nhận: ${receiverName}\nSố điện thoại: ${receiverPhone}\nĐịa chỉ: ${receiverAddress}\nThanh toán: ${paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}`);

    checkoutForm.reset();
    if (checkoutQr) checkoutQr.hidden = true;
    checkoutModal.hidden = true;
    document.body.classList.remove("checkout-open");
  };

  checkoutModal.hidden = false;
  document.body.classList.add("checkout-open");
  if (nameInput) nameInput.focus();
}

function createProductCard(productId, product, fallbackImage, showActions = true) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `Xem chi tiết ${product.name}`);
  card.addEventListener("click", () => openProductDetails(productId));
  card.addEventListener("keydown", (event) => {
    if (event.target === card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openProductDetails(productId);
    }
  });

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "product-image";
  const image = document.createElement("img");
  image.src = getProductImage(product, fallbackImage);
  image.alt = product.name;
  image.loading = "lazy";
  imageWrapper.appendChild(image);

  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = product.badge;
    imageWrapper.appendChild(badge);
  }

  const info = document.createElement("div");
  info.className = "product-info";
  const name = document.createElement("h2");
  name.textContent = product.name;
  const description = document.createElement("p");
  description.textContent = product.description || "";
  const footer = document.createElement("div");
  footer.className = "product-card-footer";
  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(product.price);
  footer.appendChild(price);

  if (showActions) {
    const actions = document.createElement("div");
    actions.className = "product-actions";

    const cartButton = document.createElement("button");
    cartButton.type = "button";
    cartButton.className = "cart-add-btn";
    cartButton.title = "Thêm vào giỏ hàng";
    cartButton.setAttribute("aria-label", `Thêm ${product.name} vào giỏ hàng`);

    const orderButton = document.createElement("button");
    orderButton.type = "button";
    orderButton.className = "add-btn";
    orderButton.textContent = "Đặt hàng";

    const resolvedProduct = { ...product, id: product.id || productId };

    cartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (addToCart(resolvedProduct, { fallbackImage, image: getProductImage(resolvedProduct, fallbackImage) })) {
        alert("Đã thêm sản phẩm vào giỏ hàng.");
      }
    });

    orderButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openCheckoutModal(resolvedProduct, { fallbackImage, image: getProductImage(resolvedProduct, fallbackImage) });
    });

    actions.append(cartButton, orderButton);
    footer.appendChild(actions);
  }

  info.append(name, description, footer);
  card.append(imageWrapper, info);
  return card;
}

function initializeMenuCarousel() {
  const slides = Array.from(document.querySelectorAll("#slides img"));
  const dotsContainer = document.getElementById("dots");
  const slidesContainer = document.getElementById("slides");
  if (!slides.length || !dotsContainer || !slidesContainer) return;

  let activeSlide = 0;
  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Hiển thị banner ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slidesContainer.style.transform = `translateX(-${activeSlide * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeSlide);
      dots[slideIndex].classList.toggle("active", slideIndex === activeSlide);
    });
  }

  document.getElementById("prev")?.addEventListener("click", () => showSlide(activeSlide - 1));
  document.getElementById("next")?.addEventListener("click", () => showSlide(activeSlide + 1));
  showSlide(0);
}

function initializeCategoryTabs() {
  const tabs = Array.from(document.querySelectorAll(".menu-category-tab-link"));
  if (!tabs.length) return;

  const updateActiveTab = () => {
    const activeHash = window.location.hash || "#best-seller";
    tabs.forEach((tab) => {
      const active = tab.getAttribute("href") === activeHash;
      tab.classList.toggle("is-active", active);
      if (active) tab.setAttribute("aria-current", "location");
      else tab.removeAttribute("aria-current");
    });
  };
  window.addEventListener("hashchange", updateActiveTab);
  updateActiveTab();
}

function renderHomepageProducts(database) {
  const container = document.getElementById("head-category-products");
  if (!container) return;
  container.replaceChildren();
  Object.entries(database.bestseller?.products || {}).forEach(([id, product]) => {
    container.appendChild(createProductCard(id, product, categoryFallbackImages.combo, true));
  });
}

function renderMenuProducts(database) {
  const bestsellerGrid = document.getElementById("menu-bestseller-products");
  const categorySections = document.getElementById("menu-category-sections");
  if (!bestsellerGrid || !categorySections) return;

  const bestsellers = database.bestseller?.products || {};
  Object.entries(bestsellers).forEach(([id, product]) => {
    bestsellerGrid.appendChild(createProductCard(id, product, categoryFallbackImages.combo, true));
  });

  categoryOrder.forEach((categoryId) => {
    const category = database[categoryId];
    if (!category?.products) return;

    const section = document.createElement("section");
    section.id = categoryId;
    section.className = "menu-product-section menu-category-section";
    const heading = document.createElement("div");
    heading.className = "menu-section-heading menu-category-heading";
    const title = document.createElement("h2");
    title.textContent = category.name;
    heading.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "product-grid";
    Object.entries(category.products).forEach(([id, product]) => {
      const combinedProduct = { ...bestsellers[id], ...product };
      grid.appendChild(createProductCard(id, combinedProduct, categoryFallbackImages[categoryId], true));
    });
    section.append(heading, grid);
    categorySections.appendChild(section);
  });

  if (!bestsellerGrid.childElementCount) bestsellerGrid.textContent = "Chưa có sản phẩm bán chạy.";
}

function renderProductDetails(database) {
  const detail = document.getElementById("product-detail");
  if (!detail) return;

  const productId = new URLSearchParams(window.location.search).get("id");
  const message = document.getElementById("product-message");
  const toppingsContainer = document.getElementById("topping-options");
  const quantityOutput = document.getElementById("product-quantity");
  const totalOutput = document.getElementById("product-total");
  let quantity = 1;

  const showError = (text) => {
    detail.replaceChildren();
    const error = document.createElement("p");
    error.className = "product-load-error";
    error.textContent = text;
    detail.appendChild(error);
  };
  if (!productId) {
    showError("Không tìm thấy mã sản phẩm.");
    return;
  }

  let categoryId = "";
  let categoryProduct = null;
  for (const [key, category] of Object.entries(database)) {
    if (key === "bestseller") continue;
    if (category?.products?.[productId]) {
      categoryId = key;
      categoryProduct = category.products[productId];
      break;
    }
  }
  const bestsellerProduct = database.bestseller?.products?.[productId] || null;
  if (!categoryProduct && bestsellerProduct) categoryId = "bestseller";
  if (!categoryProduct && !bestsellerProduct) {
    showError("Không tìm thấy sản phẩm này.");
    return;
  }

  const product = { ...(bestsellerProduct || {}), ...(categoryProduct || {}) };
  product.id = product.id || productId;
  const imageName = product.image || bestsellerProduct?.image || categoryFallbackImages[categoryId] || categoryFallbackImages.combo;
  const imageUrl = getProductImage({ image: imageName });
  const image = document.getElementById("product-image");
  image.src = imageUrl;
  image.alt = product.name;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-category").textContent = database[categoryId]?.name || "Best Seller";
  document.getElementById("product-description").textContent = product.description || "Món ngon được chế biến tươi mới, sẵn sàng cho bạn thưởng thức.";
  document.title = `${product.name} | Ăn Ngon`;

  const badge = document.getElementById("product-badge");
  if (product.badge) {
    badge.textContent = product.badge;
    badge.hidden = false;
  }

  const toppingOptions = Array.isArray(product.toppingOptions) ? product.toppingOptions : [];
  if (!toppingOptions.length) {
    const noToppings = document.createElement("p");
    noToppings.className = "no-toppings-message";
    noToppings.textContent = "Món này hiện không có topping tùy chọn.";
    toppingsContainer.appendChild(noToppings);
  } else {
    toppingOptions.forEach((topping, index) => {
      const label = document.createElement("label");
      label.className = "topping-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "topping";
      checkbox.value = String(index);
      checkbox.dataset.name = topping.name;
      checkbox.dataset.price = String(Number(topping.price) || 0);
      checkbox.addEventListener("change", updateTotal);
      const toppingName = document.createElement("span");
      toppingName.className = "topping-option-name";
      toppingName.textContent = topping.name;
      const toppingPrice = document.createElement("span");
      toppingPrice.className = "topping-option-price";
      toppingPrice.textContent = `+${formatPrice(topping.price)}`;
      label.append(checkbox, toppingName, toppingPrice);
      toppingsContainer.appendChild(label);
    });
  }

  function selectedToppings() {
    return Array.from(toppingsContainer.querySelectorAll('input[name="topping"]:checked')).map((input) => ({
      name: input.dataset.name,
      price: Number(input.dataset.price),
    }));
  }

  function updateTotal() {
    const toppingsTotal = selectedToppings().reduce((sum, topping) => sum + topping.price, 0);
    document.getElementById("product-price").textContent = formatPrice(product.price);
    totalOutput.textContent = formatPrice((Number(product.price) + toppingsTotal) * quantity);
    return (Number(product.price) + toppingsTotal) * quantity;
  }

  document.getElementById("quantity-decrease").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    quantityOutput.textContent = String(quantity);
    updateTotal();
  });
  document.getElementById("quantity-increase").addEventListener("click", () => {
    quantity += 1;
    quantityOutput.textContent = String(quantity);
    updateTotal();
  });

  function addSelectedProductToCart() {
    if (!localStorage.getItem("CurrentUser")) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      window.location.href = new URL("../../pages/login.html", productsScriptUrl).href;
      return false;
    }
    const toppings = selectedToppings();
    return addToCart(product, {
      quantity,
      toppings,
      note: document.getElementById("product-note").value.trim(),
      image: imageUrl,
    });
  }

  document.getElementById("add-to-cart").addEventListener("click", () => {
    if (addSelectedProductToCart()) message.textContent = "Đã thêm sản phẩm vào giỏ hàng.";
  });

  document.getElementById("place-order").addEventListener("click", () => {
    openCheckoutModal(product, {
      quantity,
      toppings: selectedToppings(),
      note: document.getElementById("product-note").value.trim(),
      image: imageUrl,
    });
  });

  updateTotal();
}

document.addEventListener("DOMContentLoaded", async () => {
  initializeMenuCarousel();
  initializeCategoryTabs();

  const homepageGrid = document.getElementById("head-category-products");
  const menuBestsellerGrid = document.getElementById("menu-bestseller-products");
  const productDetail = document.getElementById("product-detail");
  if (!homepageGrid && !menuBestsellerGrid && !productDetail) return;

  try {
    const response = await fetch(productsDataUrl);
    if (!response.ok) throw new Error("Không thể tải dữ liệu thực đơn.");
    const database = await response.json();
    if (homepageGrid) renderHomepageProducts(database);
    if (menuBestsellerGrid) renderMenuProducts(database);
    if (productDetail) renderProductDetails(database);
  } catch (error) {
    console.error("Lỗi tải dữ liệu sản phẩm:", error);
    if (homepageGrid) homepageGrid.textContent = "Không thể tải danh sách sản phẩm.";
    if (menuBestsellerGrid) {
      menuBestsellerGrid.textContent = "Không thể tải danh sách sản phẩm.";
      document.getElementById("menu-category-sections").textContent = "Không thể tải danh sách sản phẩm.";
    }
    if (productDetail) {
      productDetail.replaceChildren();
      const message = document.createElement("p");
      message.className = "product-load-error";
      message.textContent = "Không thể tải thông tin sản phẩm. Vui lòng thử lại.";
      productDetail.appendChild(message);
    }
  }
});
