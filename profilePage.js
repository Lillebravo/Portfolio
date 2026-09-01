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

async function loadLanguageFile(language) {
  if (window.portfolioTranslations?.[language]) return;

  const response = await fetch(`lang/${language}.json`);
  if (!response.ok) throw new Error(`Could not load ${language} translations.`);

  window.portfolioTranslations = window.portfolioTranslations || {};
  window.portfolioTranslations[language] = await response.json();
}

function applyLanguage(language) {
  const translations = window.portfolioTranslations?.[language];
  if (!translations) return;

  const translate = (key) => {
    return translations[key];
  };
  const setText = (selector, keys) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      const value = keys[index] && translate(keys[index]);
      if (value !== undefined) element.textContent = value;
    });
  };

  document.documentElement.lang = language;
  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) languageToggle.textContent = language === "sv" ? "EN" : "SV";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translate(element.dataset.i18n);
    if (value !== undefined) {
      element[element.dataset.i18nHtml === "true" ? "innerHTML" : "textContent"] = value;
    }
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((mapping) => {
      const [attribute, key] = mapping.trim().split(":");
      const value = translate(key);
      if (value !== undefined) element.setAttribute(attribute, value);
    });
  });

  setText(".case-detail h3", Array(5).fill(["case.problem", "case.solution", "case.result"]).flat());
  setText(".case-detail p", ["project.wedding.problem", "project.wedding.solution", "project.wedding.result", "project.crm.problem", "project.crm.solution", "project.crm.result", "project.provsmart.problem", "project.provsmart.solution", "project.provsmart.result", "project.invoice.problem", "project.invoice.solution", "project.invoice.result", "project.omni.problem", "project.omni.solution", "project.omni.result"]);
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
  setText(".service-card h3", ["services.title1", "services.title2", "services.title3", "services.title4"]);
  setText(".service-card p", ["services.copy1", "services.copy2", "services.copy3", "services.copy4"]);
  const firstServiceCopy = document.querySelector(".service-card p");
  const firstServiceCopyText = translate("services.copy1");
  if (firstServiceCopy && firstServiceCopyText !== undefined) firstServiceCopy.innerHTML = firstServiceCopyText;
  setText(".services-note", ["services.note"]);
  setText(".services-cta", ["services.cta"]);
  document.querySelector(".articles h2").innerHTML = `${translate("articles.heading")} <span class="applyCyanColor">${translate("articles.accent")}</span>`;
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
  setText("#projectType option", ["contact.service.default", "contact.service.website", "contact.service.app", "contact.service.saas", "contact.service.seo", "contact.service.consulting", "contact.service.other"]);
  setText("#budget option", ["contact.budget.default", "contact.budget.under", "contact.budget.mid1", "contact.budget.high", "contact.budget.unsure"]);
  document.getElementById("firstName").placeholder = translate("contact.first.placeholder");
  document.getElementById("lastName").placeholder = translate("contact.last.placeholder");
  document.getElementById("email").placeholder = translate("contact.email.placeholder");
  document.getElementById("message").placeholder = translate("contact.message.placeholder");
  setText(".contact-form button", ["contact.submit"]);
  setText(".contact-details h3", ["contact.conversation"]);
  setText(".contact-details > p", ["contact.conversation.copy"]);
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
  const aboutSection = document.getElementById("about");

  function toggleNavbarVisibility() {
    if (navbar && aboutSection && window.innerWidth > 768) {
      navbar.classList.toggle("navbar-hidden", window.scrollY < aboutSection.offsetTop);
    } else if (navbar) {
      navbar.classList.remove("navbar-hidden");
    }
  }

  window.addEventListener("scroll", toggleNavbarVisibility, { passive: true });
  window.addEventListener("resize", toggleNavbarVisibility);
  toggleNavbarVisibility();

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("show");
      navbar.classList.toggle("nav-visible");
      const menuIsOpen = navMenu.classList.contains("show");
      menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
      menuToggle.setAttribute("aria-label", menuIsOpen ? "Stäng meny" : "Öppna meny");
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        navbar.classList.remove("nav-visible");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Öppna meny");
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

  if (contactForm) {
    contactForm.addEventListener("invalid", function (event) {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

      let message = contactForm.dataset.validationRequired;
      if (field.type === "email" && !field.validity.valueMissing) {
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

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const statusMessage = contactForm.querySelector(".form-status");
      const formData = new FormData(contactForm);
      const isSwedish = document.documentElement.lang === "sv";
      const defaultButtonText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = isSwedish ? "Skickar..." : "Sending...";
      statusMessage.textContent = "";
      statusMessage.className = "form-status";

      try {
        const response = await fetch("https://api.jerrylundahl.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        if (!response.ok) throw new Error("Contact request failed.");

        contactForm.reset();
        statusMessage.textContent = isSwedish
          ? "Tack! Din förfrågan har skickats."
          : "Thank you! Your inquiry has been sent.";
        statusMessage.classList.add("is-success");
      } catch (error) {
        console.error("Could not send contact form.", error);
        statusMessage.textContent = isSwedish
          ? "Det gick inte att skicka just nu. Försök igen eller mejla mig direkt."
          : "The message could not be sent. Please try again or email me directly.";
        statusMessage.classList.add("is-error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
        if (window.turnstile) window.turnstile.reset();
      }
    });
  }
});
