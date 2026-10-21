// === Lấy phần tử DOM chính ===
const slides = document.getElementById('slides');
const dots = document.getElementById('dots');
let slidesList = Array.from(slides.children);

// === Nhân đôi slide đầu và cuối để tạo hiệu ứng vòng lặp vô tận ===
const firstClone = slidesList[0].cloneNode(true);
const lastClone = slidesList[slidesList.length - 1].cloneNode(true);
slides.appendChild(firstClone);
slides.insertBefore(lastClone, slidesList[0]);

// === Cập nhật các biến điều khiển ===
slidesList = Array.from(slides.children);
const total = slidesList.length;
let index = 1; // bắt đầu ở slide thật đầu tiên
let timer;
let isAnimating = false;
let clickTransition = false; // auto = false → 0.5s, click = true → 0.2s

// === Hàm hiển thị slide ===
function showSlide(i) {
    // ✅ Giới hạn index (chặn tăng vô hạn)
    if (i >= total) i = 1;
    if (i < 0) i = total - 2;

    slides.style.transition = clickTransition
        ? 'transform 0.2s ease-out'  // nhanh khi click/ vuốt
        : 'transform 0.5s ease';     // mượt khi auto

    slides.style.transform = `translateX(-${i * 100}%)`;
    index = i;
    updateDots();
}

// === Chuyển slide kế tiếp / trước ===
function next() {
    if (isAnimating) return;
    isAnimating = true;
    clickTransition = true;
    showSlide(index + 1);
}

function prev() {
    if (isAnimating) return;
    isAnimating = true;
    clickTransition = true;
    showSlide(index - 1);
}

// === Tự động chuyển slide ===
function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
        clickTransition = false; // auto chạy chậm hơn
        showSlide(index + 1);
    }, 4000);
}

// === Tạo chấm tròn (dots) ===
function createDots() {
    const dotCount = total - 2; // bỏ 2 clone
    dots.innerHTML = '';
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.addEventListener('click', () => {
            clickTransition = true;
            showSlide(i + 1);
            startAuto();
        });
        dots.appendChild(dot);
    }
}

// === Cập nhật dot đang active ===
function updateDots() {
    const realIndex =
        index === 0 ? total - 3 :
            index === total - 1 ? 0 :
                index - 1;

    [...dots.children].forEach((d, i) =>
        d.classList.toggle('active', i === realIndex)
    );
}

// === Nút điều hướng ===
document.getElementById('next').onclick = () => { next(); startAuto(); };
document.getElementById('prev').onclick = () => { prev(); startAuto(); };

// === Dừng auto khi hover ===
const carousel = document.getElementById('carousel');
carousel.addEventListener('mouseenter', () => clearInterval(timer));
carousel.addEventListener('mouseleave', startAuto);

// === Khi hiệu ứng kết thúc ===
slides.addEventListener('transitionend', () => {
    // Nếu đang ở clone cuối → quay về slide thật đầu
    if (index === total - 1) {
        slides.style.transition = 'none';
        index = 1;
        slides.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
        setTimeout(() => slides.style.transition = 'transform 0.5s ease', 0);
    }
    // Nếu đang ở clone đầu → quay về slide thật cuối
    else if (index === 0) {
        slides.style.transition = 'none';
        index = total - 2;
        slides.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
        setTimeout(() => slides.style.transition = 'transform 0.5s ease', 0);
    }

    // 🔓 Mở khoá thao tác
    isAnimating = false;
    clickTransition = false;
});

// === Vuốt cảm ứng (mobile) ===
let startX = 0;
let isSwiping = false;

carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    clearInterval(timer);
});

carousel.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX;
    slides.style.transition = 'none';
    slides.style.transform = `translateX(${diff - index * 100}%)`;
});

carousel.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const diff = e.changedTouches[0].clientX - startX;

    clickTransition = true;
    slides.style.transition = 'transform 0.2s ease-out';

    if (diff > 50) prev();
    else if (diff < -50) next();
    else showSlide(index);

    isSwiping = false;
    startAuto();
});

// === Reset an toàn khi reload (fix stuck -500%, -600%) ===
window.addEventListener('load', () => {
    createDots();

    // Xóa transition để tránh nháy
    slides.style.transition = 'none';

    // Kiểm tra nếu đang ở clone cuối hoặc vượt quá giới hạn
    const currentTransform = slides.style.transform;
    if (currentTransform.includes('-500%') || currentTransform.includes('-600%') || index >= total - 1) {
        index = 1;
        slides.style.transform = `translateX(-${index * 100}%)`;
    } else if (index === 0) {
        index = total - 2;
        slides.style.transform = `translateX(-${index * 100}%)`;
    } else {
        index = 1;
        slides.style.transform = `translateX(-${index * 100}%)`;
    }

    // Khởi động auto sau khi DOM ổn định
    setTimeout(() => {
        slides.style.transition = 'transform 0.5s ease';
        showSlide(index);
        startAuto();
    }, 150);
});
