(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.documentElement.classList.add("js");

  const faqMenu = document.querySelector(".faq-menu");
  if (faqMenu) {
    const closeMenu = () => faqMenu.removeAttribute("open");
    document.addEventListener("click", (event) => {
      if (faqMenu.open && !faqMenu.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && faqMenu.open) closeMenu();
    });
  }

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((details) => {
    const summary = details.querySelector("summary");
    const body = details.querySelector(".faq-body");
    if (!summary || !body) return;

    const DURATION = 400;
    let token = 0;
    body.style.height = details.open ? "auto" : "0px";

    const open = () => {
      const myToken = ++token;
      details.setAttribute("open", "");
      body.style.height = "auto";
      const target = body.scrollHeight + "px";
      body.style.height = "0px";
      void body.offsetHeight;
      body.style.height = target;
      const done = () => {
        if (myToken === token && details.open) body.style.height = "auto";
      };
      body.addEventListener("transitionend", done, { once: true });
      window.setTimeout(done, DURATION + 60);
    };

    const close = () => {
      const myToken = ++token;
      const from = body.getBoundingClientRect().height + "px";
      body.style.height = from;
      void body.offsetHeight;
      body.style.height = "0px";
      const done = () => {
        if (myToken !== token) return;
        details.removeAttribute("open");
        body.style.height = "0px";
      };
      body.addEventListener("transitionend", done, { once: true });
      window.setTimeout(done, DURATION + 60);
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.open) close();
      else open();
    });
  });

  const legalDialogs = document.querySelectorAll(".legal-dialog");
  legalDialogs.forEach((dialog) => {
    const openers = document.querySelectorAll(
      `[data-dialog="${dialog.id.replace("dialog-", "")}"]`
    );
    openers.forEach((opener) => {
      opener.addEventListener("click", () => {
        if (!dialog.open) dialog.showModal();
      });
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    const closeBtn = dialog.querySelector("[data-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => dialog.close());
    }
  });

  const revealables = document.querySelectorAll(".reveal");

  const setDelay = (el, delay) => {
    if (el) el.style.setProperty("--reveal-delay", `${delay}ms`);
  };

  setDelay(document.querySelector(".hero .eyebrow"), 0);
  setDelay(document.querySelector(".hero-copy h1"), 60);
  setDelay(document.querySelector(".hero-sub"), 120);
  setDelay(document.querySelector(".hero-actions"), 180);
  setDelay(document.querySelector(".showcase"), 280);

  const grid = document.querySelector(".features-grid");
  const cards = grid ? Array.from(grid.children) : [];
  cards.forEach((card, i) => {
    setDelay(card, 350 + i * 70);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealables.forEach((el) => observer.observe(el));
})();
