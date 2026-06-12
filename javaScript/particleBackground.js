const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

// 自動調整畫布大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 120;

// 初始化粒子，額外加上 originVx/Vy 用來記錄基礎速度，並加上 scrollYOffset 用於滾動視差
for (let i = 0; i < particleCount; i++) {
    const vx = (Math.random() - 0.5) * 1.2;
    const vy = (Math.random() - 0.5) * 1.2;
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: vx,
        vy: vy,
        originVx: vx, // 紀錄原本的速度，以便之後回彈
        originVy: vy,
        scrollYOffset: Math.random() * 0.6 + 0.1 // 每個粒子對滾動的敏感度不同（產生遠近視差感）
    });
}

// 追蹤滾動狀態的變數
let lastScrollY = window.scrollY;
let scrollSpeed = 0;
let targetBoostY = 0;
let currentBoostY = 0;

// 監聽滾動事件，計算滾動速度與方向
window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // 當滾動時，給予粒子 Y 軸的衝刺目標值（除以 8 調整靈敏度，負值代表向下捲動時粒子向上飄）
    targetBoostY = -deltaY * 1;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 緩動矩陣：讓滾動帶來的爆發速度（Boost）平滑地遞減，產生果凍般的延遲回彈感
    currentBoostY += (targetBoostY - currentBoostY) * 0.1; 
    targetBoostY *= 0.85; // 逐漸讓衝刺目標回歸 0

    // 更新與繪製粒子
    particles.forEach(p => {
        // 實際速度 = 基礎隨機速度 + 當前滾動造成的動態速度增幅（乘以各自的視差權重）
        p.x += p.vx;
        p.y += p.vy + (currentBoostY * p.scrollYOffset);

        // 碰撞邊界反彈（考慮到 Boost 很大時可能飛出去，進行邊界防禦）
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
        if (p.y < 0) { p.y = canvas.height; } // 從上方飛出去就從下方出現，維持連貫流動
        if (p.y > canvas.height) { p.y = 0; }

        // 滾動速度越快，粒子稍微變得大一點點，增強速度感
        const speedFactor = Math.abs(currentBoostY);
        const radius = 1.5 + Math.min(speedFactor * 0.2, 2);

        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // 粒子連線計算
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
                // 滾動時連線會隨速度稍微變亮，沒滾動時恢復正常
                const baseAlpha = 1 - dist / 130;
                const scrollGlow = Math.min(Math.abs(currentBoostY) * 0.05, 0.3);
                
                ctx.strokeStyle = `rgba(0, 255, 255, ${Math.min(baseAlpha + scrollGlow, 0.8)})`;
                ctx.lineWidth = baseAlpha * 0.8;
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