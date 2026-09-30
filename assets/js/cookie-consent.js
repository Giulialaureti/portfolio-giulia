(function () {
  "use strict";

  var GA_ID = "G-66H31E9R32";
  var STORAGE_KEY = "cookie-consent";
  var isEn = location.pathname === "/en" || location.pathname.indexOf("/en/") === 0;
  var privacyHref = isEn ? "/en/privacy.html" : "/privacy.html";
  var copy = isEn
    ? {
        text: 'I only use necessary technical cookies and, if you consent, analytics cookies (Google Analytics) to understand how the site is used. <a href="' + privacyHref + '">Learn more</a>.',
        reject: "Reject",
        accept: "Accept",
        ariaLabel: "Cookie preferences",
      }
    : {
        text: 'Uso solo cookie tecnici necessari e, se acconsenti, cookie analitici (Google Analytics) per capire come viene usato il sito. <a href="' + privacyHref + '">Leggi di più</a>.',
        reject: "Rifiuta",
        accept: "Accetta",
        ariaLabel: "Preferenze cookie",
      };

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
    wrap.setAttribute("aria-label", copy.ariaLabel);
    wrap.innerHTML =
      "<p>" + copy.text + "</p>" +
      '<div class="cookie-banner-actions">' +
      '<button type="button" class="btn btn-outline" data-cookie-reject>' + copy.reject + "</button>" +
      '<button type="button" class="btn btn-primary" data-cookie-accept>' + copy.accept + "</button>" +
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
