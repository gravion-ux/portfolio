/* ============================================================
   GRAVION — interactions
   Three.js hero, 3D tilt cards, scroll reveals, counters,
   terminal typing, nav. Everything degrades gracefully:
   no WebGL / no THREE / reduced motion -> static styled page.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- header state + mobile nav ---------- */
  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function onScrollHeader() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.body.classList.add("no-js-anim");
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll(".count");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString("en-US"); return; }
    var start = null, dur = 1500;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); countObs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var raf = null;
      card.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(900px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" +
            (px * 9).toFixed(2) + "deg) translateY(-3px)";
        });
      });
      card.addEventListener("pointerleave", function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = "";
      });
    });
  }

  /* ---------- terminal typing ---------- */
  var term = document.getElementById("terminalBody");
  var termLines = [
    { p: "$ ", c: "whoami", cls: "t-prompt" },
    { p: "", c: "gravion — penetration tester, Delhi (remote)", cls: "" },
    { p: "$ ", c: "ls arsenal/", cls: "t-prompt" },
    { p: "", c: "gravion-ai  wp-cve-hunter  llm-redteam-kit  mcp-shield  jwt-auditor  +30 more", cls: "" },
    { p: "$ ", c: "./status --now", cls: "t-prompt" },
    { p: "", c: "[sentra-byte] offensive security — active", cls: "" },
    { p: "", c: "[patchstack]  report filed Nov 2026 — lab-verified", cls: "" },
    { p: "", c: "[upstream]    PRs merged → xerj-org/xerj", cls: "" },
    { p: "$ ", c: "echo $MODE", cls: "t-prompt" },
    { p: "", c: "proof_not_promises", cls: "t-red" }
  ];
  function renderTerm(upto, partial) {
    var html = "";
    for (var i = 0; i < upto; i++) {
      var l = termLines[i];
      html += '<span class="' + l.cls + '">' + (l.p ? escapeHtml(l.p) : "") +
        escapeHtml(l.c) + "</span>\n";
    }
    if (partial !== null && partial !== undefined && upto < termLines.length) {
      var cur = termLines[upto];
      html += '<span class="' + cur.cls + '">' + escapeHtml(cur.p) +
        escapeHtml(cur.c.slice(0, partial)) + "</span>";
    }
    term.innerHTML = html;
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  if (term) {
    if (reduceMotion) {
      renderTerm(termLines.length, null);
    } else {
      var started = false;
      var startTyping = function () {
        if (started) return; started = true;
        var li = 0, ci = 0;
        (function tick() {
          if (li >= termLines.length) { renderTerm(termLines.length, null); return; }
          var line = termLines[li];
          if (line.p === "") { // output line: print whole, brief pause
            li++; ci = 0;
            renderTerm(li, null);
            setTimeout(tick, 240);
          } else {
            ci++;
            renderTerm(li, ci);
            if (ci >= line.c.length) { li++; ci = 0; setTimeout(tick, 320); }
            else setTimeout(tick, 34);
          }
        })();
      };
      if ("IntersectionObserver" in window) {
        var tObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { startTyping(); tObs.disconnect(); }
          });
        }, { threshold: 0.3 });
        tObs.observe(term);
      } else startTyping();
    }
  }

  /* ---------- Three.js hero: particle network + wireframe core ---------- */
  var canvas = document.getElementById("hero-canvas");
  var hero = document.querySelector(".hero");
  function initThree() {
    if (!canvas || typeof THREE === "undefined") return;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
    camera.position.z = 9;

    var LIME = 0xa3e635, RED = 0xfb4d6d;

    /* wireframe icosahedron core, right side */
    var core = new THREE.Group();
    var ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.15, 1),
      new THREE.MeshBasicMaterial({ color: LIME, wireframe: true, transparent: true, opacity: 0.5 })
    );
    var inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 0),
      new THREE.MeshBasicMaterial({ color: RED, wireframe: true, transparent: true, opacity: 0.34 })
    );
    core.add(ico); core.add(inner);
    core.position.set(3.4, 0.3, 0);
    scene.add(core);

    /* particle field + connecting lines */
    var W = 26, H = 15, COUNT = window.innerWidth < 640 ? 55 : 105;
    var positions = new Float32Array(COUNT * 3);
    var speeds = [];
    for (var i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * W;
      positions[i * 3 + 1] = (Math.random() - 0.5) * H;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      speeds.push({ x: (Math.random() - 0.5) * 0.0035, y: (Math.random() - 0.5) * 0.0035 });
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var points = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: LIME, size: 0.075, transparent: true, opacity: 0.9, sizeAttenuation: true
    }));
    scene.add(points);

    var MAX_LINKS = COUNT * 3;
    var linePos = new Float32Array(MAX_LINKS * 6);
    var lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    var lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
      color: LIME, transparent: true, opacity: 0.17
    }));
    scene.add(lines);

    var mouseX = 0, mouseY = 0;
    window.addEventListener("pointermove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      core.position.x = w < 760 ? 0 : 3.4;
      core.position.y = w < 760 ? 1.9 : 0.3;
      var s = w < 760 ? 0.62 : 1;
      core.scale.set(s, s, s);
    }
    resize();
    window.addEventListener("resize", resize);

    var running = true, visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () { running = !document.hidden; });

    var clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      if (!running || !visible) return;
      var t = clock.getElapsedTime();

      ico.rotation.y = t * 0.12; ico.rotation.x = t * 0.07;
      inner.rotation.y = -t * 0.2; inner.rotation.z = t * 0.09;
      core.position.y += Math.sin(t * 0.7) * 0.0009;

      var arr = pGeo.attributes.position.array;
      for (var i = 0; i < COUNT; i++) {
        arr[i * 3] += speeds[i].x;
        arr[i * 3 + 1] += speeds[i].y;
        if (arr[i * 3] > W / 2) arr[i * 3] = -W / 2;
        if (arr[i * 3] < -W / 2) arr[i * 3] = W / 2;
        if (arr[i * 3 + 1] > H / 2) arr[i * 3 + 1] = -H / 2;
        if (arr[i * 3 + 1] < -H / 2) arr[i * 3 + 1] = H / 2;
      }
      pGeo.attributes.position.needsUpdate = true;

      var li = 0;
      for (var a = 0; a < COUNT; a++) {
        for (var b = a + 1; b < COUNT; b++) {
          var dx = arr[a * 3] - arr[b * 3], dy = arr[a * 3 + 1] - arr[b * 3 + 1];
          if (dx * dx + dy * dy < 4.4 && li < MAX_LINKS) {
            linePos[li * 6] = arr[a * 3]; linePos[li * 6 + 1] = arr[a * 3 + 1]; linePos[li * 6 + 2] = arr[a * 3 + 2];
            linePos[li * 6 + 3] = arr[b * 3]; linePos[li * 6 + 4] = arr[b * 3 + 1]; linePos[li * 6 + 5] = arr[b * 3 + 2];
            li++;
          }
        }
      }
      lGeo.setDrawRange(0, li * 2);
      lGeo.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.45 - camera.position.y) * 0.04;
      camera.lookAt(0.6, 0, 0);

      renderer.render(scene, camera);
    })();
  }

  if (reduceMotion) {
    /* static fallback stays (CSS gradients/grid) */
    return;
  }
  if (document.readyState === "complete") initThree();
  else window.addEventListener("load", initThree);

  /* ---------- hero content parallax ---------- */
  if (finePointer && !reduceMotion) {
    var heroInner = document.querySelector(".hero-inner");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.scrollY;
        if (y < window.innerHeight && heroInner) {
          heroInner.style.transform = "translate3d(0," + (y * 0.16).toFixed(1) + "px,0)";
          heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 1.05)));
        }
      });
    }, { passive: true });
  }
})();
