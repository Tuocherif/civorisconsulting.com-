/* =========================
   MOBILE MENU
========================= */

const hamb = document.getElementById("hamb");
const mobilePanel = document.getElementById("mobilePanel");

if (hamb && mobilePanel) {
    hamb.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = mobilePanel.classList.toggle("show");
        mobilePanel.setAttribute("aria-hidden", String(!isOpen));
        hamb.setAttribute("aria-expanded", String(isOpen));
    });
}

/* Close when clicking a mobile link */
document.querySelectorAll('.mobile-link, .mobile-contact').forEach(link => {
    link.addEventListener('click', () => {
        mobilePanel.classList.remove('show');
        mobilePanel.setAttribute('aria-hidden', 'true');
        hamb.setAttribute('aria-expanded', 'false');
    });
});

/* Close on outside click */
document.addEventListener('click', e => {
    if (!e.target.closest('#mobilePanel') && !e.target.closest('#hamb')) {
        mobilePanel.classList.remove('show');
        mobilePanel.setAttribute('aria-hidden', 'true');
        hamb.setAttribute('aria-expanded', 'false');
    }
});

/* Close on ESC */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        mobilePanel.classList.remove('show');
        mobilePanel.setAttribute('aria-hidden', 'true');
        hamb.setAttribute('aria-expanded', 'false');
    }
});

/* Reset on resize */
window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) {
        mobilePanel.classList.remove('show');
        mobilePanel.setAttribute('aria-hidden', 'true');
        hamb.setAttribute('aria-expanded', 'false');
    }
});

/* =========================
   NAVBAR SCROLL
========================= */

window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
});

/* =========================
   FADE IN
========================= */

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
});

/* =========================
   KPI COUNTER ANIMATION
========================= */

const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const increment = target / 120;

            const update = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target;
                }
            };

            update();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.6 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

/* =========================
   LANGUAGE SYSTEM
========================= */

let currentLang = localStorage.getItem("lang") || "en";

async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}/translation.json`);
        const translations = await response.json();
        applyTranslations(translations, lang);
    } catch (error) {
        console.error("Translation loading error:", error);
    }
}

function applyTranslations(translations, lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    /* Placeholder text (form inputs / textareas) */
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (translations[key]) {
            element.setAttribute("placeholder", translations[key]);
        }
    });

    updateToggleUI(lang);
    localStorage.setItem("lang", lang);
}

function updateToggleUI(lang) {
    document.querySelectorAll(".lang-track").forEach(track => {
        track.classList.toggle("fr", lang === "fr");
    });

    document.querySelectorAll(".lang-option").forEach(option => {
        option.classList.remove("active-lang");
        if (option.textContent.trim() === lang.toUpperCase()) {
            option.classList.add("active-lang");
        }
    });

    localStorage.setItem("lang", lang);
}

function switchLanguage() {
    currentLang = currentLang === "en" ? "fr" : "en";
    loadTranslations(currentLang);
}

const langToggle = document.getElementById("langToggle");
const mobileLangToggle = document.getElementById("mobileLangToggle");

if (langToggle) langToggle.addEventListener("click", switchLanguage);
if (mobileLangToggle) mobileLangToggle.addEventListener("click", switchLanguage);

/* INITIAL LOAD */
loadTranslations(currentLang);
