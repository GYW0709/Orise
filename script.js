window.addEventListener("load", () => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // 1. 初始化 Lenis 平滑滚动
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. 注册 GSAP 插件
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        // --- 鼠标交互 (光标 & 聚光灯) ---
        const cursorEl = document.getElementById("customCursor");
        const spotlight = document.getElementById("spotlight");
        
        if (!isTouch && cursorEl && spotlight) {
            cursorEl.style.display = "block";
            window.addEventListener("mousemove", (e) => {
                // 聚光灯位置计算
                const xPct = (e.clientX / window.innerWidth) * 100;
                const yPct = (e.clientY / window.innerHeight) * 100;
                
                gsap.to(spotlight, {
                    "--spot-x": `${xPct}%`,
                    "--spot-y": `${yPct}%`,
                    duration: 0.6,
                    ease: "power2.out"
                });
                
                // 光标跟随
                gsap.to(cursorEl, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1
                });
            });
        }

        // --- Hero 标题逐字拆分与入场 ---
        const titleEl = document.getElementById("heroTitle");
        if (titleEl) {
            const text = titleEl.innerText;
            titleEl.innerHTML = "";
            text.split("").forEach(c => {
                const span = document.createElement("span");
                span.className = "char";
                span.innerText = c === " " ? "\u00A0" : c;
                titleEl.appendChild(span);
            });

            gsap.from(".char", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.03,
                ease: "expo.out",
                delay: 0.3
            });
        }

        // --- 自动打字效果 ---
        const typingEl = document.getElementById("typingText");
        if (typingEl) {
            const word = "INTERACTIVE DESIGN & DEV";
            let i = 0;
            function typeEffect() {
                if (i < word.length) {
                    typingEl.textContent += word.charAt(i);
                    i++;
                    setTimeout(typeEffect, 80);
                }
            }
            setTimeout(typeEffect, 1800);
        }

        // --- 磁性按钮效果 ---
        const magneticBtn = document.getElementById("exploreBtn");
        const mArea = document.getElementById("magneticArea");
        
        if (magneticBtn && mArea && !isTouch) {
            mArea.addEventListener("mousemove", (e) => {
                const rect = mArea.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(magneticBtn, { 
                    x: x * 0.4, 
                    y: y * 0.4, 
                    duration: 0.3 
                });
            });
            
            mArea.addEventListener("mouseleave", () => {
                gsap.to(magneticBtn, { 
                    x: 0, 
                    y: 0, 
                    duration: 0.5, 
                    ease: "elastic.out(1, 0.3)" 
                });
            });
        }

        // --- 3D 倾斜卡片 (Tilt) ---
        if (!isTouch) {
            document.querySelectorAll("[data-tilt]").forEach(card => {
                card.addEventListener("mousemove", (e) => {
                    const { left, top, width, height } = card.getBoundingClientRect();
                    const x = (e.clientX - left) / width - 0.5;
                    const y = (e.clientY - top) / height - 0.5;
                    gsap.to(card, {
                        rotationY: x * 15,
                        rotationX: -y * 15,
                        transformPerspective: 1000,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener("mouseleave", () => {
                    gsap.to(card, { 
                        rotationY: 0, 
                        rotationX: 0, 
                        duration: 0.6,
                        ease: "power2.out"
                    });
                });
            });
        }

        // --- 滚动入场动画 ---
        const revealElements = document.querySelectorAll(".reveal-on-scroll");
        if (revealElements.length > 0) {
            revealElements.forEach(box => {
                gsap.from(box, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: box,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            });
        }

    });

    // 按钮点击滚动
    const exploreBtn = document.getElementById("exploreBtn");
    const sectionHeading = document.querySelector(".section-heading");
    
    if (exploreBtn && sectionHeading) {
        exploreBtn.addEventListener("click", () => {
            lenis.scrollTo(sectionHeading, { offset: -50 });
        });
    }
    
    // 优化视频加载
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('loadeddata', () => {
            video.style.opacity = '0.7';
        });
    });
});
