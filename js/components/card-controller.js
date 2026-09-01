export class CardController {
  constructor(translationService) {
    this.translationService = translationService;
  }

  initialize() {
    document.querySelectorAll(".card-expand-toggle").forEach((button) => {
      button.addEventListener("click", () => this.toggleCard(button));
    });
  }

  toggleCard(button) {
    const card = button.closest(".project, .education-card");
    if (!card) return;

    const isExpanded = card.classList.toggle("is-expanded");
    button.setAttribute("aria-expanded", String(isExpanded));
    const label = button.querySelector(".card-expand-label");
    if (!label) return;

    const key = isExpanded ? "card.collapse" : "card.expand";
    label.dataset.i18n = key;
    label.textContent = this.translationService.get(document.documentElement.lang, key) || label.textContent;
  }
}