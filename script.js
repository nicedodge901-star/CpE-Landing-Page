// CpE PRMSU landing page interactions (vanilla JS)
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // Small confetti burst when the "you're up to date" card appears
  var ut = Array.prototype.find.call(document.querySelectorAll("#news .lift"), function (el) {
    return /up to date/i.test(el.textContent || "");
  });
  if (ut && !reduce) {
    var utColors = ["var(--gold)", "var(--sky)", "var(--primary)", "var(--primary-deep)"];
    var utBusy = false;
    function confetti() {
      if (utBusy) return;
      utBusy = true;
      for (var k = 0; k < 24; k++) {
        var p = document.createElement("span");
        p.className = "confetti-piece" + (k % 3 === 0 ? " round" : "");
        p.style.left = (2 + Math.random() * 96).toFixed(1) + "%";
        p.style.background = utColors[k % utColors.length];
        p.style.setProperty("--x", (Math.random() * 70 - 35).toFixed(1) + "px");
        p.style.setProperty("--fy", (70 + Math.random() * 55).toFixed(0) + "px");
        p.style.setProperty("--r", Math.round(Math.random() * 720 - 360) + "deg");
        p.style.setProperty("--dl", (Math.random() * 0.4).toFixed(2) + "s");
        p.style.setProperty("--dur", (1.5 + Math.random() * 1.2).toFixed(2) + "s");
        ut.appendChild(p);
        (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3400); })(p);
      }
      setTimeout(function () { utBusy = false; }, 3600);
    }
    var utio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) confetti(); else utBusy = false; });
    }, { threshold: 0.4 });
    utio.observe(ut);
  }


  // Smooth scrolling (Lenis)
  if (!reduce && window.Lenis) {
    var lenis = new Lenis({ duration: 1.25, easing: function (t) { return 1 - Math.pow(1 - t, 4); }, anchors: { offset: -80 } });
    (function loop(t) { lenis.raf(t); requestAnimationFrame(loop); })(0);
  }

  // Scroll progress, header state, parallax variable
  var bar = document.getElementById("scrollBar");
  var header = document.getElementById("siteHeader");
  var solid = ["bg-primary-deep/85", "py-2", "shadow-lg", "backdrop-blur-md"];
  var ticking = false;
  function update() {
    var p = root.scrollTop / (root.scrollHeight - root.clientHeight || 1);
    bar.style.transform = "scaleX(" + p + ")";
    root.style.setProperty("--sy", String(root.scrollTop));
    var s = p > 0.01;
    solid.forEach(function (c) { header.classList.toggle(c, s); });
    header.classList.toggle("py-5", !s);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  // Mobile menu
  var btn = document.getElementById("menuBtn");
  var menu = document.getElementById("navMenu");
  function setMenu(open) { menu.classList.toggle("hidden", !open); menu.classList.toggle("flex", open); }
  btn.addEventListener("click", function () { setMenu(menu.classList.contains("hidden")); });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  // Gallery carousel
  var track = document.getElementById("track");
  if (track) {
    var box = track.parentElement;
    var slides = track.querySelectorAll("figure");
    var dots = box.querySelectorAll('button[aria-label^="Slide"]');
    var n = slides.length, i = 0, paused = false;
    function render() {
      slides.forEach(function (f, k) {
        var off = k - i;
        if (off > n / 2) off -= n;
        if (off < -n / 2) off += n;
        var abs = Math.abs(off);
        f.style.transform = "translateX(calc(-50% + " + off * 62 + "%)) translateZ(" + -abs * 160 + "px) rotateY(" + off * -14 + "deg)";
        f.style.opacity = abs > 2 ? 0 : 1 - abs * 0.35;
        f.style.zIndex = 10 - abs;
      });
      dots.forEach(function (d, k) {
        var on = k === i;
        d.classList.toggle("w-10", on); d.classList.toggle("bg-gold", on);
        d.classList.toggle("w-2", !on); d.classList.toggle("bg-primary/25", !on);
      });
    }
    function go(k) { i = (k + n) % n; render(); }
    slides.forEach(function (f, k) { f.addEventListener("click", function () { go(k); }); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); }); });
    box.querySelector('[aria-label="Previous"]').addEventListener("click", function () { go(i - 1); });
    box.querySelector('[aria-label="Next"]').addEventListener("click", function () { go(i + 1); });
    box.addEventListener("mouseenter", function () { paused = true; });
    box.addEventListener("mouseleave", function () { paused = false; });
    setInterval(function () { if (!paused) go(i + 1); }, 4500);
    render();
  }
  // Courses collage: click or tap a photo to enlarge (Esc closes, arrows or swipe to browse)
  var tiles = document.querySelectorAll(".collage-tile");
  var lb = document.getElementById("lightbox");
  if (tiles.length && lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var lbBtns = [lb.querySelector(".lb-close"), lb.querySelector(".lb-prev"), lb.querySelector(".lb-next")];
    var cur = 0, opener = null, startX = 0;
    function isOpen() { return lb.classList.contains("open"); }
    function show(k) {
      cur = (k + tiles.length) % tiles.length;
      var im = tiles[cur].querySelector("img");
      lbImg.src = im.currentSrc || im.src;
      lbImg.alt = im.alt;
      lbCap.textContent = (cur + 1) + " / " + tiles.length + " \u00b7 " + tiles[cur].getAttribute("data-caption");
    }
    function openLb(k) {
      opener = tiles[k]; show(k);
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      root.style.overflow = "hidden";
      if (lenis) lenis.stop();
      lbBtns[0].focus();
    }
    function closeLb() {
      lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
      root.style.overflow = "";
      if (lenis) lenis.start();
      if (opener) opener.focus();
    }
    tiles.forEach(function (t, k) { t.addEventListener("click", function () { openLb(k); }); });
    lbBtns[0].addEventListener("click", closeLb);
    lbBtns[1].addEventListener("click", function () { show(cur - 1); });
    lbBtns[2].addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    lb.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") show(cur - 1);
      else if (e.key === "ArrowRight") show(cur + 1);
      else if (e.key === "Tab") {
        var first = lbBtns[0], last = lbBtns[2], a = document.activeElement;
        if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  // Facilities: hover, focus or tap a lab card to show its photo
  var facCards = document.querySelectorAll(".fac-card");
  var facSlides = document.querySelectorAll(".photo-slide");
  if (facCards.length && facCards.length === facSlides.length) {
    function pickFac(k) {
      facCards.forEach(function (c, j) { c.classList.toggle("on", j === k); });
      facSlides.forEach(function (s, j) {
        s.classList.toggle("on", j === k);
        s.setAttribute("aria-hidden", j === k ? "false" : "true");
      });
    }
    facCards.forEach(function (c, k) {
      c.addEventListener("mouseenter", function () { pickFac(k); });
      c.addEventListener("focus", function () { pickFac(k); });
      c.addEventListener("click", function () { pickFac(k); });
    });
    pickFac(0);
  }
})();
