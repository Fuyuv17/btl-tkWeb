const categories = document.querySelectorAll(".category");
const products = document.querySelectorAll(".product-card");

const productCount = document.querySelector("#product-count");

const sortSelect = document.querySelector("#sort");

const productList = document.querySelector("#product-list");

const cartCount = document.querySelector("#cart-count");

let cart = 0;

/* =========================
   FILTER CATEGORY
========================= */

categories.forEach((category) => {
  category.addEventListener("click", () => {
    categories.forEach((item) => {
      item.classList.remove("active");
    });

    category.classList.add("active");

    const selectedCategory = category.dataset.category;

    let visibleProducts = 0;

    products.forEach((product) => {
      const productCategory = product.dataset.category;

      if (selectedCategory === "all" || selectedCategory === productCategory) {
        product.style.display = "";

        visibleProducts++;
      } else {
        product.style.display = "none";
      }
    });

    productCount.textContent = visibleProducts;
  });
});

/* =========================
   SORT
========================= */

sortSelect.addEventListener("change", () => {
  const type = sortSelect.value;

  const productArray = Array.from(products);

  if (type === "low") {
    productArray.sort((a, b) => {
      return Number(a.dataset.price) - Number(b.dataset.price);
    });
  }

  if (type === "high") {
    productArray.sort((a, b) => {
      return Number(b.dataset.price) - Number(a.dataset.price);
    });
  }

  if (type === "default") {
    productArray.sort((a, b) => {
      return Number(a.dataset.price) - Number(b.dataset.price);
    });
  }

  productArray.forEach((product) => {
    productList.appendChild(product);
  });
});

/* =========================
   ADD TO CART
========================= */

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cart++;

    cartCount.textContent = cart;

    const productName = button.dataset.name;

    alert(`${productName} đã được thêm vào giỏ hàng!`);
  });
});
