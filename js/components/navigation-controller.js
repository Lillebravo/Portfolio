export class NavigationController {
  constructor() {
    this.menuToggle = document.querySelector(".menu-toggle");
    this.navMenu = document.querySelector(".navbar nav");
    this.navbar = document.querySelector(".navbar");
    this.aboutSection = document.getElementById("about");
    this.footer = document.querySelector(".site-footer");
  }

  initialize() {
    this.updateNavbarVisibility();
    this.updateFooterVisibility();
    window.addEventListener("scroll", () => { this.updateNavbarVisibility(); this.updateFooterVisibility(); }, { passive: true });
    window.addEventListener("resize", () => this.updateNavbarVisibility());
    this.menuToggle?.addEventListener("click", () => this.toggleMenu());
    this.navMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => this.closeMenu()));
  }

  updateNavbarVisibility() {
    if (!this.navbar) return;
    if (this.aboutSection && window.innerWidth > 768) this.navbar.classList.toggle("navbar-hidden", window.scrollY < this.aboutSection.offsetTop);
    else this.navbar.classList.remove("navbar-hidden");
  }

  updateFooterVisibility() {
    if (this.footer) this.footer.classList.toggle("visible", window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100);
  }

  toggleMenu() {
    if (!this.navMenu || !this.navbar || !this.menuToggle) return;
    const isOpen = this.navMenu.classList.toggle("show");
    this.navbar.classList.toggle("nav-visible", isOpen);
    this.menuToggle.setAttribute("aria-expanded", String(isOpen));
    this.menuToggle.setAttribute("aria-label", isOpen ? "Stäng meny" : "Öppna meny");
  }

  closeMenu() {
    this.navMenu?.classList.remove("show");
    this.navbar?.classList.remove("nav-visible");
    this.menuToggle?.setAttribute("aria-expanded", "false");
    this.menuToggle?.setAttribute("aria-label", "Öppna meny");
  }
}