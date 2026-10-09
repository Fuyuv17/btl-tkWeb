// Dữ liệu sản phẩm: tách riêng khỏi phần truy cập và cập nhật DOM.
const bestSellerProducts = [
	{
		id: "fried-chicken",
		name: "Gà rán giòn vui vẻ",
		description: "Gà rán vàng giòn, thơm ngon cho bữa ăn thêm trọn vị.",
		price: 69000,
		image: "4_mieng_ga_ron.jpg",
		badge: "Bán chạy",
	},
	{
		id: "chicken-rice",
		name: "Cơm gà sốt",
		description: "Cơm nóng dùng kèm gà mềm và nước sốt đậm đà.",
		price: 59000,
		image: "comga_nuoc.jpg",
		badge: "Yêu thích",
	},
	{
		id: "spaghetti",
		name: "Mì Ý sốt bò bằm",
		description: "Mì Ý dai ngon cùng sốt cà chua bò bằm hấp dẫn.",
		price: 49000,
		image: "spagetti_01.png",
		badge: "Bán chạy",
	},
	{
		id: "chicken-burger",
		name: "Burger gà giòn",
		description: "Burger gà giòn ăn kèm khoai tây chiên và nước uống.",
		price: 79000,
		image: "burger_chip_coca01.jpg",
		badge: "Combo",
	},
	{
		id: "sauced-chicken",
		name: "Gà rán xốt cay",
		description: "Gà rán phủ xốt cay mặn ngọt, đậm vị khó quên.",
		price: 72000,
		image: "ga_ran_xot.png",
		badge: "Món ngon",
	},
	{
		id: "ice-cream",
		name: "Kem vani",
		description: "Kem vani mát lạnh, lựa chọn ngọt ngào sau bữa ăn.",
		price: 19000,
		image: "ice_creame_01.png",
		badge: "",
	},
];

// Truy cập DOM, dựng thẻ sản phẩm và xử lý nút đặt hàng.
document.addEventListener("DOMContentLoaded", () => {
	const productList = document.getElementById("best-seller-products");
	const orderMessage = document.getElementById("order-message");
	if (!productList) return;

	const imageDirectory = "src/assets/images/TruongQuyDuong_252631030/";
	const formatPrice = (price) => `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;

	bestSellerProducts.forEach((product) => {
		const card = document.createElement("article");
		card.className = "product-card";
		card.dataset.price = product.price;
		card.dataset.productId = product.id;

		const imageFrame = document.createElement("div");
		imageFrame.className = "product-image";

		const image = document.createElement("img");
		image.src = `${imageDirectory}${product.image}`;
		image.alt = product.name;
		image.loading = "lazy";
		imageFrame.append(image);

		if (product.badge) {
			const badge = document.createElement("span");
			badge.className = "badge";
			badge.textContent = product.badge;
			imageFrame.append(badge);
		}

		const info = document.createElement("div");
		info.className = "product-info";

		const title = document.createElement("h2");
		title.textContent = product.name;

		const description = document.createElement("p");
		description.textContent = product.description;

		const footer = document.createElement("div");
		footer.className = "product-card-footer";

		const price = document.createElement("span");
		price.className = "price";
		price.textContent = formatPrice(product.price);

		const actions = document.createElement("div");
		actions.className = "product-actions";

		const favoriteButton = document.createElement("button");
		favoriteButton.className = "favorite-btn";
		favoriteButton.type = "button";
		favoriteButton.setAttribute("aria-label", `Yêu thích ${product.name}`);
		favoriteButton.innerHTML = `
			<img class="favorite-outline" src="src/assets/images/CaoQuynhAnh_252601009/heart-outline.svg" alt="" />
			<img class="favorite-filled" src="src/assets/images/CaoQuynhAnh_252601009/heart.svg" alt="" />
		`;
		favoriteButton.addEventListener("click", (event) => event.stopPropagation());

		const orderButton = document.createElement("button");
		orderButton.className = "add-btn";
		orderButton.type = "button";
		orderButton.textContent = "Đặt hàng";
		orderButton.setAttribute("aria-label", `Đặt hàng ${product.name}`);

		actions.append(favoriteButton, orderButton);
		footer.append(price, actions);
		info.append(title, description, footer);
		card.append(imageFrame, info);
		productList.append(card);
	});

	
});
