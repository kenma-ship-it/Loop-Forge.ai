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
    var bizInput = document.getElementById("lf-biz");
    var needSelect = document.getElementById("lf-need");
    if (!nameInput || !bizInput || !needSelect) return;

    var seg1 = document.getElementById("lf-seg-1");
    var seg2 = document.getElementById("lf-seg-2");
    var seg3 = document.getElementById("lf-seg-3");
    var strip = document.getElementById("lf-preview-strip");
    var badge = document.getElementById("lf-preview-badge");
    var previewText = document.getElementById("lf-preview-text");

    function update() {
      var nameFilled = nameInput.value.trim().length > 0;
      var bizFilled = bizInput.value.trim().length > 0;
      var needFilled = needSelect.value !== "";
      var allFilled = nameFilled && bizFilled && needFilled;

      seg1.classList.toggle("filled", nameFilled);
      seg2.classList.toggle("filled", bizFilled);
      seg3.classList.toggle("filled", needFilled);
      strip.classList.toggle("filled", allFilled);
      badge.classList.toggle("filled", allFilled);

      var text = "Fill in the details to see your project preview.";
      if (allFilled) {
        text = nameInput.value.trim() + " · " + bizInput.value.trim() + " · " + needSelect.value;
      } else if (nameFilled || bizFilled) {
        text = "Building a preview for " + (nameInput.value.trim() || bizInput.value.trim()) + "...";
      }
      previewText.textContent = text;
    }

    nameInput.addEventListener("input", update);
    bizInput.addEventListener("input", update);
    needSelect.addEventListener("change", update);
    update();
  }

  initTheme();
  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initContactForm();
  });
})();
