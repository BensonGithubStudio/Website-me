document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    let links = [];

    if (mobileMenu) {
        links = mobileMenu.querySelectorAll("a");
    }

    // 🌟 1. 把控制手機選單開關的函式抽到外面，讓全站連結都能呼叫
    const closeMenu = () => {
        if (menuToggle && mobileMenu) {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
            links.forEach(l => l.style.transitionDelay = "0s");
        }
    };

    const openMenu = () => {
        if (menuToggle && mobileMenu) {
            menuToggle.classList.add("active");
            mobileMenu.classList.add("active");
            document.body.classList.add("menu-open");
            links.forEach((link, index) => {
                link.style.transitionDelay = `${0.3 + index * 0.12}s`; // 保持慢速流暢解碼感
            });
        }
    };

    // 手機版漢堡鈕與空白處點擊邏輯
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (menuToggle.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.addEventListener("click", (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }

    // =========================================
    // 2. 全站導覽與網址淨化（桌機、手機、首頁按鈕全支援）
    // =========================================
    const allCyberLinks = document.querySelectorAll("#mobileMenu a, #navLinks a, #exploreBtn");

    allCyberLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");

            if (targetId && targetId.startsWith("#")) {
                e.preventDefault(); // 阻止預設 HTML 錨點改網址
                
                closeMenu(); // 🌟 成功呼叫！點擊後手機選單現在會自己乖乖消失了

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    // 悄悄洗掉網址列最後面的 # 尾巴
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
            }
        });
    });

    // =========================================
    // 3. 【核心開機動畫與解鎖機制】
    // =========================================
    const shouldSkipAnimation = sessionStorage.getItem("skipAnimation");
    const boot = document.getElementById("bootText");
    const nameEl = document.getElementById("name");
    const titleEl = document.getElementById("heroTitle");
    const btnEl = document.getElementById("exploreBtn");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    setTimeout(() => {
        document.body.classList.remove("system-loading");
    }, 3000);

    const unlockSystem = (text) => {
        document.body.classList.remove("system-loading");
        if (boot) boot.innerText = text;
    };

    if (shouldSkipAnimation === "true") {
        if (history.scrollRestoration) history.scrollRestoration = 'auto'; 
        unlockSystem("SYSTEM_READY. ACCESS_GRANTED.");
        if (nameEl) nameEl.style.opacity = "1";
        if (titleEl) titleEl.style.opacity = "1";
        if (btnEl) btnEl.style.opacity = "1";
        sessionStorage.removeItem("skipAnimation"); 
    } else {
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