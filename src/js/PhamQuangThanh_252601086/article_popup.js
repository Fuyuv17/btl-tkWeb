document.addEventListener("DOMContentLoaded", () => {
  // Lấy danh sách tin và các vùng sẽ hiển thị nội dung popup.
  const newsList = document.getElementById("news-list");
  const backdrop = document.querySelector(".article-backdrop");
  const drawer = document.getElementById("article-drawer");
  const closeButton = drawer && drawer.querySelector(".article-drawer-close");
  const category = document.getElementById("article-category");
  const meta = document.getElementById("article-meta");
  const title = document.getElementById("article-title");
  const image = document.getElementById("article-image");
  const excerpt = document.getElementById("article-excerpt");

  // Không khởi tạo nếu trang thiếu thành phần cần thiết cho popup.
  if (!newsList || !backdrop || !drawer || !closeButton || !category || !meta || !title || !image || !excerpt) {
    return;
  }

  // Lưu phần tử đang được focus để trả focus lại sau khi đóng popup.
  let previouslyFocusedElement = null;

  function openArticle(card) {
    // Đọc thông tin bài viết trực tiếp từ thẻ tin được chọn.
    const titleElement = card.querySelector("h3");
    const imageElement = card.querySelector(".news-image img");
    const tagElement = card.querySelector(".news-tag");
    const metaElement = card.querySelector(".news-meta");
    const articleText = card.dataset.article;

    if (!titleElement || !imageElement || !tagElement || !metaElement || !articleText) {
      return;
    }

    const titleText = titleElement.textContent.trim();
    const tagText = tagElement.textContent.trim();
    const metaText = metaElement.textContent.trim();
    const trimmedArticleText = articleText.trim();

    if (!titleText || !trimmedArticleText) {
      return;
    }

    previouslyFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    category.textContent = tagText || "";
    meta.textContent = metaText || "";
    title.textContent = titleText;
    image.src = imageElement.currentSrc || imageElement.src;
    image.alt = imageElement.alt;
    image.classList.add("is-visible");
    excerpt.textContent = trimmedArticleText;

    backdrop.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Khóa cuộn trang nền khi popup mở.
    closeButton.focus();
  }

  function closeArticle() {
    if (!drawer.classList.contains("is-open")) {
      return;
    }

    backdrop.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Khôi phục cuộn trang nền.

    if (previouslyFocusedElement && previouslyFocusedElement.isConnected) {
      previouslyFocusedElement.focus();
    }
  }

  // Dùng event delegation để xử lý click trên mọi thành phần của các thẻ tin.
  newsList.addEventListener("click", (event) => {
    const card = event.target instanceof Element
      ? event.target.closest(".news-card")
      : null;

    if (!card) {
      return;
    }

    event.preventDefault();
    openArticle(card);
  });

  closeButton.addEventListener("click", closeArticle);
  backdrop.addEventListener("click", closeArticle);

  // Cho phép đóng popup bằng phím Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeArticle();
    }
  });
});
