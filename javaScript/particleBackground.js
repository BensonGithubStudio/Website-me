const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

const particles = [];

// === 【核心優化 1】根據螢幕寬度動態決定粒子數量 ===
const particleCount = window.innerWidth < 768 ? 45 : 120;

// === 【核心優化 2】視網膜螢幕高解析度處理 (Fix Blur) ===
function resizeCanvas() {
    // 獲取當前裝置的像素比 (桌機通常是 1，高階手機/Retina 螢幕通常是 2 或 3)
    const dpr = window.devicePixelRatio || 1;
    
    // 獲取瀏覽器視窗的實際 CSS 寬高
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. 將 Canvas 畫布的真實畫稿像素放大（乘以 dpr）
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // 2. 透過 CSS 樣式鎖定，將它強制縮小回原本的網頁大小
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // 3. 關鍵：將 Canvas 繪圖上下文的坐標系放大對應倍數，這樣後續畫圖時不需手動換算
    ctx.scale(dpr, dpr);
}

// 首次載入與視窗縮放時皆執行高解析度重設
resizeCanvas();
window.addEventListener('resize', () => {
    // 視窗縮放時，如果粒子超出邊界，將其拉回新畫布範圍內
    resizeCanvas();
    particles.forEach(p => {
        if (p.x > window.innerWidth) p.x = Math.random() * window.innerWidth;
        if (p.y > window.innerHeight) p.y = Math.random() * window.innerHeight;
    });
});

// 初始化粒子 (使用網頁 CSS 寬高來做基準算坐標)
for (let i = 0; i < particleCount; i++) {
    const vx = (Math.random() - 0.5) * 1.2;
    const vy = (Math.random() - 0.5) * 1.2;
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: vx,
        vy: vy,
        originVx: vx, 
        originVy: vy,
        scrollYOffset: Math.random() * 0.6 + 0.1 
    });
}

// 追蹤滾動狀態的變數
let lastScrollY = window.scrollY;
let targetBoostY = 0;
let currentBoostY = 0;

// 監聽滾動事件
window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    const boostFactor = window.innerWidth < 768 ? 0.9 : 1;
    targetBoostY = -deltaY * boostFactor;
});

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 緩動滑行矩陣
    currentBoostY += (targetBoostY - currentBoostY) * 0.08; 
    targetBoostY *= 0.85; 

    // 更新與繪製粒子 (這裏的邊界判定全部改用 window.innerWidth/Height，防止 DPR 混淆)
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy + (currentBoostY * p.scrollYOffset);

        // 邊界防禦與循環流動
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > window.innerWidth) { p.x = window.innerWidth; p.vx *= -1; }
        if (p.y < 0) { p.y = window.innerHeight; } 
        if (p.y > window.innerHeight) { p.y = 0; }

        const speedFactor = Math.abs(currentBoostY);
        const baseRadius = window.innerWidth < 768 ? 1.2 : 1.5;
        const radius = baseRadius + Math.min(speedFactor * 0.15, 1.5);

        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        // 由於前面使用了 ctx.scale(dpr, dpr)，這裡直接繪製原始大小，底層會自動高清化
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // 粒子連線計算
    const connectionDist = window.innerWidth < 768 ? 100 : 130;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
                const baseAlpha = 1 - dist / connectionDist;
                const scrollGlow = Math.min(Math.abs(currentBoostY) * 0.05, 0.2);
                
                ctx.strokeStyle = `rgba(0, 255, 255, ${Math.min(baseAlpha + scrollGlow, 0.7)})`;
                ctx.lineWidth = baseAlpha * 0.7;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();