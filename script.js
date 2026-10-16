// ==========================================================================
// Loopforge — site behavior: theme toggle, hero call, plan tabs, contact form
// (Initial theme is set inline in <head> to avoid a flash.)
// ==========================================================================

(function () {
  "use strict";

  var STORAGE_KEY = "loopforge-theme";
  var $ = function (id) { return document.getElementById(id); };

  function initThemeToggle() {
    var btn = $("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  // --- hero: play the call transcript once, line by line ---
  function initCall() {
    var log = $("call-log");
    var timer = $("call-timer");
    if (!log || !document.documentElement.classList.contains("js-anim")) return;

    var lines = Array.prototype.slice.call(log.children);
    var typing = document.createElement("li");
    typing.className = "typing is-in";
    typing.setAttribute("aria-hidden", "true");
    typing.innerHTML = "<i></i><i></i><i></i>";

    var secs = 0;
    var tick;
    var i = 0;
    function next() {
      if (i >= lines.length) { clearInterval(tick); return; }
      var line = lines[i++];
      // a beat of "typing" before agent lines, so it reads like a live call
      var pause = line.classList.contains("agent") ? 900 : 500;
      if (line.classList.contains("agent")) log.insertBefore(typing, line);
      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        line.classList.add("is-in");
        setTimeout(next, 500 + line.textContent.length * 12);
      }, pause);
    }
    function start() {
      tick = setInterval(function () {
        secs++;
        timer.textContent = "00:" + (secs < 10 ? "0" : "") + secs;
      }, 1000);
      setTimeout(next, 600);
    }

    // start when the call scrolls into view (below the fold on phones)
    if (!("IntersectionObserver" in window)) return start();
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); start(); }
    }, { threshold: 0.3 });
    io.observe(log);
  }

  // --- pricing tabs (ARIA tabs pattern) ---
  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        $(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(idx + d + tabs.length) % tabs.length], true); }
      });
    });

    // service "plans" links open the matching tab
    document.querySelectorAll("[data-plan]").forEach(function (a) {
      a.addEventListener("click", function () { select($("tab-" + a.getAttribute("data-plan"))); });
    });
  }

  // --- contact form: progress bar, summary strip, Formspree success view ---
  function initContactForm() {
    var form = $("contact-form");
    if (!form) return;
    var fields = [$("f-name"), $("f-email"), $("f-biz"), $("f-need")];
    var strip = $("summary-strip");
    var badge = $("summary-badge");
    var text = $("summary-text");

    function update() {
      var vals = fields.map(function (f) { return f.value.trim(); });
      vals.forEach(function (v, i) { $("seg-" + (i + 1)).classList.toggle("filled", !!v); });
      var all = vals.every(Boolean);
      strip.classList.toggle("filled", all);
      badge.classList.toggle("filled", all);
      text.textContent = all
        ? vals[3] + " for " + vals[2] + ", reply to " + vals[1]
        : "Your request summary appears here.";
    }
    fields.forEach(function (f) { f.addEventListener("input", update); f.addEventListener("change", update); });
    update();

    // "Get a quote" buttons preselect the service
    document.querySelectorAll("[data-need]").forEach(function (a) {
      a.addEventListener("click", function () { fields[3].value = a.getAttribute("data-need"); update(); });
    });

    var formView = $("form-view");
    var successView = $("success-view");
    // Formspree reveals [data-fs-success]; swap the whole card when it does.
    new MutationObserver(function () {
      if (successView.style.display !== "none" && !successView.hasAttribute("hidden") && formView.style.display !== "none") {
        formView.style.display = "none";
        successView.style.display = "flex";
        var h = successView.querySelector("h3");
        h.tabIndex = -1;
        h.focus(); // announce the result to keyboard and screen-reader users
      }
    }).observe(successView, { attributes: true });

    $("reset-form").addEventListener("click", function () {
      successView.style.display = "none";
      formView.style.display = "block";
      form.reset();
      update();
    });
  }


  // --- floating WhatsApp button: one tap opens a service menu, second tap opens WhatsApp ---
  // Without JS the button is a plain WhatsApp link.
  function initWhatsAppMenu() {
    var btn = $("wa-float");
    var sheet = $("wa-sheet");
    if (!btn || !sheet) return;

    function setOpen(open) {
      sheet.hidden = !open;
      btn.setAttribute("aria-expanded", open);
      if (open) sheet.querySelector(".wa-options a").focus();
    }
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      setOpen(sheet.hidden);
    });
    $("wa-close").addEventListener("click", function () { setOpen(false); btn.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!sheet.hidden && !sheet.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    sheet.querySelectorAll(".wa-options a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initCall();
    initTabs();
    initContactForm();
    initWhatsAppMenu();
  });
})();
