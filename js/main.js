// Navegación Radial - Solo Desktop
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navDots = document.querySelectorAll('.nav-dot');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navToggle.classList.contains('active');
        
        if (isActive) {
            // Cerrar el menú
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        } else {
            // Abrir el menú
            navToggle.classList.add('active');
            navMenu.classList.add('active');
        }
    });

    // Cerrar menú al hacer clic en un enlace
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = dot.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }, 300);
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navToggle && navMenu) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
}

// Menú Móvil
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = mobileNavToggle.classList.contains('active');
        
        if (isActive) {
            mobileNavMenu.classList.remove('active');
            mobileNavToggle.classList.remove('active');
        } else {
            mobileNavToggle.classList.add('active');
            mobileNavMenu.classList.add('active');
        }
    });

    // Cerrar menú al hacer clic en un enlace
    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    mobileNavMenu.classList.remove('active');
                    mobileNavToggle.classList.remove('active');
                }, 300);
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (mobileNavToggle && mobileNavMenu) {
            if (!mobileNavToggle.contains(e.target) && !mobileNavMenu.contains(e.target)) {
                mobileNavMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
            }
        }
    });
}

// Toggle de Tema
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Verificar tema guardado o usar tema oscuro por defecto
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Animación al hacer scroll mejorada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        }
    });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .about-content, .contact-info');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.95)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        observer.observe(el);
    });
});

// Efecto de parallax mejorado en orbs
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 100;
    targetY = (e.clientY / window.innerHeight - 0.5) * 100;
});

// Animación suave del parallax
function animateParallax() {
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;
    
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.8;
        const x = mouseX * speed * 0.1;
        const y = mouseY * speed * 0.1;
        const currentTransform = orb.style.transform || 'translate(0, 0)';
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    requestAnimationFrame(animateParallax);
}

animateParallax();

// Indicador de sección activa en navegación
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) {
            dot.classList.add('active');
        }
    });
});

