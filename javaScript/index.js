document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 1. 手機版選單邏輯
    // =========================================
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    
    if (menuToggle && mobileMenu) {
        const links = mobileMenu.querySelectorAll("a");

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = menuToggle.classList.toggle("active");
            mobileMenu.classList.toggle("active");

            if (isActive) {
                // 如果是打開選單，依序計算延遲，做出「刷刷刷」依序浮現的效果
                links.forEach((link, index) => {
                    link.style.transitionDelay = `${0.15 + index * 0.08}s`;
                });
            } else {
                // 如果是關閉選單，立刻收回，不需要延遲
                links.forEach(link => {
                    link.style.transitionDelay = "0s";
                });
            }
        });

        links.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                mobileMenu.classList.remove("active");
                links.forEach(l => l.style.transitionDelay = "0s");
            });
        });
    }

    // =========================================
    // 2. 開機動畫與解鎖機制
    // =========================================
    const shouldSkipAnimation = sessionStorage.getItem("skipAnimation");
    const boot = document.getElementById("bootText");
    const nameEl = document.getElementById("name");
    const titleEl = document.getElementById("heroTitle");
    const btnEl = document.getElementById("exploreBtn");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // 安全解鎖防禦：若 3 秒內沒解鎖，強制解除 loading 狀態
    setTimeout(() => {
        document.body.classList.remove("system-loading");
    }, 3000);

    const unlockSystem = (text) => {
        document.body.classList.remove("system-loading");
        if (boot) boot.innerText = text;
    };

    if (shouldSkipAnimation === "true") {
        // 【快速通道】從分頁返回，直接跳過動畫
        if (history.scrollRestoration) history.scrollRestoration = 'auto'; 
        unlockSystem("SYSTEM_READY. ACCESS_GRANTED.");
        if (nameEl) nameEl.style.opacity = "1";
        if (titleEl) titleEl.style.opacity = "1";
        if (btnEl) btnEl.style.opacity = "1";
        sessionStorage.removeItem("skipAnimation"); 
    } else {
        // 【正常通道】播放開機文字矩陣與淡入動畫
        if (history.scrollRestoration) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

        if (boot) {
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

            setTimeout(() => {
                clearInterval(bootInterval);
                unlockSystem("SYSTEM_READY. ACCESS_GRANTED.");
            }, 2500);
        } else {
            unlockSystem("");
        }

        // 串接元素的淡入動畫
        if (nameEl) {
            nameEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2000, fill: "forwards" });
        }
        setTimeout(() => {
            if (titleEl) titleEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1500, fill: "forwards" });
        }, 1000);
        setTimeout(() => {
            if (btnEl) btnEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, fill: "forwards" });
        }, 1500);
    }
});