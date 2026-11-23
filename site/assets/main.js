/* ============================================================
   GRAVION — interactions (2026 redesign)
   Three.js hero, 3D tilt cards, scroll reveals, counters,
   terminal typing, nav. Everything degrades gracefully:
   no WebGL / no THREE / reduced motion -> static styled page.
   THREE comes from the CDN script tag in index.html; if that
   fails, the local assets/three.min.js copy is loaded instead.
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

  /* ---------- scroll progress bar ---------- */
  var progress = document.getElementById("scrollProgress");
  if (progress) {
    var pTick = false;
    var updateProgress = function () {
      pTick = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1).toFixed(4) + ")";
    };
    window.addEventListener("scroll", function () {
      if (!pTick) { pTick = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();
  }

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

  /* ---------- active nav link (scrollspy) ---------- */
  if (nav && "IntersectionObserver" in window) {
    var navLinks = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      navLinks[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove("active"); });
        var link = navLinks[entry.target.id];
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-38% 0px -55% 0px" });
    Object.keys(navLinks).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.body.classList.add("no-js-anim");
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      var batch = [];
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          batch.push(entry.target);
          revealObs.unobserve(entry.target);
        }
      });
      /* stagger elements that arrive together, then clear the delay so
         it never lags the tilt/hover transitions on the same element */
      batch.forEach(function (el, i) {
        if (batch.length > 1) {
          el.style.transitionDelay = Math.min(i * 75, 450) + "ms";
          setTimeout(function () { el.style.transitionDelay = ""; }, 1500);
        }
        el.classList.add("in");
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
          card.style.setProperty("--mx", ((px + 0.5) * 100).toFixed(1) + "%");
          card.style.setProperty("--my", ((py + 0.5) * 100).toFixed(1) + "%");
          card.style.transform =
            "perspective(900px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" +
            (px * 9).toFixed(2) + "deg) translateY(-3px) scale(1.02)";
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
    { p: "", c: "gravion-ai  wp-cve-hunter  llm-redteam-kit  mcp-shield  jwt-auditor  +33 more", cls: "" },
    { p: "$ ", c: "./status --now", cls: "t-prompt" },
    { p: "", c: "[sentra-byte] offensive security — active", cls: "" },
    { p: "", c: "[patchstack]  2 reports filed Nov 2026 — lab-verified", cls: "" },
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

  /* ---------- Three.js hero: particle network + wireframe core ----------
     Palette sampled from the GRAVION logo: vivid red #ff2916,
     silver-greys, near-black.                              */
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

    var RED = 0xff2916, SILVER = 0xc9c9cf, GREY = 0x8e8e96;

    /* wireframe icosahedron core, right side */
    var core = new THREE.Group();
    var ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.15, 1),
      new THREE.MeshBasicMaterial({ color: RED, wireframe: true, transparent: true, opacity: 0.55 })
    );
    var inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 0),
      new THREE.MeshBasicMaterial({ color: SILVER, wireframe: true, transparent: true, opacity: 0.32 })
    );
    /* outer shell + orbit ring: extra depth layers around the core */
    var shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.75, 1),
      new THREE.MeshBasicMaterial({ color: GREY, wireframe: true, transparent: true, opacity: 0.14 })
    );
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.15, 0.014, 8, 100),
      new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.26 })
    );
    ring.rotation.x = Math.PI / 2.25;
    core.add(ico); core.add(inner); core.add(shell); core.add(ring);
    core.position.set(3.4, 0.3, 0);
    scene.add(core);

    /* silver particle field + faint red connecting lines */
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
      color: SILVER, size: 0.075, transparent: true, opacity: 0.85, sizeAttenuation: true
    }));
    scene.add(points);

    var MAX_LINKS = COUNT * 3;
    var linePos = new Float32Array(MAX_LINKS * 6);
    var lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    var lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
      color: RED, transparent: true, opacity: 0.13
    }));
    scene.add(lines);

    /* sparse red accent particles on a deeper plane (no link lines) */
    var RCOUNT = window.innerWidth < 640 ? 14 : 26;
    var rPos = new Float32Array(RCOUNT * 3);
    var rSpeeds = [];
    for (var j = 0; j < RCOUNT; j++) {
      rPos[j * 3] = (Math.random() - 0.5) * W;
      rPos[j * 3 + 1] = (Math.random() - 0.5) * H;
      rPos[j * 3 + 2] = -2 - Math.random() * 3;
      rSpeeds.push({ x: (Math.random() - 0.5) * 0.002, y: (Math.random() - 0.5) * 0.002 });
    }
    var rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));
    var rPoints = new THREE.Points(rGeo, new THREE.PointsMaterial({
      color: RED, size: 0.11, transparent: true, opacity: 0.8, sizeAttenuation: true
    }));
    scene.add(rPoints);

    var mouseX = 0, mouseY = 0;
    window.addEventListener("pointermove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    var coreBaseY = 0.3, coreBaseScale = 1;
    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      core.position.x = w < 760 ? 0 : 3.4;
      coreBaseY = w < 760 ? 1.9 : 0.3;
      coreBaseScale = w < 760 ? 0.62 : 1;
      core.position.y = coreBaseY;
      core.scale.set(coreBaseScale, coreBaseScale, coreBaseScale);
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
      shell.rotation.y = -t * 0.05; shell.rotation.x = t * 0.03;
      ring.rotation.z = t * 0.1;
      /* anchored float + breathing pulse (no cumulative drift), and the
         whole core leans gently toward the pointer */
      core.position.y = coreBaseY + Math.sin(t * 0.7) * 0.16;
      var pulse = coreBaseScale * (1 + Math.sin(t * 1.25) * 0.02);
      core.scale.set(pulse, pulse, pulse);
      core.rotation.y += (mouseX * 0.3 - core.rotation.y) * 0.03;
      core.rotation.x += (mouseY * 0.18 - core.rotation.x) * 0.03;

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

      var rArr = rGeo.attributes.position.array;
      for (var j = 0; j < RCOUNT; j++) {
        rArr[j * 3] += rSpeeds[j].x;
        rArr[j * 3 + 1] += rSpeeds[j].y;
        if (rArr[j * 3] > W / 2) rArr[j * 3] = -W / 2;
        if (rArr[j * 3] < -W / 2) rArr[j * 3] = W / 2;
        if (rArr[j * 3 + 1] > H / 2) rArr[j * 3 + 1] = -H / 2;
        if (rArr[j * 3 + 1] < -H / 2) rArr[j * 3 + 1] = H / 2;
      }
      rGeo.attributes.position.needsUpdate = true;

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

  /* Boot the hero once THREE is available. index.html loads THREE from
     a CDN; if that script failed, fall back to the local copy. If both
     fail, the CSS hero-fallback (gradients + grid) stays — by design. */
  function bootThree() {
    if (typeof THREE !== "undefined") { initThree(); return; }
    var s = document.createElement("script");
    s.src = "assets/three.min.js";
    s.onload = function () { initThree(); };
    document.body.appendChild(s);
  }

  if (!reduceMotion) {
    if (document.readyState === "complete") bootThree();
    else window.addEventListener("load", bootThree);
  }
  /* reduced motion: static fallback stays (CSS gradients/grid) */

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

/* ---------- copy-to-clipboard buttons (support section) ---------- */
(function () {
  var btns = document.querySelectorAll("[data-copy]");
  if (!btns.length) return;
  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      function done() {
        var old = btn.textContent;
        btn.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove("copied");
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });
})();

