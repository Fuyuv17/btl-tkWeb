/**
 * ========================================================
 * JAVASCRIPT CHO TRANG ĐỒ UỐNG (DOUONG.HTML)
 * Xử lý dữ liệu đồ uống, bộ lọc danh mục, giỏ hàng & yêu thích
 * ========================================================
 */

// Dữ liệu đồ uống được chuẩn hóa theo đúng mockup thiết kế
const drinkProducts = [
  // --- NHÓM BEST SELLER (6 món chính xác như mockup) ---
  {
    id: "tra-sua-tran-chau",
    name: "Trà sữa trân châu",
    category: "tra-sua",
    description: "Trà sữa thơm béo, trân châu dai ngon.",
    price: 32000,
    image: "../assets/images/douong/tra_sua_tran_chau.png",
    badge: "Bán chạy",
    badgeType: "bestseller",
    isBestSeller: true,
  },
  {
    id: "tra-sua-duong-den",
    name: "Trà sữa đường đen",
    category: "tra-sua",
    description: "Vị sữa béo ngậy, ngọt dịu hòa quyện đường đen.",
    price: 35000,
    image: "../assets/images/douong/tra_sua_duong_den.png",
    badge: "Yêu thích",
    badgeType: "favorite",
    isBestSeller: true,
  },
  {
    id: "tra-dao-cam-sa",
    name: "Trà đào cam sả",
    category: "tra-trai-cay",
    description: "Thanh mát, chua ngọt hài hòa, thơm mùi sả nhẹ.",
    price: 28000,
    image: "../assets/images/douong/tra_dao_cam_sa.png",
    badge: "Mới",
    badgeType: "new",
    isBestSeller: true,
  },
  {
    id: "ca-phe-sua-da",
    name: "Cà phê sữa đá",
    category: "ca-phe",
    description: "Cà phê đậm đà, hòa quyện cùng sữa thơm ngon.",
    price: 29000,
    image: "../assets/images/douong/ca_phe_sua_da.png",
    badge: "Combo",
    badgeType: "combo",
    isBestSeller: true,
  },
  {
    id: "tra-sua-matcha",
    name: "Trà sữa matcha",
    category: "tra-sua",
    description: "Vị matcha thanh nhẹ, béo ngậy, hấp dẫn.",
    price: 33000,
    image: "../assets/images/douong/tra_sua_matcha.png",
    badge: "Hot",
    badgeType: "hot",
    isBestSeller: true,
  },
  {
    id: "tra-sua-dau-tay",
    name: "Trà sữa dâu tây",
    category: "tra-sua",
    description: "Hương dâu tây tươi mát, kết hợp trà sữa béo ngậy.",
    price: 34000,
    image: "../assets/images/douong/tra_sua_dau_tay.png",
    badge: "Đặc biệt",
    badgeType: "special",
    isBestSeller: true,
  },

  // --- CÁC MÓN MỞ RỘNG THEO TỪNG DANH MỤC ---
  {
    id: "tra-chanh-nha-dam",
    name: "Trà chanh nha đam",
    category: "tra-trai-cay",
    description: "Vị chua dịu thanh nhiệt với topping nha đam giòn sần sật.",
    price: 22000,
    image: "../assets/images/douong/tra_dao_cam_sa.png",
    badge: "Giải nhiệt",
    badgeType: "new",
    isBestSeller: false,
  },
  {
    id: "tra-vai-hoa-hong",
    name: "Trà vải hoa hồng",
    category: "tra-trai-cay",
    description: "Hương hoa hồng quyến rũ kết hợp thịt vải ngọt thanh mọng nước.",
    price: 32000,
    image: "../assets/images/douong/tra_dao_cam_sa.png",
    badge: "Mới",
    badgeType: "new",
    isBestSeller: false,
  },
  {
    id: "ca-phe-den-da",
    name: "Cà phê đen đá",
    category: "ca-phe",
    description: "Cà phê Robusta rang mộc đậm đà nguyên bản cho ngày tỉnh táo.",
    price: 22000,
    image: "../assets/images/douong/ca_phe_sua_da.png",
    badge: "Đậm vị",
    badgeType: "bestseller",
    isBestSeller: false,
  },
  {
    id: "bac-xiu-ba-tang",
    name: "Bạc xỉu ba tầng",
    category: "ca-phe",
    description: "Sự hòa quyện ngọt ngào giữa sữa đặc, sữa tươi và cà phê thơm lừng.",
    price: 28000,
    image: "../assets/images/douong/ca_phe_sua_da.png",
    badge: "Yêu thích",
    badgeType: "favorite",
    isBestSeller: false,
  },
  {
    id: "nuoc-ep-cam-tuoi",
    name: "Nước ép cam tươi",
    category: "nuoc-ep",
    description: "100% cam tươi vắt nguyên chất dồi dào vitamin C tự nhiên.",
    price: 30000,
    image: "../assets/images/douong/tra_dao_cam_sa.png",
    badge: "Tươi ngon",
    badgeType: "new",
    isBestSeller: false,
  },
  {
    id: "nuoc-ep-dua-hau",
    name: "Nước ép dưa hấu",
    category: "nuoc-ep",
    description: "Vị ngọt thanh mát lành từ dưa hấu tươi mọng nước mát rượi.",
    price: 28000,
    image: "../assets/images/douong/tra_sua_dau_tay.png",
    badge: "Mát lạnh",
    badgeType: "hot",
    isBestSeller: false,
  },
  {
    id: "matcha-da-xay",
    name: "Matcha đá xay kem sữa",
    category: "da-xay",
    description: "Matcha Nhật Bản xay nhuyễn phủ lớp bông kem béo ngậy ngọt ngào.",
    price: 38000,
    image: "../assets/images/douong/tra_sua_matcha.png",
    badge: "Hot",
    badgeType: "hot",
    isBestSeller: false,
  },
  {
    id: "cookie-da-xay",
    name: "Choco Cookie đá xay",
    category: "da-xay",
    description: "Bánh Oreo giòn rụm xay cùng sốt sô-cô-la đậm đà hấp dẫn.",
    price: 39000,
    image: "../assets/images/douong/tra_sua_duong_den.png",
    badge: "Bán chạy",
    badgeType: "bestseller",
    isBestSeller: false,
  },
  {
    id: "soda-viet-quat",
    name: "Soda việt quất sủi bọt",
    category: "do-uong-khac",
    description: "Soda sủi tăm sảng khoái kết hợp siro việt quất chua ngọt.",
    price: 25000,
    image: "../assets/images/douong/tra_sua_dau_tay.png",
    badge: "Mát lạnh",
    badgeType: "special",
    isBestSeller: false,
  },
  {
    id: "tra-sen-vang",
    name: "Trà sen vàng kem cheese",
    category: "do-uong-khac",
    description: "Hương trà sen thanh tao, hạt sen bùi ngậy và kem cheese sánh mịn.",
    price: 36000,
    image: "../assets/images/douong/tra_sua_tran_chau.png",
    badge: "Đặc biệt",
    badgeType: "special",
    isBestSeller: false,
  },
];

