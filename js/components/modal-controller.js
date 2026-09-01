export class ModalController {
  constructor(translationService) {
    this.translationService = translationService;
    this.cvOverlay = document.getElementById("cvModalOverlay");
    this.articleOverlay = document.getElementById("articleModalOverlay");
    this.articleTrigger = null;
  }

  initialize() {
    this.initializeCvModal();
    this.initializeArticleModal();
  }

  initializeCvModal() {
    const openButton = document.getElementById("viewCvBtn");
    const closeButton = document.getElementById("cvModalClose");
    if (!openButton || !this.cvOverlay || !closeButton) return;
    openButton.addEventListener("click", () => this.openCv());
    closeButton.addEventListener("click", () => this.closeCv());
    this.cvOverlay.addEventListener("click", (event) => { if (event.target === this.cvOverlay) this.closeCv(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && this.cvOverlay.classList.contains("visible")) this.closeCv(); });
  }

  openCv() { this.cvOverlay.classList.add("visible"); document.body.style.overflow = "hidden"; }
  closeCv() { this.cvOverlay.classList.remove("visible"); document.body.style.overflow = ""; }

  initializeArticleModal() {
    const closeButton = document.getElementById("articleModalClose");
    if (!this.articleOverlay || !closeButton) return;
    document.querySelectorAll(".article-open-btn").forEach((button) => button.addEventListener("click", () => this.openArticle(button)));
    closeButton.addEventListener("click", () => this.closeArticle());
    this.articleOverlay.addEventListener("click", (event) => { if (event.target === this.articleOverlay) this.closeArticle(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && this.articleOverlay.classList.contains("visible")) this.closeArticle(); });
    document.addEventListener("portfolio-language-changed", () => {
      if (this.articleOverlay.dataset.activeArticle) this.renderArticle(this.articleOverlay.dataset.activeArticle);
    });
  }

  renderArticle(articleId) {
    const language = document.documentElement.lang;
    document.getElementById("articleModalMeta").textContent = this.translationService.get(language, `${articleId}.meta`) || "";
    document.getElementById("articleModalTitle").textContent = this.translationService.get(language, `${articleId}.title`) || "";
    document.getElementById("articleModalBody").innerHTML = this.translationService.get(language, `${articleId}.body`) || "";
  }

  openArticle(button) {
    this.articleTrigger = button;
    this.articleOverlay.dataset.activeArticle = button.dataset.article;
    this.renderArticle(button.dataset.article);
    this.articleOverlay.hidden = false;
    this.articleOverlay.classList.add("visible");
    document.body.style.overflow = "hidden";
    document.getElementById("articleModalClose").focus();
  }

  closeArticle() {
    this.articleOverlay.classList.remove("visible");
    this.articleOverlay.hidden = true;
    document.body.style.overflow = "";
    this.articleTrigger?.focus();
  }
}