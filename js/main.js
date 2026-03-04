/* ══════════════════════════════════════════
   CYBERPUNK TECH — Portfolio JS
   Tube Cursor · Preloader · Terminal · i18n
   ══════════════════════════════════════════ */

// ─── DOM Elements ───
const preloader = document.getElementById('preloader');
const preloaderName = document.getElementById('preloaderName');
const preloaderFill = document.getElementById('preloaderFill');
const preloaderBar = document.getElementById('preloaderBar');
const preloaderPercent = document.getElementById('preloaderPercent');
const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const languageToggle = document.getElementById('languageToggle');
const terminalText = document.getElementById('terminalText');

// ═══════════════════════════════════════
// TUBE CURSOR (Canvas-based glowing trail)
// ═══════════════════════════════════════
const canvas = document.getElementById('cursorCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let mouseX = 0, mouseY = 0;
const trailPoints = [];
const maxTrailLength = 30;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

if (canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trailPoints.push({ x: mouseX, y: mouseY, time: Date.now() });
    if (trailPoints.length > maxTrailLength) {
        trailPoints.shift();
    }
});

function drawTubeCursor() {
    if (!ctx) { requestAnimationFrame(drawTubeCursor); return; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Remove old points (older than 400ms)
    const now = Date.now();
    while (trailPoints.length > 0 && now - trailPoints[0].time > 400) {
        trailPoints.shift();
    }

    if (trailPoints.length < 2) {
        // Just draw the dot
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#b026ff';
        ctx.shadowColor = '#b026ff';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        requestAnimationFrame(drawTubeCursor);
        return;
    }

    // Draw the tube trail
    for (let i = 1; i < trailPoints.length; i++) {
        const p0 = trailPoints[i - 1];
        const p1 = trailPoints[i];
        const age = (now - p0.time) / 400; // 0 to 1 = new to old
        const alpha = Math.max(0, 1 - age);
        const lineWidth = Math.max(1, (1 - age) * 6);

        // Main neon purple trail
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(176, 38, 255, ${alpha * 0.8})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#b026ff';
        ctx.shadowBlur = 20 * alpha;
        ctx.stroke();

        // Inner bright core
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(200, 90, 255, ${alpha * 0.5})`;
        ctx.lineWidth = Math.max(0.5, lineWidth * 0.4);
        ctx.shadowColor = '#c85aff';
        ctx.shadowBlur = 10 * alpha;
        ctx.stroke();
    }

    // Draw cursor dot at current position
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#b026ff';
    ctx.shadowColor = '#b026ff';
    ctx.shadowBlur = 25;
    ctx.fill();

    // Second glow layer
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#e0a0ff';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    requestAnimationFrame(drawTubeCursor);
}

drawTubeCursor();

// ═══════════════════════════════════════
// PRELOADER (fixed — no overlap)
// ═══════════════════════════════════════
let loadProgress = 0;
const loadDuration = 2500;
const loadInterval = 25;
const loadStep = 100 / (loadDuration / loadInterval);

function runPreloader() {
    const interval = setInterval(() => {
        loadProgress += loadStep;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(interval);

            // Trigger shrink + reveal
            setTimeout(() => {
                if (preloaderName) preloaderName.classList.add('shrink');

                setTimeout(() => {
                    if (preloader) preloader.classList.add('done');
                    if (navbar) navbar.classList.add('visible');
                }, 600);
            }, 400);
        }

        // Sync bar and name fill — both driven by loadProgress
        if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
        if (preloaderPercent) preloaderPercent.textContent = Math.round(loadProgress) + '%';
        // Name fill: update CSS variable instead of rewriting background
        if (preloaderName) {
            preloaderName.style.setProperty('--progress', `${loadProgress}%`);
        }
    }, loadInterval);
}

runPreloader();

// ═══════════════════════════════════════
// TERMINAL TYPEWRITER
// ═══════════════════════════════════════
const terminalCommands = [
    'node server.js --port 3000',
    'npm run build && npm run deploy',
    'git push origin main',
    'docker-compose up -d',
    'ssh admin@192.168.1.1',
    'python3 manage.py runserver',
    'npx create-react-app my-app',
    'ping -c 4 google.com'
];

let cmdIndex = 0;
let charIdx = 0;
let isTyping = true;
let termDelay = 80;

function typeTerminal() {
    if (!terminalText) return;

    const currentCmd = terminalCommands[cmdIndex];

    if (isTyping) {
        if (charIdx <= currentCmd.length) {
            terminalText.textContent = currentCmd.substring(0, charIdx);
            charIdx++;
            termDelay = 50 + Math.random() * 60;

            if (charIdx > currentCmd.length) {
                isTyping = false;
                termDelay = 2500;
            }
        }
    } else {
        terminalText.textContent = '';
        charIdx = 0;
        cmdIndex = (cmdIndex + 1) % terminalCommands.length;
        isTyping = true;
        termDelay = 500;
    }

    setTimeout(typeTerminal, termDelay);
}

setTimeout(typeTerminal, 3500);

// ═══════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════
if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('.navbar__mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// ═══════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll(
        '.tech-stack__item, .project-card, .about__container, .about__stat, .contact__card, .cinematic__content'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(index % 6) * 0.08}s`;
        revealObserver.observe(el);
    });
});

// ═══════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        }
    });
});

