/* ============================================
   tamir.info - Shared JS (Dock, Theme, Animations)
   ============================================ */

// --- Theme Toggle ---
// Switching themes plays a soft-edged circle out from the toggle, revealing the
// incoming theme over the outgoing one. It's a View Transition: the browser
// snapshots the page before and after, and we animate a mask across the "after"
// snapshot while the "before" one holds still underneath.
const WIPE_MS = 800;

// easeOutQuad, exactly -- a cubic Bezier with these control points reduces to
// y = 1-(1-t)^2. Worth being precise about: --ease-out is far more aggressive
// (~35% travelled by t=0.05) and collapses the whole wipe into a few frames.
const WIPE_EASE = 'cubic-bezier(0.333, 0.667, 0.667, 1)';

// Final mask size, as a multiple of the distance from the button to the
// furthest viewport corner. Most of this is deliberate overshoot: the mask's
// circle is a quarter of the image width and heavily blurred, so scaling it
// well past the viewport is what buys a wide, soft front instead of a hard
// expanding disc. Measuring the corner (rather than using a flat multiple of
// the viewport) keeps the pacing the same on any screen size.
const WIPE_SCALE = 9.5;

// Blurred circle: r=33 with a 5-unit Gaussian inside a 132-unit viewBox, so the
// blur has room to fall off without being clipped. Single-quoted internally so
// it can sit inside a double-quoted url(), and '#' escaped for the data URI.
const WIPE_MASK =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-66 -66 132 132'>" +
  "<defs><filter id='b'><feGaussianBlur stdDeviation='5'/></filter></defs>" +
  "<circle r='33' fill='black' filter='url(%23b)'/></svg>";

function wipeSize(cx, cy) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const maxDist = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(w - cx, cy),
    Math.hypot(cx, h - cy),
    Math.hypot(w - cx, h - cy)
  );
  return maxDist * WIPE_SCALE;
}

// The keyframes depend on where the button is, so the rule is built per click
// and torn down when the transition ends.
function injectWipeStyles(originEl) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const span = wipeSize(cx, cy);

  const style = document.createElement('style');
  style.textContent = `
    ::view-transition-group(root) { animation-duration: ${WIPE_MS}ms; }

    /* The outgoing theme holds still underneath rather than cross-fading.
       That's what makes this read as a reveal instead of a dissolve. */
    ::view-transition-old(root) { animation: none; z-index: -1; }

    ::view-transition-new(root) {
      animation: theme-wipe ${WIPE_MS}ms ${WIPE_EASE} forwards;
      mask: url("${WIPE_MASK}") 0 0 / 100% 100% no-repeat;
    }

    @keyframes theme-wipe {
      from { mask-position: ${cx}px ${cy}px; mask-size: 0; }
      to   { mask-position: ${cx - span / 2}px ${cy - span / 2}px; mask-size: ${span}px; }
    }
  `;
  document.head.appendChild(style);
  return style;
}

// The wipe currently on screen, if any, and when the theme last flipped.
let activeWipe = null;
let lastToggleAt = -Infinity;

const ThemeManager = {
  init() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'dark'); // default dark
    this.set(theme, false);
  },

  set(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) localStorage.setItem('theme', theme);
  },

  // originEl is the element the wipe radiates from. Without it, or without
  // View Transition support, or when the visitor has asked for less motion,
  // this falls back to the plain instant swap.
  toggle(originEl) {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Clicking faster than the wipe can run. Starting a second transition here
    // would snapshot the half-finished frame and re-grow from the button, so
    // the screen lurches back towards the old theme before moving forward
    // again. Cut the wipe and swap outright instead.
    //
    // The elapsed-time half of this matters as much as the in-flight half:
    // with only the in-flight check, every other click would start a wipe that
    // gets cut a moment later, and a burst becomes a stutter of half-bloomed
    // circles. Animation returns once the clicking stops.
    const now = performance.now();
    const outrunning = activeWipe !== null || now - lastToggleAt < WIPE_MS;
    lastToggleAt = now;

    if (outrunning) {
      if (activeWipe) activeWipe.transition.skipTransition();
      this.set(next);
      return;
    }

    if (!originEl || reduced || !document.startViewTransition) {
      this.set(next);
      return;
    }

    const style = injectWipeStyles(originEl);
    const transition = document.startViewTransition(() => this.set(next));
    const wipe = { transition, style };
    activeWipe = wipe;

    // Both promises reject if the transition is skipped or the browser
    // abandons it (it will, for one, if the DOM update takes too long).
    // Nothing is waiting on the outcome, but an unhandled rejection would
    // still surface in the console, so settle them explicitly and clean up
    // either way.
    const cleanup = () => {
      style.remove();
      if (activeWipe === wipe) activeWipe = null;
    };
    transition.ready.catch(() => {});
    transition.finished.then(cleanup, cleanup);
  }
};

// --- Floating Dock Navigation ---
// The dock is the site's only navigation: internal pages, external profiles and
// the theme toggle, grouped by dividers. Labels live in hover/focus tooltips.
const DOCK_ICONS = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>`,
  writing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`,
  // Both icons are always present and stacked; which one shows is decided by
  // [data-theme] in CSS, so it crossfades rather than hard-swapping. The
  // wrapper is what the view transition rotates -- it has to hold the icons
  // and nothing else, or the tooltip inside the button spins along with them.
  theme: `<span class="theme-icons">
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </span>`,
};

