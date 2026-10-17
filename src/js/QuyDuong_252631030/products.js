const productsScriptUrl = document.currentScript.src;
const productsDataUrl = new URL("../../data/data.json", productsScriptUrl);
const productImagesUrl = new URL("../../assets/images/TruongQuyDuong_252631030/", productsScriptUrl);
const cartStorageKey = "shoppingCart";
const checkoutPhonePattern = /^(?!00)[0-9]{10,11}$/;
const categoryOrder = ["combo", "com", "mi-bun", "do-an-vat", "nuoc-uong"];

const imageFolderMap = {
  // CaoQuynhAnh_252601009
  "combo-doi-ban-than.png": "CaoQuynhAnh_252601009",

  // ChuSyThanh
  "bun-bo.jpg": "ChuSyThanh",
  "bun-ca.jpg": "ChuSyThanh",
  "bun-ga.jpg": "ChuSyThanh",
  "bun-moc.jpg": "ChuSyThanh",
  "bun-tron-ga-xe.jpg": "ChuSyThanh",
  "bun-tron-thit-nuong.jpg": "ChuSyThanh",
  "mi-tron-nem-chua-ran.jpg": "ChuSyThanh",
  "mi-tron-rau-cu.jpg": "ChuSyThanh",
  "mi-tron-thap-cam.jpg": "ChuSyThanh",
  "mi-tron-vien-chien.jpg": "ChuSyThanh",

  // TruongQuyDuong_252631030
  "com-bo-chao-nong.jpg": "TruongQuyDuong_252631030",
  "com-bo-cha-nong.jpg": "TruongQuyDuong_252631030",
  "com-rang-dua-bo.jpg": "TruongQuyDuong_252631030",
  "com-rang-thap-cam.jpg": "TruongQuyDuong_252631030",
  "com-tho-dui-ga.jpg": "TruongQuyDuong_252631030",
  "com-tron-ga-nuong.jpg": "TruongQuyDuong_252631030",
  "com-tron-trung-rau.jpg": "TruongQuyDuong_252631030",
  "4_mieng_ga_ron.jpg": "TruongQuyDuong_252631030",
  "6_mieng_ga_ron.jpg": "TruongQuyDuong_252631030",
  "burger_chip_coca01.jpg": "TruongQuyDuong_252631030",
  "chips_01.png": "TruongQuyDuong_252631030",
  "comga_nuoc.jpg": "TruongQuyDuong_252631030",
  "comga_nuoc_02.jpg": "TruongQuyDuong_252631030",
  "drinks_01.png": "TruongQuyDuong_252631030",
  "ga_coca.png": "TruongQuyDuong_252631030",
  "ga_nuoc_chip_01.png": "TruongQuyDuong_252631030",
  "ga_ran_xot.png": "TruongQuyDuong_252631030",
  "ice_creame_01.png": "TruongQuyDuong_252631030",
  "spagetti_01.png": "TruongQuyDuong_252631030",
  "spagetti_02.png": "TruongQuyDuong_252631030",

  // PhamQuangThanh
  "kimbap-chien.jpg": "PhamQuangThanh",
  "kimbap.jpg": "PhamQuangThanh",
  "snack-bap-ngot.svg": "PhamQuangThanh",
  "snack-bi-do.svg": "PhamQuangThanh",
  "snack-crap-me.svg": "PhamQuangThanh",
  "snack-pho-mai.svg": "PhamQuangThanh",
  "snack-tom-cay.svg": "PhamQuangThanh",

  // DuongVanMinh
  "chanh-leo-bach-huong.jpg": "DuongVanMinh",
  "duong-chi-cam-lo.jpg": "DuongVanMinh",
  "nuoc-chanh-tuoi-lanh.jpg": "DuongVanMinh",
  "super-sundae-dao-hong.jpg": "DuongVanMinh",
  "super-sundae-dau-tay.jpg": "DuongVanMinh",
  "super-sundae-khoai-mon.jpg": "DuongVanMinh",
  "super-sundae-tran-chau.jpg": "DuongVanMinh",
  "super-sundae-xoai.jpg": "DuongVanMinh",
  "tra-chanh-lo-hoi.jpg": "DuongVanMinh",
  "Tra-Hong-Vai.jpg": "DuongVanMinh",
  "cafe-latte.jpg": "DuongVanMinh",
  "tra-nho.jpg": "DuongVanMinh",
  "tra-sua-tran-chau-duong-den.jpg": "DuongVanMinh",
};

