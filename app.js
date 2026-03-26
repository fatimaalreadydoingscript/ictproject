/* ============================================
   VOICES FOR PEACE — app.js
   ============================================ */

'use strict';

// ─── CURSOR ────────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

(function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
})();

// Grow cursor on interactable elements
document.querySelectorAll('a, button, input, textarea, select, .news-card, .pillar, .area-card, .resource-card, .forum-thread')
    .forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.width = '56px';
            follower.style.height = '56px';
            follower.style.borderColor = 'rgba(200,182,255,0.6)';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.width = '32px';
            follower.style.height = '32px';
            follower.style.borderColor = 'rgba(200,182,255,0.4)';
        });
    });


// ─── NAV SCROLL ─────────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
});


// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});


// ─── REVEAL ON SCROLL ────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


// ─── NEWS FILTER ─────────────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        newsCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});


// ─── NEWSLETTER ──────────────────────────────────────────────────────────────
function handleNewsletter(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const email = input.value.trim();
    if (!email) return;
    input.value = '';
    showToast(`✓ Subscribed! Welcome to the daily digest.`);
}


// ─── MODALS ──────────────────────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');
const modalEl = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

const modalTemplates = {
    register: {
        title: 'Create Account',
        desc: 'Join the community to participate in forum discussions.',
        fields: [
            { type: 'text', placeholder: 'Display name', name: 'name' },
            { type: 'email', placeholder: 'Email address', name: 'email' },
            { type: 'password', placeholder: 'Password', name: 'password' },
        ],
        cta: 'Create Account',
    },
    login: {
        title: 'Sign In',
        desc: 'Welcome back. Sign in to participate in discussions.',
        fields: [
            { type: 'email', placeholder: 'Email address', name: 'email' },
            { type: 'password', placeholder: 'Password', name: 'password' },
        ],
        cta: 'Sign In',
    },
    volunteer: {
        title: 'Volunteer',
        desc: 'Help with content moderation, translation, outreach, and more.',
        fields: [
            { type: 'text', placeholder: 'Full name', name: 'name' },
            { type: 'email', placeholder: 'Email address', name: 'email' },
            { type: 'text', placeholder: 'Skills / area of interest', name: 'skills' },
        ],
        cta: 'Submit Application',
    },
    donate: {
        title: 'Support the Campaign',
        desc: 'Your contribution funds content production, development, and outreach.',
        fields: [
            { type: 'text', placeholder: 'Full name', name: 'name' },
            { type: 'email', placeholder: 'Email address', name: 'email' },
            { type: 'text', placeholder: 'Amount (₱)', name: 'amount' },
        ],
        cta: 'Donate Now',
    },
    contact: {
        title: 'Get in Touch',
        desc: 'For partnerships, media inquiries, or general questions.',
        fields: [
            { type: 'text', placeholder: 'Your name', name: 'name' },
            { type: 'email', placeholder: 'Email address', name: 'email' },
            { type: 'textarea', placeholder: 'Message…', name: 'message' },
        ],
        cta: 'Send Message',
    },
};

function openModal(type) {
    const t = modalTemplates[type];
    if (!t) return;

    const fieldsHTML = t.fields.map(f => {
        if (f.type === 'textarea') {
            return `<textarea placeholder="${f.placeholder}" name="${f.name}" rows="4"></textarea>`;
        }
        return `<input type="${f.type}" placeholder="${f.placeholder}" name="${f.name}" />`;
    }).join('');

    modalContent.innerHTML = `
    <h3>${t.title}</h3>
    <p>${t.desc}</p>
    <form class="modal-form" onsubmit="handleModalSubmit(event,'${type}')">
      ${fieldsHTML}
      <button type="submit" class="btn-primary">${t.cta}</button>
    </form>
  `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function handleModalSubmit(e, type) {
    e.preventDefault();
    closeModal();
    const messages = {
        register: '✓ Account created! Check your email to verify.',
        login: '✓ Signed in successfully.',
        volunteer: '✓ Application submitted! We\'ll be in touch soon.',
        donate: '✓ Thank you for your support!',
        contact: '✓ Message sent. We\'ll respond within 48 hours.',
    };
    showToast(messages[type] || '✓ Done!');
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});


// ─── TOAST ───────────────────────────────────────────────────────────────────
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
}


// ─── SIMULATE DOWNLOAD ───────────────────────────────────────────────────────
function simulateDownload(e, filename) {
    e.preventDefault();
    showToast(`⬇ Downloading ${filename}…`);
}

function simulatePlay(e) {
    e.preventDefault();
    showToast('▶ Opening video player…');
}


// ─── ACCESSIBILITY ───────────────────────────────────────────────────────────
let baseFontSize = 16;

function changeFontSize(delta) {
    baseFontSize = Math.max(12, Math.min(22, baseFontSize + delta));
    document.documentElement.style.setProperty('--font-size-base', `${baseFontSize}px`);
    document.documentElement.style.fontSize = `${baseFontSize}px`;
    showToast(`Font size: ${baseFontSize}px`);
}

function toggleContrast() {
    document.documentElement.classList.toggle('high-contrast');
    const on = document.documentElement.classList.contains('high-contrast');
    showToast(on ? '◑ High contrast enabled' : '◑ High contrast disabled');
}


// ─── LANG SWITCHER ───────────────────────────────────────────────────────────
const translations = {
    en: {
        missionTitle: 'Informed citizens advocate for peace.',
        missionBody: 'We educate and empower communities with accurate, factual, and balanced information about the 2026 US–Iran War — its humanitarian impact, and the importance of diplomacy and peaceful conflict resolution.',
    },
    fil: {
        missionTitle: 'Ang mga may-alam na mamamayan ay nagtataguyod ng kapayapaan.',
        missionBody: 'Aming tinuturuan at binibigyan ng kapangyarihan ang mga komunidad ng tumpak, makatotohanang, at balanseng impormasyon tungkol sa Digmaan ng US–Iran 2026 — ang epekto nito sa sangkatauhan, at ang kahalagahan ng diplomasya at mapayapang resolusyon ng alitan.',
    },
};

function switchLang(lang) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[onclick="switchLang('${lang}')"]`)?.classList.add('active');

    const t = translations[lang];
    if (!t) return;

    const mh = document.querySelector('.mission-text h2');
    const mp = document.querySelector('.mission-text p');
    if (mh) mh.innerHTML = t.missionTitle;
    if (mp) mp.textContent = t.missionBody;

    showToast(lang === 'fil' ? '✓ Filipino / Tagalog' : '✓ English');
}


// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


// ─── TIMELINE HOVER INTERACTION ──────────────────────────────────────────────
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        document.querySelectorAll('.timeline-item').forEach(i => {
            i.style.opacity = i === item ? '1' : '0.4';
        });
    });
    item.addEventListener('mouseleave', () => {
        document.querySelectorAll('.timeline-item').forEach(i => {
            i.style.opacity = '1';
        });
    });
});


// ─── HERO PARALLAX ───────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
}, { passive: true });


// ─── INITIAL HERO REVEAL ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-delay-1, .hero .reveal-delay-2, .hero .reveal-delay-3')
        .forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 200 + i * 180);
        });
});