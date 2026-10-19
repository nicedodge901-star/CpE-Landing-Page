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
})();
