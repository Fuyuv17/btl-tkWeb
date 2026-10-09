// ==========================================
// GIỎ HÀNG
// ==========================================


// Lấy dữ liệu giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// CÁC PHẦN TỬ HTML
// ==========================================

const cartList = document.getElementById("cart-list");

const emptyCart = document.getElementById("empty-cart");

const cartSummary = document.getElementById("cart-summary");

const subtotalElement = document.getElementById("subtotal");

const totalElement = document.getElementById("total");

const checkoutButton =
    document.getElementById("checkout-btn");


// ==========================================
// LƯU GIỎ HÀNG
// ==========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ==========================================
// ĐỊNH DẠNG GIÁ TIỀN
// ==========================================

function formatMoney(price) {

    return Number(price).toLocaleString("vi-VN") + " ₫";

}


// ==========================================
// HIỂN THỊ GIỎ HÀNG
// ==========================================

function displayCart() {

    // Xóa danh sách cũ
    cartList.innerHTML = "";


    // -------------------------------
    // GIỎ HÀNG TRỐNG
    // -------------------------------

    if (cart.length === 0) {

        emptyCart.style.display = "block";

        cartSummary.style.display = "none";

        return;
    }


    // -------------------------------
    // CÓ SẢN PHẨM
    // -------------------------------

    emptyCart.style.display = "none";

    cartSummary.style.display = "block";


    let totalPrice = 0;


    // Duyệt từng sản phẩm
    cart.forEach(function(product, index) {

        // Đảm bảo quantity luôn có giá trị
        if (!product.quantity) {
            product.quantity = 1;
        }


        // Giá sản phẩm
        const price = Number(product.price) || 0;


        // Thành tiền
        const itemTotal =
            price * product.quantity;


        // Cộng vào tổng
        totalPrice += itemTotal;


        // Tạo HTML sản phẩm
        const cartItem =
            document.createElement("div");


        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <!-- ẢNH SẢN PHẨM -->

            <div class="cart-item-image">

                <img
                    src="${product.image || ""}"
                    alt="${product.name || "Sản phẩm"}"
                >

            </div>


            <!-- THÔNG TIN -->

            <div class="cart-item-info">

                <h2>
                    ${product.name || "Sản phẩm"}
                </h2>

                <p>
                    ${product.description || ""}
                </p>

                <div class="cart-price">
                    ${formatMoney(price)}
                </div>

            </div>


            <!-- SỐ LƯỢNG -->

            <div class="quantity">

                <button
                    class="minus-btn"
                    data-index="${index}"
                >
                    -
                </button>


                <span>
                    ${product.quantity}
                </span>


                <button
                    class="plus-btn"
                    data-index="${index}"
                >
                    +
                </button>

            </div>


            <!-- THÀNH TIỀN -->

            <div class="item-total">

                ${formatMoney(itemTotal)}

            </div>


            <!-- XÓA -->

            <button
                class="remove-btn"
                data-index="${index}"
            >
                Xóa
            </button>

        `;


        cartList.appendChild(cartItem);

    });


    // ==================================
    // CẬP NHẬT TỔNG TIỀN
    // ==================================

    subtotalElement.textContent =
        formatMoney(totalPrice);


    totalElement.textContent =
        formatMoney(totalPrice);


    // ==================================
    // GẮN SỰ KIỆN NÚT -
    // ==================================

    const minusButtons =
        document.querySelectorAll(".minus-btn");


    minusButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const index =
                    Number(button.dataset.index);


                decreaseQuantity(index);

            }
        );

    });


    // ==================================
    // GẮN SỰ KIỆN NÚT +
    // ==================================

    const plusButtons =
        document.querySelectorAll(".plus-btn");


    plusButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const index =
                    Number(button.dataset.index);


                increaseQuantity(index);

            }
        );

    });


    // ==================================
    // GẮN SỰ KIỆN NÚT XÓA
    // ==================================

    const removeButtons =
        document.querySelectorAll(".remove-btn");


    removeButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const index =
                    Number(button.dataset.index);


                removeProduct(index);

            }
        );

    });

}


// ==========================================
// TĂNG SỐ LƯỢNG
// ==========================================

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity++;


    saveCart();

    displayCart();

}


// ==========================================
// GIẢM SỐ LƯỢNG
// ==========================================

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    // Nếu số lượng > 1
    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }

    // Nếu chỉ còn 1
    else {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

}


// ==========================================
// XÓA SẢN PHẨM
// ==========================================

function removeProduct(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);


    saveCart();

    displayCart();

}


// ==========================================
// ĐẶT HÀNG
// ==========================================

checkoutButton.addEventListener(
    "click",
    function() {

        // Kiểm tra giỏ hàng
        if (cart.length === 0) {

            alert("Giỏ hàng đang trống!");

            return;
        }


        // Thông báo
        alert("Đặt hàng thành công!");


        // Xóa giỏ hàng
        cart = [];


        // Lưu lại
        saveCart();


        // Hiển thị lại
        displayCart();

    }
);


// ==========================================
// CHẠY KHI MỞ TRANG
// ==========================================

displayCart();