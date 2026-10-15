// Tải dữ liệu và dựng giao diện Best Seller khi trang đã sẵn sàng.
const productsScriptUrl = document.currentScript?.src || window.location.href;
document.addEventListener("DOMContentLoaded", loadBestSellerProducts);

async function loadBestSellerProducts() {
	const productList = document.getElementById("best-seller-products");
	if (!productList) return;

	const dataUrl = new URL("../../data/data.json", productsScriptUrl);
	const imageDirectory = new URL("../../assets/images/TruongQuyDuong_252631030/", productsScriptUrl);
	const iconDirectory = new URL("../../assets/images/CaoQuynhAnh_252601009/", productsScriptUrl);
	const formatPrice = (price) => `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;

	productList.setAttribute("aria-busy", "true");
	productList.textContent = "Đang tải sản phẩm...";

	try {
		const response = await fetch(dataUrl);
		if (!response.ok) {
			throw new Error(`Không thể tải dữ liệu sản phẩm (${response.status}).`);
		}

		const data = await response.json();
		if (!Array.isArray(data.bestSellerProducts)) {
			throw new Error("Danh sách bestSellerProducts không hợp lệ.");
		}

		const cards = data.bestSellerProducts.map((product) => {
			const card = document.createElement("article");
			card.className = "product-card";
			card.dataset.price = product.price;
			card.dataset.productId = product.id;

			const imageFrame = document.createElement("div");
			imageFrame.className = "product-image";

			const image = document.createElement("img");
			image.src = new URL(product.image, imageDirectory).href;
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
				<img class="favorite-outline" src="${new URL("heart-outline.svg", iconDirectory).href}" alt="" />
				<img class="favorite-filled" src="${new URL("heart.svg", iconDirectory).href}" alt="" />
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
			return card;
		});

		productList.replaceChildren(...cards);
	} catch (error) {
		console.error("Lỗi tải sản phẩm:", error);
		productList.textContent = "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.";
	} finally {
		productList.setAttribute("aria-busy", "false");
	}
}
