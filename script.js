document.addEventListener('DOMContentLoaded', () => {
    // --- Variables y referencias a elementos del DOM ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarNav = document.querySelector('.sidebar-nav');
    const closeBtn = document.querySelector('.close-btn');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.section-content');
    const urlInput = document.getElementById('project-url');
    const loadPreviewBtn = document.getElementById('load-preview-btn');
    const iframe = document.getElementById('project-iframe');
    const previewMessage = document.querySelector('.preview-message');

    // --- Lógica del modo oscuro/claro ---
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = savedTheme;
    if (savedTheme === 'dark-mode') {
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.className = 'dark-mode';
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.className = 'light-mode';
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // --- Lógica de navegación del sidebar ---
    menuToggle.addEventListener('click', () => {
        sidebarNav.classList.add('is-open');
    });

    closeBtn.addEventListener('click', () => {
        sidebarNav.classList.remove('is-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.dataset.target;
            
            sections.forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden-section');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden-section');
                targetSection.classList.add('active-section');
            }

            sidebarNav.classList.remove('is-open');
        });
    });

    // --- Lógica de previsualización de proyectos ---
    loadPreviewBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            const validUrl = url.startsWith('http://') || url.startsWith('https://');
            if (validUrl) {
                iframe.src = url;
                previewMessage.style.display = 'none';
            } else {
                alert('Por favor, introduce una URL válida (con http:// o https://).');
            }
        } else {
            alert('Por favor, pega una URL para previsualizar.');
        }
    });

    iframe.addEventListener('load', () => {
        console.log('El iframe ha cargado el contenido.');
    });

    // --- Carga de datos simulada para el blog (reemplazar con tus datos reales) ---
    const blogPosts = [
        { title: 'Cómo Optimizar tus Consultas en SQL', description: 'Tips y trucos para hacer tus consultas de base de datos más rápidas y eficientes.', url: '/blog/sql-optimizado.html' },
        { title: 'Una Guía para Python con Pandas', description: 'Introducción a la librería Pandas para manipular datos de manera sencilla.', url: '/blog/pandas-guia.html' },
        { title: 'Dominando Flexbox y CSS Grid', description: 'Crea diseños responsivos y modernos sin frustración.', url: '/blog/css-flexbox-grid.html' },
    ];

    const blogGrid = document.querySelector('.blog-grid');

    blogPosts.forEach(post => {
        const card = document.createElement('a');
        card.href = post.url;
        card.className = 'blog-post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.description}</p>
        `;
        blogGrid.appendChild(card);
    });
});