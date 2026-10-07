(function () {
  "use strict";

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  var year = document.getElementById("current-year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Language switcher: link to the same page under /en/ (or back out of it),
  // computed from the current path so every page can share one script
  // instead of hand-writing the counterpart URL on each of them.
  var langToggles = document.querySelectorAll("[data-lang-switch]");
  if (langToggles.length) {
    var path = window.location.pathname;
    var isEn = path === "/en" || path.indexOf("/en/") === 0;
    var target;
    if (path === "/" || path === "/index.html") {
      target = path === "/" ? "/en/" : "/en/index.html";
    } else if (path === "/en" || path === "/en/" || path === "/en/index.html") {
      target = path === "/en/index.html" ? "/index.html" : "/";
    } else if (isEn) {
      target = path.slice(3) || "/";
    } else {
      target = "/en" + path;
    }
    langToggles.forEach(function (link) {
      link.href = target;
      link.textContent = isEn ? "IT" : "EN";
      link.setAttribute("lang", isEn ? "it" : "en");
      link.setAttribute("aria-label", isEn ? "Passa alla versione italiana" : "Switch to the English version");
    });
  }

  // Theme toggle: explicit choice wins over the system preference and
  // persists in localStorage; the <head> inline script applies it on load
  // to avoid a flash of the wrong theme.
  var root = document.documentElement;
  var themeToggles = document.querySelectorAll(".theme-toggle");
  var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  var isDarkNow = function () {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "dark") return true;
    if (explicit === "light") return false;
    return systemPrefersDark.matches;
  };

  var syncToggles = function () {
    var dark = isDarkNow();
    themeToggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Attiva modalità chiara" : "Attiva modalità scura");
    });
  };
  syncToggles();

  themeToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = isDarkNow() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggles();
    });
  });

  systemPrefersDark.addEventListener("change", function () {
    if (!root.getAttribute("data-theme")) syncToggles();
  });

  // Ambient background: the main glow follows the cursor directly (smoothed
  // by the CSS transition on --cx/--cy), a second one keeps drifting on its
  // own for a little extra depth. Skipped entirely under reduced motion.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var pending = false;
    var lastX = 0.78;
    var lastY = 0.22;

    var applyGlowPosition = function () {
      root.style.setProperty("--cx", (lastX * 100).toFixed(2) + "%");
      root.style.setProperty("--cy", (lastY * 100).toFixed(2) + "%");
      pending = false;
    };

    window.addEventListener("pointermove", function (event) {
      lastX = event.clientX / window.innerWidth;
      lastY = event.clientY / window.innerHeight;
      if (!pending) {
        pending = true;
        requestAnimationFrame(applyGlowPosition);
      }
    }, { passive: true });
  }

  // Analytics: count clicks on any CV link. window.gtag only exists once the
  // visitor has accepted cookies (see cookie-consent.js), so nothing is sent
  // otherwise. Uses a custom event name: GA's own "file_download" is already
  // recorded automatically by Enhanced measurement and would double count.
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href*='Giulia-Laureti-CV']");
    if (!link || typeof window.gtag !== "function") return;
    var place = link.closest("footer") ? "footer" : link.closest("nav") ? "menu" : "page";
    window.gtag("event", "cv_download", {
      file_name: link.getAttribute("href").split("/").pop(),
      language: link.getAttribute("href").indexOf("-EN.pdf") !== -1 ? "en" : "it",
      link_location: place,
    });
  });
})();
