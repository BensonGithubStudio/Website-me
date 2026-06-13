// === 強制網頁載入與重新整理時一律回歸最頂端 ===
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// === 1. 雜訊打字機效果 (維持不變) ===
const boot = document.getElementById("bootText");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

setInterval(() => {
    let txt = "INITIALIZING MEMORY...";
    if (Math.random() < 0.3) {
        let arr = txt.split("");
        let index = Math.floor(Math.random() * arr.length);
        arr[index] = chars[Math.floor(Math.random() * chars.length)];
        txt = arr.join("");
    }
    boot.innerText = txt;
}, 80);

// === 2. 入場動畫序列 ===
// 網頁一打開（第 0 秒）就立刻執行入場動畫，不再用 setTimeout 憋 1~2 秒才開始
// 【移除最外層的 setTimeout】

// 名字淡入 (立刻開始)
document.getElementById("name").animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 2000, fill: "forwards" }
);

// 副標題跟著淡入 (延遲 1 秒)
setTimeout(() => {
    document.getElementById("heroTitle").animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 1500, fill: "forwards" }
    );
}, 1000);

// 按鈕跟著淡入 (再延遲 0.5 秒)
setTimeout(() => {
    document.getElementById("exploreBtn").animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 1000, fill: "forwards" }
    );
}, 1500);

// === 當 Explore 按鈕完全淡入完成後，解鎖網頁操作權限 ===
// 1500ms (開始淡入的時間) + 1000ms (動畫長度) = 2500ms 後完美開鎖
setTimeout(() => {
    document.body.classList.remove("system-loading");
    boot.innerText = "SYSTEM_READY. ACCESS_GRANTED.";
}, 2500);