// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1
};

const observerCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("scroll-revealed");
      
      // For project cards, add staggered animation
      if (entry.target.dataset.projectAnimate !== undefined) {
        entry.target.classList.add("project-animate-in");
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const sunIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
const moonIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

function loadLanguageFile(language) {
  if (window.portfolioTranslations?.[language]) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `lang/${language}.json`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function applyLanguage(language) {
  const translations = window.portfolioTranslations?.[language];
  if (!translations) return;

  const swedishCharacters = {
    "affar": "affär", "Affar": "Affär", "ar": "är", "Ar": "Är", "battre": "bättre", "Battre": "Bättre",
    "dar": "där", "Dar": "Där", "floden": "flöden", "Floden": "Flöden", "flode": "flöde", "Flode": "Flöde", "foretag": "företag", "Foretag": "Företag", "foretaget": "företaget", "foretagets": "företagets",
    "for": "för", "For": "För", "fran": "från", "Fran": "Från", "hjalper": "hjälper", "Hjalper": "Hjälper", "hjalpa": "hjälpa", "Hjalpa": "Hjälpa",
    "hog": "hög", "Hog": "Hög", "hogpresterande": "högpresterande", "ide": "idé", "Ide": "Idé", "langre": "längre", "Langre": "Längre",
    "losning": "lösning", "Losning": "Lösning", "losningen": "lösningen", "Losningen": "Lösningen", "losningar": "lösningar", "Losningar": "Lösningar", "mal": "mål", "Mal": "Mål", "mots": "möts", "Mots": "Möts",
    "nagot": "något", "Nagot": "Något", "nojdare": "nöjdare", "Nojdare": "Nöjdare", "osaker": "osäker", "Osaker": "Osäker", "pa": "på", "Pa": "På", "ratt": "rätt", "Ratt": "Rätt",
    "salj": "sälj", "Salj": "Sälj", "saljare": "säljare", "Saljare": "Säljare", "saljteamet": "säljteamet", "Saljteamet": "Säljteamet", "saker": "säker", "Saker": "Säker", "sakerhet": "säkerhet", "Sakerhet": "Säkerhet", "sakerhetsgrunder": "säkerhetsgrunder", "sakerhetsmedveten": "säkerhetsmedveten", "tjanster": "tjänster", "Tjanster": "Tjänster",
    "tjanst": "tjänst", "Tjanst": "Tjänst", "tillganglig": "tillgänglig", "Tillganglig": "Tillgänglig", "upptack": "upptäck", "Upptack": "Upptäck",
    "vagen": "vägen", "Vagen": "Vägen", "verktygslada": "verktygslåda", "Verktygslada": "Verktygslåda", "webblosning": "webblösning", "webblosningar": "webblösningar", "Over": "Över", "over": "över",
    "Gastlistor": "Gästlistor", "svartoverskadligt": "svårtöverskådligt", "kokslista": "kökslista", "sa": "så", "paret": "paret", "behovde": "behövde", "satt": "sätt", "affarer": "affärer", "agarskap": "ägarskap", "molnbaserade": "molnbaserade", "vektorsokning": "vektorsökning", "sokning": "sökning", "sokbar": "sökbar", "latt": "lätt", "bortglomda": "bortglömda", "gor": "gör", "fortsatter": "fortsätter", "anvander": "använder", "paminner": "påminner", "fornyelse": "förnyelse", "fore": "före", "stod": "stöd", "upptackt": "upptäckt", "upptacka": "upptäcka", "vaxa": "växa", "serverlosa": "serverlösa", "mikrotjanster": "mikrotjänster", "miljoer": "miljöer", "bitradande": "biträdande", "overvakade": "övervakade", "hoga": "höga", "handelser": "händelser", "genomforde": "genomförde", "lopande": "löpande", "annu": "ännu", "borjar": "börjar", "foreslar": "föreslår", "skraddarsydda": "skräddarsydda", "sokbarhet": "sökbarhet", "borjan": "början", "kostnadsoversikt": "kostnadsöversikt", "Sma": "Små", "bokforingssystem": "bokföringssystem", "bokforing": "bokföring", "prisberakning": "prisberäkning", "bokforingsunderlag": "bokföringsunderlag", "redovisningsbyran": "redovisningsbyrån", "arbetsflode": "arbetsflöde", "behover": "behöver", "fullstandiga": "fullständiga", "flersprakighet": "flerspråkighet", "anvandbart": "användbart", "Varfor": "Varför", "Nar": "När", "hallbar": "hållbar", "skraddarsytt": "skräddarsytt", "tillforlitliga": "tillförlitliga", "Har": "Har", "atanke": "åtanke", "Lat": "Låt", "Beratta": "Berätta", "aterkommer": "återkommer", "nasta": "nästa", "Fornamn": "Förnamn", "fornamn": "förnamn", "Valj": "Välj", "valkommen": "välkommen", "hora": "höra", "forfragan": "förfrågan", "Stang": "Stäng"
  };
  const translate = (key) => {
    const value = translations[key] || key;
    if (language !== "sv") return value;
    return value.replace(/\b[\p{L}]+\b/gu, (word) => swedishCharacters[word] || word);
  };
  const setText = (selector, keys) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (keys[index]) element.textContent = translate(keys[index]);
    });
  };

  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translate(element.dataset.i18n);
    element[element.dataset.i18nHtml === "true" ? "innerHTML" : "textContent"] = value;
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((mapping) => {
      const [attribute, key] = mapping.trim().split(":");
      element.setAttribute(attribute, translate(key));
    });
  });

  setText(".case-detail h3", Array(5).fill(["case.problem", "case.solution", "case.result"]).flat());
  setText(".case-detail p", ["project.wedding.problem", "project.wedding.solution", "project.wedding.result", "project.crm.problem", "project.crm.solution", "project.crm.result", "project.provsmart.problem", "project.provsmart.solution", "project.provsmart.result", "project.invoice.problem", "project.invoice.solution", "project.invoice.result", "project.omni.problem", "project.omni.solution", "project.omni.result"]);
  setText(".projectHeader", [null, null, "project.provsmart.title", "project.invoice.title", "project.omni.title"]);
  document.querySelectorAll(".project-code").forEach((element) => {
    const label = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (label) label.textContent = translate("project.code");
  });
  setText(".project-demo", Array(5).fill("project.demo.label"));
  document.querySelectorAll(".project-code.is-unavailable").forEach((element, index) => {
    element.dataset.tooltip = translate(index === 0 ? "project.private" : "project.coming");
  });
  document.querySelectorAll(".project-demo.is-unavailable").forEach((element) => {
    element.dataset.tooltip = translate("project.demo");
  });
  document.querySelector(".services h2").innerHTML = `${translate("services.heading")} <span class="applyCyanColor">${translate("services.accent")}</span>`;
  document.querySelector(".services-intro").innerHTML = translate("services.intro");
  setText(".service-card h3", ["services.title1", "services.title2", "services.title3"]);
  setText(".service-card p", ["services.copy1", "services.copy2", "services.copy3"]);
  setText(".services-note", ["services.note"]);
  setText(".services-cta", ["services.cta"]);
  document.querySelector(".articles h2").innerHTML = `${translate("articles.heading")} <span class="applyCyanColor">${translate("articles.accent")}</span>`;
  setText(".article-card h3", ["article1.title", "article2.title", "article3.title"]);
  setText(".article-card > p:not(.article-meta)", ["article1.copy", "article2.copy", "article3.copy"]);
  setText(".article-status", Array(3).fill("article.status"));
  setText(".article-meta", [null, null, "article3.meta"]);
  document.querySelector(".skills h2").innerHTML = `${translate("skills.heading")} <span class="applyCyanColor">${translate("skills.accent")}</span>`;
  setText(".skills > .section-intro", ["skills.intro"]);
  setText(".skills-category h3", ["skills.security", "skills.backend", "skills.frontend", "skills.database"]);
  setText(".contact-header h2", ["contact.header"]);
  document.querySelector(".contact-intro h2").innerHTML = `${translate("contact.heading")} <span class="applyCyanColor">${translate("contact.accent")}</span>`;
  setText(".contact-eyebrow", ["contact.eyebrow"]);
  setText(".contact-intro > p:last-child", ["contact.copy"]);
  setText(".contact-form h3", ["contact.details"]);
  setText(".form-field label", ["contact.first", "contact.last", "contact.email", "contact.type", "contact.budget", "contact.message"]);
  document.querySelectorAll(".form-field label").forEach((label, index) => {
    if ([0, 1, 2, 5].includes(index)) label.insertAdjacentHTML("beforeend", ' <span aria-hidden="true">*</span>');
  });
  setText("#projectType option", ["contact.service.default", "contact.service.website", "contact.service.saas", "contact.service.seo", "contact.service.consulting", "contact.service.other"]);
  setText("#budget option", ["contact.budget.default", "contact.budget.under", "contact.budget.mid1", "contact.budget.mid2", "contact.budget.high", "contact.budget.unsure"]);
  document.getElementById("firstName").placeholder = translate("contact.first.placeholder");
  document.getElementById("lastName").placeholder = translate("contact.last.placeholder");
  document.getElementById("email").placeholder = translate("contact.email.placeholder");
  document.getElementById("message").placeholder = translate("contact.message.placeholder");
  setText(".contact-form button", ["contact.submit"]);
  setText(".contact-details h3", ["contact.conversation"]);
  setText(".contact-details > p", ["contact.conversation.copy"]);
  setText(".contact-method small", [null, null, "contact.based"]);
  setText(".contact-method > span:last-child", [null, null, "contact.location"]);
  setText(".response-card h4", ["contact.available"]);
  setText(".response-card p", ["contact.reply"]);
  document.querySelector(".contact-details").setAttribute("aria-label", translate("contact.aria"));
  document.querySelector(".site-footer p:first-child").innerHTML = language === "sv"
    ? "&copy; 2026 ScaleWeb Solutions. Innehar F-skatt."
    : "&copy; 2026 ScaleWeb Solutions. Holds Swedish F-tax approval.";
  setText(".site-footer p:nth-child(2)", ["footer.copy"]);
  setText(".cv-download-btn", ["cv.download"]);
  document.getElementById("cvModalClose").setAttribute("aria-label", translate("cv.close"));
  document.querySelector(".cv-modal-header h3").textContent = translate("cv.title");
}

