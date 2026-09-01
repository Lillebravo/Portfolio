import { AnimationController } from "./components/animation-controller.js";
import { CardController } from "./components/card-controller.js";
import { ContactFormController } from "./components/contact-form-controller.js";
import { ModalController } from "./components/modal-controller.js";
import { NavigationController } from "./components/navigation-controller.js";
import { ResponsiveLayoutController } from "./components/responsive-layout-controller.js";
import { ThemeController } from "./components/theme-controller.js";
import { TranslationService } from "./services/translation-service.js";

class PortfolioApp {
  constructor() {
    this.translations = new TranslationService();
    this.languageToggle = document.getElementById("languageToggle");
  }

  initialize() {
    new ThemeController(document.getElementById("themeToggle")).initialize();
    new AnimationController().initialize();
    new NavigationController().initialize();
    new ModalController(this.translations).initialize();
    new CardController(this.translations).initialize();
    new ResponsiveLayoutController().initialize();
    new ContactFormController().initialize();
    this.initializeLanguage();
  }

  initializeLanguage() {
    const savedLanguage = localStorage.getItem("language") || "sv";
    this.changeLanguage(savedLanguage, false);
    this.languageToggle?.addEventListener("click", () => {
      const nextLanguage = document.documentElement.lang === "sv" ? "en" : "sv";
      this.changeLanguage(nextLanguage, true);
    });
  }

  async changeLanguage(language, persist) {
    try {
      await this.translations.load(language);
      if (persist) localStorage.setItem("language", language);
      this.translations.apply(language);
    } catch (error) {
      console.error("Could not load language file.", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new PortfolioApp().initialize());