// Smooth scroll mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Efecto de brillo en elementos al pasar el mouse
document.querySelectorAll('.project-card, .skill-category').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Animación de carga inicial
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Sistema de Traducción
const translations = {
    es: {
        // Navegación
        'nav-inicio': 'Inicio',
        'nav-proyectos': 'Proyectos',
        'nav-skills': 'Skills',
        'nav-sobre-mi': 'Sobre Mí',
        'nav-contacto': 'Contacto',
        'nav-linkedin': 'LinkedIn',
        // Hero
        'profession1': 'Desarrollador Full Stack Web',
        'profession2': 'Administrador de Redes CISCO (CCNA)',
        'profession3': 'Ingeniero Informático',
        'hero-description': 'Apasionado desarrollador con experiencia en tecnologías modernas y redes. Especializado en crear soluciones web completas desde el frontend hasta el backend.',
        'technologies-title': 'Tecnologías:',
        'download-cv': 'Descargar CV',
        // Proyectos
        'projects-title': 'Mis Proyectos',
        'geoplanner-description': 'Red social geolocalizada innovadora que permite a los usuarios crear y compartir eventos, planes y actividades basadas en ubicación. Incluye funcionalidades de geolocalización en tiempo real, mapas interactivos y sistema de recomendaciones basado en preferencias del usuario.',
        'ad-pages-title': 'Páginas de Publicidad',
        'ad-pages-description': 'Desarrollo de páginas web modernas y atractivas para campañas publicitarias y marketing digital. Diseños responsivos optimizados para conversión, con integración de analytics y herramientas de seguimiento de rendimiento.',
        'view-project': 'Ver Proyecto',
        // Skills
        'skills-title': 'Mis Habilidades',
        // Sobre Mí
        'about-title': 'Sobre Mí',
        'about-p1': 'Soy un Ingeniero Informático venezolano apasionado por la tecnología y el desarrollo de software. Actualmente curso el 11vo trimestre de Ingeniería Informática en la Universidad Privada Dr. Rafael Belloso Chacín (URBE), combinando mi formación académica con experiencia práctica en desarrollo web.',
        'about-p2': 'Como desarrollador Full Stack, tengo experiencia trabajando con tecnologías modernas tanto en el frontend como en el backend. Me especializo en crear aplicaciones web escalables y eficientes, utilizando React para interfaces de usuario dinámicas y Node.js para construir APIs robustas.',
        'about-p3': 'Además de mi experiencia en desarrollo, cuento con certificación como Administrador de Redes CISCO (CCNA), lo que me permite tener una comprensión completa de las infraestructuras de red y cómo se integran con las aplicaciones web modernas.',
        'about-p4': 'Mi enfoque está en crear soluciones tecnológicas que no solo sean funcionales, sino también intuitivas y centradas en el usuario. Disfruto trabajando en proyectos desafiantes y estoy siempre aprendiendo nuevas tecnologías para mantenerme actualizado en este campo en constante evolución.',
        'education-title': 'Formación Académica',
        'education-period': '2020 - Actualidad | 11vo Trimestre',
        // Contacto
        'contact-title': 'Contacto',
        // LinkedIn
        'linkedin-title': 'Conectemos en LinkedIn',
        'linkedin-description': '¿Te gustaría conocer más sobre mi experiencia profesional y proyectos? Conectemos en LinkedIn y sigamos en contacto.',
        'visit-linkedin': 'Visitar mi LinkedIn'
    },
    en: {
        // Navegación
        'nav-inicio': 'Home',
        'nav-proyectos': 'Projects',
        'nav-skills': 'Skills',
        'nav-sobre-mi': 'About Me',
        'nav-contacto': 'Contact',
        'nav-linkedin': 'LinkedIn',
        // Hero
        'profession1': 'Full Stack Web Developer',
        'profession2': 'CISCO Network Administrator (CCNA)',
        'profession3': 'Computer Engineer',
        'hero-description': 'Passionate developer with experience in modern technologies and networks. Specialized in creating complete web solutions from frontend to backend.',
        'technologies-title': 'Technologies:',
        'download-cv': 'Download CV',
        // Proyectos
        'projects-title': 'My Projects',
        'geoplanner-description': 'Innovative geolocated social network that allows users to create and share location-based events, plans, and activities. Includes real-time geolocation features, interactive maps, and a recommendation system based on user preferences.',
        'ad-pages-title': 'Advertising Pages',
        'ad-pages-description': 'Development of modern and attractive web pages for advertising campaigns and digital marketing. Responsive designs optimized for conversion, with analytics integration and performance tracking tools.',
        'view-project': 'View Project',
        // Skills
        'skills-title': 'My Skills',
        // Sobre Mí
        'about-title': 'About Me',
        'about-p1': 'I am a Venezuelan Computer Engineer passionate about technology and software development. I am currently in the 11th trimester of Computer Engineering at Dr. Rafael Belloso Chacín Private University (URBE), combining my academic training with practical experience in web development.',
        'about-p2': 'As a Full Stack developer, I have experience working with modern technologies in both frontend and backend. I specialize in creating scalable and efficient web applications, using React for dynamic user interfaces and Node.js to build robust APIs.',
        'about-p3': 'In addition to my development experience, I hold a certification as a CISCO Network Administrator (CCNA), which allows me to have a complete understanding of network infrastructures and how they integrate with modern web applications.',
        'about-p4': 'My approach is to create technological solutions that are not only functional, but also intuitive and user-centered. I enjoy working on challenging projects and I am always learning new technologies to stay updated in this constantly evolving field.',
        'education-title': 'Academic Education',
        'education-period': '2020 - Present | 11th Trimester',
        // Contacto
        'contact-title': 'Contact',
        // LinkedIn
        'linkedin-title': 'Let\'s Connect on LinkedIn',
        'linkedin-description': 'Would you like to know more about my professional experience and projects? Let\'s connect on LinkedIn and stay in touch.',
        'visit-linkedin': 'Visit my LinkedIn'
    }
};

let currentLanguage = localStorage.getItem('language') || 'es';

// Función para cambiar el idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Cambiar el código de idioma en el botón
    const langCode = document.querySelector('.lang-code');
    if (langCode) {
        langCode.textContent = lang === 'es' ? 'ES' : 'EN';
    }
    
    // Cambiar el atributo lang del HTML
    document.documentElement.lang = lang;
    
    // Traducir todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Inicializar idioma al cargar
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLanguage);
});

// Toggle de Idioma
const languageToggle = document.getElementById('languageToggle');
if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'es' ? 'en' : 'es';
        changeLanguage(newLang);
    });
}