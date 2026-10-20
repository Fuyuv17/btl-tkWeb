// ===============================
// LẤY CÁC PHẦN TỬ DOM
// ===============================

const slides = document.getElementById("slides");
const dots = document.getElementById("dots");
const carousel = document.getElementById("carousel");

let slidesList = Array.from(slides.children);


// ===============================
// NHÂN ĐÔI SLIDE ĐẦU VÀ CUỐI
// ===============================

const firstClone = slidesList[0].cloneNode(true);
const lastClone = slidesList[slidesList.length - 1].cloneNode(true);

slides.appendChild(firstClone);
slides.insertBefore(lastClone, slidesList[0]);

slidesList = Array.from(slides.children);

const total = slidesList.length;


// ===============================
// BIẾN ĐIỀU KHIỂN
// ===============================

let index = 1;
let timer;
let isAnimating = false;
let clickTransition = false;


// ===============================
// ĐƯA SLIDE VÀO GIỮA
// ===============================

function moveToSlide(i, animate = true) {
    const currentSlide = slidesList[i];
    if (!currentSlide) return;

    const carouselWidth = carousel.clientWidth;
    const slideLeft = currentSlide.offsetLeft;
    const slideWidth = currentSlide.offsetWidth;

    // Tâm của slide và carousel
    const slideCenter = slideLeft + slideWidth / 2;
    const carouselCenter = carouselWidth / 2;
    const translate = carouselCenter - slideCenter;

    // Nếu animate = false (dịch chuyển tức thời)
    if (!animate) {
        slides.style.transition = "none";
        // TẮT luôn hiệu ứng làm mờ/thu nhỏ của từng ảnh
        slidesList.forEach(slide => slide.style.transition = "none"); 
    } else {
        slides.style.transition = clickTransition
            ? "transform 0.2s ease-out"
            : "transform 0.5s ease";
        // BẬT lại hiệu ứng làm mờ/thu nhỏ cho ảnh
        slidesList.forEach(slide => slide.style.transition = "all 0.5s ease");
    }

    slides.style.transform = `translateX(${translate}px)`;
    index = i;

    updateDots();
    updateActiveSlide();

    // Ép trình duyệt vẽ lại ngay lập tức (thủ thuật Force Reflow chống nháy)
    if (!animate) {
        slides.offsetHeight; 
    }
}


// ===============================
// ACTIVE SLIDE
// ===============================

function updateActiveSlide() {
    slidesList.forEach((slide, i) => {
        slide.classList.toggle("active",i === index);
    });
}


// ===============================
// HIỂN THỊ SLIDE
// ===============================

function showSlide(i) {

    if (i >= total) {
        i = 1;
    }

    if (i < 0) {
        i = total - 2;
    }

    moveToSlide(i, true);
}


// ===============================
// NEXT
// ===============================

function next() {

    if (isAnimating) return;

    isAnimating = true;

    clickTransition = true;

    showSlide(index + 1);
}


// ===============================
// PREVIOUS
// ===============================

function prev() {

    if (isAnimating) return;

    isAnimating = true;

    clickTransition = true;

    showSlide(index - 1);
}


// ===============================
// AUTO PLAY
// ===============================

function startAuto() {

    clearInterval(timer);

    timer = setInterval(() => {

        if (isAnimating) return;

        clickTransition = false;

        isAnimating = true;

        showSlide(index + 1);

    }, 4000);
}


// ===============================
// TẠO DOT
// ===============================

function createDots() {

    const dotCount = total - 2;

    dots.innerHTML = "";

    for (let i = 0; i < dotCount; i++) {

        const dot = document.createElement("button");

        dot.addEventListener("click", () => {

            if (isAnimating) return;

            isAnimating = true;

            clickTransition = true;

            showSlide(i + 1);

            startAuto();

        });

        dots.appendChild(dot);
    }
}


// ===============================
// UPDATE DOT
// ===============================

function updateDots() {

    const realIndex =
        index === 0
            ? total - 3
            : index === total - 1
                ? 0
                : index - 1;


    [...dots.children].forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === realIndex
        );

    });
}


// ===============================
// NÚT NEXT / PREV
// ===============================

const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");


if (nextButton) {

    nextButton.onclick = () => {

        next();

        startAuto();

    };

}


if (prevButton) {

    prevButton.onclick = () => {

        prev();

        startAuto();

    };

}


// ===============================
// HOVER → DỪNG AUTO
// ===============================

carousel.addEventListener("mouseenter", () => {

    clearInterval(timer);

});


carousel.addEventListener("mouseleave", () => {

    startAuto();

});


// === Khi hiệu ứng kết thúc ===
slides.addEventListener('transitionend', () => {
    // Nếu đang ở clone cuối → quay về slide thật đầu
    if (index === total - 1) {
        moveToSlide(1, false); // Gọi hàm dịch chuyển im lặng thay vì chèn chuỗi -100%
    }
    // Nếu đang ở clone đầu → quay về slide thật cuối
    else if (index === 0) {
        moveToSlide(total - 2, false);
    }

    // 🔓 Mở khoá thao tác
    isAnimating = false;
    clickTransition = false;
});

// === Reset an toàn khi reload (fix stuck) ===
window.addEventListener('load', () => {
    createDots();

    // Khởi tạo index mặc định là 1 (slide thật đầu tiên)
    index = 1;
    
    // Gọi hàm đưa ảnh vào giữa ngay lập tức mà không có animation
    moveToSlide(index, false);

    // Khởi động auto sau khi DOM ổn định
    setTimeout(() => {
        startAuto();
    }, 150);
});

// === BỔ SUNG QUAN TRỌNG: Cập nhật lại vị trí khi phóng to/thu nhỏ trình duyệt ===
window.addEventListener('resize', () => {
    moveToSlide(index, false);
});