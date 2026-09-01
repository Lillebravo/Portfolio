export class ResponsiveLayoutController {
  constructor() {
    this.mediaQuery = window.matchMedia("(max-width: 768px)");
  }

  initialize() {
    if (this.mediaQuery.matches) this.flattenMobileContainers();
    this.mediaQuery.addEventListener("change", (event) => {
      if (event.matches) this.flattenMobileContainers();
      else window.location.reload();
    });
  }

  flattenMobileContainers() {
    [".hero-content", ".about-text"].forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container?.parentElement) return;
      const parent = container.parentElement;
      while (container.firstChild) parent.insertBefore(container.firstChild, container);
      container.remove();
    });
  }
}