// Preloader — smooth fade with modern spinner
(function(){
  const pre = document.getElementById('preloader');
  if(!pre){ document.body.classList.remove('is-loading'); return; }
  document.body.classList.add('is-loading');
  const fill = document.getElementById('loaderFill');
  let progress = 0;
  const start = Date.now();
  const minDuration = 1200; // ms, keeps the animation from flashing on fast loads

  function tick(){
    progress += (100 - progress) * 0.11 + 1.2;
    if(progress > 95) progress = 95;
    if(fill) fill.style.width = progress + '%';
    if(progress < 95) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function finish(){
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minDuration - elapsed);
    setTimeout(()=>{
      if(fill) fill.style.width = '100%';
      setTimeout(()=>{
        pre.classList.add('hide');
        document.body.classList.remove('is-loading');
        setTimeout(()=>pre.remove(), 600);
      }, 300);
    }, wait);
  }
  if(document.readyState === 'complete'){ finish(); }
  else{ window.addEventListener('load', finish); }
})();

// Hero photo-card scroll parallax
(function(){
  const visual = document.querySelector('.hero-visual');
  const heroSection = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileView = window.matchMedia('(max-width: 900px)').matches;
  if(!visual || !heroSection || reduceMotion || mobileView) return;
  let ticking = false;
  function update(){
    const rect = heroSection.getBoundingClientRect();
    // how far the hero has scrolled past the top of the viewport
    const offset = Math.min(Math.max(-rect.top, 0), rect.height);
    const shift = offset * 0.18;
    visual.style.transform = 'translateY(' + shift + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});
  update();
})();

// Mobile nav toggle
const menuBtn = document.getElementById('menuBtn');
const mobilePanel = document.getElementById('mobilePanel');
if(menuBtn && mobilePanel){
  const closeMenu = ()=>{
    mobilePanel.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', ()=>{
    const isOpen = mobilePanel.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuBtn.textContent = isOpen ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobilePanel.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 900){ closeMenu(); }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if(revealEls.length){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  revealEls.forEach(el=>io.observe(el));
}

// Activity grid — mapped to real events, intensity = relative significance
const grid = document.getElementById('activityGrid');
if(grid){
  const events = [
    {name:"CodeWar v1.0", lvl:3}, {name:"CodeWar v2.0", lvl:3}, {name:"CodeWar v3.0", lvl:4},
    {name:"Ideathon", lvl:2}, {name:"IdeaSphere", lvl:3}, {name:"Park Young Innovators Summit 2025", lvl:4},
  ];
  const totalCells = 48;
  const positions = [4,9,15,20,26,33];
  for(let i=0;i<totalCells;i++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    const idx = positions.indexOf(i);
    if(idx !== -1){
      const ev = events[idx];
      cell.classList.add('lvl'+ev.lvl);
      const tip = document.createElement('div');
      tip.className = 'tip';
      tip.textContent = ev.name;
      cell.appendChild(tip);
    } else if(Math.random() < 0.12){
      cell.classList.add('lvl1');
    }
    grid.appendChild(cell);
  }
}

// Terminal typing sequence (home hero only)
const termBody = document.getElementById('termBody');
if(termBody){
  const lines = [
    {p:true, text:"whoami"},
    {p:false, text:"B.Tech IT student, fresher developer"},
    {p:true, text:"cat skills.txt"},
    {p:false, text:"Python · HTML · CSS · JS · Git"},

  ];
  function typeLoop(){
    termBody.innerHTML = '';
    let i = 0;
    function next(){
      if(i >= lines.length){
        setTimeout(typeLoop, 2600);
        return;
      }
      const div = document.createElement('div');
      div.className = 'line' + (lines[i].p ? '' : ' out');
      div.innerHTML = lines[i].p ? '<span class="prompt">$</span> ' + lines[i].text : lines[i].text;
      if(i === lines.length - 1){
        const caret = document.createElement('span');
        caret.className = 'caret';
        div.appendChild(caret);
      }
      termBody.appendChild(div);
      i++;
      setTimeout(next, lines[i-1] && lines[i-1].p ? 500 : 900);
    }
    next();
  }
  typeLoop();
}
