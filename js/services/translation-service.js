export class TranslationService {
  constructor() {
    this.translations = window.portfolioTranslations || {};
    window.portfolioTranslations = this.translations;
  }

  async load(language) {
    if (this.translations[language]) return;

    const response = await fetch(`lang/${language}.json`);
    if (!response.ok) throw new Error(`Could not load ${language} translations.`);
    this.translations[language] = await response.json();
  }

  get(language, key) {
    return this.translations[language]?.[key];
  }

  apply(language) {
    const translate = (key) => this.get(language, key);
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
      if (value !== undefined) element[element.dataset.i18nHtml === "true" ? "innerHTML" : "textContent"] = value;
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

    this.setHtml(".services h2", `${translate("services.heading")} <span class="applyCyanColor">${translate("services.accent")}</span>`);
    this.setHtml(".services-intro", translate("services.intro"));
    setText(".service-card h3", ["services.title1", "services.title2", "services.title3", "services.title4"]);
    setText(".service-card p", ["services.copy1", "services.copy2", "services.copy3", "services.copy4"]);
    this.setHtml(".service-card p", translate("services.copy1"));
    setText(".services-note", ["services.note"]);
    setText(".services-cta", ["services.cta"]);
    this.setHtml(".articles h2", `${translate("articles.heading")} <span class="applyCyanColor">${translate("articles.accent")}</span>`);
    this.setHtml(".skills h2", `${translate("skills.heading")} <span class="applyCyanColor">${translate("skills.accent")}</span>`);
    setText(".skills > .section-intro", ["skills.intro"]);
    setText(".skills-category h3", ["skills.security", "skills.backend", "skills.frontend", "skills.database"]);
    setText(".contact-header h2", ["contact.header"]);
    this.setHtml(".contact-intro h2", `${translate("contact.heading")} <span class="applyCyanColor">${translate("contact.accent")}</span>`);
    setText(".contact-eyebrow", ["contact.eyebrow"]);
    setText(".contact-intro > p:last-child", ["contact.copy"]);
    setText(".contact-form h3", ["contact.details"]);
    setText(".form-field label", ["contact.first", "contact.last", "contact.email", "contact.type", "contact.budget", "contact.message"]);
    document.querySelectorAll(".form-field label").forEach((label, index) => {
      if ([0, 1, 2, 5].includes(index) && !label.querySelector("span[aria-hidden]")) label.insertAdjacentHTML("beforeend", ' <span aria-hidden="true">*</span>');
    });
    setText("#projectType option", ["contact.service.default", "contact.service.website", "contact.service.app", "contact.service.saas", "contact.service.seo", "contact.service.consulting", "contact.service.other"]);
    setText("#budget option", ["contact.budget.default", "contact.budget.under", "contact.budget.mid1", "contact.budget.high", "contact.budget.unsure"]);
    this.setPlaceholder("firstName", translate("contact.first.placeholder"));
    this.setPlaceholder("lastName", translate("contact.last.placeholder"));
    this.setPlaceholder("email", translate("contact.email.placeholder"));
    this.setPlaceholder("message", translate("contact.message.placeholder"));
    setText(".contact-form button", ["contact.submit"]);
    setText(".contact-details h3", ["contact.conversation"]);
    setText(".contact-details > p", ["contact.conversation.copy"]);
    setText(".response-card h4", ["contact.available"]);
    setText(".response-card p", ["contact.reply"]);
    document.querySelector(".contact-details")?.setAttribute("aria-label", translate("contact.aria"));
    this.setHtml(".site-footer p:first-child", language === "sv" ? "&copy; 2026 ScaleWeb Solutions. Innehar F-skatt." : "&copy; 2026 ScaleWeb Solutions. Holds Swedish F-tax approval.");
    setText(".site-footer p:nth-child(2)", ["footer.copy"]);
    setText(".cv-download-btn", ["cv.download"]);
    document.getElementById("cvModalClose")?.setAttribute("aria-label", translate("cv.close"));
    const cvTitle = document.querySelector(".cv-modal-header h3");
    if (cvTitle) cvTitle.textContent = translate("cv.title");
    document.dispatchEvent(new CustomEvent("portfolio-language-changed"));
  }

  setHtml(selector, value) {
    const element = document.querySelector(selector);
    if (element && value !== undefined) element.innerHTML = value;
  }

  setPlaceholder(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) element.placeholder = value;
  }
}