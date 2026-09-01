export class AnimationController {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("scroll-revealed");
        if (entry.target.dataset.projectAnimate !== undefined) entry.target.classList.add("project-animate-in");
      });
    }, { root: null, rootMargin: "0px", threshold: 0.1 });
  }

  initialize() {
    document.querySelectorAll("[data-scroll-animate], [data-timeline-animate], [data-skill-animate]").forEach((element) => this.observer.observe(element));
    document.querySelectorAll("[data-project-animate]").forEach((element, index) => {
      element.style.animationDelay = `${index * 0.15}s`;
      this.observer.observe(element);
    });
  }
}