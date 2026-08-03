/* ============================================
   tamir.info - Home Page JS
   Featured posts + the Side Quest case-study showcase.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedPosts();
  initShowcase();
});

async function loadFeaturedPosts() {
  const container = document.getElementById('featured-writing');
  if (!container) return;

  try {
    const response = await fetch('posts/index.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const posts = (data.posts || []).filter(
      (post) => post.featured && post.public
    );

    if (posts.length === 0) {
      container.innerHTML =
        '<p style="color:var(--foreground-faded);font-size:0.8125rem;">No featured posts yet.</p>';
      return;
    }

    container.innerHTML = posts
      .map(
        (post) => `
        <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="featured-writing-card">
          <div class="card-title">${escapeHtml(post.title)}</div>
          <div class="card-summary">${escapeHtml(post.summary)}</div>
          <div class="card-meta">${formatDate(post.date)} · ${post.readTime} min read</div>
        </a>`
      )
      .join('');
  } catch (err) {
    console.error('Failed to load featured posts:', err);
    container.innerHTML =
      '<p style="color:var(--foreground-faded);font-size:0.8125rem;">Could not load posts.</p>';
  }
}

/** Simple HTML escape to prevent XSS in rendered post data. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   Side Quest showcase
   ------------------------------------------------------------
   Each tile opens a full case-study overlay: headline metrics,
   the story, a tabbed exhibit stage (charts, real terminal
   captures, screenshots, an interactive quorum simulator), and
   the engineering deep dive.
   ============================================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initShowcase() {
  const tiles = Array.from(document.querySelectorAll('.side-quest-item'));
  const projects = window.PROJECTS || [];
  if (!tiles.length || !projects.length) return;

  const showcase = new Showcase(tiles, projects);
  showcase.mount();
}

class Showcase {
  constructor(tiles, projects) {
    this.tiles = tiles;
    this.projects = projects;
    // Only tiles that have matching data participate.
    this.order = tiles
      .map((tile) => tile.dataset.slug)
      .filter((slug) => projects.some((p) => p.slug === slug));
    this.current = null;
    this.originTile = null;
    this.lastFocused = null;
    this.exhibitIndex = 0;
  }

  /* ---------- lifecycle ---------- */

  mount() {
    this.root = this.buildRoot();
    document.body.appendChild(this.root);

    this.dialog = this.root.querySelector('.pm-dialog');
    this.el = {
      icon: this.root.querySelector('.pm-head-icon'),
      eyebrow: this.root.querySelector('.pm-eyebrow'),
      title: this.root.querySelector('.pm-title'),
      tagline: this.root.querySelector('.pm-tagline'),
      status: this.root.querySelector('.pm-status'),
      body: this.root.querySelector('.pm-body'),
      stack: this.root.querySelector('.pm-stack'),
      metrics: this.root.querySelector('.pm-metrics'),
      story: this.root.querySelector('.pm-story'),
      exhibits: this.root.querySelector('.pm-exhibits'),
      tabs: this.root.querySelector('.pm-tabs'),
      stage: this.root.querySelector('.pm-stage'),
      caption: this.root.querySelector('.pm-stage-caption'),
      stageTitle: this.root.querySelector('.pm-stage-title'),
      deep: this.root.querySelector('.pm-deep'),
      note: this.root.querySelector('.pm-note'),
      links: this.root.querySelector('.pm-links'),
      counter: this.root.querySelector('.pm-counter'),
      prev: this.root.querySelector('.pm-prev'),
      next: this.root.querySelector('.pm-next'),
      zoom: this.root.querySelector('.pm-zoom'),
      zoomImg: this.root.querySelector('.pm-zoom img')
    };

    this.tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const slug = tile.dataset.slug;
        if (!slug) return;
        this.open(slug, tile);
      });
    });

    this.root.querySelectorAll('[data-close]').forEach((node) => {
      node.addEventListener('click', () => this.close());
    });
    this.el.prev.addEventListener('click', () => this.step(-1));
    this.el.next.addEventListener('click', () => this.step(1));
    this.el.zoom.addEventListener('click', () => this.closeZoom());

    document.addEventListener('keydown', (event) => this.onKeydown(event));
  }

  buildRoot() {
    const root = document.createElement('div');
    root.className = 'pm-overlay';
    root.id = 'project-modal';
    root.hidden = true;
    root.innerHTML = `
      <div class="pm-backdrop" data-close></div>
      <div class="pm-dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title" tabindex="-1">
        <header class="pm-head">
          <div class="pm-head-icon" aria-hidden="true"></div>
          <div class="pm-head-text">
            <div class="pm-eyebrow"></div>
            <h2 class="pm-title" id="pm-title"></h2>
          </div>
          <button type="button" class="pm-close" data-close aria-label="Close project details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </header>
        <div class="pm-body">
          <p class="pm-tagline"></p>
          <div class="pm-status"></div>
          <div class="pm-stack"></div>
          <div class="pm-metrics"></div>
          <div class="pm-story"></div>
          <section class="pm-exhibits" aria-label="Project exhibits">
            <div class="pm-section-label">Exhibits</div>
            <div class="pm-tabs" role="tablist"></div>
            <h3 class="pm-stage-title"></h3>
            <div class="pm-stage"></div>
            <p class="pm-stage-caption"></p>
          </section>
          <section class="pm-deep" aria-label="Engineering deep dive"></section>
          <div class="pm-note"></div>
        </div>
        <footer class="pm-foot">
          <div class="pm-links"></div>
          <div class="pm-nav">
            <button type="button" class="pm-nav-btn pm-prev" aria-label="Previous project">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="pm-counter"></span>
            <button type="button" class="pm-nav-btn pm-next" aria-label="Next project">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </footer>
      </div>
      <div class="pm-zoom" hidden><img alt=""></div>
    `;
    return root;
  }

  /* ---------- open / close ---------- */

  open(slug, tile) {
    const project = this.projects.find((p) => p.slug === slug);
    if (!project) return;

    const isFirstOpen = this.root.hidden;
    this.current = slug;
    this.originTile = tile || this.tileFor(slug);

    this.tiles.forEach((t) => {
      const active = t === this.originTile;
      t.classList.toggle('active', active);
      t.setAttribute('aria-expanded', String(active));
    });

    this.render(project);

    if (isFirstOpen) {
      this.lastFocused = document.activeElement;
      this.lockScroll();
      this.root.hidden = false;
      this.setOrigin(this.originTile);
      void this.root.offsetHeight;
      this.root.classList.add('open');
      this.dialog.focus({ preventScroll: true });
    } else {
      this.el.body.scrollTop = 0;
      this.dialog.classList.remove('pm-swap');
      void this.dialog.offsetHeight;
      this.dialog.classList.add('pm-swap');
    }
  }

  close() {
    if (this.root.hidden) return;
    this.closeZoom();
    this.setOrigin(this.originTile);
    this.root.classList.remove('open');

    const done = (event) => {
      if (event && event.target !== this.dialog) return;
      this.root.hidden = true;
      this.el.stage.innerHTML = '';
      this.dialog.removeEventListener('transitionend', done);
    };
    this.dialog.addEventListener('transitionend', done);
    if (REDUCED_MOTION) done();

    this.unlockScroll();
    this.tiles.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-expanded', 'false');
    });
    this.current = null;
    if (this.lastFocused && this.lastFocused.focus) {
      this.lastFocused.focus({ preventScroll: true });
    }
  }

  step(delta) {
    if (!this.current) return;
    const i = this.order.indexOf(this.current);
    const next = this.order[(i + delta + this.order.length) % this.order.length];
    this.open(next, this.tileFor(next));
  }

  tileFor(slug) {
    return this.tiles.find((t) => t.dataset.slug === slug) || null;
  }

  /** Anchor the dialog's grow/shrink transform on the tile that was clicked. */
  setOrigin(tile) {
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    this.dialog.style.setProperty('--pm-from-x', `${cx - window.innerWidth / 2}px`);
    this.dialog.style.setProperty('--pm-from-y', `${cy - window.innerHeight / 2}px`);
  }

  lockScroll() {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    this.scrollY = window.scrollY;
    document.body.style.paddingRight = gap > 0 ? `${gap}px` : '';
    document.body.classList.add('pm-locked');
  }

  unlockScroll() {
    document.body.classList.remove('pm-locked');
    document.body.style.paddingRight = '';
  }

  onKeydown(event) {
    if (this.root.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      if (!this.el.zoom.hidden) this.closeZoom();
      else this.close();
      return;
    }
    if (!this.el.zoom.hidden) return;

    if (event.key === 'ArrowRight' && !this.isTabFocus(event.target)) {
      this.step(1);
    } else if (event.key === 'ArrowLeft' && !this.isTabFocus(event.target)) {
      this.step(-1);
    } else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  isTabFocus(target) {
    return target && target.closest && target.closest('.pm-tabs');
  }

  trapFocus(event) {
    const focusables = this.dialog.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------- rendering ---------- */

  render(project) {
    const tile = this.tileFor(project.slug);
    const tileIcon = tile && tile.querySelector('.side-quest-icon');
    this.el.icon.style.backgroundImage = tileIcon ? tileIcon.style.backgroundImage : '';

    this.el.eyebrow.textContent = project.eyebrow || 'Side quest';
    this.el.title.textContent = project.name;
    this.el.tagline.textContent = project.tagline || '';

    if (project.status) {
      this.el.status.innerHTML = `<span class="pm-badge pm-badge--${project.status.tone || 'active'}"><span class="pm-badge-dot"></span>${escapeHtml(project.status.label)}</span>`;
    } else {
      this.el.status.innerHTML = '';
    }

    this.el.stack.innerHTML = (project.stack || [])
      .map((tech) => `<span class="pm-chip">${escapeHtml(tech)}</span>`)
      .join('');

    this.renderMetrics(project);
    this.renderStory(project);
    this.renderExhibits(project);
    this.renderDeepDive(project);

    this.el.note.innerHTML = project.note
      ? `<span class="pm-note-tag">Where it stands</span><p>${project.note}</p>`
      : '';
    this.el.note.hidden = !project.note;

    this.el.links.innerHTML = (project.links || [])
      .map((link) => {
        const external = /^https?:/.test(link.href);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a class="pm-link${link.primary ? ' pm-link--primary' : ''}" href="${escapeHtml(link.href)}"${attrs}>${escapeHtml(link.label)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>`;
      })
      .join('');

    const i = this.order.indexOf(project.slug);
    this.el.counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(this.order.length).padStart(2, '0')}`;
    this.el.body.scrollTop = 0;
  }

  renderMetrics(project) {
    const metrics = project.metrics || [];
    this.el.metrics.hidden = !metrics.length;
    this.el.metrics.innerHTML = metrics
      .map(
        (m) => `
        <div class="pm-metric">
          <div class="pm-metric-value">${escapeHtml(m.value)}<span class="pm-metric-unit">${escapeHtml(m.unit || '')}</span></div>
          <div class="pm-metric-label">${escapeHtml(m.label)}</div>
          ${m.note ? `<div class="pm-metric-note">${escapeHtml(m.note)}</div>` : ''}
        </div>`
      )
      .join('');
  }

  renderStory(project) {
    if (project.story && project.story.length) {
      this.el.story.innerHTML = project.story
        .map(
          (block) => `
          <div class="pm-story-block">
            <div class="pm-story-heading">${escapeHtml(block.heading)}</div>
            <p>${block.body}</p>
          </div>`
        )
        .join('');
    } else if (project.highlights && project.highlights.length) {
      this.el.story.innerHTML = `
        <ul class="pm-highlights">
          ${project.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
        </ul>`;
    } else {
      this.el.story.innerHTML = '';
    }
  }

  renderDeepDive(project) {
    const items = project.deepDive || [];
    this.el.deep.hidden = !items.length;
    if (!items.length) {
      this.el.deep.innerHTML = '';
      return;
    }
    this.el.deep.innerHTML =
      '<div class="pm-section-label">Engineering deep dive</div>' +
      items
        .map(
          (item, i) => `
        <details class="pm-dd"${i === 0 ? ' open' : ''}>
          <summary>
            <span class="pm-dd-num">${String(i + 1).padStart(2, '0')}</span>
            <span class="pm-dd-title">${escapeHtml(item.title)}</span>
            <svg class="pm-dd-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </summary>
          <p>${item.body}</p>
        </details>`
        )
        .join('');
  }

  renderExhibits(project) {
    const exhibits = project.exhibits || [];
    this.el.exhibits.hidden = !exhibits.length;
    this.el.tabs.innerHTML = '';
    this.el.stage.innerHTML = '';
    if (!exhibits.length) return;

    exhibits.forEach((exhibit, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'pm-tab';
      tab.setAttribute('role', 'tab');
      tab.textContent = exhibit.tab;
      tab.addEventListener('click', () => this.showExhibit(project, i));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (i + delta + exhibits.length) % exhibits.length;
        this.showExhibit(project, nextIndex);
        this.el.tabs.children[nextIndex].focus();
      });
      this.el.tabs.appendChild(tab);
    });

    this.showExhibit(project, 0);
  }

  showExhibit(project, index) {
    const exhibit = project.exhibits[index];
    if (!exhibit) return;
    this.exhibitIndex = index;

    Array.from(this.el.tabs.children).forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    this.el.stageTitle.textContent = exhibit.title || '';
    this.el.caption.innerHTML = exhibit.caption || '';
    this.el.stage.innerHTML = '';
    this.el.stage.className = `pm-stage pm-stage--${exhibit.type}`;

    const render = EXHIBITS[exhibit.type];
    if (!render) return;
    render(this.el.stage, exhibit, this);

    if (!REDUCED_MOTION) {
      this.el.stage.classList.remove('pm-stage-in');
      void this.el.stage.offsetHeight;
      this.el.stage.classList.add('pm-stage-in');
    }
  }

  /* ---------- image zoom ---------- */

  openZoom(src, alt) {
    this.el.zoomImg.src = src;
    this.el.zoomImg.alt = alt || '';
    this.el.zoom.hidden = false;
    void this.el.zoom.offsetHeight;
    this.el.zoom.classList.add('open');
  }

  closeZoom() {
    if (this.el.zoom.hidden) return;
    this.el.zoom.classList.remove('open');
    this.el.zoom.hidden = true;
  }
}

/* ============================================================
   Exhibit renderers
   ============================================================ */

const EXHIBITS = {
  /* --- animated bar chart (single or grouped) --- */
  bars(stage, exhibit) {
    const groups = exhibit.groups || [{ bars: exhibit.bars }];
    const max = exhibit.max || Math.max(...groups.flatMap((g) => g.bars.map((b) => b.value))) * 1.1;

    stage.innerHTML = groups
      .map(
        (group) => `
        <div class="pm-bargroup">
          ${group.label ? `<div class="pm-bargroup-label">${escapeHtml(group.label)}${group.note ? `<span class="pm-bargroup-note">${escapeHtml(group.note)}</span>` : ''}</div>` : ''}
          ${group.bars
            .map(
              (bar) => `
            <div class="pm-bar${bar.highlight ? ' pm-bar--hi' : ''}">
              <div class="pm-bar-label">${escapeHtml(bar.label)}</div>
              <div class="pm-bar-track">
                <div class="pm-bar-fill" data-w="${Math.min(100, (bar.value / max) * 100)}"></div>
              </div>
              <div class="pm-bar-value">${bar.value}<span>${escapeHtml(exhibit.unit || '')}</span></div>
            </div>`
            )
            .join('')}
        </div>`
      )
      .join('');

    animateFills(stage);
  },

  /* --- memory-footprint threshold view --- */
  memfit(stage, exhibit) {
    stage.innerHTML = `
      <div class="pm-memfit">
        <div class="pm-memfit-switch" role="group" aria-label="Weight dtype">
          ${exhibit.options
            .map(
              (opt, i) =>
                `<button type="button" class="pm-memfit-btn${i === 0 ? ' active' : ''}" data-i="${i}">${escapeHtml(opt.label)}</button>`
            )
            .join('')}
        </div>
        <div class="pm-memfit-chart">
          <div class="pm-memfit-threshold" style="left:${(exhibit.thresholdGb / exhibit.maxGb) * 100}%">
            <span>${escapeHtml(exhibit.thresholdLabel)}</span>
          </div>
          <div class="pm-memfit-track">
            <div class="pm-memfit-fill"></div>
          </div>
          <div class="pm-memfit-scale">
            <span>0</span><span>${exhibit.maxGb} GB</span>
          </div>
        </div>
        <div class="pm-memfit-readout">
          <div class="pm-memfit-total"></div>
          <div class="pm-memfit-verdict"></div>
          <div class="pm-memfit-sub"></div>
        </div>
      </div>`;

    const fill = stage.querySelector('.pm-memfit-fill');
    const total = stage.querySelector('.pm-memfit-total');
    const verdict = stage.querySelector('.pm-memfit-verdict');
    const sub = stage.querySelector('.pm-memfit-sub');
    const buttons = Array.from(stage.querySelectorAll('.pm-memfit-btn'));

    const select = (i) => {
      const opt = exhibit.options[i];
      buttons.forEach((b, j) => b.classList.toggle('active', i === j));
      fill.style.width = `${Math.min(100, (opt.totalGb / exhibit.maxGb) * 100)}%`;
      fill.classList.toggle('over', !opt.fits);
      total.innerHTML = `${opt.totalGb}<span>GB</span> <em>total weights, 32 layers</em>`;
      verdict.textContent = opt.verdict;
      verdict.className = `pm-memfit-verdict ${opt.fits ? 'ok' : 'bad'}`;
      sub.textContent = `${opt.perLayerMb} MB per transformer layer · ${opt.label} weights`;
    };

    buttons.forEach((b, i) => b.addEventListener('click', () => select(i)));
    select(0);
  },

  /* --- terminal transcript with typewriter reveal --- */
  terminal(stage, exhibit) {
    stage.innerHTML = `
      <div class="pm-term">
        <div class="pm-term-bar">
          <span class="pm-term-dot"></span><span class="pm-term-dot"></span><span class="pm-term-dot"></span>
          <span class="pm-term-title">${escapeHtml(exhibit.termTitle || 'zsh')}</span>
        </div>
        <pre class="pm-term-body"><code><span class="pm-term-prompt">$ ${escapeHtml(exhibit.prompt || '')}</span>
<span class="pm-term-out"></span></code></pre>
      </div>`;

    const out = stage.querySelector('.pm-term-out');
    const lines = exhibit.lines || [];
    const html = lines.map((line) => decorateTermLine(line)).join('\n');

    if (REDUCED_MOTION) {
      out.innerHTML = html;
      return;
    }
    // Reveal line by line — reads like a live run without faking any output.
    let i = 0;
    out.innerHTML = '';
    const tick = () => {
      if (!out.isConnected || i >= lines.length) return;
      out.innerHTML = lines.slice(0, i + 1).map((l) => decorateTermLine(l)).join('\n');
      i += 1;
      setTimeout(tick, 55);
    };
    setTimeout(tick, 260);
  },

  /* --- real screenshot, click to zoom --- */
  image(stage, exhibit, showcase) {
    stage.innerHTML = `
      <figure class="pm-shot">
        <img src="${escapeHtml(exhibit.src)}" alt="${escapeHtml(exhibit.alt || '')}" loading="lazy">
        <figcaption>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          Click to enlarge
        </figcaption>
      </figure>`;
    stage.querySelector('.pm-shot').addEventListener('click', () => {
      showcase.openZoom(exhibit.src, exhibit.alt);
    });
  },

  /* --- inference pipeline flow --- */
  flow(stage, exhibit) {
    stage.innerHTML = `
      <div class="pm-flow">
        ${exhibit.stages
          .map(
            (s, i) => `
          <div class="pm-flow-node${s.wide ? ' pm-flow-node--wide' : ''}" style="--i:${i}">
            <div class="pm-flow-name">${escapeHtml(s.name)}</div>
            <div class="pm-flow-detail">${escapeHtml(s.detail)}</div>
          </div>
          ${i < exhibit.stages.length - 1 ? '<div class="pm-flow-arrow" aria-hidden="true"></div>' : ''}`
          )
          .join('')}
      </div>
      <div class="pm-flow-foot">all hand-written Rust · no PyTorch · no BLAS · no ONNX</div>`;
  },

  /* --- LedgerKV architecture --- */
  arch(stage) {
    stage.innerHTML = `
      <div class="pm-arch">
        <div class="pm-arch-row pm-arch-client">Client · gRPC (any node coordinates)</div>
        <div class="pm-arch-split">
          <div class="pm-arch-col pm-arch-col--ap">
            <div class="pm-arch-tag">AP path</div>
            <div class="pm-arch-title">Leaderless quorum</div>
            <ul>
              <li>Consistent-hash ring · 150 vnodes</li>
              <li>Tunable N / R / W · vector clocks</li>
              <li>Read repair · hinted handoff</li>
              <li>Hedged, deadline-bounded fan-out</li>
            </ul>
          </div>
          <div class="pm-arch-col pm-arch-col--cp">
            <div class="pm-arch-tag">CP path</div>
            <div class="pm-arch-title">Raft consensus</div>
            <ul>
              <li>Leader election · log replication</li>
              <li>Durable log · snapshot + compaction</li>
              <li>Linearizable register state machine</li>
              <li>Separate gRPC service surface</li>
            </ul>
          </div>
        </div>
        <div class="pm-arch-engine">
          <div class="pm-arch-tag">Shared LSM storage engine</div>
          <div class="pm-arch-chain">
            <span>WAL<em>CRC32 · group-commit fsync</em></span>
            <span>MemTable<em>sorted · sealable</em></span>
            <span>SSTable<em>sparse index · Bloom</em></span>
            <span>Compaction<em>size-tiered / leveled</em></span>
          </div>
        </div>
        <div class="pm-arch-row pm-arch-obs">
          <span>/health + /metrics per node</span><span>Prometheus</span><span>Grafana</span><span>Linearizability checker in CI</span>
        </div>
      </div>`;
  },

  /* --- interactive quorum simulator --- */
  ring(stage) {
    const N = 5;
    const RF = 3;
    const W = 2;
    const R = 2;
    const alive = new Array(N).fill(true);
    // Real preference list for "cart:9f3e" on the running cluster: nodes 0, 2, 4.
    // It is not index-ordered because the ring hands out 150 vnodes per node.
    const KEY_ANGLE = -126;
    const pref = [0, 2, 4];

    stage.innerHTML = `
      <div class="pm-ring">
        <div class="pm-ring-viz">
          <svg viewBox="0 0 260 260" role="img" aria-label="Consistent hash ring with five nodes">
            <circle class="pm-ring-path" cx="130" cy="130" r="92"/>
            <g class="pm-ring-key"></g>
            <g class="pm-ring-nodes"></g>
          </svg>
        </div>
        <div class="pm-ring-side">
          <div class="pm-ring-key-label">key <code>"cart:9f3e"</code> &rarr; preference list <code>[n0, n2, n4]</code></div>
          <div class="pm-ring-verdicts">
            <div class="pm-ring-verdict" data-kind="w"><span class="pm-ring-vlabel">Write quorum W=2</span><span class="pm-ring-vstate"></span></div>
            <div class="pm-ring-verdict" data-kind="r"><span class="pm-ring-vlabel">Read quorum R=2</span><span class="pm-ring-vstate"></span></div>
          </div>
          <p class="pm-ring-explain"></p>
          <button type="button" class="pm-ring-reset">Revive all nodes</button>
        </div>
      </div>`;

    const svg = stage.querySelector('svg');
    const nodesG = svg.querySelector('.pm-ring-nodes');
    const keyG = svg.querySelector('.pm-ring-key');
    const explain = stage.querySelector('.pm-ring-explain');

    const pos = (angleDeg) => {
      const a = (angleDeg * Math.PI) / 180;
      return { x: 130 + 92 * Math.cos(a), y: 130 + 92 * Math.sin(a) };
    };

    const kp = pos(KEY_ANGLE);
    keyG.innerHTML = `
      <circle cx="${kp.x.toFixed(1)}" cy="${kp.y.toFixed(1)}" r="4" class="pm-ring-keydot"/>
      <text x="${kp.x.toFixed(1)}" y="${(kp.y - 12).toFixed(1)}" text-anchor="middle" class="pm-ring-keytext">hash(key)</text>`;

    for (let i = 0; i < N; i++) {
      const p = pos(-90 + (360 / N) * i);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'pm-ring-node');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.dataset.i = String(i);
      g.innerHTML = `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="20"/>
        <text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" text-anchor="middle">n${i}</text>`;
      const toggle = () => {
        alive[i] = !alive[i];
        update();
      };
      g.addEventListener('click', toggle);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
      nodesG.appendChild(g);
    }

    const update = () => {
      const liveInPref = pref.filter((i) => alive[i]).length;
      const deadPref = pref.filter((i) => !alive[i]);
      const wOk = liveInPref >= W;
      const rOk = liveInPref >= R;

      Array.from(nodesG.children).forEach((g, i) => {
        g.classList.toggle('dead', !alive[i]);
        g.classList.toggle('replica', pref.includes(i));
        g.setAttribute('aria-label', `node ${i} — ${pref.includes(i) ? 'replica for this key' : 'not a replica'}, ${alive[i] ? 'alive' : 'killed'}. Activate to toggle.`);
      });

      stage.querySelectorAll('.pm-ring-verdict').forEach((v) => {
        const ok = v.dataset.kind === 'w' ? wOk : rOk;
        v.classList.toggle('ok', ok);
        v.classList.toggle('bad', !ok);
        v.querySelector('.pm-ring-vstate').textContent = `${liveInPref} of ${RF} replicas up — ${ok ? 'MET' : 'LOST'}`;
      });

      if (deadPref.length === 0) {
        explain.innerHTML = 'All three replicas are up. The coordinator answers as soon as the fastest two acknowledge, so a single slow disk never sets the latency. Note that <strong>n1 and n3 store nothing for this key and can still coordinate the request</strong> — there is no leader to route around.';
      } else if (liveInPref >= W) {
        explain.innerHTML = `<strong>Still fully available.</strong> ${deadPref.length === 1 ? 'One replica is' : `${deadPref.length} replicas are`} gone, but ${liveInPref} of ${RF} satisfies W=2 and R=2, so nothing is rejected — this is the state the transcript and the dashboard were captured in. Writes bound for the dead replica park as <em>hints</em> on a live neighbour for delivery on recovery.`;
      } else {
        explain.innerHTML = `<strong>Quorum lost.</strong> Only ${liveInPref} of ${RF} replicas remain, so this key cannot satisfy W=2 or R=2, and the coordinator rejects the operation instead of lying about durability. That refusal is the honest behaviour — and it is precisely the tradeoff you accept in exchange for the availability shown above.`;
      }
    };

    stage.querySelector('.pm-ring-reset').addEventListener('click', () => {
      alive.fill(true);
      update();
    });
    update();
  }
};

/** Highlight numbers and key/value shapes in a real captured terminal line. */
function decorateTermLine(line) {
  let out = escapeHtml(line);
  out = out.replace(/^(\s*)([A-Za-z0-9_/.\-]+:)/, '$1<span class="t-key">$2</span>');
  out = out.replace(/\b(\d[\d.,]*\s?(?:GB|MB|KB|B|ms|s|B\b)?)\b/g, '<span class="t-num">$1</span>');
  out = out.replace(/\b(OK|SUCCESS|HOLDS|healthy|true)\b/g, '<span class="t-ok">$1</span>');
  out = out.replace(/\b(UNREACHABLE|KILLED|FAILED|SIGKILL|false)\b/g, '<span class="t-bad">$1</span>');
  out = out.replace(/^(==&gt;.*)$/gm, '<span class="t-step">$1</span>');
  return out;
}

/** Grow bar fills from zero on first paint. */
function animateFills(stage) {
  const fills = stage.querySelectorAll('.pm-bar-fill');
  fills.forEach((fill) => {
    const target = `${fill.dataset.w}%`;
    if (REDUCED_MOTION) {
      fill.style.width = target;
      return;
    }
    fill.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fill.style.width = target;
    }));
  });
}
