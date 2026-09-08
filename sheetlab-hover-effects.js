/*
 * Melbourne Lending System - SheetLab-style Hover Effects
 * Drop this file into the same folder as index.html and load it once:
 * <script src="sheetlab-hover-effects.js"></script>
 *
 * This file is intentionally dependency-free so it works on GitHub Pages.
 */
(function () {
  'use strict';

  const STYLE_ID = 'melbourne-lending-hover-effects';
  const TOOLTIP_ID = 'melbourne-hover-tooltip';

  const css = `
    /* Sidebar navigation */
    .mls-hover-nav {
      position: relative !important;
      transition: background .18s ease, color .18s ease, transform .18s ease,
                  box-shadow .18s ease, border-color .18s ease !important;
      will-change: transform;
    }
    .mls-hover-nav:hover,
    .mls-hover-nav.mls-hover-focus {
      transform: translateX(3px) !important;
      background: rgba(16,185,129,.16) !important;
      color: #ecfdf5 !important;
      box-shadow: inset 3px 0 0 #10b981, 0 8px 18px rgba(0,0,0,.12) !important;
    }
    .mls-hover-nav:hover svg,
    .mls-hover-nav.mls-hover-focus svg {
      transform: scale(1.08);
      filter: drop-shadow(0 0 7px rgba(16,185,129,.42));
    }
    .mls-hover-nav svg {
      transition: transform .18s ease, filter .18s ease;
    }

    /* Dashboard / metric cards */
    .mls-hover-card {
      position: relative !important;
      transition: transform .2s cubic-bezier(.2,.8,.2,1),
                  box-shadow .2s ease, filter .2s ease !important;
      will-change: transform;
    }
    .mls-hover-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
      transition: opacity .2s ease;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.10),
                  0 18px 40px rgba(0,0,0,.16);
    }
    .mls-hover-card:hover {
      transform: translateY(-5px) scale(1.008) !important;
      filter: brightness(1.035) saturate(1.04) !important;
      z-index: 4;
    }
    .mls-hover-card:hover::after { opacity: 1; }

    /* Buttons / action controls */
    .mls-hover-button {
      transition: transform .15s ease, box-shadow .15s ease,
                  filter .15s ease, background .15s ease !important;
    }
    .mls-hover-button:hover {
      transform: translateY(-2px) !important;
      filter: brightness(1.05) !important;
      box-shadow: 0 8px 18px rgba(0,0,0,.18) !important;
    }
    .mls-hover-button:active {
      transform: translateY(0) scale(.985) !important;
    }

    /* Tables / collection rows */
    .mls-hover-row {
      transition: background .14s ease, transform .14s ease, box-shadow .14s ease !important;
    }
    .mls-hover-row:hover {
      background: rgba(255,255,255,.035) !important;
      box-shadow: inset 3px 0 0 rgba(16,185,129,.72);
    }

    /* Icon-only controls */
    .mls-hover-icon {
      transition: transform .15s ease, opacity .15s ease, filter .15s ease !important;
    }
    .mls-hover-icon:hover {
      transform: translateY(-1px) scale(1.06) !important;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,.24));
    }

    /* Floating tooltip */
    #${TOOLTIP_ID} {
      position: fixed;
      z-index: 2147483647;
      max-width: 260px;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 9px;
      background: rgba(8,15,31,.97);
      color: #f8fafc;
      font: 500 12px/1.35 Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      box-shadow: 0 10px 28px rgba(0,0,0,.35);
      pointer-events: none;
      opacity: 0;
      transform: translateY(3px);
      transition: opacity .12s ease, transform .12s ease;
      white-space: normal;
    }
    #${TOOLTIP_ID}.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Respect reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .mls-hover-nav,
      .mls-hover-card,
      .mls-hover-button,
      .mls-hover-row,
      .mls-hover-icon,
      #${TOOLTIP_ID} { transition: none !important; }
    }
  `;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function makeTooltip() {
    let tip = document.getElementById(TOOLTIP_ID);
    if (tip) return tip;
    tip = document.createElement('div');
    tip.id = TOOLTIP_ID;
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
    return tip;
  }

  function getLabel(el) {
    const explicit = el.getAttribute('data-hover-tip') || el.getAttribute('aria-label') || el.title;
    if (explicit) return explicit;
    const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (text && text.length <= 70) return text;
    return '';
  }

  function positionTooltip(el, tip) {
    const r = el.getBoundingClientRect();
    const gap = 9;
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.classList.add('is-visible');

    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    let left = r.left + (r.width - tw) / 2;
    let top = r.top - th - gap;

    if (top < 8) top = r.bottom + gap;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - th - 8));

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function enableTooltip(el) {
    const label = getLabel(el);
    if (!label) return;
    const tip = makeTooltip();

    const show = () => {
      tip.textContent = label;
      positionTooltip(el, tip);
    };
    const hide = () => tip.classList.remove('is-visible');

    el.addEventListener('mouseenter', show, { passive: true });
    el.addEventListener('mouseleave', hide, { passive: true });
    el.addEventListener('focus', show, { passive: true });
    el.addEventListener('blur', hide, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', () => {
      if (tip.classList.contains('is-visible')) positionTooltip(el, tip);
    }, { passive: true });
  }

  function mark(selector, className) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(className);
    });
  }

  function isNavElement(el) {
    if (!(el instanceof HTMLElement)) return false;
    const txt = (el.innerText || '').trim().toLowerCase();
    const hasIcon = !!el.querySelector('svg, i, [class*="icon"]');
    const navWords = /(dashboard|borrowers|active loans|overdue|capital|expenses|settings|instructions|reports|payments|calculator|collect)/i;
    return (el.tagName === 'A' || el.tagName === 'BUTTON' || el.hasAttribute('role') && el.getAttribute('role') === 'button')
      && (hasIcon || navWords.test(txt));
  }

  function markSidebar() {
    // Prefer common sidebar containers. Fall back to the first navigation area.
    const candidates = Array.from(document.querySelectorAll('nav a, nav button, aside a, aside button, [role="navigation"] a, [role="navigation"] button'));
    candidates.forEach(el => el.classList.add('mls-hover-nav'));

    // Also cover sidebar links rendered without a <nav> element.
    if (!candidates.length) {
      document.querySelectorAll('a, button').forEach(el => {
        if (isNavElement(el)) {
          const rect = el.getBoundingClientRect();
          if (rect.left < window.innerWidth * 0.22) el.classList.add('mls-hover-nav');
        }
      });
    }
  }

  function enhance() {
    injectStyle();
    makeTooltip();
    markSidebar();

    // Cards: broad enough for common React/Tailwind-style layouts.
    document.querySelectorAll('[class*="card"], [class*="Card"], article').forEach(el => {
      if (el.offsetWidth > 160 && el.offsetHeight > 70) el.classList.add('mls-hover-card');
    });

    // Buttons / action pills.
    document.querySelectorAll('button, [role="button"], a').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width >= 48 && r.height >= 28 && r.height <= 80) el.classList.add('mls-hover-button');
      if (r.width <= 60 && r.height <= 60) el.classList.add('mls-hover-icon');
    });

    // Table rows, but not header rows.
    document.querySelectorAll('tbody tr, [role="row"]').forEach(row => {
      const txt = (row.innerText || '').trim();
      if (txt) row.classList.add('mls-hover-row');
    });

    // Only use a tooltip when an explicit title/aria-label/data-hover-tip exists.
    document.querySelectorAll('[data-hover-tip], [aria-label], [title]').forEach(enableTooltip);
  }

  // Re-run after React/Vue/vanilla DOM changes without polling aggressively.
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhance();
    });
  });

  function init() {
    enhance();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
