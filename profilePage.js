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

document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;
  const body = document.body;
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    themeToggle.innerHTML = moonIcon;
  } else {
    body.classList.remove("light-mode");
    themeToggle.innerHTML = sunIcon;
  }

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
});
