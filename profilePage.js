document.addEventListener("DOMContentLoaded", function () {
  const skills = document.querySelectorAll(".skill");

  skills.forEach((skill) => {
    const percentage = skill.getAttribute("percentage"); // Changed from dataset.percentage
    const progressBar = skill.querySelector(".skill-progress");
    const percentageText = skill.querySelector(".skill-percentage");

    progressBar.style.width = `${percentage}%`;
    percentageText.textContent = `${percentage}%`;
  });

  const projects = document.querySelector(".projects");
  const projectTitles = document.querySelectorAll(".projectHeader");
  const tooltipText = projects.getAttribute("data-tooltip");

  projectTitles.forEach((title) => {
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = tooltipText;
    title.appendChild(tooltip);
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar nav");
  const navbar = document.querySelector(".navbar");
  const logo = document.querySelector(".logo");
  const contactIcons = document.querySelector(".contact-icons");

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    navbar.classList.toggle("nav-visible");

    if (navMenu.classList.contains("show")) {
      logo.style.display = "block";
    } else {
      logo.style.display = "none";
    }
  });

  // Function to check if user has scrolled near the bottom of the page
  function isNearBottom() {
    return (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 100 // Adjust this value to control when icons appear
    );
  }

  function toggleContactIconsVisibility() {
    if (isNearBottom()) {
      contactIcons.classList.add("visible");
    } else {
      contactIcons.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", toggleContactIconsVisibility);

  // Initial check on page load
  toggleContactIconsVisibility();

  function flattenContainer(selectedContainer) {
    const container = document.querySelector(selectedContainer);
    if (container) {
      const parent = container.parentElement;

      // Move all child elements of .container to the parent
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, container);
      }

      // Remove the now-empty .container element
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
  
});