const categoryFallbackImages = {
  combo: "com-tho-dui-ga.jpg",
  com: "com-tho-dui-ga.jpg",
  "mi-bun": "mi-tron-thap-cam.jpg",
  "do-an-vat": "snack-pho-mai.svg",
  "nuoc-uong": "tra-sua-tran-chau-duong-den.jpg",
};

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function getProductImage(product, fallbackImage = "com-tho-dui-ga.jpg") {
  const imageName = (product && (product.image || product.src)) || fallbackImage;
  if (imageName && imageFolderMap[imageName]) {
    return new URL(`../../assets/images/${imageFolderMap[imageName]}/${imageName}`, productsScriptUrl).href;
  }
  return new URL(imageName || fallbackImage, productImagesUrl).href;
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
  const {
    quantity = 1,
    toppings = [],
    size = "",
    sugar = "",
    ice = "",
    basePrice = Number(product.price || 0),
    note = "",
    image = getProductImage(product, options.fallbackImage),
  } = options;

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
    price: formatPrice(basePrice + toppingsTotal),
    basePrice,
    quantity,
    size,
    sugar,
    ice,
    toppings,
    note,
    storage: "",
    color: "",
  };

  const cart = readCart();
  const existing = cart.find((item) =>
    item.id === cartItem.id &&
    (item.size || "") === (cartItem.size || "") &&
    (item.sugar || "") === (cartItem.sugar || "") &&
    (item.ice || "") === (cartItem.ice || "") &&
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
    size = "",
    sugar = "",
    ice = "",
    basePrice = Number(product.price || 0),
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
  const unitPrice = basePrice + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const summaryImg = document.getElementById("checkout-product-image");
  if (summaryImg) {
    summaryImg.src = image;
    summaryImg.alt = product.name;
  }
  const summaryName = document.getElementById("checkout-product-name");
  if (summaryName) summaryName.textContent = `${product.name} × ${quantity}`;
  const summaryOptions = document.getElementById("checkout-product-options");
  if (summaryOptions) {
    const details = [];
    if (size) details.push(`Size: ${size}`);
    if (sugar) details.push(`Đường: ${sugar}`);
    if (ice) details.push(`Đá: ${ice}`);
    if (toppings.length) details.push(`Topping: ${toppings.map((t) => t.name).join(", ")}`);
    if (note) details.push(`Ghi chú: ${note}`);
    summaryOptions.textContent = details.length ? details.join(" | ") : "Không có tùy chọn thêm";
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
      price: formatPrice(unitPrice),
      basePrice,
      quantity,
      size,
      sugar,
      ice,
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
      openProductDetails(resolvedProduct.id || productId);
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

  const sizeFieldset = document.getElementById("product-size-fieldset");
  const sizeContainer = document.getElementById("size-options");
  const sugarFieldset = document.getElementById("product-sugar-fieldset");
  const sugarContainer = document.getElementById("sugar-options");
  const iceFieldset = document.getElementById("product-ice-fieldset");
  const iceContainer = document.getElementById("ice-options");

  // 1. Kích cỡ (Size M / L)
  const sizeOptions = Array.isArray(product.sizeOptions) ? product.sizeOptions : [];
  if (sizeFieldset && sizeContainer) {
    sizeContainer.replaceChildren();
    if (sizeOptions.length) {
      sizeFieldset.hidden = false;
      sizeOptions.forEach((size, index) => {
        const label = document.createElement("label");
        label.className = "topping-option";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "product-size";
        radio.value = size.name;
        radio.dataset.price = String(Number(size.price) || 0);
        if (index === 0) radio.checked = true;
        radio.addEventListener("change", updateTotal);
        const name = document.createElement("span");
        name.className = "topping-option-name";
        name.textContent = size.name;
        const price = document.createElement("span");
        price.className = "topping-option-price";
        price.textContent = size.price > 0 ? `+${formatPrice(size.price)}` : "+0đ";
        label.append(radio, name, price);
        sizeContainer.appendChild(label);
      });
    } else {
      sizeFieldset.hidden = true;
    }
  }

  // 2. Mức đường (0-100% chia theo số lẻ: 0%, 30%, 50%, 70%, 100%)
  const sugarOptions = Array.isArray(product.sugarOptions) ? product.sugarOptions : [];
  if (sugarFieldset && sugarContainer) {
    sugarContainer.replaceChildren();
    if (sugarOptions.length) {
      sugarFieldset.hidden = false;
      sugarOptions.forEach((sugar, index) => {
        const label = document.createElement("label");
        label.className = "option-pill";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "product-sugar";
        radio.value = sugar;
        if (sugar === "100%" || index === sugarOptions.length - 1) radio.checked = true;
        const span = document.createElement("span");
        span.textContent = sugar;
        label.append(radio, span);
        sugarContainer.appendChild(label);
      });
    } else {
      sugarFieldset.hidden = true;
    }
  }

  // 3. Mức đá (0-100% chia theo số lẻ: 0%, 30%, 50%, 70%, 100%)
  const iceOptions = Array.isArray(product.iceOptions) ? product.iceOptions : [];
  if (iceFieldset && iceContainer) {
    iceContainer.replaceChildren();
    if (iceOptions.length) {
      iceFieldset.hidden = false;
      iceOptions.forEach((ice, index) => {
        const label = document.createElement("label");
        label.className = "option-pill";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "product-ice";
        radio.value = ice;
        if (ice === "100%" || index === iceOptions.length - 1) radio.checked = true;
        const span = document.createElement("span");
        span.textContent = ice;
        label.append(radio, span);
        iceContainer.appendChild(label);
      });
    } else {
      iceFieldset.hidden = true;
    }
  }

  // 4. Topping options
  const toppingOptions = Array.isArray(product.toppingOptions) ? product.toppingOptions : [];
  toppingsContainer.replaceChildren();
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

  function getSelectedSize() {
    const checked = sizeContainer ? sizeContainer.querySelector('input[name="product-size"]:checked') : null;
    return checked ? { name: checked.value, price: Number(checked.dataset.price || 0) } : null;
  }

  function getSelectedSugar() {
    const checked = sugarContainer ? sugarContainer.querySelector('input[name="product-sugar"]:checked') : null;
    return checked ? checked.value : "";
  }

  function getSelectedIce() {
    const checked = iceContainer ? iceContainer.querySelector('input[name="product-ice"]:checked') : null;
    return checked ? checked.value : "";
  }

  function selectedToppings() {
    return Array.from(toppingsContainer.querySelectorAll('input[name="topping"]:checked')).map((input) => ({
      name: input.dataset.name,
      price: Number(input.dataset.price),
    }));
  }

  function updateTotal() {
    const selectedSize = getSelectedSize();
    const sizePrice = selectedSize ? selectedSize.price : 0;
    const toppingsTotal = selectedToppings().reduce((sum, topping) => sum + topping.price, 0);
    const unitPrice = Number(product.price) + sizePrice + toppingsTotal;
    document.getElementById("product-price").textContent = formatPrice(Number(product.price) + sizePrice);
    totalOutput.textContent = formatPrice(unitPrice * quantity);
    return unitPrice * quantity;
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

  function getProductOrderPayload() {
    const selectedSize = getSelectedSize();
    const sizePrice = selectedSize ? selectedSize.price : 0;
    return {
      quantity,
      toppings: selectedToppings(),
      size: selectedSize ? selectedSize.name : "",
      sugar: getSelectedSugar(),
      ice: getSelectedIce(),
      basePrice: Number(product.price) + sizePrice,
      note: document.getElementById("product-note").value.trim(),
      image: imageUrl,
    };
  }

  document.getElementById("add-to-cart").addEventListener("click", () => {
    if (addToCart(product, getProductOrderPayload())) {
      message.textContent = "Đã thêm sản phẩm vào giỏ hàng.";
    }
  });

  document.getElementById("place-order").addEventListener("click", () => {
    openCheckoutModal(product, getProductOrderPayload());
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
