// Preloader — smooth fade with modern spinner
(function () {
  const pre = document.getElementById('preloader');
  if (!pre) { document.body.classList.remove('is-loading'); return; }
  document.body.classList.add('is-loading');
  const fill = document.getElementById('loaderFill');
  let progress = 0;
  const start = Date.now();
  const minDuration = 1200; // ms, keeps the animation from flashing on fast loads

  function tick() {
    progress += (100 - progress) * 0.11 + 1.2;
    if (progress > 95) progress = 95;
    if (fill) fill.style.width = progress + '%';
    if (progress < 95) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function finish() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minDuration - elapsed);
    setTimeout(() => {
      if (fill) fill.style.width = '100%';
      setTimeout(() => {
        pre.classList.add('hide');
        document.body.classList.remove('is-loading');
        setTimeout(() => pre.remove(), 600);
      }, 300);
    }, wait);
  }
  if (document.readyState === 'complete') { finish(); }
  else { window.addEventListener('load', finish); }
})();



// Mobile nav toggle
const menuBtn = document.getElementById('menuBtn');
const mobilePanel = document.getElementById('mobilePanel');
if (menuBtn && mobilePanel) {
  const closeMenu = () => {
    mobilePanel.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = mobilePanel.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuBtn.textContent = isOpen ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobilePanel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) { closeMenu(); }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// Activity grid — mapped to real events, intensity = relative significance
const grid = document.getElementById('activityGrid');
if (grid) {
  const events = [
    { name: "CodeWar v1.0", lvl: 3 }, { name: "CodeWar v2.0", lvl: 3 }, { name: "CodeWar v3.0", lvl: 4 },
    { name: "Ideathon", lvl: 2 }, { name: "IdeaSphere", lvl: 3 }, { name: "Park Young Innovators Summit 2025", lvl: 4 },
  ];
  const totalCells = 48;
  const positions = [4, 9, 15, 20, 26, 33];
  // Fixed decorative filler cells (deterministic, so the grid looks the
  // same on every load/reload instead of reshuffling with Math.random()).
  const fillerCells = [2, 7, 12, 18, 23, 29, 36, 41, 44];
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const idx = positions.indexOf(i);
    if (idx !== -1) {
      const ev = events[idx];
      cell.classList.add('lvl' + ev.lvl);
      const tip = document.createElement('div');
      tip.className = 'tip';
      tip.textContent = ev.name;
      cell.appendChild(tip);
    } else if (fillerCells.includes(i)) {
      cell.classList.add('lvl1');
    }
    grid.appendChild(cell);
  }
}

// Terminal typing sequence (home hero only)
const termBody = document.getElementById('termBody');
if (termBody) {
  const lines = [
    { p: true, text: "whoami" },
    { p: false, text: "B.Tech IT student, fresher developer" },
    { p: true, text: "cat skills.txt" },
    { p: false, text: "Python · HTML · CSS · JS · Git" },

  ];
  function typeLoop() {
    termBody.innerHTML = '';
    let i = 0;
    function next() {
      if (i >= lines.length) {
        setTimeout(typeLoop, 2600);
        return;
      }
      const div = document.createElement('div');
      div.className = 'line' + (lines[i].p ? '' : ' out');
      div.innerHTML = lines[i].p ? '<span class="prompt">$</span> ' + lines[i].text : lines[i].text;
      if (i === lines.length - 1) {
        const caret = document.createElement('span');
        caret.className = 'caret';
        div.appendChild(caret);
      }
      termBody.appendChild(div);
      i++;
      setTimeout(next, lines[i - 1] && lines[i - 1].p ? 500 : 900);
    }
    next();
  }
  typeLoop();
}

// Custom Cursor Experience
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch devices

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
  });

  function tick() {
    if (isMoving) {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      // Smooth interpolation (lerp)
      cursorX += dx * 0.16;
      cursorY += dy * 0.16;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
    requestAnimationFrame(tick);
  }
  tick();

  // Listeners for hover elements
  function updateHoverListeners() {
    const interactives = document.querySelectorAll('a, button, .btn, .project-card, .strength-card, .detail-card, .cell');
    interactives.forEach(el => {
      // Avoid duplicate listeners
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  updateHoverListeners();

  // Re-run whenever content reveals or changes
  const observer = new MutationObserver(updateHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });
})();

// Staggered Entrance Delay & Animated Stat Counters
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const containers = document.querySelectorAll('.projects-grid, .strengths, .contact-detail-grid, .skills-grid');
  containers.forEach(container => {
    const cards = container.children;
    Array.from(cards).forEach((card, idx) => {
      card.style.transitionDelay = `${idx * 75}ms`;
    });
  });

  // Animated Number Counter for Stats (.hero-meta strong)
  const stats = document.querySelectorAll('.hero-meta strong');
  if (stats.length) {
    const ioStats = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const numMatch = text.match(/\d+/);
          if (numMatch && !el.dataset.counted) {
            el.dataset.counted = 'true';
            const targetNum = parseInt(numMatch[0], 10);
            const suffix = text.replace(numMatch[0], '');
            let startTime = null;
            const duration = 850;
            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * targetNum);
              el.textContent = current + suffix;
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.textContent = targetNum + suffix;
              }
            }
            requestAnimationFrame(step);
          }
          ioStats.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => ioStats.observe(el));
  }
})();