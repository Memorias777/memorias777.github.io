document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del modo oscuro/claro ---
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light-mode';

    document.body.className = savedTheme;
    if (savedTheme === 'dark-mode') {
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.className = 'dark-mode';
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.className = 'light-mode';
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // --- Lógica de navegación del sidebar ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarNav = document.querySelector('.sidebar-nav');
    const closeBtn = document.querySelector('.close-btn');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.section-content');

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
            
            // Oculta todas las secciones
            sections.forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden-section');
            });

            // Muestra la sección deseada
            const targetSection = document.getElementById(targetId);
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');

            sidebarNav.classList.remove('is-open');
        });
    });

    // --- Carga de datos simulada (aquí irán tus datos reales) ---
    const blogPosts = [
        { title: 'Cómo Optimizar tus Consultas en SQL', description: 'Tips y trucos para hacer tus consultas de base de datos más rápidas y eficientes.', url: '/blog/sql-optimizado.html' },
        { title: 'Una Guía para Python con Pandas', description: 'Introducción a la librería Pandas para manipular datos de manera sencilla.', url: '/blog/pandas-guia.html' },
    ];

    const projects = [
        { title: 'Red Social Memo', description: 'App de mensajería familiar.', previewImage: 'https://via.placeholder.com/400x200?text=Preview+de+Red+Social', url: 'https://redsocialmemo.tudominio.com' },
        { title: 'Cinta Rota Films', description: 'Web para productora de eventos.', previewImage: 'https://via.placeholder.com/400x200?text=Preview+de+Cinta+Rota', url: 'https://cintarotafilms.tudominio.com' },
    ];

    const blogGrid = document.querySelector('.blog-grid');
    const projectGrid = document.querySelector('.project-grid');

    // Renderizar posts del blog
    blogPosts.forEach(post => {
        const card = document.createElement('a');
        card.href = post.url;
        card.className = 'blog-post-card';
        card.innerHTML = `<h3>${post.title}</h3><p>${post.description}</p>`;
        blogGrid.appendChild(card);
    });

    // Renderizar proyectos
    projects.forEach(project => {
        const card = document.createElement('a');
        card.href = project.url;
        card.className = 'project-card';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.innerHTML = `
            <div class="project-preview" style="background-image: url('${project.previewImage}');"></div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        `;
        projectGrid.appendChild(card);
    });

});