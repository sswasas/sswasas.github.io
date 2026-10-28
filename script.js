(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- content from config.js ---------- */
  $("#about").textContent = S.about;
  $("#tags").innerHTML = S.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
  $("#comm-note").textContent = S.commissionsNote;
  $("#comm-fine").textContent = S.commissionsFine;
  $("#year").textContent = "\u00A9 " + new Date().getFullYear();
  $$("[data-discord-name]").forEach(function (el) { el.textContent = S.discord; });
  if (S.deviantart) { $("#da-side").href = S.deviantart; $("#da-tile").href = S.deviantart; }

  $("#tiers").innerHTML = S.tiers.map(function (t, i) {
    return '<article class="ticket rv' + (t.featured ? " hot" : "") + '" style="--d:' + i + '">' +
      (t.featured ? '<span class="pop">Popular</span>' : "") +
      "<h3>" + esc(t.name) + '</h3><div class="price">' + esc(t.price) + '</div><p class="desc">' + esc(t.desc) + "</p><ul>" +
      t.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></article>";
  }).join("");

  var fr = S.friends.slice().sort(function (a, b) { return (b.watchers || 0) - (a.watchers || 0); });
  var max = Math.sqrt(fr[0].watchers || 1);
  $("#friend-list").innerHTML = fr.map(function (f, i) {
    var w = Math.max(5, Math.round(Math.sqrt(f.watchers || 0) / max * 100));
    return '<li class="fr rv" style="--d:' + Math.min(i, 5) + ';--w:' + w + '%"><span class="rk">' + (i + 1) + '</span>' +
      '<div class="nm"><strong>' + esc(f.name) + ' <span class="chip18">18+</span></strong><small>@' + esc(f.handle) + '</small></div>' +
      '<div class="meter"><div class="bar"><i></i></div><div class="wc"><b>' + esc(f.watchersLabel || String(f.watchers)) + '</b>watchers on DeviantArt</div></div>' +
      '<a class="go" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Visit <span aria-hidden="true">&#8599;</span></a></li>';
  }).join("") +
  '<li class="fr ghost rv" style="--d:5"><span class="rk">+</span><div class="nm"><strong>Your account here?</strong><small>Want to be listed? Message me on Discord.</small></div><div></div>' +
  '<button class="go" type="button" data-discord>Copy Discord</button></li>';

  /* ---------- toast, Discord copy, PayPal ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2200); }
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
    copyText(S.discord).then(function () { toast("Copied Discord: " + S.discord); }, function () { toast("Discord: " + S.discord); });
  });
  var pp = S.paypal, ppSet = pp && pp !== "PAYPAL_LINK_HERE";
  $("#donate").innerHTML = '<div><p class="st">Buy the bear a <em>coffee</em>.</p><p class="fine">' + (ppSet ? "Opens PayPal in a new tab." : "PayPal link coming soon") + '</p></div>' +
    (ppSet ? '<a class="btn ember big magnet" href="' + esc(pp) + '" target="_blank" rel="noopener noreferrer">Support via PayPal</a>'
           : '<button class="btn ember big magnet" type="button" id="pp-soon">Support via PayPal</button>');
  if (!ppSet) $("#pp-soon").addEventListener("click", function () { toast("PayPal link coming soon"); });

  /* ---------- age gate ---------- */
  $("#gate-yes").addEventListener("click", function () {
    try { localStorage.setItem("age18", "yes"); } catch (e) {}
    document.documentElement.classList.remove("gate-on");
  });
  $("#gate-no").addEventListener("click", function () { location.href = "https://www.google.com/"; });

  /* ---------- reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;
  $$(".rv").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

  /* ---------- scroll spy + glow parallax + progress fallback ---------- */
  var secs = ["home", "commissions", "friends", "support"].map(function (id) { return document.getElementById(id); });
  var links = $$("[data-go]"), bar = $("#menu-bar"), cur = "";
  function setOn(id) {
    if (id === cur) return; cur = id;
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-go") === id); });
    var a = $(".menu a[data-go=\"" + id + "\"]");
    if (a && bar) { bar.style.height = a.offsetHeight + "px"; bar.style.transform = "translateY(" + a.offsetTop + "px)"; }
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, mid = y + innerHeight * .4, id = "home";
      secs.forEach(function (s) { if (s.offsetTop <= mid) id = s.id; });
      setOn(id);
      document.documentElement.style.setProperty("--sy", (y * -0.25) + "px");
      var h = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();

  /* ---------- page transition between sections ---------- */
  var curtain = $("#curtain"), busy = false;
  function go(id, instant) {
    var t = document.getElementById(id); if (!t || busy) return;
    var top = t.offsetTop + (id === "home" ? 0 : 0);
    if (reduce || instant) { window.scrollTo(0, top); return; }
    busy = true;
    curtain.classList.remove("out"); void curtain.offsetWidth; curtain.classList.add("in");
    setTimeout(function () {
      window.scrollTo(0, top); onScroll();
      curtain.classList.remove("in"); void curtain.offsetWidth; curtain.classList.add("out");
      setTimeout(function () { curtain.classList.remove("out"); busy = false; }, 650);
    }, 560);
  }
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault(); var id = a.getAttribute("data-go");
      history.replaceState(null, "", "#" + id); go(id);
    });
  });
  if (location.hash.length > 1) setTimeout(function () { go(location.hash.slice(1), true); }, 50);

  /* ---------- spotlight on tiles, magnetic buttons ---------- */
  if (fine && !reduce) {
    document.addEventListener("mousemove", function (e) {
      var s = e.target.closest && e.target.closest(".spot");
      if (s) { var r = s.getBoundingClientRect(); s.style.setProperty("--mx", (e.clientX - r.left) + "px"); s.style.setProperty("--my", (e.clientY - r.top) + "px"); }
    }, { passive: true });
    $$(".magnet, .magnet-soft").forEach(function (el) {
      var k = el.classList.contains("magnet-soft") ? .04 : .3;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * k).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * k).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
    addEventListener("mousemove", function (e) {
      document.documentElement.style.setProperty("--gx", (60 + e.clientX / innerWidth * 30) + "%");
    }, { passive: true });
  }

  /* ---------- forest: parallax + fireflies ---------- */
  (function () {
    var far = $(".fl-far"), mid = $(".fl-mid"), near = $(".fl-near");
    var cv = $("#flies");
    if (!far || !cv) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, raf = 0;
    function apply() {
      raf = 0;
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      var s = Math.min(sy, 1200);
      far.style.transform = "translate3d(" + (cx * 6).toFixed(1) + "px," + (cy * 3 + s * .01).toFixed(1) + "px,0)";
      mid.style.transform = "translate3d(" + (cx * 14).toFixed(1) + "px," + (cy * 6 + s * .025).toFixed(1) + "px,0)";
      near.style.transform = "translate3d(" + (cx * 28).toFixed(1) + "px," + (cy * 10 + s * .05).toFixed(1) + "px,0)";
      if (Math.abs(tx - cx) > .002 || Math.abs(ty - cy) > .002) raf = requestAnimationFrame(apply);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(apply); }
    if (!reduce) {
      addEventListener("mousemove", function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; kick(); }, { passive: true });
      addEventListener("scroll", function () { sy = window.scrollY; kick(); }, { passive: true });
    }

    /* fireflies: one small canvas, a pre-rendered glow sprite, paused when hidden */
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = 1, flies = [], running = false, last = 0;
    var spr = document.createElement("canvas"); spr.width = spr.height = 64;
    var sc = spr.getContext("2d"), g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,244,200,1)"); g.addColorStop(.12, "rgba(255,206,110,.9)");
    g.addColorStop(.4, "rgba(255,150,40,.28)"); g.addColorStop(1, "rgba(255,120,20,0)");
    sc.fillStyle = g; sc.fillRect(0, 0, 64, 64);
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr;
      var n = W < 700 ? 12 : 26;
      while (flies.length < n) flies.push(null);
      flies.length = n;
      for (var i = 0; i < n; i++) if (!flies[i]) flies[i] = {
        x: Math.random(), y: .35 + Math.random() * .65, r: 5 + Math.random() * 7,
        sp: .25 + Math.random() * .5, ph: Math.random() * 6.28, bl: .5 + Math.random() * 1.1, a: Math.random() * 6.28
      };
    }
    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < flies.length; i++) {
        var f = flies[i], tt = t / 1000;
        var x = (f.x * W + Math.sin(tt * f.sp + f.ph) * 46 + Math.sin(tt * f.sp * .37 + f.a) * 30);
        var y = (f.y * H + Math.cos(tt * f.sp * .8 + f.ph) * 30 - ((tt * 6 * f.sp) % 40));
        var b = reduce ? .6 : Math.max(0, Math.sin(tt * f.bl + f.ph)); b = b * b;
        if (b < .02) continue;
        ctx.globalAlpha = b * .85;
        var r = f.r * 2.2; ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    }
    function loop(t) { if (!running) return; if (t - last > 33) { last = t; draw(t); } requestAnimationFrame(loop); }
    function start() { if (!running && !reduce) { running = true; requestAnimationFrame(loop); } }
    size(); draw(1000);
    addEventListener("resize", function () { size(); if (reduce || !running) draw(1000); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) running = false; else start(); });
    start();
  })();
})();
