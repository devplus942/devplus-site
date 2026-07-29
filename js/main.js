// ============================================================
// DEVPLUS+ — site behavior
// ============================================================
(function () {
  "use strict";

  document.documentElement.setAttribute(
    "data-theme",
    localStorage.getItem("devplus-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
  );

  window.addEventListener("DOMContentLoaded", init);

  function init() {
    loaderHide();
    themeToggle();
    headerScroll();
    mobileNav();
    scrollProgress();
    revealOnScroll();
    backToTop();
    cookieConsent();
    faqAccordion();
    portfolioFilters();
    contactForm();
    newsletterForm();
    commandPalette();
    cardTilt();
    setActiveNav();
    yearStamp();
  }

  // ---------- Loading screen ----------
  function loaderHide() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 350);
    });
    // fallback in case load already fired
    setTimeout(() => loader.classList.add("hidden"), 1800);
  }

  // ---------- Theme ----------
  function themeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const root = document.documentElement;
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("devplus-theme", next);
      });
    });
  }

  // ---------- Header on scroll ----------
  function headerScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- Mobile nav ----------
  function mobileNav() {
    const openBtn = document.querySelector("[data-nav-open]");
    const closeBtn = document.querySelector("[data-nav-close]");
    const panel = document.getElementById("mobile-nav");
    if (!panel) return;
    openBtn && openBtn.addEventListener("click", () => panel.classList.add("open"));
    closeBtn && closeBtn.addEventListener("click", () => panel.classList.remove("open"));
    panel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => panel.classList.remove("open"))
    );
  }

  // ---------- Scroll progress bar ----------
  function scrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    window.addEventListener(
      "scroll",
      () => {
        const h = document.documentElement;
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = pct + "%";
      },
      { passive: true }
    );
  }

  // ---------- Reveal on scroll ----------
  function revealOnScroll() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
  }

  // ---------- Back to top ----------
  function backToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("show", window.scrollY > 500),
      { passive: true }
    );
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ---------- Cookie consent ----------
  function cookieConsent() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    if (!localStorage.getItem("devplus-cookie-consent")) {
      setTimeout(() => banner.classList.add("show"), 1200);
    }
    banner.querySelectorAll("[data-cookie-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem("devplus-cookie-consent", btn.dataset.cookieAction);
        banner.classList.remove("show");
      });
    });
  }

  // ---------- FAQ accordion ----------
  function faqAccordion() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      q && q.addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
        if (!wasOpen) item.classList.add("open");
      });
    });
  }

  // ---------- Portfolio filters ----------
  function portfolioFilters() {
    const filters = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll("[data-category]");
    if (!filters.length) return;
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        cards.forEach((card) => {
          const match = cat === "all" || card.dataset.category === cat;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  // ---------- Contact form (validation) ----------
  function contactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const success = document.getElementById("form-success");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll("[data-required]").forEach((field) => {
        const wrap = field.closest(".form-field");
        const value = field.value.trim();
        let ok = value.length > 0;
        if (field.type === "email" && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        wrap.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = "Sending…";
      btn.disabled = true;

      // Simulated send — replace with EmailJS / Resend endpoint in production.
      setTimeout(() => {
        form.classList.add("hidden");
        success.classList.add("show");
        btn.textContent = original;
        btn.disabled = false;
      }, 900);
    });

    form.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", () => el.closest(".form-field").classList.remove("invalid"));
    });
  }

  // ---------- Newsletter ----------
  function newsletterForm() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const btn = form.querySelector("button");
      if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.style.borderColor = "#F87171";
        return;
      }
      input.style.borderColor = "";
      btn.textContent = "Subscribed ✓";
      input.value = "";
      setTimeout(() => (btn.textContent = "Subscribe"), 2400);
    });
  }

  // ---------- Command palette ----------
  function commandPalette() {
    const backdrop = document.getElementById("cmdk-backdrop");
    const input = document.getElementById("cmdk-input");
    const results = document.getElementById("cmdk-results");
    if (!backdrop) return;

    const pages = [
      { name: "Home", href: "index.html#top" },
      { name: "About", href: "index.html#about" },
      { name: "Services", href: "index.html#services" },
      { name: "Portfolio", href: "index.html#portfolio" },
      { name: "Pricing", href: "index.html#pricing" },
      { name: "Testimonials", href: "index.html#testimonials" },
      { name: "FAQ", href: "index.html#faq" },
      { name: "Blog", href: "index.html#blog" },
      { name: "Careers", href: "index.html#careers" },
      { name: "Contact", href: "contact.html" },
      { name: "Privacy Policy", href: "privacy.html" },
      { name: "Terms of Service", href: "terms.html" },
    ];

    function render(list) {
      results.innerHTML = list
        .map(
          (p, i) =>
            `<a href="${p.href}" class="${i === 0 ? "sel" : ""}">${p.name}<span class="hint">↵</span></a>`
        )
        .join("") || `<div style="padding:16px;color:var(--ink-faint);font-size:13.5px;">No matches</div>`;
    }
    render(pages);

    function open() {
      backdrop.classList.add("open");
      input.value = "";
      render(pages);
      setTimeout(() => input.focus(), 50);
    }
    function close() {
      backdrop.classList.remove("open");
    }

    document.querySelectorAll("[data-cmdk-open]").forEach((b) => b.addEventListener("click", open));
    backdrop.addEventListener("click", (e) => e.target === backdrop && close());

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        backdrop.classList.contains("open") ? close() : open();
      }
      if (e.key === "Escape") close();
    });

    input &&
      input.addEventListener("input", () => {
        const q = input.value.toLowerCase();
        render(pages.filter((p) => p.name.toLowerCase().includes(q)));
      });
  }

  // ---------- Card tilt / glow follow ----------
  function cardTilt() {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  // ---------- Active nav link ----------
  function setActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, #mobile-nav a").forEach((a) => {
      const href = a.getAttribute("href").split("#")[0] || "index.html";
      if (href === path && !a.getAttribute("href").includes("#")) {
        a.classList.add("active");
      }
    });
  }

  function yearStamp() {
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }
})();
