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

}, 2000); // 縮短一點點初始等待時間，讓使用者體驗更流暢