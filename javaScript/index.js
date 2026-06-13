// === 1. 雜訊打字機效果 (維持你原本的酷炫創意) ===
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

// === 2. 入場動畫序列 (Web Animations API) ===
setTimeout(() => {
    // 一開始確保鎖定 (保險起見也可以在 JS 開頭加，但直接寫在 CSS 最安全)
    document.body.classList.add("system-loading");

    // 名字淡入
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

    // === 【新增】當 Explore 按鈕完全淡入完成後，解鎖網頁操作權限 ===
    // 1500ms (開始淡入的時間) + 1000ms (淡入動畫本身的長度) = 2500ms 後解鎖
    setTimeout(() => {
        document.body.classList.remove("system-loading");
        // 可自由加入酷炫文字提示，例如把系統初始化文字改掉
        boot.innerText = "SYSTEM_READY. ACCESS_GRANTED.";
    }, 2500);

}, 1000);