document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById("themeToggle");
  const languageToggle = document.getElementById("languageToggle");
  const htmlElement = document.documentElement;
  const body = document.body;
  const savedLanguage = localStorage.getItem("language") || "sv";

  loadLanguageFile(savedLanguage)
    .then(() => applyLanguage(savedLanguage))
    .catch((error) => console.error("Could not load saved language file.", error));
  languageToggle.addEventListener("click", async function () {
    const nextLanguage = document.documentElement.lang === "sv" ? "en" : "sv";
    try {
      await loadLanguageFile(nextLanguage);
      localStorage.setItem("language", nextLanguage);
      applyLanguage(nextLanguage);
    } catch (error) {
      console.error("Could not load language file.", error);
    }
  });
  
  // Respect the device theme until the visitor makes an explicit choice.
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const activeTheme = savedTheme || (prefersDarkTheme ? "dark" : "light");
  body.classList.toggle("light-mode", activeTheme === "light");
  themeToggle.innerHTML = activeTheme === "light" ? moonIcon : sunIcon;

  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      body.classList.toggle("light-mode");
      const isLightMode = body.classList.contains("light-mode");
      localStorage.setItem("theme", isLightMode ? "light" : "dark");
      themeToggle.innerHTML = isLightMode ? moonIcon : sunIcon;
    });
  }

  // Observe scroll-animate elements
  const scrollElements = document.querySelectorAll("[data-scroll-animate]");
  scrollElements.forEach((el) => {
    observer.observe(el);
  });

  // Observe project cards
  const projectElements = document.querySelectorAll("[data-project-animate]");
  projectElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.15}s`;
    observer.observe(el);
  });

  // Observe timeline items
  const timelineItems = document.querySelectorAll("[data-timeline-animate]");
  timelineItems.forEach((el) => {
    observer.observe(el);
  });

  // Observe skill cards
  const skillCards = document.querySelectorAll("[data-skill-animate]");
  skillCards.forEach((el) => {
    observer.observe(el);
  });

  // Menu Toggle (Mobile)
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar nav");
  const navbar = document.querySelector(".navbar");
  const logo = document.querySelector(".logo");
  const aboutSection = document.getElementById("about");

  function toggleNavbarVisibility() {
    if (navbar && aboutSection) {
      navbar.classList.toggle("navbar-hidden", window.scrollY < aboutSection.offsetTop);
    }
  }

  window.addEventListener("scroll", toggleNavbarVisibility, { passive: true });
  window.addEventListener("resize", toggleNavbarVisibility);
  toggleNavbarVisibility();

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("show");
      navbar.classList.toggle("nav-visible");

      if (navMenu.classList.contains("show")) {
        logo.style.display = "block";
      } else {
        logo.style.display = "none";
      }
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        navbar.classList.remove("nav-visible");
      });
    });
  }

  // Function to check if user has scrolled near the bottom of the page
  function isNearBottom() {
    return (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 100
    );
  }

  const siteFooter = document.querySelector(".site-footer");
  function toggleFooterVisibility() {
    if (siteFooter) {
      if (isNearBottom()) {
        siteFooter.classList.add("visible");
      } else {
        siteFooter.classList.remove("visible");
      }
    }
  }

  window.addEventListener("scroll", toggleFooterVisibility);

  // Initial check on page load
  toggleFooterVisibility();

  // CV Viewer Modal
  const viewCvBtn = document.getElementById("viewCvBtn");
  const cvModalOverlay = document.getElementById("cvModalOverlay");
  const cvModalClose = document.getElementById("cvModalClose");

  function openCvModal() {
    cvModalOverlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeCvModal() {
    cvModalOverlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  if (viewCvBtn && cvModalOverlay) {
    viewCvBtn.addEventListener("click", openCvModal);
    cvModalClose.addEventListener("click", closeCvModal);

    cvModalOverlay.addEventListener("click", function (event) {
      if (event.target === cvModalOverlay) {
        closeCvModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && cvModalOverlay.classList.contains("visible")) {
        closeCvModal();
      }
    });
  }

  // Flatten container for mobile responsive
  function flattenContainer(selectedContainer) {
    const container = document.querySelector(selectedContainer);
    if (container) {
      const parent = container.parentElement;

      // Move all child elements of container to the parent
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, container);
      }

      // Remove the now-empty container element
      container.remove();
    }
  }

  const mediaQuery = window.matchMedia("(max-width: 768px)");

  function reloadOnResize() {
    if (!mediaQuery.matches) {
      window.location.reload();
    }
  }

  if (mediaQuery.matches) {
    flattenContainer(".hero-content");
    flattenContainer(".about-text");
  }

  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) {
      flattenContainer(".hero-content");
      flattenContainer(".about-text");
    } else {
      reloadOnResize();
    }
  });

  // Add tooltips to project headers
  const projects = document.querySelector(".projects");
  const projectTitles = document.querySelectorAll(".projectHeader");
  const tooltipText = projects?.getAttribute("data-tooltip");

  if (tooltipText) {
    projectTitles.forEach((title) => {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      tooltip.textContent = tooltipText;
      // Uncomment if tooltip styling exists
      // title.appendChild(tooltip);
    });
  }

  // Expand/collapse long cards (project cases & education) on smaller screens
  document.querySelectorAll(".card-expand-toggle").forEach((button) => {
    button.addEventListener("click", function () {
      const card = button.closest(".project, .education-card");
      if (!card) return;

      const isExpanded = card.classList.toggle("is-expanded");
      button.setAttribute("aria-expanded", String(isExpanded));

      const label = button.querySelector(".card-expand-label");
      if (label) {
        const key = isExpanded ? "card.collapse" : "card.expand";
        label.dataset.i18n = key;
        const translations = window.portfolioTranslations?.[document.documentElement.lang];
        label.textContent = translations?.[key] || label.textContent;
      }
    });
  });

  const contactForm = document.querySelector(".contact-form");
  const humanCheck = document.getElementById("humanCheck");

  if (contactForm && humanCheck) {
    contactForm.addEventListener("invalid", function (event) {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

      let message = contactForm.dataset.validationRequired;
      if (field === humanCheck) {
        message = contactForm.dataset.validationHuman;
        field.closest(".human-check")?.classList.add("is-invalid");
      } else if (field.type === "email" && !field.validity.valueMissing) {
        message = contactForm.dataset.validationEmail;
      }

      field.setCustomValidity(message || "Please complete this field.");
    }, true);

    contactForm.addEventListener("input", function (event) {
      const field = event.target;
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity("");
      }
    });

    humanCheck.addEventListener("change", function () {
      humanCheck.setCustomValidity("");
      humanCheck.closest(".human-check")?.classList.toggle("is-invalid", !humanCheck.checked);
    });
  }
});
