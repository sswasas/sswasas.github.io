(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- fill content from config.js ---------- */
  $("#about").textContent = S.about;
  $("#tags").innerHTML = S.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
  $("#comm-note").textContent = S.commissionsNote;
  $("#comm-fine").textContent = S.commissionsFine;
  $("#year").textContent = "\u00A9 " + new Date().getFullYear();

  $("#tiers").innerHTML = S.tiers.map(function (t) {
    return '<article class="col' + (t.featured ? " featured" : "") + '">' +
      (t.featured ? '<span class="badge">Popular</span>' : "") +
      "<h3>" + esc(t.name) + '</h3><div class="price">' + esc(t.price) + "</div><p>" + esc(t.desc) + "</p><ul>" +
      t.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></article>";
  }).join("");

  var friends = S.friends.slice().sort(function (a, b) { return (b.watchers || 0) - (a.watchers || 0); });
  $("#friend-grid").innerHTML = friends.map(function (f, i) {
    return '<article class="col"><span class="rank mono">#' + (i + 1) + '</span><h3>' + esc(f.name) + '</h3><div class="handle">@' + esc(f.handle) + "</div>" +
      '<div class="meta mono"><span class="w"><b>' + esc(f.watchersLabel || String(f.watchers || 0)) + '</b> watchers</span><span class="chip18">18+</span></div><p>' + esc(f.blurb) +
      '</p><a class="visit" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Visit profile \u2197</a></article>';
  }).join("") + '<article class="col ghost"><h3>Your account here?</h3><p>Want to be listed? Message me on Discord.</p><button class="visit" type="button" data-discord>Copy Discord</button></article>';

  /* ---------- toast + PayPal ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }
  /* ---------- Discord copy ---------- */
  $$("[data-discord-name]").forEach(function (el) { el.textContent = S.discord; });
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea"); ta.value = t; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); } ta.remove();
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-discord]"); if (!b) return;
    copyText(S.discord).then(function () { toast("Copied Discord: " + S.discord); },
                             function () { toast("Discord: " + S.discord); });
  });
  if (S.deviantart) $("#da-btn").href = S.deviantart;

  /* ---------- 18+ age gate ---------- */
  var root = document.documentElement, gate = $("#gate");
  function closeGate() { root.classList.remove("gate-on"); }
  $("#gate-yes").addEventListener("click", function () {
    try { localStorage.setItem("age18", "yes"); } catch (e) {}
    closeGate();
  });
  $("#gate-no").addEventListener("click", function () { location.href = "https://www.google.com/"; });

  var pp = S.paypal, ppSet = pp && pp !== "PAYPAL_LINK_HERE";
  $("#donate").innerHTML = ppSet
    ? '<a class="btn paypal mono" href="' + esc(pp) + '" target="_blank" rel="noopener noreferrer">Support via PayPal</a><p class="fine">Opens PayPal in a new tab.</p>'
    : '<button class="btn paypal mono" type="button" id="pp-soon">Support via PayPal</button><p class="fine">PayPal link coming soon</p>';
  if (!ppSet) $("#pp-soon").addEventListener("click", function () { toast("PayPal link coming soon"); });

  /* ---------- tabs (commissions / friends / support) ---------- */
  var tabNames = ["commissions", "friends", "support"];
  var tabrow = $("#tabrow"), ink = $("#ink"), currentTab = null;
  function moveInk(name) {
    var b = $('[data-tab="' + name + '"]', tabrow); if (!b) return;
    ink.style.width = b.offsetWidth + "px";
    ink.style.transform = "translateX(" + b.offsetLeft + "px)";
    $$("[data-tab]", tabrow).forEach(function (x) {
      x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b ? "true" : "false");
    });
  }
  function wipe() {
    if (reduce) return;
    var w = $("#wipe"); w.classList.remove("go"); void w.offsetWidth; w.classList.add("go");
  }
  function openTab(name, animate) {
    if (tabNames.indexOf(name) < 0) name = "commissions";
    if (name === currentTab) return;
    var next = document.getElementById(name), prev = currentTab ? document.getElementById(currentTab) : null;
    currentTab = name; moveInk(name);
    function enter() { next.classList.add("show"); void next.offsetWidth; next.classList.add("enter"); }
    if (prev && animate) {
      wipe(); prev.classList.remove("enter"); prev.classList.add("leave");
      setTimeout(function () { prev.classList.remove("show", "leave"); enter(); }, 230);
    } else { if (prev) prev.classList.remove("show", "enter"); enter(); }
  }
  $$("[data-tab]", tabrow).forEach(function (b) {
    b.addEventListener("click", function () {
      var n = b.getAttribute("data-tab");
      history.replaceState(null, "", "#" + n); openTab(n, true); setNav(n);
    });
  });

  /* ---------- nav / hash routing ---------- */
  function setNav(name) {
    $$(".nav-links a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-go") === name); });
  }
  function route(first) {
    var h = (location.hash || "#home").slice(1);
    if (h === "home" || h === "") {
      setNav("home"); if (!currentTab) openTab("commissions", false);
      if (!first) window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    if (tabNames.indexOf(h) < 0) return;
    openTab(h, !first); setNav(h);
    var target = $("#panel-anchor");
    var y = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: first || reduce ? "auto" : "smooth" });
  }
  window.addEventListener("hashchange", function () { route(false); });
  $$("[data-nav]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (a.getAttribute("href") === location.hash) { e.preventDefault(); route(false); }
    });
  });
  addEventListener("resize", function () { moveInk(currentTab); });

  /* ---------- avatar tilt + tap ---------- */
  var portrait = $("#portrait"), tilt = $(".tilt", portrait), av = $("#avatar-btn");
  var hero = $(".hero");
  hero.addEventListener("mousemove", function (e) {
    if (reduce) return;
    var r = portrait.getBoundingClientRect();
    var x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2 + 160)));
    var y = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2 + 160)));
    tilt.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg"); tilt.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
  }, { passive: true });
  hero.addEventListener("mouseleave", function () { tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg"); });
  av.addEventListener("click", function () { av.classList.remove("tap"); void av.offsetWidth; av.classList.add("tap"); });

  /* ---------- ASCII background ---------- */
  var cv = $("#ascii"), cx = cv.getContext("2d"), W = 0, H = 0, CW = 9, CH = 13, mx = .5;
  var RAMP = " .:-=+*#%@";
  function size() {
    var r = hero.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
    cx.font = "10px " + getComputedStyle(document.body).getPropertyValue("--mono"); cx.textBaseline = "top";
    if (reduce) draw(0);
  }
  function draw(t) {
    cx.clearRect(0, 0, W, H);
    var cols = Math.ceil(W / CW), rows = Math.ceil(H / CH), tt = t * .00035;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var u = i / cols, v = j / rows;
        /* soft arches rising from the middle, drifting slowly */
        var wave = Math.sin(u * 9 + tt) * .5 + Math.sin(u * 17 - tt * 1.3) * .25;
        var arch = Math.abs(Math.sin(u * 3.14159 * 2 + tt * .6));
        var edge = Math.pow(Math.abs(u - .5) * 2, 1.2);
        var d = (1 - Math.abs(v - (.18 + .28 * arch + wave * .06))) * (.35 + edge * .8);
        d += (Math.sin(i * .9 + j * 1.7 + tt * 3) * .5 + .5) * .08;
        d *= (.55 + .45 * Math.sin(u * 40 + v * 12 - tt * 2));
        var k = Math.max(0, Math.min(RAMP.length - 1, Math.floor((d - .3) * 11)));
        if (k <= 0) continue;
        cx.fillStyle = "rgba(240,97,74," + (0.09 + k * 0.04).toFixed(3) + ")";
        cx.fillText(RAMP.charAt(k), i * CW, j * CH);
      }
    }
  }
  var last = 0;
  function loop(t) { if (t - last > 70) { draw(t); last = t; } if (!document.hidden) requestAnimationFrame(loop); }
  document.addEventListener("visibilitychange", function () { if (!document.hidden && !reduce) requestAnimationFrame(loop); });
  addEventListener("resize", size);
  size(); if (reduce) draw(0); else requestAnimationFrame(loop);

  /* ---------- intro ---------- */
  function typeKicker() {
    var el = $("#kicker"), txt = S.kicker || S.role, i = 0;
    if (reduce) { el.textContent = txt; return; }
    (function step() { if (i <= txt.length) { el.textContent = txt.slice(0, i++); setTimeout(step, 22); } })();
  }
  function start() {
    document.body.classList.remove("is-loading");
    route(true); typeKicker();
  }
  window.addEventListener("load", function () { setTimeout(start, reduce ? 0 : 900); });
  setTimeout(function () { if (document.body.classList.contains("is-loading")) start(); }, 4000);
})();
