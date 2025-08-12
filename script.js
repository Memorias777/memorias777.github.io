/* ===========================
   script.js - comportamiento
   =========================== */
/* NOTA: este script sirve para ambas páginas.
   - Renderiza posts y proyectos desde arrays (fácil edición).
   - Controla sidebar/hamburger, theme y microinteracciones (tilt, ripple).
*/

(() => {
  // ---------- Datos (edítalos aquí) ----------
  const blogPosts = [
    {
      title: "Cómo optimicé consultas SQL",
      excerpt: "Tips y trucos para acelerar queries en bases de datos grandes.",
      thumb: "https://via.placeholder.com/400x300?text=SQL",
      url: "#"
    },
    {
      title: "Introducción a Pandas",
      excerpt: "Manipulación de datos paso a paso con ejemplos prácticos.",
      thumb: "https://via.placeholder.com/400x300?text=Pandas",
      url: "#"
    },
    {
      title: "Mi preparación para el nacional",
      excerpt: "Rutinas, errores pasados y cómo lo arreglé para competir mejor.",
      thumb: "https://via.placeholder.com/400x300?text=Entreno",
      url: "#"
    }
  ];

  const projects = [
    {
      title: "Red Social Memo",
      description: "App de mensajería familiar con autenticación y chats.",
      image: "https://via.placeholder.com/900x500?text=Red+Social+Memo",
      url: "https://redsocialmemo.tudominio.com",
      theme: ["#3fe0c5","#8ff5e4"] // puedes cambiar gradiente por proyecto
    },
    {
      title: "Cinta Rota Films",
      description: "Web para productora: portfolios, videos y booking.",
      image: "https://memorias777.github.io/Cinta-Rota-FIlms/fotos/logo.jpg",
      url: "https://memorias777.github.io/Cinta-Rota-FIlms/index.html",
      theme: ["#ff8a65","#ffccbc"]
    }
  ];

  // ---------- Helpers ----------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // ---------- Common UI ----------
  function initYear() {
    const y = new Date().getFullYear();
    const yearEls = $$('#year, #year2');
    yearEls.forEach(el => { if (el) el.textContent = y; });
  }

  // ---------- Theme (persistente) ----------
  function initTheme() {
    const isDark = localStorage.getItem('memo_theme') === 'dark';
    if (isDark) document.body.classList.add('dark');
    // connect toggles on both pages (if exist)
    const tgls = $$('#themeToggle, #themeToggle2');
    tgls.forEach(t => { t.checked = isDark; t.addEventListener('change', toggleTheme); });
  }
  function toggleTheme(e){
    const checked = e.target.checked;
    if (checked) {
      document.body.classList.add('dark'); localStorage.setItem('memo_theme','dark');
    } else {
      document.body.classList.remove('dark'); localStorage.setItem('memo_theme','light');
    }
  }

  // ---------- Sidebar / Hamburger ----------
  function wireSidebar({hamburgerId, sidebarId, closeId}) {
    const ham = document.getElementById(hamburgerId);
    const side = document.getElementById(sidebarId);
    const closeBtn = document.getElementById(closeId);

    if (!ham || !side) return;
    function open() {
      ham.classList.add('open');
      side.classList.add('open');
      ham.setAttribute('aria-expanded','true');
      side.setAttribute('aria-hidden','false');
      // disable body scroll lightly
      document.body.style.overflow = 'hidden';
    }
    function close() {
      ham.classList.remove('open');
      side.classList.remove('open');
      ham.setAttribute('aria-expanded','false');
      side.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }
    ham.addEventListener('click', () => { if (side.classList.contains('open')) close(); else open(); });
    closeBtn && closeBtn.addEventListener('click', close);
    // close on nav link click
    side.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', close));
    // close on Escape
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
  }

  // ---------- Render blog posts ----------
  function renderBlog() {
    const grid = $('#blogGrid');
    if (!grid) return;
    grid.innerHTML = ''; // reset
    blogPosts.forEach(post => {
      const a = document.createElement('a');
      a.href = post.url;
      a.className = 'card-post';
      a.style.display = 'block';
      a.style.position = 'relative';
      a.style.overflow = 'hidden';
      a.innerHTML = `
        <div class="card-head">
          <div class="thumb" style="background-image:url('${post.thumb}');"></div>
          <div style="flex:1">
            <div class="title">${post.title}</div>
            <div class="excerpt">${post.excerpt}</div>
          </div>
        </div>
      `;
      addHoverTilt(a, 10);
      addLinkRipple(a);
      grid.appendChild(a);
    });
  }

  // ---------- Render projects ----------
  function renderProjects() {
    const grid = $('#projectGrid');
    if (!grid) return;
    grid.innerHTML = '';
    projects.forEach(proj => {
      const card = document.createElement('article');
      card.className = 'card-project';
      // gradient from theme array
      const g1 = (proj.theme && proj.theme[0]) || '#ffffff';
      const g2 = (proj.theme && proj.theme[1]) || '#f1f1f1';
      card.innerHTML = `
        <div class="media" style="background-image:url('${proj.image}');"></div>
        <div class="proj-body">
          <h3>${proj.title}</h3>
          <p>${proj.description}</p>
          <div class="card-actions">
            <a class="btn primary" href="${proj.url}" target="_blank" rel="noopener noreferrer">Abrir</a>
            <button class="btn ghost" data-edit="${proj.title}">Editar</button>
          </div>
        </div>
      `;
      // set a subtle top gradient accent using a pseudo-element style
      const media = card.querySelector('.media');
      media.style.boxShadow = `inset 0 -60px 80px rgba(0,0,0,0.18), 0 6px 22px rgba(2,20,16,0.06)`;
      // allow per-project accent color on hover
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) rotateX(0.6deg)';
        card.style.transition = 'transform 260ms ease, box-shadow 260ms ease';
        card.querySelector('.btn.primary').style.boxShadow = `0 10px 28px ${hexToRgba(g1,0.18)}`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.querySelector('.btn.primary').style.boxShadow = '';
      });
      addHoverTilt(card, 8);
      // edit button: opens prompt to edit description (simple inline editing)
      card.querySelector('[data-edit]')?.addEventListener('click', (ev) => {
        const p = card.querySelector('p');
        const newText = prompt('Editar descripción del proyecto:', p.textContent);
        if (newText !== null) p.textContent = newText;
      });
      grid.appendChild(card);
    });
  }

  // ---------- Microinteraction: add tilt effect ----------
  function addHoverTilt(el, max = 8) {
    let bounds = null;
    el.addEventListener('pointermove', (e) => {
      if (!bounds) bounds = el.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width;
      const py = (e.clientY - bounds.top) / bounds.height;
      const rx = (py - 0.5) * max;
      const ry = (px - 0.5) * -max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      el.style.transition = 'transform 120ms linear';
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; el.style.transition = 'transform 400ms cubic-bezier(.2,.9,.3,1)'; bounds = null; });
  }

  // ---------- Ripple effect for links/buttons ----------
  function addLinkRipple(el) {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - rect.left - 10}px`;
      ripple.style.top = `${e.clientY - rect.top - 10}px`;
      ripple.style.width = ripple.style.height = '20px';
      ripple.style.position = 'absolute';
      ripple.style.background = 'rgba(0,0,0,0.12)';
      ripple.style.pointerEvents = 'none';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '0.9';
      ripple.style.transition = 'transform 600ms linear, opacity 600ms linear';
      el.appendChild(ripple);
      requestAnimationFrame(() => { ripple.style.transform = 'scale(8)'; ripple.style.opacity = '0'; });
      setTimeout(() => ripple.remove(), 650);
    });
  }

  // ---------- Utility to convert hex to rgba ----------
  function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(h=>h+h).join('');
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ---------- Page init ----------
  function init() {
    initYear();
    initTheme();

    // wire sidebars for index and projects pages (IDs differ)
    wireSidebar({hamburgerId:'hamburger',sidebarId:'sidebar',closeId:'closeSidebar'});
    wireSidebar({hamburgerId:'hamburger2',sidebarId:'sidebar2',closeId:'closeSidebar2'});

    // render sections if present
    renderBlog();
    renderProjects();

    // apply ripple to primary CTA if present
    $$('.btn').forEach(b => addLinkRipple(b));

    // accessible: close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar.open');
      if (!sidebar) return;
      if (!sidebar.contains(e.target) && !e.target.closest('.hamburger')) {
        sidebar.classList.remove('open');
        $$('.hamburger').forEach(h=>h.classList.remove('open'));
        document.body.style.overflow = '';
      }
    });

    // small animation: fade in panels
    $$('.panel').forEach((p,i) => {
      p.style.opacity = 0; p.style.transform = 'translateY(12px)';
      setTimeout(()=>{ p.style.transition = 'all 520ms cubic-bezier(.2,.9,.3,1)'; p.style.opacity=1; p.style.transform=''; }, 120 + i*90);
    });
  }

  // run init after DOM loaded
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();

// aqui vlviendo a escribir cosas para la racha de github