/* ---------- payment verification form (support section) ---------- */
(function () {
  var form = document.getElementById("verifyForm");
  if (!form) return;
  var method = document.getElementById("vfMethod");
  var proof = document.getElementById("vfProof");
  var proofLabel = document.getElementById("vfProofLabel");

  var proofHints = {
    "UPI": ["UTR ID — the 12-digit reference in your UPI app's payment history", "Paste the UTR ID here"],
    "Binance Pay": ["Binance Pay transaction ID — in Binance app → Pay → History", "Paste the transaction ID here"],
    "USDT — TRC20 (Tron)": ["Transaction hash (TxID) — check it on Tronscan", "Paste the transaction hash here"],
    "USDT — Solana": ["Transaction signature / hash — check it on Solscan", "Paste the transaction hash here"],
    "USDT — BEP20 / ERC20": ["Transaction hash (TxID) — check it on BscScan / Etherscan", "Paste the transaction hash here"],
    "Litecoin (LTC) — BEP20": ["Transaction hash (TxID) — check it on BscScan", "Paste the transaction hash here"],
    "PayPal": ["PayPal transaction ID — in the payment email / activity", "Paste the transaction ID here"],
    "GitHub Sponsors": ["Your GitHub username — sponsorships show on your profile", "Paste your GitHub username here"]
  };

  function syncProof() {
    var h = proofHints[method.value] || proofHints["UPI"];
    proofLabel.textContent = h[0];
    proof.placeholder = h[1];
  }
  method.addEventListener("change", syncProof);
  syncProof();

  function buildMessage() {
    var lines = [
      "Payment verification — Gravion",
      "Name: " + document.getElementById("vfName").value.trim(),
      "Contact: " + document.getElementById("vfContact").value.trim(),
      "Method: " + method.value,
      "Amount: " + document.getElementById("vfAmount").value.trim(),
      "Proof (UTR / Tx hash / ID): " + proof.value.trim()
    ];
    var purpose = document.getElementById("vfPurpose").value.trim();
    if (purpose) lines.push("For: " + purpose);
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var url = "https://wa.me/918178777142?text=" + encodeURIComponent(buildMessage());
    window.open(url, "_blank", "noopener");
  });

  document.getElementById("vfEmailBtn").addEventListener("click", function () {
    if (!form.reportValidity()) return;
    var subject = "Payment verification — " + method.value;
    var url = "mailto:priyanshukumarthakur937@gmail.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildMessage());
    window.location.href = url;
  });
})();

