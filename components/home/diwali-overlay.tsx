// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";

/**
 * Diwali Festive Celebration Suite
 *
 * Updated per requirements:
 * 1. Top swinging paper lanterns REMOVED completely.
 * 2. Flowers removed from both sides — keeping the golden chains,
 *    hanging brass bell, and warm glowing light / diya with flame intact.
 * 3. Bottom glowing realistic diyas & rising sparks preserved.
 * 4. Opening fireworks rocket show with "Happy Diwali" greeting preserved.
 * 5. Cute cursor sparkler trail preserved.
 */
export function DiwaliOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load Google Fonts for Diwali Greeting
    if (!document.getElementById("diwali-fonts")) {
      const link = document.createElement("link");
      link.id = "diwali-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Cormorant+Garamond:ital,wght@1,500&display=swap";
      document.head.appendChild(link);
    }

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const LITE =
      (navigator.hardwareConcurrency || 4) <= 4 ||
      ((navigator as any).deviceMemory || 4) <= 4 ||
      window.innerWidth < 700;

    const root = containerRef.current;
    if (!root) return;

    // Clean up any previously appended dynamic elements if re-mounted
    root.innerHTML = "";

    /* =========================================================
       INJECT CSS STYLES
       ========================================================= */
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      /* ----- BOTTOM REALISTIC DIYAS ----- */
      .dw-bottom {
        position: fixed; left: 0; right: 0; bottom: 0; height: 125px;
        display: grid; grid-template-columns: 1fr auto auto 1fr; align-items: end;
        column-gap: clamp(16px, 4vw, 56px); padding: 0 3vw; pointer-events: none;
        z-index: 999992; contain: layout paint; --dw-size: 70px;
      }
      .dw-candle { width: var(--dw-size); line-height: 0; transform-origin: 50% 100%; pointer-events: auto; cursor: pointer; }
      .dw-candle:nth-child(1) { justify-self: start; }
      .dw-candle:nth-child(2) { justify-self: end; }
      .dw-candle:nth-child(3) { justify-self: start; }
      .dw-candle:nth-child(4) { justify-self: end; }
      .dw-candle svg { display: block; width: 100%; height: auto; overflow: visible; }
      .dw-flame, .dw-flame-mid, .dw-flame-core { transform-box: fill-box; transform-origin: 50% 100%; }
      .dw-flame      { animation: dwFlicker 2.1s ease-in-out infinite; }
      .dw-flame-mid  { animation: dwFlicker2 1.5s ease-in-out infinite; }
      .dw-flame-core { animation: dwFlicker3 1.1s ease-in-out infinite; }
      .dw-glow, .dw-lit { transform-box: fill-box; transform-origin: 50% 50%; animation: dwGlow 2.3s ease-in-out infinite; }
      .dw-candle:nth-child(1) :is(.dw-flame,.dw-flame-mid,.dw-flame-core,.dw-glow,.dw-lit) { animation-delay: -.35s; }
      .dw-candle:nth-child(2) :is(.dw-flame,.dw-flame-mid,.dw-flame-core,.dw-glow,.dw-lit) { animation-delay: -1.15s; }
      .dw-candle:nth-child(3) :is(.dw-flame,.dw-flame-mid,.dw-flame-core,.dw-glow,.dw-lit) { animation-delay: -1.85s; }
      .dw-candle:nth-child(4) :is(.dw-flame,.dw-flame-mid,.dw-flame-core,.dw-glow,.dw-lit) { animation-delay: -.75s; }
      @keyframes dwFlicker {
        0%,100% { transform: rotate(0deg) scale(1, 1); opacity: 1; }
        15%     { transform: rotate(-2.2deg) scale(.96, 1.05); opacity: .94; }
        32%     { transform: rotate(1.6deg) scale(1.04, .95); opacity: 1; }
        50%     { transform: rotate(-1deg) scale(.97, 1.08); opacity: .92; }
        71%     { transform: rotate(2.4deg) scale(1.03, .97); opacity: 1; }
        88%     { transform: rotate(-1.4deg) scale(.98, 1.03); opacity: .96; }
      }
      @keyframes dwFlicker2 {
        0%,100% { transform: rotate(0deg) scale(1, 1); }
        25%     { transform: rotate(2deg) scale(.94, 1.07); }
        55%     { transform: rotate(-2.6deg) scale(1.05, .93); }
        80%     { transform: rotate(1.2deg) scale(.97, 1.05); }
      }
      @keyframes dwFlicker3 {
        0%,100% { transform: scale(1, 1); opacity: .95; }
        35%     { transform: scale(.9, 1.12); opacity: 1; }
        70%     { transform: scale(1.08, .92); opacity: .85; }
      }
      @keyframes dwGlow {
        0%,100% { opacity: .8; transform: scale(1); }
        30%     { opacity: 1; transform: scale(1.08); }
        60%     { opacity: .88; transform: scale(.97); }
        80%     { opacity: 1; transform: scale(1.05); }
      }
      @media (max-width: 900px) {
        .dw-bottom { height: 105px; --dw-size: 56px; column-gap: clamp(14px, 3.5vw, 40px); padding: 0 2.5vw; }
      }
      @media (max-width: 700px) {
        .dw-bottom { height: 88px; --dw-size: 46px; column-gap: clamp(12px, 3.5vw, 28px); padding: 0 2vw; }
      }

      /* ----- RISING SPARKS ----- */
      .dw-sparks-layer {
        position: fixed; inset: 0; pointer-events: none; z-index: 999989; overflow: hidden; contain: layout paint;
      }
      .dw-sparks span {
        position: absolute; bottom: -14px; border-radius: 50%; opacity: 0; animation: dwRise linear infinite;
      }
      @keyframes dwRise {
        0% { transform: translate3d(0,0,0) scale(.6); opacity: 0; }
        15% { opacity: 1; }
        100% { transform: translate3d(var(--dx,0px),-85vh,0) scale(1.2); opacity: 0; }
      }

      /* ----- SCROLL-TRIGGERED FESTIVE ARCH & SIDE BELLS/LIGHTS ----- */
      #utsav-festive-root {
        position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important;
        pointer-events: none !important; z-index: 999993 !important; overflow: hidden !important;
        user-select: none !important; -webkit-user-select: none !important;
      }
      #utsav-festive-root::before {
        content: ""; position: absolute; top: -15px; left: 0; width: 100%; height: 55px;
        background: radial-gradient(60% 100% at 50% 0%, rgba(255, 185, 50, 0.16) 0%, transparent 100%);
        pointer-events: none; opacity: 0; transition: opacity 0.4s ease-in-out;
      }
      #utsav-festive-root.utsav-scrolled::before { opacity: 1; }
      .utsav-top-row {
        position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 62px !important;
        display: flex !important; justify-content: space-between !important; align-items: flex-start !important;
        padding: 0 45px !important; box-sizing: border-box !important;
        transform: translateY(-100%) !important; transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }
      #utsav-festive-root.utsav-scrolled .utsav-top-row { transform: translateY(0) !important; }
      .utsav-scallop {
        flex: 1 1 220px !important; height: 58px !important; transform-origin: 50% 0% !important;
        animation: utsavGentleSway 6s ease-in-out infinite; transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .utsav-scallop:nth-child(even) { animation-duration: 7.2s; animation-delay: -2.5s; }
      .utsav-scallop svg { width: 100% !important; height: 58px !important; overflow: visible !important; display: block !important; }

      /* Side entrances with bell & light */
      .utsav-side-entrance {
        position: absolute !important; top: 0 !important; width: 90px !important; height: 330px !important;
        transform-origin: 50% 0% !important; animation: utsavLampSwing 5.5s ease-in-out infinite;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); pointer-events: none !important;
        filter: drop-shadow(0 0 14px rgba(255, 195, 60, 0.4));
      }
      .utsav-side-left { left: 8px !important; }
      .utsav-side-right { right: 8px !important; animation-delay: -2.7s; }
      .utsav-side-entrance svg { width: 100% !important; height: 100% !important; overflow: visible !important; display: block !important; }
      @keyframes utsavGentleSway { 0%, 100% { transform: rotate(-0.8deg); } 50% { transform: rotate(0.8deg); } }
      @keyframes utsavLampSwing { 0%, 100% { transform: rotate(-1.8deg); } 50% { transform: rotate(1.8deg); } }
      @keyframes utsavBulbBreath { 0%, 100% { opacity: 0.72; transform: scale(0.92); } 50% { opacity: 1; transform: scale(1.1); } }
      @keyframes utsavFlameFlicker {
        0%, 100% { transform: scale(1, 1) rotate(-1deg); opacity: 0.95; }
        25% { transform: scale(0.94, 1.07) rotate(1.5deg); opacity: 1; }
        50% { transform: scale(1.04, 0.94) rotate(-1.5deg); opacity: 0.9; }
        75% { transform: scale(0.97, 1.05) rotate(1deg); opacity: 1; }
      }
      .utsav-bulb-glow { transform-box: fill-box; transform-origin: center; animation: utsavBulbBreath 2.6s ease-in-out infinite; }
      .utsav-lamp-flame { transform-box: fill-box; transform-origin: 50% 90%; animation: utsavFlameFlicker 1.8s ease-in-out infinite; }
      .utsav-hit { pointer-events: auto !important; cursor: pointer !important; transition: filter 0.25s ease; }
      .utsav-hit:hover { filter: brightness(1.25) drop-shadow(0 0 8px rgba(255, 215, 60, 0.9)); }
      .utsav-jolt { animation: none !important; transform: rotate(2.5deg) !important; }
      @media (max-width: 640px) {
        .utsav-top-row { padding: 0 16px !important; height: 46px !important; }
        .utsav-scallop, .utsav-scallop svg { height: 44px !important; }
        .utsav-side-entrance { width: 68px !important; height: 250px !important; }
      }

      /* ----- CURSOR SPARKLER CANVAS ----- */
      #utsav-spark-canvas {
        position: fixed !important; top: 0 !important; left: 0 !important;
        width: 100vw !important; height: 100vh !important; pointer-events: none !important;
        z-index: 999997 !important;
      }

      /* ----- FIREWORKS OVERLAY & GREETING ----- */
      .diwali-overlay {
        position: fixed; inset: 0; z-index: 999999; pointer-events: none;
        background: transparent; font-family: system-ui, sans-serif; overflow: hidden;
        transition: opacity 1.2s ease; contain: strict;
      }
      .diwali-overlay.is-hiding { opacity: 0; }
      .diwali-overlay canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .diwali-hello {
        position: absolute; left: 50%; top: 38%;
        transform: translate(-50%, calc(-50% + 40px)) scale(.92);
        text-align: center; opacity: 0;
        transition: opacity 1s, transform 1.3s cubic-bezier(.2,.8,.2,1);
        width: min(92%, 640px); z-index: 3; pointer-events: none;
      }
      .diwali-hello.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      .diwali-hello h1 {
        font: 600 clamp(32px, 7vw, 64px)/1.05 'Cinzel', Georgia, serif;
        letter-spacing: .06em; text-transform: uppercase;
        background: linear-gradient(180deg, #fff7dc, #ffd36b 55%, #d99a2b);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: #ffd36b; margin: 0 0 12px;
        filter: drop-shadow(0 2px 14px rgba(255, 200, 60, 0.45));
      }
      .diwali-hello p {
        margin: 0; font: italic 500 clamp(18px, 2.7vw, 25px)/1.2 "Cormorant Garamond", Georgia, serif;
        color: #fff0c8; text-shadow: 0 2px 10px rgba(0,0,0,.95);
      }

      @media (prefers-reduced-motion: reduce) {
        .dw-flame, .dw-flame-mid, .dw-flame-core, .dw-glow, .dw-lit,
        .dw-sparks span, .utsav-scallop, .utsav-side-entrance,
        .utsav-bulb-glow, .utsav-lamp-flame { animation: none !important; }
        .diwali-hello { transition-duration: .01s; }
      }
    `;
    root.appendChild(styleEl);

    /* =========================================================
       1. RISING EMBER SPARKS
       ========================================================= */
    const sparksLayer = document.createElement("div");
    sparksLayer.className = "dw-sparks-layer";
    sparksLayer.setAttribute("aria-hidden", "true");
    const sparksContainer = document.createElement("div");
    sparksContainer.className = "dw-sparks";
    const SP = ["#ffd700", "#ffe27a", "#ffffff", "#ff6fa5", "#4de1ff", "#ffa040", "#b388ff"];
    const sparkCount = LITE ? 10 : 18;
    for (let i = 0; i < sparkCount; i++) {
      const sp = document.createElement("span");
      const sz = 5 + Math.random() * 6;
      const c = SP[(Math.random() * SP.length) | 0];
      sp.style.left = Math.random() * 100 + "%";
      sp.style.animationDuration = 9 + Math.random() * 9 + "s";
      sp.style.animationDelay = -Math.random() * 14 + "s";
      sp.style.width = sp.style.height = sz + "px";
      sp.style.setProperty("--dx", (Math.random() - 0.5) * 90 + "px");
      sp.style.background = `radial-gradient(circle, #fff 0%, ${c} 40%, rgba(255,200,60,0) 72%)`;
      sparksContainer.appendChild(sp);
    }
    sparksLayer.appendChild(sparksContainer);
    root.appendChild(sparksLayer);

    /* =========================================================
       2. BOTTOM REALISTIC DIYAS
       ========================================================= */
    function diyaSVG(c1: string, c2: string, uid: number) {
      const u = uid;
      const s = [];
      s.push(`<svg viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg"><defs>`);
      s.push(`<linearGradient id="bb${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c2}"/><stop offset=".3" stop-color="${c1}"/><stop offset=".62" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`);
      s.push(`<linearGradient id="bs${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>`);
      s.push(`<linearGradient id="br${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8721a"/><stop offset=".3" stop-color="#ffe9a8"/><stop offset=".6" stop-color="#f0b93e"/><stop offset="1" stop-color="#9a6516"/></linearGradient>`);
      s.push(`<radialGradient id="bo${u}" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="#c8741c"/><stop offset="1" stop-color="#2e1304"/></radialGradient>`);
      s.push(`<radialGradient id="bg${u}"><stop offset="0" stop-color="#fff2b8" stop-opacity=".85"/><stop offset=".35" stop-color="#ffb02e" stop-opacity=".35"/><stop offset="1" stop-color="#ff7a00" stop-opacity="0"/></radialGradient>`);
      s.push(`<radialGradient id="bl${u}"><stop offset="0" stop-color="#ffc45a" stop-opacity=".75"/><stop offset="1" stop-color="#ff8a00" stop-opacity="0"/></radialGradient>`);
      s.push(`<linearGradient id="bf1${u}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4a00"/><stop offset=".4" stop-color="#ff9100"/><stop offset=".8" stop-color="#ffcf3a" stop-opacity=".9"/><stop offset="1" stop-color="#ffe98a" stop-opacity=".4"/></linearGradient>`);
      s.push(`<linearGradient id="bf2${u}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb300"/><stop offset=".55" stop-color="#ffe066"/><stop offset="1" stop-color="#fffbe0"/></linearGradient>`);
      s.push(`<radialGradient id="bf3${u}" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#fff6c8"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient>`);
      s.push(`<radialGradient id="bf4${u}"><stop offset="0" stop-color="#5aa8ff" stop-opacity=".9"/><stop offset="1" stop-color="#3a6bff" stop-opacity="0"/></radialGradient>`);
      s.push(`<filter id="bz${u}" x="-30%" y="-20%" width="160%" height="140%"><feGaussianBlur stdDeviation=".7"/></filter>`);
      s.push(`</defs>`);
      s.push(`<ellipse class="dw-glow" cx="40" cy="95" rx="38" ry="7" fill="url(#bl${u})" opacity=".55"/>`);
      s.push(`<circle class="dw-glow" cx="40" cy="42" r="36" fill="url(#bg${u})"/>`);
      s.push(`<ellipse cx="40" cy="94.5" rx="16" ry="3.6" fill="#000" opacity=".35"/>`);
      s.push(`<ellipse cx="40" cy="92.5" rx="14" ry="3.6" fill="${c2}"/>`);
      s.push(`<path d="M9 63 Q11 89 40 93 Q69 89 71 63 Z" fill="url(#bb${u})"/>`);
      s.push(`<path d="M9 63 Q11 89 40 93 Q69 89 71 63 Z" fill="url(#bs${u})"/>`);
      s.push(`<path d="M11 68 Q40 78 69 68" fill="none" stroke="url(#br${u})" stroke-width="1.8" stroke-linecap="round" opacity=".95"/>`);
      s.push(`<g fill="#ffe9a8" opacity=".95"><circle cx="20" cy="75.5" r="1.5"/><circle cx="30" cy="77.8" r="1.5"/><circle cx="40" cy="78.6" r="1.5"/><circle cx="50" cy="77.8" r="1.5"/><circle cx="60" cy="75.5" r="1.5"/></g>`);
      s.push(`<path d="M15 70 Q18 84 31 89" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.6" stroke-linecap="round"/>`);
      s.push(`<ellipse class="dw-lit" cx="40" cy="72" rx="26" ry="14" fill="url(#bl${u})" opacity=".35"/>`);
      s.push(`<ellipse cx="40" cy="63" rx="31" ry="7.6" fill="url(#br${u})"/>`);
      s.push(`<ellipse cx="40" cy="63.8" rx="27.5" ry="5.8" fill="url(#bo${u})"/>`);
      s.push(`<ellipse class="dw-lit" cx="40" cy="63.6" rx="9" ry="2.4" fill="#ffe9a8" opacity=".6"/>`);
      s.push(`<path d="M16 61.4 Q40 57.6 64 61.4" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/>`);
      s.push(`<path d="M40 63.5 Q40.6 60 40 57" fill="none" stroke="#2a1608" stroke-width="2.2" stroke-linecap="round"/>`);
      s.push(`<circle cx="40" cy="57" r="1.3" fill="#ff5a1a"/>`);
      s.push(`<g class="dw-flame" filter="url(#bz${u})"><path d="M40 6 C44 21 55 33 53 46 C52 54 47 59 40 59 C33 59 28 54 27 46 C25 33 36 21 40 6Z" fill="url(#bf1${u})"/></g>`);
      s.push(`<g class="dw-flame-mid" filter="url(#bz${u})"><path d="M40 19 C43 29 50 37 48.5 47 C47.5 53.5 44 57.5 40 57.5 C36 57.5 32.5 53.5 31.5 47 C30 37 37 29 40 19Z" fill="url(#bf2${u})"/></g>`);
      s.push(`<g class="dw-flame-core"><path d="M40 35 C42 41 45 46 44 51.5 C43.4 55 41.8 56.6 40 56.6 C38.2 56.6 36.6 55 36 51.5 C35 46 38 41 40 35Z" fill="url(#bf3${u})"/></g>`);
      s.push(`<ellipse cx="40" cy="57" rx="5.2" ry="3.4" fill="url(#bf4${u})"/>`);
      s.push(`</svg>`);
      return s.join("");
    }

    const bottomDiv = document.createElement("div");
    bottomDiv.className = "dw-bottom";
    bottomDiv.setAttribute("aria-hidden", "true");
    const diyaConfigs = [
      { c1: "#ffb21f", c2: "#a24a06" },
      { c1: "#ff3d8b", c2: "#8a0f45" },
      { c1: "#22d3ee", c2: "#07607a" },
      { c1: "#a855f7", c2: "#44187a" },
    ];
    diyaConfigs.forEach((c, idx) => {
      const d = document.createElement("div");
      d.className = "dw-candle";
      d.innerHTML = diyaSVG(c.c1, c.c2, idx);
      d.addEventListener("click", () => {
        if (window.spawnHoverSpark) {
          const rect = d.getBoundingClientRect();
          window.spawnHoverSpark(rect.left + rect.width / 2, rect.top + 20, "gold");
        }
      });
      bottomDiv.appendChild(d);
    });
    root.appendChild(bottomDiv);

    /* =========================================================
       3. SCROLL-TRIGGERED FESTIVE ARCH & SIDE BELLS/LIGHTS
       (NO FLOWERS ON SIDES — ONLY GOLDEN CHAINS, BELL & LIGHT)
       ========================================================= */
    const archRoot = document.createElement("div");
    archRoot.id = "utsav-festive-root";
    archRoot.setAttribute("aria-hidden", "true");

    const topRow = document.createElement("div");
    topRow.className = "utsav-top-row";
    archRoot.appendChild(topRow);

    const leftGate = document.createElement("div");
    leftGate.className = "utsav-side-entrance utsav-side-left";
    archRoot.appendChild(leftGate);

    const rightGate = document.createElement("div");
    rightGate.className = "utsav-side-entrance utsav-side-right";
    archRoot.appendChild(rightGate);
    root.appendChild(archRoot);

    function checkScroll() {
      if (window.scrollY > 25) archRoot.classList.add("utsav-scrolled");
      else archRoot.classList.remove("utsav-scrolled");
    }
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();

    function warmBulb(x: number, y: number, delay: string) {
      return `
        <g class="utsav-hit" transform="translate(${x},${y})">
          <circle class="utsav-bulb-glow" cx="0" cy="7" r="14" fill="#ffb700" fill-opacity="0.25" style="animation-delay:${delay}s"/>
          <circle class="utsav-bulb-glow" cx="0" cy="7" r="7.5" fill="#fde047" fill-opacity="0.45" style="animation-delay:${delay}s"/>
          <line x1="0" y1="-4" x2="0" y2="1" stroke="#b48a28" stroke-width="1"/>
          <rect x="-1.8" y="0" width="3.6" height="3" rx="0.8" fill="#5c4414"/>
          <ellipse cx="0" cy="6.5" rx="3" ry="4.4" fill="#fffbeb" stroke="#fbbf24" stroke-width="1"/>
        </g>
      `;
    }

    // Top scallop arch with glowing warm bulbs and golden beads
    function createTopScallopSVG(i: number) {
      const d1 = (i * 0.4).toFixed(1);
      const d2 = (i * 0.4 + 1.1).toFixed(1);
      return `
        <svg viewBox="0 0 240 58" preserveAspectRatio="none">
          <line x1="0" y1="1.5" x2="240" y2="1.5" stroke="#d4af37" stroke-width="1.6" stroke-opacity="0.9"/>
          <path d="M0,2 Q120,44 240,2" fill="none" stroke="#e0b840" stroke-width="1.2" stroke-opacity="0.75"/>
          <g fill="#ffd700" opacity="0.85">
            <circle cx="20" cy="8" r="2"/>
            <circle cx="40" cy="14" r="2.2"/>
            <circle cx="80" cy="22" r="2.2"/>
            <circle cx="100" cy="24" r="2.4"/>
            <circle cx="140" cy="24" r="2.4"/>
            <circle cx="160" cy="22" r="2.2"/>
            <circle cx="200" cy="14" r="2.2"/>
            <circle cx="220" cy="8" r="2"/>
          </g>
          ${warmBulb(60, 17, d1)}
          ${warmBulb(120, 26, d2)}
          ${warmBulb(180, 17, d1)}
        </svg>
      `;
    }

    // Side entrance with NO FLOWERS: Only golden beaded chains, ornate brass bell, and warm glowing diya/light!
    function createSideEntranceSVG(isRight: boolean) {
      const flip = isRight ? 'transform="scale(-1, 1) translate(-90, 0)"' : "";
      return `
        <svg viewBox="0 0 90 330" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldChain${isRight ? 'R' : 'L'}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
            <linearGradient id="bellGrad${isRight ? 'R' : 'L'}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fffbeb"/>
              <stop offset="35%" stop-color="#fde047"/>
              <stop offset="70%" stop-color="#d97706"/>
              <stop offset="100%" stop-color="#92400e"/>
            </linearGradient>
            <radialGradient id="bellGlow${isRight ? 'R' : 'L'}">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <g ${flip}>
            <!-- SECTION 1: Golden Beaded Chain with Hanging Bell (NO FLOWERS) -->
            <g class="utsav-hit">
              <!-- Main hanging chain -->
              <line x1="22" y1="0" x2="22" y2="240" stroke="url(#goldChain${isRight ? 'R' : 'L'})" stroke-width="1.8"/>
              
              <!-- Golden chain beads -->
              <g fill="#ffd700" stroke="#b45309" stroke-width="0.5">
                <circle cx="22" cy="18" r="2.8"/>
                <circle cx="22" cy="38" r="2.4"/>
                <circle cx="22" cy="58" r="3.2"/>
                <circle cx="22" cy="78" r="2.4"/>
                <circle cx="22" cy="98" r="2.8"/>
                <circle cx="22" cy="118" r="3.2"/>
                <circle cx="22" cy="138" r="2.4"/>
                <circle cx="22" cy="158" r="2.8"/>
                <circle cx="22" cy="178" r="3.2"/>
                <circle cx="22" cy="198" r="2.4"/>
                <circle cx="22" cy="218" r="2.8"/>
                <circle cx="22" cy="236" r="3.2"/>
              </g>

              <!-- Filigree diamond ornaments along chain -->
              <polygon points="22,66 26,72 22,78 18,72" fill="#fde047" stroke="#b45309" stroke-width="0.6"/>
              <polygon points="22,146 26,152 22,158 18,152" fill="#fde047" stroke="#b45309" stroke-width="0.6"/>

              <!-- Bell Top Loop -->
              <circle cx="22" cy="244" r="3.2" fill="none" stroke="#d4af37" stroke-width="1.6"/>
              <rect x="18" y="247" width="8" height="4" rx="1.5" fill="#b45309"/>

              <!-- The Brass Bell Body -->
              <circle cx="22" cy="265" r="16" fill="url(#bellGlow${isRight ? 'R' : 'L'})"/>
              <path d="M16,251 C16,247 28,247 28,251 L31,268 C33,275 35,278 11,278 C13,278 15,275 17,268 Z"
                    fill="url(#bellGrad${isRight ? 'R' : 'L'})" stroke="#78350f" stroke-width="1"/>
              
              <!-- Bell Rim & Lip -->
              <ellipse cx="22" cy="278" rx="12" ry="3.5" fill="#fde047" stroke="#78350f" stroke-width="0.8"/>
              <ellipse cx="22" cy="278" rx="9" ry="2" fill="#78350f" opacity="0.4"/>

              <!-- Bell Clapper -->
              <line x1="22" y1="278" x2="22" y2="286" stroke="#92400e" stroke-width="1.8"/>
              <circle cx="22" cy="287" r="3.2" fill="#fef08a" stroke="#b45309" stroke-width="0.8"/>
            </g>

            <!-- SECTION 2: Golden Chain with Hanging Diya / Light (NO FLOWERS) -->
            <g class="utsav-hit">
              <!-- Hanging chain for the light -->
              <line x1="58" y1="0" x2="58" y2="150" stroke="url(#goldChain${isRight ? 'R' : 'L'})" stroke-width="1.6" stroke-dasharray="6 3"/>

              <!-- Chain bead accents -->
              <g fill="#ffd700" stroke="#b45309" stroke-width="0.5">
                <circle cx="58" cy="25" r="2.4"/>
                <circle cx="58" cy="55" r="3"/>
                <circle cx="58" cy="85" r="2.4"/>
                <circle cx="58" cy="115" r="3"/>
                <circle cx="58" cy="142" r="2.6"/>
              </g>

              <!-- Diamond filigree accent -->
              <polygon points="58,68 62,74 58,80 54,74" fill="#fde047" stroke="#b45309" stroke-width="0.6"/>

              <!-- Light: Breathing Ambient Glow Halos -->
              <circle class="utsav-bulb-glow" cx="58" cy="176" r="36" fill="#ff9e00" fill-opacity="0.22"/>
              <circle class="utsav-bulb-glow" cx="58" cy="174" r="18" fill="#fde047" fill-opacity="0.38"/>

              <!-- Diya Hanger Frame -->
              <path d="M46,150 Q58,140 70,150 Z" fill="#d97706" stroke="#fef08a" stroke-width="0.8"/>
              <line x1="49" y1="150" x2="44" y2="180" stroke="#d4af37" stroke-width="1.1"/>
              <line x1="67" y1="150" x2="72" y2="180" stroke="#d4af37" stroke-width="1.1"/>

              <!-- Light: Animated Flickering Flame -->
              <g class="utsav-lamp-flame">
                <path d="M58,155 C53,164 54,172 58,176 C62,172 63,164 58,155 Z" fill="#ff5a00"/>
                <path d="M58,159 C55,165 55.5,171 58,175 C60.5,171 61,165 58,159 Z" fill="#fde047"/>
                <circle cx="58,172" r="2" fill="#ffffff"/>
              </g>

              <!-- Diya Bowl -->
              <path d="M40,178 Q58,196 76,178 L72,176 Q58,182 44,176 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
              <path d="M51,187 L65,187 L62,192 L54,192 Z" fill="#b45309"/>

              <!-- Dangling Beads & Pendant at base of Light -->
              <line x1="52" y1="192" x2="52" y2="208" stroke="#d4af37" stroke-width="1"/>
              <line x1="58" y1="192" x2="58" y2="216" stroke="#d4af37" stroke-width="1.2"/>
              <line x1="64" y1="192" x2="64" y2="208" stroke="#d4af37" stroke-width="1"/>
              <circle cx="52" cy="210" r="2" fill="#fde047"/>
              <polygon points="58,213 54,220 58,227 62,220" fill="#fbbf24" stroke="#b45309" stroke-width="0.7"/>
              <circle cx="64" cy="210" r="2" fill="#fde047"/>
            </g>
          </g>
        </svg>
      `;
    }

    function buildArchScene() {
      const unitWidth = window.innerWidth < 640 ? 150 : 230;
      const count = Math.max(2, Math.ceil((window.innerWidth - 90) / unitWidth));
      topRow.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const scallop = document.createElement("div");
        scallop.className = "utsav-scallop";
        scallop.innerHTML = createTopScallopSVG(i);
        topRow.appendChild(scallop);
      }
      leftGate.innerHTML = createSideEntranceSVG(false);
      rightGate.innerHTML = createSideEntranceSVG(true);

      // Attach hover & click jolt events on the bells & lights
      [leftGate, rightGate].forEach((gate) => {
        const hits = gate.querySelectorAll(".utsav-hit");
        hits.forEach((node) => {
          node.addEventListener("pointerenter", () => {
            const rect = node.getBoundingClientRect();
            if (window.spawnHoverSpark) {
              window.spawnHoverSpark(rect.left + rect.width / 2, rect.top + rect.height / 2, "gold");
            }
            gate.classList.add("utsav-jolt");
            setTimeout(() => gate.classList.remove("utsav-jolt"), 320);
          });
          node.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            const rect = node.getBoundingClientRect();
            if (window.spawnHoverSpark) {
              window.spawnHoverSpark(rect.left + rect.width / 2, rect.top + rect.height / 2, "gold");
            }
            gate.classList.add("utsav-jolt");
            setTimeout(() => gate.classList.remove("utsav-jolt"), 340);
          });
        });
      });
    }
    buildArchScene();

    /* =========================================================
       4. CURSOR SPARKLER TRAIL
       ========================================================= */
    const sparkCanvas = document.createElement("canvas");
    sparkCanvas.id = "utsav-spark-canvas";
    sparkCanvas.setAttribute("aria-hidden", "true");
    root.appendChild(sparkCanvas);

    const sctx = sparkCanvas.getContext("2d")!;
    let sw = window.innerWidth;
    let sh = window.innerHeight;
    const sdpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeSparkCanvas() {
      sw = window.innerWidth;
      sh = window.innerHeight;
      sparkCanvas.width = sw * sdpr;
      sparkCanvas.height = sh * sdpr;
      sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    }
    resizeSparkCanvas();

    const particles: any[] = [];
    const MAX_PARTICLES = 70;
    const SPARKLE_COLORS = ["#fff3c4", "#fde68a", "#fbbf24", "#f59e0b"];
    let sparkRunning = false;

    function pushSpark(p: any) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push(p);
      if (!sparkRunning) {
        sparkRunning = true;
        requestAnimationFrame(sparkLoop);
      }
    }

    function spawnDot(x: number, y: number, speed: number) {
      const angle = Math.random() * Math.PI * 2;
      const s = (0.2 + Math.random() * 0.7) * speed;
      pushSpark({
        type: "dot",
        x,
        y,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s - 0.15,
        gravity: 0.015,
        drag: 0.95,
        alpha: 0.9,
        decay: 0.026 + Math.random() * 0.02,
        color: SPARKLE_COLORS[(Math.random() * SPARKLE_COLORS.length) | 0],
        size: 0.9 + Math.random() * 1.1,
      });
    }

    function spawnStar(x: number, y: number) {
      pushSpark({
        type: "star",
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: 0,
        vy: -0.12,
        alpha: 0.95,
        decay: 0.045,
        size: 3 + Math.random() * 2.5,
        color: "#fff7d6",
      });
    }

    function drawStar(x: number, y: number, s: number) {
      sctx.beginPath();
      sctx.moveTo(x, y - s);
      sctx.quadraticCurveTo(x, y, x + s, y);
      sctx.quadraticCurveTo(x, y, x, y + s);
      sctx.quadraticCurveTo(x, y, x - s, y);
      sctx.quadraticCurveTo(x, y, x, y - s);
      sctx.closePath();
      sctx.fill();
    }

    function sparkLoop() {
      sctx.clearRect(0, 0, sw, sh);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay !== undefined ? p.decay : 0.06;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === "star") {
          p.y += p.vy;
          sctx.save();
          sctx.globalAlpha = Math.max(0, p.alpha);
          sctx.fillStyle = p.color;
          sctx.shadowColor = "#fbbf24";
          sctx.shadowBlur = 6;
          drawStar(p.x, p.y, p.size * (0.6 + p.alpha * 0.4));
          sctx.restore();
          continue;
        }

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        sctx.save();
        sctx.globalAlpha = Math.max(0, p.alpha);
        sctx.fillStyle = p.color;
        sctx.shadowColor = "#f59e0b";
        sctx.shadowBlur = 5;
        sctx.beginPath();
        sctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();
      }

      if (particles.length) requestAnimationFrame(sparkLoop);
      else {
        sparkRunning = false;
        sctx.clearRect(0, 0, sw, sh);
      }
    }

    if (!reduce) {
      let lastX = 0, lastY = 0, lastSpawn = 0, tick = 0;
      window.addEventListener(
        "pointermove",
        (e) => {
          if (e.pointerType === "touch") return;
          const now = performance.now();
          const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
          if (dist > 6 && now - lastSpawn > 26) {
            spawnDot(e.clientX, e.clientY, 1.2);
            if (Math.random() < 0.5) spawnDot(e.clientX, e.clientY, 1.0);
            if (++tick % 5 === 0) spawnStar(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
            lastSpawn = now;
          }
        },
        { passive: true }
      );
    }

    /* =========================================================
       5. FULL FIREWORKS OVERLAY & GREETING
       ========================================================= */
    const fwOverlay = document.createElement("div");
    fwOverlay.className = "diwali-overlay";
    fwOverlay.id = "diwaliOverlay";
    fwOverlay.innerHTML = `
      <canvas id="cv" aria-hidden="true"></canvas>
      <div class="diwali-hello" id="hello">
        <h1 id="greetTitle">Happy Diwali</h1>
        <p id="greetSub">Wishing you a bright and joyful festival</p>
      </div>
    `;
    root.appendChild(fwOverlay);

    const cv = fwOverlay.querySelector("#cv") as HTMLCanvasElement;
    const hello = fwOverlay.querySelector("#hello") as HTMLDivElement;
    const c = cv.getContext("2d", { desynchronized: true })!;

    const CFG = {
      greeting: "Happy Diwali",
      greetingSub: "Wishing you a bright and joyful festival",
      duration: 400,
      slow: 0.55,
      show: 6000,
    };
    const MAXP = LITE ? 650 : 1200;
    let Q = 1, GLOW = true, ema = 0.016, fcount = 0;

    const PAL = [
      "#FFD700", "#FFC107", "#FFE27A", "#FFB300", "#FFCF40",
      "#FFFFFF", "#EEF3FB", "#D5DEEC", "#C0CCE0",
      "#FF3D8B", "#FF7A18", "#27E1FF", "#B050FF", "#7CFF4D", "#3D7BFF", "#FF3B3B", "#FF4FD8",
    ];
    const LV = 5, NB = PAL.length * LV, buckets = new Array(NB);

    function gold() { return (Math.random() * 5) | 0; }
    function silver() { return 5 + ((Math.random() * 4) | 0); }
    function multi() { return 9 + ((Math.random() * 8) | 0); }
    function pickColor() {
      const r = Math.random();
      return r < 0.42 ? gold() : r < 0.68 ? silver() : multi();
    }

    let N = 0;
    const X = new Float32Array(MAXP), Y = new Float32Array(MAXP),
      VX = new Float32Array(MAXP), VY = new Float32Array(MAXP),
      LF = new Float32Array(MAXP), MX = new Float32Array(MAXP),
      ST = new Float32Array(MAXP), CI = new Uint8Array(MAXP), FL = new Uint8Array(MAXP);

    function addParticle(x: number, y: number, vx: number, vy: number, max: number, ci: number, tw: boolean, split: boolean, st: number) {
      if (N >= ((MAXP * Q) | 0)) return;
      X[N] = x; Y[N] = y; VX[N] = vx; VY[N] = vy;
      LF[N] = 0; MX[N] = max; ST[N] = st || 0.06;
      CI[N] = ci; FL[N] = (tw ? 1 : 0) | (split ? 2 : 0);
      N++;
    }
    function countAdj(n: number) {
      return Math.max(3, Math.round(n * Q * (LITE ? 0.6 : 1)));
    }

    let W = 0, H = 0, sc = 1, raf = 0, t0: number | null = null, tl = 0, running = false;
    let phase = 0, ending = false, frameNo = 0;
    const flashes: any[] = [];
    const hist: any[] = [];
    let starPath: any = null;
    const rk = { x: 0, y: 0, ang: -1.5708 };
    let nextBoom = 0, boomN = 0, nextFountain = 0;

    const flashSpr = document.createElement("canvas");
    flashSpr.width = flashSpr.height = 128;
    (() => {
      const f = flashSpr.getContext("2d")!;
      const g = f.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "#fff6dc");
      g.addColorStop(0.4, "rgba(255,210,120,.45)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      f.fillStyle = g;
      f.fillRect(0, 0, 128, 128);
    })();

    const rocketSpr = document.createElement("canvas");
    rocketSpr.width = 80;
    rocketSpr.height = 210;
    (() => {
      const r = rocketSpr.getContext("2d")!, fl = 150;
      const g1 = r.createLinearGradient(0, 40, 0, 40 + fl);
      g1.addColorStop(0, "rgba(255,240,190,.95)");
      g1.addColorStop(0.15, "rgba(255,200,90,.6)");
      g1.addColorStop(0.5, "rgba(255,160,60,.18)");
      g1.addColorStop(1, "rgba(255,120,40,0)");
      r.fillStyle = g1;
      r.beginPath();
      r.moveTo(38, 40);
      r.quadraticCurveTo(40, 40 + fl * 1.3, 42, 40);
      r.fill();
      const gh = r.createRadialGradient(40, 40, 0, 40, 40, 38);
      gh.addColorStop(0, "rgba(255,255,255,1)");
      gh.addColorStop(0.2, "rgba(255,236,170,.9)");
      gh.addColorStop(0.5, "rgba(255,190,80,.4)");
      gh.addColorStop(1, "rgba(255,150,40,0)");
      r.fillStyle = gh;
      r.beginPath();
      r.arc(40, 40, 38, 0, 6.283);
      r.fill();
      r.fillStyle = "#fff";
      r.beginPath();
      r.arc(40, 40, 4, 0, 6.283);
      r.fill();
    })();

    function sizeFireworks() {
      const dp = Math.min(window.devicePixelRatio || 1, LITE ? 1 : 1.5);
      W = cv.clientWidth || innerWidth;
      H = cv.clientHeight || innerHeight;
      cv.width = Math.round(W * dp);
      cv.height = Math.round(H * dp);
      c.setTransform(dp, 0, 0, dp, 0, 0);
      sc = Math.max(0.7, Math.min(1.4, Math.min(W, H) / 720));
      starPath = new Path2D();
      const n = LITE ? 60 : 120;
      for (let i = 0; i < n; i++) {
        const r = 0.8 + Math.random() * 1.2;
        starPath.rect(Math.random() * W, Math.random() * H * 0.85, r, r);
      }
    }

    function rocketPath(p: number) {
      const s = Math.sin((p * Math.PI) / 2);
      const y0 = H + 140;
      const y1 = H * 0.65;
      return {
        x: W / 2 + Math.sin(s * 3.4) * Math.min(W, H) * 0.05 * s,
        y: y0 - (y0 - y1) * s,
      };
    }

    function shell(x: number, y: number, power: number, count: number) {
      const theme = Math.random();
      for (let i = 0; i < count; i++) {
        const a = Math.random() * 6.283;
        const sp = (30 + Math.pow(Math.random(), 0.7) * 190) * power;
        const ci =
          theme < 0.3
            ? gold()
            : theme < 0.5
            ? Math.random() < 0.6
              ? silver()
              : gold()
            : pickColor();
        addParticle(
          x,
          y,
          Math.cos(a) * sp,
          Math.sin(a) * sp,
          2.2 + Math.random() * 1.4,
          ci,
          Math.random() < 0.6,
          i % 5 === 0,
          0.05 + Math.random() * 0.05
        );
      }
    }

    function boom(x: number, y: number, s: number, big: boolean) {
      shell(x, y, s, countAdj(big ? 90 : 45));
      if (big) flashes.push({ x, y, t: 0 });
    }

    function fountain(x: number, s: number) {
      const n = countAdj(60);
      for (let i = 0; i < n; i++) {
        const a = -1.5708 + (Math.random() - 0.5) * 0.9;
        const sp = (260 + Math.random() * 270) * s;
        const ci = Math.random() < 0.55 ? gold() : Math.random() < 0.5 ? silver() : multi();
        addParticle(
          x,
          H + 4,
          Math.cos(a) * sp,
          Math.sin(a) * sp,
          1.4 + Math.random() * 1.2,
          ci,
          true,
          i % 3 === 0,
          0.06
        );
      }
    }

    function burst(x: number, y: number) {
      let n = countAdj(120);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 6.283;
        const sp = 90 + Math.random() * 130;
        addParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 3 + Math.random() * 1.2, gold(), false, i % 3 === 0, 0.07);
      }
      n = countAdj(80);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283;
        const sp = 30 + Math.random() * 120;
        addParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 2.8 + Math.random() * 1.2, silver(), true, i % 4 === 0, 0.06);
      }
      n = countAdj(80);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283;
        const sp = 60 + Math.random() * 230;
        addParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 3 + Math.random() * 1.2, multi(), true, i % 5 === 0, 0.06);
      }
      flashes.push({ x, y, t: 0 });

      const topPx = Math.max(H * 0.14, Math.min(y - H * 0.28, H * 0.38));
      hello.style.top = topPx + "px";
      hello.classList.add("show");
      scheduleHide();
    }

    function scheduleHide() {
      setTimeout(() => {
        ending = true;
        hello.classList.remove("show");
        setTimeout(() => {
          fwOverlay.classList.add("is-hiding");
          setTimeout(finishFireworks, 1300);
        }, 1000);
      }, CFG.show);
    }

    function finishFireworks() {
      running = false;
      cancelAnimationFrame(raf);
      N = 0;
      fwOverlay.style.display = "none";
      cv.width = cv.height = 0;
    }

    /* Interactive hover spark / mini firecracker */
    window.spawnHoverSpark = (x: number, y: number, theme: string) => {
      if (reduce) return;
      if (!running) {
        running = true;
        fwOverlay.style.display = "block";
        fwOverlay.classList.remove("is-hiding");
        if (t0 === null) {
          t0 = performance.now();
          tl = t0;
        }
        sizeFireworks();
        raf = requestAnimationFrame(fireworksFrame);
      }
      const n = LITE ? 6 : 11;
      const off = Math.random() * 6.2832;
      for (let i = 0; i < n; i++) {
        const a = off + i * (6.2832 / n) + (Math.random() - 0.5) * 0.4;
        const sp = (30 + Math.random() * 70) * sc;
        addParticle(
          x,
          y,
          Math.cos(a) * sp,
          Math.sin(a) * sp,
          0.45 + Math.random() * 0.45,
          gold(),
          true,
          false,
          0.04 + Math.random() * 0.03
        );
      }
    };

    function fireworksFrame(ts: number) {
      if (!running) return;
      if (t0 === null) {
        t0 = ts;
        tl = ts;
      }
      const real = Math.min((ts - tl) / 1000, 0.05);
      const dt = real * CFG.slow;
      const el = ts - t0;
      tl = ts;
      frameNo++;

      if (++fcount > 20) {
        ema = ema * 0.92 + real * 0.08;
        if (ema > 0.024 && Q > 0.3) Q *= 0.985;
        else if (ema < 0.0185 && Q < 1) Q = Math.min(1, Q * 1.004);
        GLOW = Q > 0.55;
      }

      const p = Math.min(el / CFG.duration, 1);
      if (phase === 0) {
        const rp = rocketPath(p);
        const pv = rocketPath(Math.max(0, p - 0.03));
        rk.x = rp.x;
        rk.y = rp.y;
        const dx = rk.x - pv.x, dy = rk.y - pv.y;
        rk.ang = dx || dy ? Math.atan2(dy, dx) : -Math.PI / 2;
        hist.push({ x: rk.x, y: rk.y, t: ts });

        for (let i = 0; i < 3; i++) {
          const na = rk.ang + Math.PI + (Math.random() - 0.5);
          const nsp = 20 + Math.random() * 90;
          addParticle(
            rk.x,
            rk.y,
            Math.cos(na) * nsp,
            Math.sin(na) * nsp,
            0.6 + Math.random() * 0.5,
            Math.random() < 0.6 ? gold() : silver(),
            true,
            false,
            0.03
          );
        }

        if (ts >= nextBoom) {
          const big = Math.random() < 0.4;
          const zx = boomN++ % 2 ? 0.62 + Math.random() * 0.3 : 0.06 + Math.random() * 0.3;
          boom(W * zx, H * (0.1 + Math.random() * 0.38), big ? 1.1 : 0.6, big);
          fountain(W * (0.1 + Math.random() * 0.8), 1);
          nextBoom = ts + (650 - p * 250) * (0.7 + Math.random() * 0.6);
        }
        if (ts >= nextFountain) {
          fountain(W * (0.05 + Math.random() * 0.9), 0.5 + Math.random() * 0.5);
          nextFountain = ts + 260 + Math.random() * 350;
        }
        if (p >= 1) {
          phase = 1;
          burst(rk.x, rk.y);
          boom(W * 0.18, H * 0.22, 1.05, true);
          boom(W * 0.82, H * 0.22, 1.05, true);
          boom(W * 0.5, H * 0.16, 0.9, true);
          fountain(W * 0.15, 1.2);
          fountain(W * 0.5, 1.2);
          fountain(W * 0.85, 1.2);
          nextBoom = ts + 1000;
          nextFountain = ts + 800;
        }
      } else if (!ending) {
        if (ts >= nextBoom) {
          boom(W * (0.08 + Math.random() * 0.84), H * (0.1 + Math.random() * 0.36), 0.7 + Math.random() * 0.5, Math.random() < 0.4);
          nextBoom = ts + 900 + Math.random() * 900;
        }
        if (ts >= nextFountain) {
          fountain(W * (0.05 + Math.random() * 0.9), 0.5 + Math.random() * 0.6);
          nextFountain = ts + 700 + Math.random() * 600;
        }
      }

      while (hist.length && ts - hist[0].t > 650) hist.shift();

      const k = Math.pow(0.38, dt);
      for (let i = N - 1; i >= 0; i--) {
        LF[i] += dt;
        if (LF[i] >= MX[i]) {
          N--;
          if (i !== N) {
            X[i] = X[N]; Y[i] = Y[N]; VX[i] = VX[N]; VY[i] = VY[N];
            LF[i] = LF[N]; MX[i] = MX[N]; ST[i] = ST[N]; CI[i] = CI[N]; FL[i] = FL[N];
          }
          continue;
        }
        if ((FL[i] & 2) && !(FL[i] & 4) && LF[i] > MX[i] * 0.7) {
          FL[i] |= 4;
          for (let j = 0; j < 2; j++) {
            const aa = Math.random() * 6.283;
            addParticle(X[i], Y[i], Math.cos(aa) * 30, Math.sin(aa) * 30, 0.7, Math.random() < 0.5 ? 2 : 5, true, false, 0.05);
          }
        }
        VX[i] *= k;
        VY[i] = VY[i] * k + 14 * dt;
        X[i] += VX[i] * dt;
        Y[i] += VY[i] * dt;
      }
      for (let i = flashes.length - 1; i >= 0; i--) {
        flashes[i].t += real;
        if (flashes[i].t > 0.9) flashes.splice(i, 1);
      }

      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 1;
      c.clearRect(0, 0, W, H);
      if (starPath) {
        c.globalAlpha = 0.35 + 0.25 * Math.sin(ts / 700);
        c.fillStyle = "#fff1cc";
        c.fill(starPath);
      }

      c.globalCompositeOperation = "lighter";
      c.lineCap = "round";

      for (let i = 0; i < flashes.length; i++) {
        const f = flashes[i];
        c.globalAlpha = 0.5 * (1 - f.t / 0.9);
        c.drawImage(flashSpr, f.x - 280 * sc, f.y - 280 * sc, 560 * sc, 560 * sc);
      }
      if (hist.length > 1) {
        c.globalAlpha = 0.5;
        c.strokeStyle = "#ffe6a0";
        c.lineWidth = 2.4 * sc;
        c.beginPath();
        c.moveTo(hist[0].x, hist[0].y);
        for (let i = 1; i < hist.length; i++) c.lineTo(hist[i].x, hist[i].y);
        c.stroke();
      }

      for (let b = 0; b < NB; b++) buckets[b] = null;
      for (let i = 0; i < N; i++) {
        let fade = 1 - LF[i] / MX[i];
        if ((FL[i] & 1) && ((frameNo + i) & 3) === 0) fade *= 0.45;
        let lvl = (fade * LV) | 0;
        if (lvl >= LV) lvl = LV - 1;
        const b = CI[i] * LV + lvl;
        const pth = buckets[b] || (buckets[b] = new Path2D());
        pth.moveTo(X[i] - VX[i] * ST[i], Y[i] - VY[i] * ST[i]);
        pth.lineTo(X[i], Y[i]);
      }
      for (let pass = GLOW ? 0 : 1; pass < 2; pass++) {
        c.lineWidth = (pass ? 1.7 : 5) * sc;
        for (let b = 0; b < NB; b++) {
          const pp = buckets[b];
          if (!pp) continue;
          c.strokeStyle = PAL[(b / LV) | 0];
          c.globalAlpha = (((b % LV) + 0.7) / LV) * (pass ? 1 : 0.22);
          c.stroke(pp);
        }
      }

      if (phase === 0) {
        const kk = Math.max(0.5, Math.min(0.8, sc * 0.7));
        c.globalAlpha = 1;
        c.save();
        c.translate(rk.x, rk.y);
        c.rotate(rk.ang + Math.PI / 2);
        c.scale(kk, kk);
        c.drawImage(rocketSpr, -40, -40);
        c.restore();
      }
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";

      if (N === 0 && !flashes.length && ending) {
        finishFireworks();
      } else {
        raf = requestAnimationFrame(fireworksFrame);
      }
    }

    function startFireworks() {
      N = 0;
      flashes.length = 0;
      hist.length = 0;
      phase = 0;
      t0 = null;
      nextBoom = 0;
      boomN = 0;
      nextFountain = 0;
      ending = false;
      hello.classList.remove("show");
      if (reduce) {
        hello.classList.add("show");
        scheduleHide();
        return;
      }
      sizeFireworks();
      const rp = rocketPath(0);
      rk.x = rp.x;
      rk.y = rp.y;
      running = true;
      raf = requestAnimationFrame(fireworksFrame);
    }

    let resizeTimer: any;
    const onResize = () => {
      resizeSparkCanvas();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildArchScene();
        if (running) sizeFireworks();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    // Launch opening celebration after a slight delay
    const startTimer = setTimeout(startFireworks, 400);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      if (root) root.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} id="diwali-celebration-container" aria-hidden="true" />;
}
