/* ============================================
   tamir.info - Shared JS (Dock, Theme, Animations)
   ============================================ */

// --- Theme Toggle ---
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
    this.updateIcon(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  updateIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const sunIcon = btn.querySelector('.icon-sun');
    const moonIcon = btn.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
      moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    }
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
  theme: `<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none" aria-hidden="true">
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
  </svg>`,
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

  // ThemeManager.init() runs before the dock exists, so the toggle ships with
  // the dark-mode icon baked in. Sync it now that the button is in the DOM.
  ThemeManager.updateIcon(document.documentElement.getAttribute('data-theme') || 'dark');

  // Theme toggle click
  document.getElementById('theme-toggle').addEventListener('click', () => {
    ThemeManager.toggle();
  });

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
  document.querySelectorAll('.accordion-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = row.getAttribute('aria-expanded') === 'true';
      const contentId = row.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      if (!content) return;

      if (expanded) {
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
