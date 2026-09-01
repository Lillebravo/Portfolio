export class ContactFormController {
  constructor() {
    this.form = document.querySelector(".contact-form");
  }

  initialize() {
    if (!this.form) return;
    this.form.addEventListener("invalid", (event) => this.handleInvalid(event), true);
    this.form.addEventListener("input", (event) => this.clearValidation(event));
    this.form.addEventListener("submit", (event) => this.submit(event));
  }

  handleInvalid(event) {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    const message = field.type === "email" && !field.validity.valueMissing
      ? this.form.dataset.validationEmail
      : this.form.dataset.validationRequired;
    field.setCustomValidity(message || "Please complete this field.");
  }

  clearValidation(event) {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("");
  }

  async submit(event) {
    event.preventDefault();
    const submitButton = this.form.querySelector('button[type="submit"]');
    const statusMessage = this.form.querySelector(".form-status");
    const isSwedish = document.documentElement.lang === "sv";
    const defaultButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = isSwedish ? "Skickar..." : "Sending...";
    statusMessage.textContent = "";
    statusMessage.className = "form-status";

    try {
      const response = await fetch("https://portfolio-contact-form.jerry-lundahl.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(this.form).entries()))
      });
      if (!response.ok) throw new Error("Contact request failed.");
      this.form.reset();
      statusMessage.textContent = isSwedish ? "Tack! Din förfrågan har skickats." : "Thank you! Your inquiry has been sent.";
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
  }
}