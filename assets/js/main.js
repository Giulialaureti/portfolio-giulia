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
})();
