const modeCopy = {
  hiring: {
    statement:
      "I help product teams turn complex workflows into clear, useful interfaces.",
    proof:
      "Looking for a frontend developer who can move comfortably from Figma to production?",
  },
  freelance: {
    statement:
      "I help growing products clarify their experience and ship focused improvements.",
    proof:
      "Need a responsive website, booking flow, or frontend improvement that is ready for real users?",
  },
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const hasGsap = typeof gsap !== "undefined";

/* ---------- Scroll reveals ---------- */
if (hasGsap && !prefersReducedMotion) {
  gsap.set(".reveal", { opacity: 0, y: 20 });
  gsap.set(".reveal-group > *", { opacity: 0, y: 20 });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add("is-visible");

        if (hasGsap && !prefersReducedMotion) {
          if (target.classList.contains("reveal-group")) {
            gsap.to(target.children, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.08,
              clearProps: "transform",
            });
          } else {
            gsap.to(target, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              clearProps: "transform",
            });
          }
        }

        observer.unobserve(target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -60px 0px" },
  );
  document
    .querySelectorAll(".reveal, .reveal-group")
    .forEach((el) => revealObserver.observe(el));
} else {
  document
    .querySelectorAll(".reveal, .reveal-group")
    .forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Hero entrance ---------- */
if (hasGsap && !prefersReducedMotion && document.querySelector(".hero")) {
  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".hero-copy .eyebrow", { opacity: 0, y: 16, duration: 0.5 })
    .from(".hero-copy h1", { opacity: 0, y: 20, duration: 0.6 }, "-=0.35")
    .from(
      ".hero-copy .hero-text",
      { opacity: 0, y: 16, duration: 0.5 },
      "-=0.35",
    )
    .from(
      ".hero-copy .hero-actions",
      { opacity: 0, y: 16, duration: 0.5 },
      "-=0.3",
    )
    .from(".hero-note", { opacity: 0, y: 16, duration: 0.6 }, "-=0.5");
}

/* ---------- Magnetic hover on primary actions ---------- */
if (hasGsap && !prefersReducedMotion && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".button-dark, .button-light").forEach((el) => {
    const moveX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width / 2) * 0.25);
      moveY((event.clientY - rect.top - rect.height / 2) * 0.25);
    });
    el.addEventListener("mouseleave", () => {
      moveX(0);
      moveY(0);
    });
  });
}

/* ---------- Sticky header: hide on scroll down, show on scroll up ---------- */
const siteHeader = document.querySelector(".site-header");
let lastScrollY = window.scrollY;
let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      siteHeader.classList.toggle("is-scrolled", y > 8);
      if (Math.abs(y - lastScrollY) > 6) {
        siteHeader.classList.toggle("is-hidden", y > lastScrollY && y > 160);
        lastScrollY = y;
      }
      scrollTicking = false;
    });
  },
  { passive: true },
);
siteHeader.addEventListener("focusin", () =>
  siteHeader.classList.remove("is-hidden"),
);

/* ---------- Mobile dock: highlight the section in view ---------- */
const dockLinks = document.querySelectorAll(".mobile-dock a");
const dockTargets = [
  [".hero", "top"],
  ["#about", "about"],
  ["#skills", "about"],
  ["#contact", "contact"],
]
  .map(([selector, key]) => ({ el: document.querySelector(selector), key }))
  .filter((target) => target.el);
let activeDockKey = null;
let dockTicking = false;

function updateDock() {
  dockTicking = false;
  const line = window.innerHeight * 0.4;
  let key = dockTargets[0]?.key;
  dockTargets.forEach((target) => {
    if (target.el.getBoundingClientRect().top <= line) key = target.key;
  });
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) key = "contact";
  if (key === activeDockKey) return;
  activeDockKey = key;
  dockLinks.forEach((link) => {
    const isActive = link.dataset.section === key;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function requestDockUpdate() {
  if (dockTicking) return;
  dockTicking = true;
  requestAnimationFrame(updateDock);
}
window.addEventListener("scroll", requestDockUpdate, { passive: true });
window.addEventListener("resize", requestDockUpdate);
updateDock();

const modeSwitch = document.querySelector(".mode-switch");
const modeIndicator = document.querySelector(".mode-indicator");
function positionModeIndicator(button) {
  if (!button || !modeIndicator) return;
  modeIndicator.style.width = `${button.offsetWidth}px`;
  modeIndicator.style.transform = `translateX(${button.offsetLeft}px)`;
}
if (modeSwitch) {
  const placeIndicator = () =>
    positionModeIndicator(modeSwitch.querySelector(".mode-button.is-active"));
  placeIndicator();
  if (document.fonts) document.fonts.ready.then(placeIndicator);
  window.addEventListener("resize", () =>
    positionModeIndicator(modeSwitch.querySelector(".mode-button.is-active")),
  );
}

if (matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project-art").forEach((art) => {
    const setX = hasGsap
      ? gsap.quickTo(art, "--mx", {
          duration: 0.35,
          ease: "power2",
          unit: "px",
        })
      : (v) => art.style.setProperty("--mx", `${v}px`);
    const setY = hasGsap
      ? gsap.quickTo(art, "--my", {
          duration: 0.35,
          ease: "power2",
          unit: "px",
        })
      : (v) => art.style.setProperty("--my", `${v}px`);
    art.addEventListener("pointermove", (event) => {
      const rect = art.getBoundingClientRect();
      setX(event.clientX - rect.left);
      setY(event.clientY - rect.top);
    });
  });
}

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });
    document.querySelector("[data-mode-copy]").textContent =
      modeCopy[button.dataset.mode].statement;
    document.querySelector("[data-mode-proof]").textContent =
      modeCopy[button.dataset.mode].proof;
    positionModeIndicator(button);
  });
});

/* ---------- Contact form ---------- */
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const status = contactForm.querySelector(".form-status");
  const submit = contactForm.querySelector("button[type=submit]");
  const label = submit.querySelector(".submit-label");
  const fallbackMail = "mailto:Harshit.kumar.web@gmail.com";
  const setStatus = (message, type) => {
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ""}`;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = [
      ...contactForm.querySelectorAll("input[required], textarea[required]"),
    ];
    fields.forEach((f) => f.classList.remove("is-invalid"));
    const invalid = fields.find((f) => !f.value.trim() || !f.checkValidity());
    if (invalid) {
      invalid.classList.add("is-invalid");
      invalid.focus();
      setStatus(
        "Please fill in your name, a valid email and a message.",
        "error",
      );
      return;
    }

    const data = new FormData(contactForm);
    if (data.get("botcheck")) return;
    if (String(data.get("access_key")).startsWith("YOUR_")) {
      setStatus(
        "The form isn't connected yet. Please email me directly.",
        "error",
      );
      return;
    }

    submit.disabled = true;
    label.textContent = "Sending...";
    setStatus("", "");
    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      contactForm.reset();
      setStatus(
        "Thanks! Your message is on its way. I'll reply soon.",
        "success",
      );
    } catch {
      setStatus(
        `Something went wrong. Email me at ${fallbackMail.replace("mailto:", "")}.`,
        "error",
      );
    } finally {
      submit.disabled = false;
      label.textContent = "Send message";
    }
  });
}
