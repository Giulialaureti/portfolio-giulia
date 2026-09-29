(function () {
  "use strict";

  var GA_ID = "G-66H31E9R32";
  var STORAGE_KEY = "cookie-consent";

  function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function buildBanner() {
    var wrap = document.createElement("div");
    wrap.className = "cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Preferenze cookie");
    wrap.innerHTML =
      '<p>Uso solo cookie tecnici necessari e, se acconsenti, cookie analitici (Google Analytics) per capire come viene usato il sito. ' +
      '<a href="/privacy.html">Leggi di più</a>.</p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" class="btn btn-outline" data-cookie-reject>Rifiuta</button>' +
      '<button type="button" class="btn btn-primary" data-cookie-accept>Accetta</button>' +
      "</div>";
    document.body.appendChild(wrap);

    wrap.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      setConsent("accepted");
      loadAnalytics();
      wrap.remove();
    });
    wrap.querySelector("[data-cookie-reject]").addEventListener("click", function () {
      setConsent("rejected");
      wrap.remove();
    });
  }

  function init() {
    var consent = getConsent();
    if (consent === "accepted") {
      loadAnalytics();
    } else if (consent !== "rejected") {
      buildBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed so the "Preferenze cookie" footer link can reopen the banner.
  window.reopenCookiePreferences = function () {
    var existing = document.querySelector(".cookie-banner");
    if (existing) existing.remove();
    buildBanner();
  };
})();