/* ---------- support: unified chooser ---------- */
(function () {
  var methods = document.getElementById("soMethods");
  if (!methods) return;
  var amountRow = document.getElementById("soAmountRow");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".so-amt"));
  var custom = document.getElementById("soCustom");
  var upiBtn = document.getElementById("soUpiBtn");
  var paypalBtn = document.getElementById("soPaypalBtn");
  var net = document.getElementById("soNet");
  var addr = document.getElementById("soAddr");
  var copyBtn = document.getElementById("soCopy");
  var state = { method: "upi", amount: 250 };
  var PRESETS = {
    upi: { cur: "₹", vals: [100, 250, 500, 1000] },
    paypal: { cur: "$", vals: [5, 10, 25, 50] },
    sponsors: { cur: "$", vals: [5, 10, 25, 50] },
    binance: { cur: "$", vals: [5, 10, 25, 50] },
    crypto: { cur: "$", vals: [5, 10, 25, 50] }
  };
  function fmt(cur, n) { return cur + Number(n).toLocaleString("en-IN"); }
  function renderAmounts() {
    var p = PRESETS[state.method];
    chips.forEach(function (chip, i) {
      chip.setAttribute("data-amt", p.vals[i]);
      chip.textContent = fmt(p.cur, p.vals[i]);
      chip.classList.toggle("is-active", Number(state.amount) === p.vals[i] && !custom.value);
    });
    amountRow.style.display = state.method === "sponsors" ? "none" : "";
  }
  function renderPanes() {
    document.querySelectorAll(".so-pane").forEach(function (pane) {
      pane.hidden = pane.getAttribute("data-pane") !== state.method;
    });
    var p = PRESETS[state.method];
    var amt = state.amount;
    if (upiBtn) {
      upiBtn.href = "upi://pay?pa=gravionthakur@fam&pn=Priyanshu%20Kumar%20Thakur&cu=INR" + (amt ? "&am=" + amt : "");
      upiBtn.textContent = amt ? "Pay " + fmt("₹", amt) + " in your UPI app ↗" : "Pay in your UPI app ↗";
    }
    if (paypalBtn) {
      paypalBtn.href = "https://paypal.me/gravion937" + (amt ? "/" + amt : "");
      paypalBtn.textContent = amt ? "Send " + fmt("$", amt) + " via PayPal ↗" : "Send via PayPal ↗";
    }
  }
  methods.addEventListener("click", function (e) {
    var btn = e.target.closest(".so-method");
    if (!btn) return;
    state.method = btn.getAttribute("data-method");
    methods.querySelectorAll(".so-method").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
    var p = PRESETS[state.method];
    state.amount = p.vals[1];
    custom.value = "";
    renderAmounts(); renderPanes();
  });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.amount = Number(chip.getAttribute("data-amt"));
      custom.value = "";
      renderAmounts(); renderPanes();
    });
  });
  if (custom) custom.addEventListener("input", function () {
    var v = parseFloat(custom.value);
    state.amount = isFinite(v) && v > 0 ? v : null;
    renderAmounts(); renderPanes();
  });
  if (net) net.addEventListener("change", function () {
    addr.textContent = net.value;
    copyBtn.setAttribute("data-copy", net.value);
  });
  renderAmounts(); renderPanes();
})();

/* ---------- builder pass: drag me ---------- */
(function () {
  var pass = document.getElementById("builderPass");
  if (!pass) return;
  var dx = 0, dy = 0, sx = 0, sy = 0, dragging = false;
  function apply() {
    pass.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + (dragging ? -2 : 0) + "deg) scale(" + (dragging ? 1.03 : 1) + ")";
  }
  pass.addEventListener("pointerdown", function (e) {
    dragging = true; sx = e.clientX - dx; sy = e.clientY - dy;
    pass.classList.add("dragging");
    try { pass.setPointerCapture(e.pointerId); } catch (err) {}
    apply();
  });
  pass.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    apply();
  });
  function end() { dragging = false; pass.classList.remove("dragging"); apply(); }
  pass.addEventListener("pointerup", end);
  pass.addEventListener("pointercancel", end);
  pass.addEventListener("dblclick", function () { dx = 0; dy = 0; apply(); });
  pass.addEventListener("dragstart", function (e) { e.preventDefault(); });
})();