// Chuẩn hóa thư mục ảnh theo vị trí thực tế của tài nguyên đồ uống.
drinkProducts.forEach((product) => {
  product.image = product.image.replace(
    "../assets/images/douong/",
    "../assets/images/DuongVanMinh/"
  );
});

// Quản lý danh sách yêu thích qua localStorage
const FAVORITES_STORAGE_KEY = "favorite_drinks";

function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error("Không thể lưu yêu thích:", e);
  }
}

function toggleFavorite(productId) {
  let favs = getFavorites();
  const index = favs.indexOf(productId);
  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    favs.push(productId);
  }
  saveFavorites(favs);
  return index < 0; // Trả về true nếu vừa thêm mới
}

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("drink-products-grid");
  const filterPills = document.querySelectorAll(".subcat-pill");
  const sectionTitle = document.getElementById("section-title");
  const sectionSubtitle = document.getElementById("section-subtitle");
  const btnViewAll = document.getElementById("btn-view-all");
  const searchInput = document.querySelector(".header-search input");

  if (!gridContainer) return;

  let currentCategory = "all";
  let currentSearchQuery = "";

  // Định dạng giá tiền VNĐ
  const formatPrice = (price) =>
    `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;

  // ---------------------------------------------------------
  // Xử lý Popup chi tiết sản phẩm
  // ---------------------------------------------------------
  function openDrinkPopup(product) {
    const overlay = document.getElementById("product-popup-overlay");
    if (!overlay) return;

    const titleEl = document.getElementById("popup-title");
    const descEl = document.getElementById("popup-desc");
    const priceEl = document.getElementById("popup-price");
    const totalEl = document.getElementById("popup-total-price");
    const imgEl = document.getElementById("popup-img");
    const placeholderEl = document.getElementById("popup-placeholder");
    const badgeEl = document.getElementById("popup-badge");
    const qtyEl = document.getElementById("popup-qty-value");
    const noteEl = document.getElementById("popup-note");

    let qty = 1;

    if (titleEl) titleEl.textContent = product.name;
    if (descEl) descEl.textContent = product.description;
    if (priceEl) priceEl.textContent = formatPrice(product.price);
    if (totalEl) totalEl.textContent = formatPrice(product.price);
    if (qtyEl) qtyEl.textContent = qty;
    if (noteEl) noteEl.value = "";

    if (badgeEl) {
      if (product.badge) {
        badgeEl.textContent = product.badge;
        badgeEl.style.display = "block";
      } else {
        badgeEl.style.display = "none";
      }
    }

    if (imgEl) {
      imgEl.src = product.image;
      imgEl.alt = product.name;
      imgEl.style.display = "block";
      if (placeholderEl) placeholderEl.style.display = "none";
    }

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Setup nút tăng giảm số lượng bên trong popup
    const minusBtn = document.getElementById("popup-qty-minus");
    const plusBtn = document.getElementById("popup-qty-plus");
    const submitBtn = document.getElementById("popup-submit");

    const updateSubtotal = () => {
      if (qtyEl) qtyEl.textContent = qty;
      if (totalEl) totalEl.textContent = formatPrice(product.price * qty);
    };

    if (minusBtn) {
      minusBtn.onclick = () => {
        if (qty > 1) {
          qty--;
          updateSubtotal();
        }
      };
    }

    if (plusBtn) {
      plusBtn.onclick = () => {
        if (qty < 99) {
          qty++;
          updateSubtotal();
        }
      };
    }

    if (submitBtn) {
      submitBtn.onclick = () => {
        overlay.classList.remove("active");
        document.body.style.overflow = "";

        // Hiển thị toast thông báo
        const toast = document.getElementById("popup-toast");
        const toastMsg = document.getElementById("popup-toast-msg");
        if (toast && toastMsg) {
          toastMsg.textContent = `Đã thêm ${qty}x "${product.name}" vào giỏ hàng!`;
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 2800);
        }
      };
    }
  }

  // ---------------------------------------------------------
  // Render danh sách sản phẩm
  // ---------------------------------------------------------
  function renderProducts() {
    gridContainer.innerHTML = "";
    const favorites = getFavorites();

    let filtered = drinkProducts.filter((product) => {
      // Lọc theo search
      if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // Lọc theo danh mục
      if (currentCategory === "all") {
        if (!currentSearchQuery) {
          return product.isBestSeller;
        }
        return true;
      }
      return product.category === currentCategory;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="drink-empty-state">
          <span>🍹</span>
          <p>Không tìm thấy đồ uống phù hợp. Bạn hãy thử chọn danh mục khác nhé!</p>
        </div>
      `;
      return;
    }

    filtered.forEach((product) => {
      const card = document.createElement("article");
      card.className = "drink-product-card product-card";
      card.dataset.productId = product.id;
      card.dataset.price = product.price;
      card.dataset.category = product.category;

      const isFav = favorites.includes(product.id);

      card.innerHTML = `
        <div class="drink-product-image product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          ${
            product.badge
              ? `<span class="badge-tag badge badge-${product.badgeType}">${product.badge}</span>`
              : ""
          }
        </div>
        <div class="drink-product-info product-info">
          <h2 class="drink-product-title">${product.name}</h2>
          <p class="drink-product-desc">${product.description}</p>
          <div class="drink-card-footer product-card-footer">
            <span class="drink-price price">${formatPrice(product.price)}</span>
            <div class="drink-actions product-actions">
              <button class="drink-fav-btn ${isFav ? "active" : ""}" 
                      type="button" 
                      title="Yêu thích" 
                      aria-label="Yêu thích ${product.name}">
                <img class="fav-outline" src="../assets/images/CaoQuynhAnh_252601009/heart-outline.svg" alt="" />
                <img class="fav-filled" src="../assets/images/CaoQuynhAnh_252601009/heart.svg" alt="" />
              </button>
              <button class="drink-order-btn add-btn" type="button" aria-label="Đặt hàng ${product.name}">
                <span>Đặt hàng</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Bắt sự kiện yêu thích (không kích hoạt mở popup)
      const favBtn = card.querySelector(".drink-fav-btn");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const added = toggleFavorite(product.id);
        favBtn.classList.toggle("active", added);
      });

      // Bắt sự kiện click đặt hàng hoặc thẻ
      card.addEventListener("click", () => {
        openDrinkPopup(product);
      });

      gridContainer.appendChild(card);
    });
  }

  // ---------------------------------------------------------
  // Xử lý chuyển tab bộ lọc danh mục
  // ---------------------------------------------------------
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");

      currentCategory = pill.dataset.category || "all";

      // Cập nhật tiêu đề phù hợp
      if (currentCategory === "all") {
        if (sectionTitle) sectionTitle.textContent = "Best Seller";
        if (sectionSubtitle)
          sectionSubtitle.textContent =
            "Những thức uống được yêu thích nhất tại Ăn Ngon!";
      } else {
        const catName = pill.querySelector("span:last-child").textContent;
        if (sectionTitle) sectionTitle.textContent = catName;
        if (sectionSubtitle)
          sectionSubtitle.textContent = `Các món ${catName.toLowerCase()} tươi mát thơm ngon hôm nay!`;
      }

      renderProducts();
    });
  });

  // ---------------------------------------------------------
  // Nút "Xem tất cả"
  // ---------------------------------------------------------
  if (btnViewAll) {
    btnViewAll.addEventListener("click", (e) => {
      e.preventDefault();
      filterPills.forEach((p) => p.classList.remove("active"));
      const allPill = document.querySelector('.subcat-pill[data-category="all"]');
      if (allPill) allPill.classList.add("active");

      currentCategory = "all";
      currentSearchQuery = "";
      if (searchInput) searchInput.value = "";
      if (sectionTitle) sectionTitle.textContent = "Tất cả đồ uống";
      if (sectionSubtitle)
        sectionSubtitle.textContent =
          "Khám phá trọn bộ sưu tập trà sữa, cà phê và nước ép tươi!";

      // Render toàn bộ các món
      gridContainer.innerHTML = "";
      const favorites = getFavorites();
      drinkProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "drink-product-card product-card";
        card.dataset.productId = product.id;
        card.dataset.price = product.price;
        card.dataset.category = product.category;

        const isFav = favorites.includes(product.id);
        card.innerHTML = `
          <div class="drink-product-image product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            ${
              product.badge
                ? `<span class="badge-tag badge badge-${product.badgeType}">${product.badge}</span>`
                : ""
            }
          </div>
          <div class="drink-product-info product-info">
            <h2 class="drink-product-title">${product.name}</h2>
            <p class="drink-product-desc">${product.description}</p>
            <div class="drink-card-footer product-card-footer">
              <span class="drink-price price">${formatPrice(product.price)}</span>
              <div class="drink-actions product-actions">
                <button class="drink-fav-btn ${isFav ? "active" : ""}" 
                        type="button" 
                        title="Yêu thích" 
                        aria-label="Yêu thích ${product.name}">
                  <img class="fav-outline" src="../assets/images/CaoQuynhAnh_252601009/heart-outline.svg" alt="" />
                  <img class="fav-filled" src="../assets/images/CaoQuynhAnh_252601009/heart.svg" alt="" />
                </button>
                <button class="drink-order-btn add-btn" type="button" aria-label="Đặt hàng ${product.name}">
                  <span>Đặt hàng</span>
                </button>
              </div>
            </div>
          </div>
        `;

        const favBtn = card.querySelector(".drink-fav-btn");
        favBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          const added = toggleFavorite(product.id);
          favBtn.classList.toggle("active", added);
        });

        card.addEventListener("click", () => {
          openDrinkPopup(product);
        });

        gridContainer.appendChild(card);
      });
    });
  }

  // ---------------------------------------------------------
  // Tìm kiếm trực tiếp trên Header
  // ---------------------------------------------------------
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.trim();
      if (currentSearchQuery) {
        if (sectionTitle)
          sectionTitle.textContent = `Kết quả: "${currentSearchQuery}"`;
        if (sectionSubtitle)
          sectionSubtitle.textContent =
            "Các thức uống phù hợp với từ khóa tìm kiếm";
      } else {
        if (sectionTitle) sectionTitle.textContent = "Best Seller";
        if (sectionSubtitle)
          sectionSubtitle.textContent =
            "Những thức uống được yêu thích nhất tại Ăn Ngon!";
      }
      renderProducts();
    });
  }

  // ---------------------------------------------------------
  // Điều hướng chuyển slide Banner
  // ---------------------------------------------------------
  const bannerImg = document.querySelector(".drink-banner-slide img");
  const bannerPrev = document.querySelector(".banner-ctr-btn.prev");
  const bannerNext = document.querySelector(".banner-ctr-btn.next");

  const bannerList = [
    {
      src: "../assets/images/DuongVanMinh/banner_douong_clean.png",
      alt: "Thức uống mới - Trà Sữa & Trà Trái Cây",
    },
    {
      src: "../assets/images/CaoQuynhAnh_252601009/banner2.jpg",
      alt: "Ưu đãi hấp dẫn mỗi ngày",
    },
    {
      src: "../assets/images/CaoQuynhAnh_252601009/banner3.jpg",
      alt: "Thực đơn món ngon mát lạnh",
    },
  ];

  let currentBannerIndex = 0;

  function switchBanner(idx) {
    if (!bannerImg) return;
    currentBannerIndex = (idx + bannerList.length) % bannerList.length;
    bannerImg.style.opacity = "0.4";
    setTimeout(() => {
      bannerImg.src = bannerList[currentBannerIndex].src;
      bannerImg.alt = bannerList[currentBannerIndex].alt;
      bannerImg.style.opacity = "1";
    }, 180);
  }

  if (bannerPrev) {
    bannerPrev.addEventListener("click", () => switchBanner(currentBannerIndex - 1));
  }
  if (bannerNext) {
    bannerNext.addEventListener("click", () => switchBanner(currentBannerIndex + 1));
  }

  // Khởi tạo hiển thị lần đầu
  renderProducts();
});

