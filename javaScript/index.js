// === 【核心修改】檢查有沒有「從詳細經歷回來的跳過訊號」 ===
const shouldSkipAnimation = sessionStorage.getItem("skipAnimation");

const boot = document.getElementById("bootText");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

if (shouldSkipAnimation === "true") {
    // --------------------------------------------------
    // 【快速通道】使用者是從完整經歷頁回來的！
    // --------------------------------------------------
    
    // 【允許瀏覽器記憶滾動位置】不要強制 manual，讓瀏覽器自動滾回原本按鈕的位置
    if (history.scrollRestoration) {
        history.scrollRestoration = 'auto'; 
    }

    document.body.classList.remove("system-loading");
    boot.innerText = "SYSTEM_READY. ACCESS_GRANTED.";
    document.getElementById("name").style.opacity = "1";
    document.getElementById("heroTitle").style.opacity = "1";
    document.getElementById("exploreBtn").style.opacity = "1";

    // 進來後立刻把開關關掉
    sessionStorage.removeItem("skipAnimation"); 

} else {
    // --------------------------------------------------
    // 【正常通道】首次進入、按下 F5 重新整理，一律播放動畫！
    // --------------------------------------------------
    
    // 【關鍵修復】只有在要播放動畫時，才強制網頁回歸最頂端！
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const bootInterval = setInterval(() => {
        let txt = "INITIALIZING MEMORY...";
        if (Math.random() < 0.3) {
            let arr = txt.split("");
            let index = Math.floor(Math.random() * arr.length);
            arr[index] = chars[Math.floor(Math.random() * chars.length)];
            txt = arr.join("");
        }
        boot.innerText = txt;
    }, 80);

    // 名字淡入
    document.getElementById("name").animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 2000, fill: "forwards" }
    );

    // 副標題跟著淡入
    setTimeout(() => {
        document.getElementById("heroTitle").animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 1500, fill: "forwards" }
        );
    }, 1000);

    // 按鈕跟著淡入
    setTimeout(() => {
        document.getElementById("exploreBtn").animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 1000, fill: "forwards" }
        );
    }, 1500);

    // 解鎖網頁
    setTimeout(() => {
        clearInterval(bootInterval);
        document.body.classList.remove("system-loading");
        boot.innerText = "SYSTEM_READY. ACCESS_GRANTED.";
    }, 2500);
}