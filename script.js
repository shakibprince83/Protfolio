const menu = document.querySelector(".menu"),
  nav = document.querySelector("nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
  menu.textContent = open ? "Close −" : "Menu +";
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu +";
  }),
);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          nav.querySelectorAll("a").forEach((link) => {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main section")
    .forEach((section) => observer.observe(section));
}
document.getElementById("year").textContent = new Date().getFullYear();

/* Type the full name while keeping a stable, accessible heading. */
(() => {
  const target = document.getElementById("typed-name");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const name = "Md. Shakibul\nHassan Prince.";
  let timer;
  const render = (text) => {
    target.replaceChildren();
    text.split("\n").forEach((line, index) => {
      if (index) target.append(document.createElement("br"));
      target.append(document.createTextNode(line));
    });
  };
  const stop = () => {
    clearTimeout(timer);
    render(name);
  };
  const run = () => {
    clearTimeout(timer);
    if (reducedMotion.matches) {
      render(name);
      return;
    }
    let count = 0;
    let deleting = false;
    render("");
    const tick = () => {
      if (document.hidden) {
        stop();
        return;
      }
      count += deleting ? -1 : 1;
      render(name.slice(0, count));
      let delay = deleting ? 45 : 105;
      if (count === name.length) {
        deleting = true;
        delay = 2600;
      } else if (count === 0) {
        deleting = false;
        delay = 650;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 350);
  };
  reducedMotion.addEventListener("change", run);
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : run(),
  );
  run();
})();

/* Reveal content once as it enters the viewport. */
(() => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) || motion.matches) return;
  const elements = [
    ...document.querySelectorAll(
      ".hero-inner,.hero-portrait,.section-head,.about-grid>div,.facts,.education-list>.education,.skills-grid>.skill-card,.credentials-list>.credential-item,.project-intro,.projects>.project,.more-work,.research-intro,.research-list>.research-card,#research>.research-note,.contact>h3,.contact>p,.contact>.actions,footer",
    ),
  ];
  let observer;
  const showAll = () => {
    observer?.disconnect();
    elements.forEach((el) => {
      el.classList.remove("reveal-pending");
      el.classList.add("is-revealed");
    });
  };
  try {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -30px 0px" },
    );
    elements.forEach((el) => {
      el.classList.add("scroll-reveal", "reveal-ready");
      const bounds = el.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        el.classList.add("is-revealed");
      } else {
        el.classList.add("reveal-pending");
        observer.observe(el);
      }
    });
    motion.addEventListener("change", (event) => {
      if (event.matches) showAll();
    });
    window.addEventListener("beforeprint", showAll);
  } catch (error) {
    showAll();
  }
})();