// ═══════════════════════════════════════
// NAVBAR SCROLL SHADOW
// ═══════════════════════════════════════
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.boxShadow = '0 4px 30px rgba(176, 38, 255, 0.08)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ═══════════════════════════════════════
// TRANSLATION SYSTEM
// ═══════════════════════════════════════
const translations = {
    es: {
        'nav-proyectos-link': 'Proyectos',
        'nav-sobre-mi': 'Sobre Mí',
        'nav-contacto': 'Contacto',
        'nav-inicio-mobile': 'Inicio',
        'nav-proyectos-mobile': 'Proyectos',
        'nav-sobre-mi-mobile': 'Sobre Mí',
        'nav-contacto-mobile': 'Contacto',
        'hero-subtitle': '< Desarrollador Full Stack />',
        'hero-description': 'Ingeniero Informático · CISCO CCNA · Creando el futuro digital',
        'hero-btn': 'Explorar Proyectos',
        'download-cv': 'Descargar CV',
        'tech-label': 'Stack Tecnológico',
        'tech-heading': 'Herramientas que domino',
        'cinematic-title': 'Construyendo el futuro digital',
        'cinematic-text': 'Desde infraestructura de redes hasta interfaces de usuario, cada línea de código cuenta.',
        'projects-label': 'Portafolio',
        'projects-heading': 'Proyectos Destacados',
        'geo-desc': 'Red social geolocalizada con mapas interactivos y eventos en tiempo real.',
        'ad-title': 'Páginas de Publicidad',
        'ad-desc': 'Landing pages optimizadas para conversión con diseño responsivo y analytics.',
        'network-title': 'Infraestructura de Redes',
        'network-desc': 'Diseño e implementación de redes con routing, switching y seguridad CISCO.',
        'api-desc': 'APIs escalables con autenticación JWT, validación y documentación.',
        'frontend-desc': 'Aplicaciones web interactivas con React, TypeScript y animaciones CSS.',
        'security-title': 'Seguridad de Redes',
        'security-desc': 'Configuración de firewalls, ACLs, VLANs y protocolos de seguridad.',
        'about-label': 'Sobre Mí',
        'about-p1': 'Ingeniero Informático venezolano apasionado por la tecnología. Actualmente en el 11vo trimestre en la Universidad Privada Dr. Rafael Belloso Chacín (URBE).',
        'about-p2': 'Desarrollador Full Stack con dominio de React, Node.js, TypeScript y Python. Certificado CISCO CCNA con experiencia en administración de redes e infraestructura.',
        'education-title': 'Formación Académica',
        'education-period': '2020 - Actualidad | 11vo Trimestre',
        'trimester-label': 'Trimestres',
        'years-label': 'Años Exp.',
        'cert-label': 'Certificado',
        'contact-label': 'Conectar',
        'contact-heading': 'Contacto',
        'phone-label': 'Teléfono',
        'whatsapp-value': 'Enviar mensaje',
        'linkedin-value': 'Conectar',
        'footer-rights': 'Todos los derechos reservados',
    },
    en: {
        'nav-proyectos-link': 'Projects',
        'nav-sobre-mi': 'About Me',
        'nav-contacto': 'Contact',
        'nav-inicio-mobile': 'Home',
        'nav-proyectos-mobile': 'Projects',
        'nav-sobre-mi-mobile': 'About Me',
        'nav-contacto-mobile': 'Contact',
        'hero-subtitle': '< Full Stack Developer />',
        'hero-description': 'Computer Engineer · CISCO CCNA · Building the digital future',
        'hero-btn': 'Explore Projects',
        'download-cv': 'Download CV',
        'tech-label': 'Tech Stack',
        'tech-heading': 'Tools I Master',
        'cinematic-title': 'Building the digital future',
        'cinematic-text': 'From network infrastructure to user interfaces, every line of code matters.',
        'projects-label': 'Portfolio',
        'projects-heading': 'Featured Projects',
        'geo-desc': 'Location-based social network with interactive maps and real-time events.',
        'ad-title': 'Advertising Pages',
        'ad-desc': 'Conversion-optimized landing pages with responsive design and analytics.',
        'network-title': 'Network Infrastructure',
        'network-desc': 'Network design with routing, switching and CISCO security implementation.',
        'api-desc': 'Scalable APIs with JWT authentication, validation and documentation.',
        'frontend-desc': 'Interactive web applications with React, TypeScript and CSS animations.',
        'security-title': 'Network Security',
        'security-desc': 'Firewall configuration, ACLs, VLANs and security protocols.',
        'about-label': 'About Me',
        'about-p1': 'Venezuelan Computer Engineer passionate about technology. Currently in the 11th trimester at Dr. Rafael Belloso Chacín Private University (URBE).',
        'about-p2': 'Full Stack developer with expertise in React, Node.js, TypeScript and Python. CISCO CCNA certified with network administration experience.',
        'education-title': 'Academic Education',
        'education-period': '2020 - Present | 11th Trimester',
        'trimester-label': 'Trimesters',
        'years-label': 'Years Exp.',
        'cert-label': 'Certified',
        'contact-label': 'Connect',
        'contact-heading': 'Contact',
        'phone-label': 'Phone',
        'whatsapp-value': 'Send message',
        'linkedin-value': 'Connect',
        'footer-rights': 'All rights reserved',
    }
};

let currentLanguage = localStorage.getItem('language') || 'es';

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    const langCode = document.querySelector('.lang-code');
    if (langCode) langCode.textContent = lang.toUpperCase();

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.querySelector('i')) {
                const icon = element.querySelector('i').outerHTML;
                element.innerHTML = icon + ' ' + translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLanguage);
});

if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        changeLanguage(currentLanguage === 'es' ? 'en' : 'es');
    });
}