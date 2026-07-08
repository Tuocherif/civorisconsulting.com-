const hamb =
document.getElementById("hamb");

const mobilePanel =
document.getElementById("mobilePanel");

/* =========================
   MOBILE MENU
========================= */

hamb.addEventListener("click", (e) => {

e.stopPropagation();

const isOpen =
mobilePanel.classList.toggle("show");

mobilePanel.setAttribute(
"aria-hidden",
String(!isOpen)
);

hamb.setAttribute(
"aria-expanded",
String(isOpen)
);

});

document.addEventListener("click", e => {

if(
!e.target.closest("#mobilePanel")
&& !e.target.closest("#hamb")
){

mobilePanel.classList.remove("show");

hamb.setAttribute(
"aria-expanded",
"false"
);

}

});

/* =========================
   NAVBAR SCROLL
========================= */

window.addEventListener("scroll", () => {

document
.getElementById("navbar")
.classList.toggle(
"scrolled",
window.scrollY > 20
);

});

/* =========================
   FADE IN
========================= */

const observer =
new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("visible");

}

});

},{ threshold:0.15 });

document
.querySelectorAll(".fade-in")
.forEach(el => observer.observe(el));

/* =========================
   LANGUAGE SYSTEM
========================= */

let currentLang =
localStorage.getItem("lang") || "en";

async function loadTranslations(lang){

try{

const response =
await fetch(
`locales/${lang}/translation.json`
);

const translations =
await response.json();

applyTranslations(
translations,
lang
);

}
catch(error){

console.error(
"Translation loading error:",
error
);

}

}

function applyTranslations(
translations,
lang
){

document.documentElement.lang = lang;

document
.querySelectorAll("[data-i18n]")
.forEach(element => {

const key =
element.getAttribute("data-i18n");

if(translations[key]){

element.textContent =
translations[key];

}

});

/* Placeholder text (form inputs / textareas) */
document
.querySelectorAll("[data-i18n-placeholder]")
.forEach(element => {

const key =
element.getAttribute("data-i18n-placeholder");

if(translations[key]){

element.setAttribute(
"placeholder",
translations[key]
);

}

});

updateToggleUI(lang);

localStorage.setItem(
"lang",
lang
);

}

function updateToggleUI(lang){

const track =
document.querySelector(".lang-track");

if(track){

if(lang === "fr"){

track.classList.add("fr");

}
else{

track.classList.remove("fr");

}

}

document
.querySelectorAll(".lang-option")
.forEach(option => {

option.classList.remove("active-lang");

if(option.textContent.trim() === lang.toUpperCase()){

option.classList.add("active-lang");

}

});

localStorage.setItem(
"lang",
lang
);

}

function switchLanguage(){

currentLang =
currentLang === "en"
? "fr"
: "en";

loadTranslations(currentLang);

}

document
.getElementById("langToggle")
.addEventListener(
"click",
switchLanguage
);

document
.getElementById("mobileLangToggle")
.addEventListener(
"click",
switchLanguage
);

/* INITIAL LOAD */
loadTranslations(currentLang);
