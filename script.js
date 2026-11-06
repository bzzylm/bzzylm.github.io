/* ==========================================================================
   陈云齐 · 简历页交互
   - 年份
   - 深色 / 浅色主题切换（记忆选择）
   - 打印 / 导出 PDF
   - 渐入动画（若页面存在 data-reveal 元素）
   ========================================================================== */

(function () {
  "use strict";

  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  /* ---------- 年份 ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 主题切换 ---------- */
  const themeBtn = document.getElementById("themeToggle");
  const isZh = (root.lang || "").toLowerCase().indexOf("zh") === 0;

  const syncThemeUI = () => {
    const isDark = root.dataset.theme !== "light";
    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? "#071322" : "#f7f7f7");
    }
    if (!themeBtn) return;
    themeBtn.setAttribute("aria-pressed", String(isDark));
    themeBtn.setAttribute(
      "aria-label",
      isZh
        ? isDark
          ? "切换到浅色主题"
          : "切换到深色主题"
        : isDark
        ? "Switch to light theme"
        : "Switch to dark theme"
    );
    themeBtn.setAttribute("title", isZh ? (isDark ? "浅色（学术风）" : "深色") : isDark ? "Light" : "Dark");
  };

  if (themeBtn) {
    syncThemeUI();
    themeBtn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      try {
        localStorage.setItem("yunqi-theme", next);
      } catch (error) {
        /* 隐私模式下忽略 */
      }
      syncThemeUI();
    });
  }

  /* ---------- 打印 / 导出 PDF ---------- */
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  /* ---------- 顶部导航：滚动态 ---------- */
  const nav = document.getElementById("siteNav");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 顶部导航：当前区块高亮 ---------- */
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- 渐入 ---------- */
  const items = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length) return;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    items.forEach((item) => observer.observe(item));
  } else {
    items.forEach((item) => item.classList.add("in"));
  }
})();
