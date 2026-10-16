
// GIỎ HÀNG
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];

// ==========================================
// CÁC PHẦN TỬ HTML
// ==========================================

const cartList = document.getElementById("cart-list");
const emptyCart = document.getElementById("empty-cart");
const cartSummary = document.getElementById("cart-summary");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const checkoutButton = document.getElementById("checkout-btn");

// ==========================================
// LƯU GIỎ HÀNG
// ==========================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ==========================================
// ĐỊNH DẠNG GIÁ TIỀN
// ==========================================

function formatMoney(price) {
    return Number(price).toLocaleString("vi-VN") + " ₫";
}

// ==========================================
// TẢI DỮ LIỆU TỪ data.json
// ==========================================

async function loadProducts() {
    try {
        const response = await fetch("../data/data.json");

        if (!response.ok) {
            throw new Error("Không thể tải data.json");
        }

        const data = await response.json();

        allProducts = [];

        Object.entries(data).forEach(([categoryId, category]) => {
            if (!category.products) return;

            Object.entries(category.products).forEach(([productId, product]) => {
                allProducts.push({
                    id: productId,
                    categoryId: categoryId,
                    ...product
                });
            });
        });

        displayCart();
    } catch (error) {
        console.error("Lỗi tải dữ liệu sản phẩm:", error);

        cartList.innerHTML =
            "<p>Không tải được dữ liệu sản phẩm. Hãy kiểm tra đường dẫn data.json.</p>";
    }
}

// ==========================================
// HIỂN THỊ GIỎ HÀNG
// ==========================================

function displayCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        cartSummary.style.display = "none";
        return;
    }

    let totalPrice = 0;
    let displayedCount = 0;

    emptyCart.style.display = "none";
    cartSummary.style.display = "block";

    cart.forEach((item, index) => {
        const product = allProducts.find(
            (product) => product.id === item.productId
        );

        if (!product) {
            console.warn(
                "Không tìm thấy sản phẩm trong data.json:",
                item.productId
            );
            return;
        }

        const quantity = Math.max(1, Number(item.quantity) || 1);
        const price = Number(product.price) || 0;
        const itemTotal = price * quantity;

        totalPrice += itemTotal;
        displayedCount++;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const imageContainer = document.createElement("div");
        imageContainer.className = "cart-item-image";

        const image = document.createElement("img");
        image.src = product.image || "";
        image.alt = product.name || "Sản phẩm";

        image.addEventListener("error", () => {
            imageContainer.style.display = "none";
        });

        imageContainer.appendChild(image);

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h2");
        name.textContent = product.name || "Sản phẩm";

        const description = document.createElement("p");
        description.textContent = product.description || "";

        const priceElement = document.createElement("div");
        priceElement.className = "cart-price";
        priceElement.textContent = formatMoney(price);

        info.append(name, description, priceElement);

        const quantityContainer = document.createElement("div");
        quantityContainer.className = "quantity";

        const minusButton = document.createElement("button");
        minusButton.className = "minus-btn";
        minusButton.dataset.index = index;
        minusButton.textContent = "-";
        minusButton.type = "button";
        minusButton.setAttribute("aria-label", "Giảm số lượng");

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const plusButton = document.createElement("button");
        plusButton.className = "plus-btn";
        plusButton.dataset.index = index;
        plusButton.textContent = "+";
        plusButton.type = "button";
        plusButton.setAttribute("aria-label", "Tăng số lượng");

        quantityContainer.append(
            minusButton,
            quantityText,
            plusButton
        );

        const itemTotalElement = document.createElement("div");
        itemTotalElement.className = "item-total";
        itemTotalElement.textContent = formatMoney(itemTotal);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-btn";
        removeButton.dataset.index = index;
        removeButton.textContent = "Xóa";
        removeButton.type = "button";

        cartItem.append(
            imageContainer,
            info,
            quantityContainer,
            itemTotalElement,
            removeButton
        );

        cartList.appendChild(cartItem);
    });

    if (displayedCount === 0) {
        emptyCart.style.display = "block";
        cartSummary.style.display = "none";
        return;
    }

    subtotalElement.textContent = formatMoney(totalPrice);
    totalElement.textContent = formatMoney(totalPrice);

    document.querySelectorAll(".minus-btn").forEach((button) => {
        button.addEventListener("click", () => {
            decreaseQuantity(Number(button.dataset.index));
        });
    });

    document.querySelectorAll(".plus-btn").forEach((button) => {
        button.addEventListener("click", () => {
            increaseQuantity(Number(button.dataset.index));
        });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", () => {
            removeProduct(Number(button.dataset.index));
        });
    });
}

// ==========================================
// TĂNG SỐ LƯỢNG
// ==========================================

function increaseQuantity(index) {
    if (!cart[index]) return;

    cart[index].quantity = (Number(cart[index].quantity) || 1) + 1;

    saveCart();
    displayCart();
}

// ==========================================
// GIẢM SỐ LƯỢNG
// ==========================================

function decreaseQuantity(index) {
    if (!cart[index]) return;

    const quantity = Number(cart[index].quantity) || 1;

    if (quantity > 1) {
        cart[index].quantity = quantity - 1;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

// ==========================================
// XÓA SẢN PHẨM
// ==========================================

function removeProduct(index) {
    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    displayCart();
}

// ==========================================
// ĐẶT HÀNG
// ==========================================

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống!");
            return;
        }

        const hasInvalidProduct = cart.some(
            (item) => !allProducts.some(
                (product) => product.id === item.productId
            )
        );

        if (hasInvalidProduct) {
            alert("Có sản phẩm không tìm thấy trong dữ liệu. Vui lòng kiểm tra giỏ hàng.");
            return;
        }

        alert("Đặt hàng thành công!");

        cart = [];

        saveCart();
        displayCart();
    });
}

// ==========================================
// CHẠY KHI MỞ TRANG
// ==========================================

if (cartList && emptyCart && cartSummary) {
    loadProducts();
} else {
    console.error(
        "Không tìm thấy phần tử giỏ hàng. Hãy kiểm tra các ID trong giohang.html."
    );
}
