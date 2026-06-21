// Portfolio JavaScript — Asjad Sajjad

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const hamburger = document.getElementById("hamburger");
  const navDrawer = document.getElementById("nav-drawer");
  const drawerLinks = document.querySelectorAll("#nav-drawer a");
  const navLinks = document.querySelectorAll(".navbar a");
  const sections = document.querySelectorAll("section");

  // --- 1. Header Scroll Styling ---
  const handleHeaderScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  // --- 2. Mobile Hamburger Menu ---
  const toggleMobileMenu = () => {
    hamburger.classList.toggle("active");
    navDrawer.classList.toggle("active");
  };
  hamburger.addEventListener("click", toggleMobileMenu);
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navDrawer.classList.remove("active");
    });
  });

  // Close drawer on outside click
  document.addEventListener("click", (e) => {
    if (navDrawer.classList.contains("active") && !navDrawer.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navDrawer.classList.remove("active");
    }
  });

  // --- 3. Theme Switcher ---
  const themePanel = document.getElementById("theme-panel");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const modeDarkBtn = document.getElementById("mode-dark-btn");
  const modeLightBtn = document.getElementById("mode-light-btn");
  const accentButtons = document.querySelectorAll(".accent-btn");

  const accents = {
    cyan:   { hex: "#0ea5e9", rgb: "14, 165, 233" },
    purple: { hex: "#8b5cf6", rgb: "139, 92, 246" },
    green:  { hex: "#10b981", rgb: "16, 185, 129" },
    orange: { hex: "#f97316", rgb: "249, 115, 22" },
    pink:   { hex: "#db2777", rgb: "219, 39, 119" },
  };

  themeToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themePanel.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!themePanel.contains(e.target)) themePanel.classList.remove("active");
  });

  const setThemeMode = (mode) => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("portfolio-theme-mode", mode);
    modeDarkBtn.classList.toggle("active", mode === "dark");
    modeLightBtn.classList.toggle("active", mode === "light");
  };

  const setAccentColor = (accentKey) => {
    const accent = accents[accentKey] || accents.cyan;
    document.documentElement.style.setProperty("--main-color", accent.hex);
    document.documentElement.style.setProperty("--main-color-rgb", accent.rgb);
    localStorage.setItem("portfolio-accent-color", accentKey);
    accentButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-accent") === accentKey);
    });
  };

  modeDarkBtn.addEventListener("click", () => setThemeMode("dark"));
  modeLightBtn.addEventListener("click", () => setThemeMode("light"));
  accentButtons.forEach((btn) => {
    btn.addEventListener("click", () => setAccentColor(btn.getAttribute("data-accent")));
  });

  const savedMode = localStorage.getItem("portfolio-theme-mode") || "light";
  const savedAccent = localStorage.getItem("portfolio-accent-color") || "cyan";
  setThemeMode(savedMode);
  setAccentColor(savedAccent);

  // --- 4. Hero Canvas Particle Network ---
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  const numberOfParticles = 60;
  let mouse = { x: null, y: null, radius: 100 };

  const resizeCanvas = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 1.2;
      this.speedX = Math.random() * 0.7 - 0.35;
      this.speedY = Math.random() * 0.7 - 0.35;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      if (mouse.x != null && mouse.y != null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 2;
          this.y += (dy / distance) * force * 2;
        }
      }
    }
    draw() {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--main-color").trim();
      ctx.fillStyle = color || "#0ea5e9";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initParticles = () => {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) particlesArray.push(new Particle());
  };
  initParticles();

  const connectParticles = () => {
    const rgb = getComputedStyle(document.documentElement).getPropertyValue("--main-color-rgb").trim();
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 115) {
          ctx.strokeStyle = `rgba(${rgb || "14, 165, 233"}, ${(1 - distance / 115) * 0.15})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((p) => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateCanvas);
  };
  animateCanvas();

  // --- 5. Typewriter ---
  const typewriterText = document.getElementById("typewriter-text");
  const titles = [
    "Web Applications",
    "AI Chatbots",
    "Automation Tools",
    "Mobile Apps",
    "Python Scripts",
  ];
  let titleIndex = 0, charIndex = 0, isDeleting = false, typingDelay = 100;

  const type = () => {
    const currentTitle = titles[titleIndex];
    if (isDeleting) {
      typewriterText.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typewriterText.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }
    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingDelay = 450;
    }
    setTimeout(type, typingDelay);
  };
  if (typewriterText) type();

  // --- 6. Scroll Spy ---
  const handleScrollspy = () => {
    let currentSectionId = "";
    const scrollPos = window.scrollY + 160;
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });
    if (currentSectionId) {
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`));
      drawerLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`));
    }
  };
  window.addEventListener("scroll", handleScrollspy);
  handleScrollspy();

  // --- 7. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // --- 8. Project Filtering ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filterValue = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const match = filterValue === "all" || card.getAttribute("data-category") === filterValue;
        card.classList.toggle("hide", !match);
        card.classList.toggle("show", match);
      });
    });
  });

  // --- 9. Project Modal ---
  const projectModal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const openModalBtns = document.querySelectorAll(".open-modal-btn");
  const modalImgWrapper = document.getElementById("modal-img-wrapper");
  const modalProjectTags = document.getElementById("modal-project-tags");
  const modalProjectTitle = document.getElementById("modal-project-title");
  const modalProjectDesc = document.getElementById("modal-project-desc");
  const modalProjectTech = document.getElementById("modal-project-tech");
  const modalDemoLink = document.getElementById("modal-demo-link");
  const modalSourceLink = document.getElementById("modal-source-link");

  const projectDatabase = {
    "admin-dashboard": {
      title: "Glassmorphic SaaS Admin Hub",
      tags: ["HTML5", "CSS3", "JavaScript"],
      desc: "A real-time admin dashboard with data visualizations, chart widgets, and settings panels. Designed for modern SaaS products — clean, fast, and built entirely from scratch without UI libraries.",
      tech: ["HTML5 / CSS3", "Vanilla ES6 JS", "Chart.js", "CSS Grid", "LocalStorage"],
      image: "./webdev_project.png",
      demoLink: "#",
      sourceLink: "https://github.com",
    },
    "ai-chatbot": {
      title: "AI Conversation Bot",
      tags: ["AI", "WebSockets"],
      desc: "A real-time AI chat interface with memory, context retention, and speech parsing. Supports custom system prompts and fast response pipelines, wrapped in a clean and minimal dark UI.",
      tech: ["HTML5 / CSS3", "Vanilla JS", "WebSockets", "JSON", "Local Storage"],
      image: "./chatbot_project.png",
      demoLink: "#",
      sourceLink: "https://github.com",
    },
    "crypto-wallet": {
      title: "Crypto Mobile Wallet",
      tags: ["App Dev", "UI/UX"],
      desc: "A high-fidelity mobile finance app with biometric authentication, real-time transaction tracking, and smooth cross-platform page transitions.",
      tech: ["Figma", "UI Systems", "UX Prototyping", "Cross-Platform"],
      image: "./appdev_project.png",
      demoLink: "#",
      sourceLink: "https://github.com",
    },
    "crawler-hub": {
      title: "High-Volume Web Crawler",
      tags: ["Web Scraping", "Python"],
      desc: "A concurrent scraping system that navigates complex site structures and compiles clean, structured output files in JSON and Excel formats.",
      tech: ["Python 3", "Scrapy", "BeautifulSoup4", "Proxy Rotation", "Excel Export"],
      image: "./scraping_project.png",
      demoLink: "#",
      sourceLink: "https://github.com",
    },
    "bug-fixing": {
      title: "Code Diagnostic Tool",
      tags: ["Debugging", "Optimization"],
      desc: "A visual runtime inspector for detecting logic errors, layout bugs, and performance bottlenecks across codebases — and fixing them at the root.",
      tech: ["Vanilla JS", "CSS Inspectors", "Browser Devtools", "Performance Profilers"],
      image: "./bugfixing_project.png",
      demoLink: "#",
      sourceLink: "https://github.com",
    },
  };

  const openModal = (projectId) => {
    const data = projectDatabase[projectId];
    if (!data) return;
    modalImgWrapper.innerHTML = `<img src="${data.image}" alt="${data.title}" style="width:100%;height:100%;object-fit:cover;" />`;
    modalProjectTitle.textContent = data.title;
    modalProjectDesc.textContent = data.desc;
    modalProjectTags.innerHTML = "";
    data.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "project-tag";
      span.textContent = tag;
      modalProjectTags.appendChild(span);
    });
    modalProjectTech.innerHTML = "";
    data.tech.forEach((tech) => {
      const span = document.createElement("span");
      span.className = "modal-tech-pill";
      span.textContent = tech;
      modalProjectTech.appendChild(span);
    });
    modalDemoLink.href = data.demoLink;
    modalSourceLink.href = data.sourceLink;
    projectModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    projectModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-project-id")));
  });
  modalCloseBtn.addEventListener("click", closeModal);
  projectModal.addEventListener("click", (e) => { if (e.target === projectModal) closeModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // --- 10. Contact Form ---
  const contactForm = document.getElementById("contact-form");
  const formSubmitBtn = document.getElementById("form-submit-btn");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  const showToast = (message) => {
    toastMessage.textContent = message;
    toast.classList.add("active");
    setTimeout(() => toast.classList.remove("active"), 4000);
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("form-name").value.trim();
      const emailVal = document.getElementById("form-email").value.trim();
      if (!nameVal || !emailVal) return;
      formSubmitBtn.disabled = true;
      formSubmitBtn.textContent = "Sending...";
      setTimeout(() => {
        showToast(`Thanks ${nameVal}! Message sent successfully.`);
        formSubmitBtn.disabled = false;
        formSubmitBtn.textContent = "Send Message";
        contactForm.reset();
      }, 1500);
    });
  }

  // --- 11. Bento Card Spotlight Effect ---
  document.querySelectorAll(".bento-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });
});