const DOCK_ITEMS = [
  { id: 'home', label: 'Home', href: '/', page: 'home' },
  { id: 'writing', label: 'Writing', href: '/writing.html', page: 'writing' },
  { divider: true },
  { id: 'github', label: 'GitHub', href: 'https://github.com/tamirkifle', external: true },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/tamir-yirga', external: true },
  { divider: true },
  { id: 'theme', label: 'Theme', button: true },
];

function createDock(activePage) {
  const dockWrapper = document.createElement('div');
  dockWrapper.className = 'dock-wrapper';

  const items = DOCK_ITEMS.map((item) => {
    if (item.divider) return '<span class="dock-divider" aria-hidden="true"></span>';

    const active = item.page && item.page === activePage;
    const inner = `
        ${DOCK_ICONS[item.id]}
        <span class="dock-tooltip" aria-hidden="true">${item.label}</span>
        ${active ? '<span class="active-dot"></span>' : ''}`;

    if (item.button) {
      return `<button type="button" class="dock-item" id="theme-toggle" aria-label="Toggle theme">${inner}</button>`;
    }

    const target = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${item.href}" class="dock-item${active ? ' active' : ''}"${target}
        aria-label="${item.label}"${active ? ' aria-current="page"' : ''}>${inner}</a>`;
  }).join('\n      ');

  dockWrapper.innerHTML = `
    <nav class="dock-nav" aria-label="Main navigation">
      ${items}
    </nav>
  `;

  document.body.appendChild(dockWrapper);

  // Theme toggle click. The button doubles as the origin of the wipe.
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    ThemeManager.toggle(themeToggle);
  });

  // While a wipe is running, the browser has captured the whole page into a
  // snapshot and stopped painting the live DOM, so nothing inside it can be
  // hit-tested -- the click retargets to <html> and the button's own handler
  // never runs. The event still reaches the document with usable coordinates,
  // though, so match it against the button's box by hand. Keyboard activation
  // doesn't need this: it dispatches straight at the focused element.
  document.addEventListener('click', (event) => {
    if (!activeWipe) return;
    const r = themeToggle.getBoundingClientRect();
    const hit = event.clientX >= r.left && event.clientX <= r.right &&
                event.clientY >= r.top && event.clientY <= r.bottom;
    if (hit) ThemeManager.toggle(themeToggle);
  }, true);

  // Dock magnification effect
  initDockMagnification(dockWrapper.querySelector('.dock-nav'));
}

function initDockMagnification(nav) {
  const items = nav.querySelectorAll('.dock-item');
  const baseSize = 44;
  const maxSize = 56;
  const neighborSize = 50;
  const mobileBreakpoint = 640;

  nav.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= mobileBreakpoint) return;
    
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(e.clientX - itemCenterX);
      const maxDistance = 80;

      let scale;
      if (distance < maxDistance) {
        const ratio = 1 - distance / maxDistance;
        scale = baseSize + (maxSize - baseSize) * ratio * ratio;
      } else {
        scale = baseSize;
      }

      item.style.width = `${scale}px`;
      item.style.height = `${scale}px`;
      item.style.transition = 'width 150ms ease, height 150ms ease, background-color 150ms ease, color 150ms ease';
    });
  });

  nav.addEventListener('mouseleave', () => {
    items.forEach((item) => {
      item.style.width = '';
      item.style.height = '';
    });
  });
}

// --- Section Entrance Animations ---
function initScrollAnimations() {
  const sections = document.querySelectorAll('.animate-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use the data-delay attribute for staggered animations
          const delay = entry.target.dataset.delay || '0';
          entry.target.style.transitionDelay = `${delay}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

// --- Text Scramble Effect ---
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&*';
    this.frameRequest = null;
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20) + 10;
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char" style="color:var(--foreground-faded)">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

// Initialize scramble on elements with data-scramble attribute
function initTextScramble() {
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const text = el.textContent;
    const scramble = new TextScramble(el);

    // Observer to trigger on visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start with scrambled text
            el.textContent = text.replace(/./g, () =>
              scramble.chars[Math.floor(Math.random() * scramble.chars.length)]
            );
            // Then resolve to real text
            setTimeout(() => scramble.setText(text), 200);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
  });
}

// --- Accordion ---
function initAccordions() {
  // Panels marked data-open start open. They get no pinned height at all, so
  // lazy images growing the panel can't clip it.
  document.querySelectorAll('.accordion-row[data-open="true"]').forEach((row) => {
    const content = document.getElementById(row.getAttribute('aria-controls'));
    if (content) content.style.maxHeight = 'none';
  });

  document.querySelectorAll('.accordion-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = row.getAttribute('aria-expanded') === 'true';
      const contentId = row.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      if (!content) return;

      if (expanded) {
        // An unpinned panel has to be given its real height before it can
        // animate down from it.
        if (content.style.maxHeight === 'none') {
          content.style.maxHeight = content.scrollHeight + 'px';
          void content.offsetHeight;
        }
        row.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
        content.classList.remove('expanded');
      } else {
        row.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('expanded');
      }
    });
  });

  // maxHeight is pinned at open time, so text that rewraps on resize would
  // otherwise get clipped. Re-measure whatever is currently open.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.accordion-content.expanded').forEach((content) => {
        if (content.style.maxHeight === 'none') return;
        content.style.maxHeight = content.scrollHeight + 'px';
      });
    }, 120);
  });
}

// --- Utility: Format date ---
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// --- Utility: Read time ---
function calcReadTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// --- Global Init ---
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initScrollAnimations();
  initTextScramble();
  initAccordions();
});
