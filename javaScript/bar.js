document.addEventListener("DOMContentLoaded", () => {
    // 抓取所有的進度條填滿元件
    const progressBars = document.querySelectorAll(".skill-bar-fill");

    // 建立一個視窗交叉觀測器
    const observerOptions = {
        root: null,       // 使用瀏覽器視窗作為基準區
        rootMargin: "-50px 0px -100px 0px", // 額外邊界外推
        threshold: 0.75   // 當進度條有 15% 進入螢幕可視範圍時，立刻觸發動畫
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 如果該元件成功進入螢幕視窗
            if (entry.isIntersecting) {
                const bar = entry.target;
                // 從 HTML 的 data-progress 屬性中抓出目標 % 數
                const targetWidth = bar.getAttribute("data-progress");
                
                // 修正 style.width，這會立刻觸發 CSS 的 transition 動畫
                bar.style.width = targetWidth;

                // 【效能優化】既然這個進度條已經跑完動畫了，就解除對它的監聽，省電省記憶體
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    // 開始對網頁上的每一個進度條進行監控
    progressBars.forEach(bar => progressObserver.observe(bar));
});