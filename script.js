// ==========================================================================
// Loopforge — site behavior (theme toggle + contact form)
// ==========================================================================

(function () {
  "use strict";

  var STORAGE_KEY = "loopforge-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable (privacy mode, etc.) — fall back silently
    }
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
      return;
    }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // ignore if storage isn't available
    }
  }

  function initThemeToggle() {
    var btn = document.getElementById("lf-theme-toggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
    }
  }

  // --- contact form: live progress bar + reactive preview strip ---
  function initContactForm() {
    var nameInput = document.getElementById("lf-name");
    var emailInput = document.getElementById("lf-email");
    var bizInput = document.getElementById("lf-biz");
    var needSelect = document.getElementById("lf-need");
    if (!nameInput || !bizInput || !needSelect) return;

    var seg1 = document.getElementById("lf-seg-1");
    var seg2 = document.getElementById("lf-seg-2");
    var seg3 = document.getElementById("lf-seg-3");
    var seg4 = document.getElementById("lf-seg-4");
    var strip = document.getElementById("lf-preview-strip");
    var badge = document.getElementById("lf-preview-badge");
    var previewText = document.getElementById("lf-preview-text");

    function update() {
      var nameFilled = nameInput.value.trim().length > 0;
      var emailFilled = emailInput ? emailInput.value.trim().length > 0 : true;
      var bizFilled = bizInput.value.trim().length > 0;
      var needFilled = needSelect.value !== "";
      var allFilled = nameFilled && emailFilled && bizFilled && needFilled;

      if (seg1) seg1.classList.toggle("filled", nameFilled);
      if (seg2) seg2.classList.toggle("filled", emailFilled);
      if (seg3) seg3.classList.toggle("filled", bizFilled);
      if (seg4) seg4.classList.toggle("filled", needFilled);
      if (strip) strip.classList.toggle("filled", allFilled);
      if (badge) badge.classList.toggle("filled", allFilled);

      var text = "Fill in the details to see your project preview.";
      if (allFilled) {
        text = nameInput.value.trim() + " · " + bizInput.value.trim() + " · " + needSelect.value;
      } else if (nameFilled || bizFilled) {
        text = "Building a preview for " + (nameInput.value.trim() || bizInput.value.trim()) + "...";
      }
      if (previewText) previewText.textContent = text;
    }

    nameInput.addEventListener("input", update);
    if (emailInput) emailInput.addEventListener("input", update);
    bizInput.addEventListener("input", update);
    needSelect.addEventListener("change", update);
    update();

    // --- Formspree success screen transition & reset ---
    var formView = document.getElementById("lf-form-view");
    var successView = document.getElementById("lf-success-view");
    var resetBtn = document.getElementById("lf-reset-form-btn");
    var form = document.getElementById("lf-contact-form");

    function showSuccess() {
      if (formView) formView.style.display = "none";
      if (successView) successView.style.display = "flex";
    }

    function showForm() {
      if (formView) formView.style.display = "block";
      if (successView) successView.style.display = "none";
      if (form) form.reset();
      update();
    }

    if (successView && formView) {
      var observer = new MutationObserver(function () {
        var isVisible = successView.style.display !== "none" && !successView.hasAttribute("hidden");
        if (isVisible && formView.style.display !== "none") {
          showSuccess();
        }
      });
      observer.observe(successView, { attributes: true, attributeFilter: ["style", "class", "hidden"] });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", showForm);
    }
  }

  initTheme();
  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initContactForm();
  });
})();
