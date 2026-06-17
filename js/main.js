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
function createDock(activePage) {
  const dockWrapper = document.createElement('div');
  dockWrapper.className = 'dock-wrapper';
  dockWrapper.innerHTML = `
    <nav class="dock-nav" aria-label="Main navigation">
      <a href="/" class="dock-item ${activePage === 'home' ? 'active' : ''}" aria-label="Home">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        ${activePage === 'home' ? '<div class="active-dot"></div>' : ''}
      </a>
      <a href="/writing.html" class="dock-item ${activePage === 'writing' ? 'active' : ''}" aria-label="Writing">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        ${activePage === 'writing' ? '<div class="active-dot"></div>' : ''}
      </a>
      <button class="dock-item" id="theme-toggle" aria-label="Toggle theme">
        <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
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
        <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </nav>
  `;

  document.body.appendChild(dockWrapper);

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
