/* London Worm Club — static site behaviour and shared data rendering. */

const committee = [
  { name: "Matan-Elle Cohen", affiliation: "UCL", photo: "./assets/committee/Matan-Elle Cohen.jpeg" },
  { name: "Anna Gavrilova", affiliation: "UCL", photo: "./assets/committee/Anna Gavrilova.PNG" },
  { name: "Padraig Gleeson", affiliation: "UCL", photo: "./assets/committee/Padraig Gleeson.png" },
  { name: "Om Patange", affiliation: "UCL", photo: "./assets/committee/Om Patange.png" },
  { name: "Julia Riedl", affiliation: "MRC LMS", photo: "./assets/committee/Julia Riedl.jpg" },
  { name: "Samuel Rigg", affiliation: "UCL", photo: "./assets/committee/Samuel Rigg.jpg" },
];

const pastCommittee = [
  { name: "Mar Ferrando Marco", affiliation: "Imperial College" },
  { name: "Arantza Barrios", affiliation: "UCL" },
  { name: "Andre Brown", affiliation: "Imperial College / MRC LMS" },
];

const initials = (name) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => (part[0] || "").toUpperCase())
    .join("");

function renderCommittee() {
  const grid = document.querySelector("[data-committee]");
  if (grid) {
    grid.innerHTML = committee
      .map(
        (person) => `
        <div class="surface-card person">
          ${person.photo
            ? `<img class="initials person-photo" src="${person.photo}" alt="${person.name}" width="96" height="96" />`
            : `<span class="initials" aria-hidden="true">${initials(person.name)}</span>`}
          <div class="who">
            <p class="name">${person.name}</p>
            <p class="aff">${person.affiliation}</p>
          </div>
        </div>`,
      )
      .join("");
  }

  const past = document.querySelector("[data-past-committee]");
  if (past) {
    past.innerHTML = pastCommittee
      .map((p) => `<li><span class="n">${p.name}</span> — ${p.affiliation}</li>`)
      .join("");
  }
}

function setupNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.getElementById("mobile-nav");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open
      ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style="width:1.25rem;height:1.25rem"><path d="M18 6 6 18M6 6l12 12" /></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style="width:1.25rem;height:1.25rem"><path d="M4 6h16M4 12h16M4 18h16" /></svg>';
  });

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }),
  );
}

function markActiveNav() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  const links = [...document.querySelectorAll(".nav-desktop a, .nav-mobile a")];
  const setActive = (href, current) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === href;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", current);
      else link.removeAttribute("aria-current");
    });
  };

  if (file === "index.html") {
    const sectionLinks = [
      { href: "./index.html#about-section", section: document.getElementById("about-section") },
      { href: "./index.html#get-involved", section: document.getElementById("get-involved") },
    ].filter(({ section }) => section);

    const updateActiveSection = () => {
      const header = document.querySelector(".site-header");
      const marker = (header?.offsetHeight || 0) + 24;
      const activeSection = sectionLinks.find(({ section }) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
      });
      setActive(activeSection?.href || "", "location");
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();
    return;
  }

  const currentLink = links.find((link) => {
    const href = link.getAttribute("href") || "";
    return !href.includes("#") && href.endsWith(file);
  });
  if (currentLink) setActive(currentLink.getAttribute("href"), "page");
}

function setupCollapsibles() {
  document.querySelectorAll("[data-collapsible]").forEach((trigger) => {
    const target = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!target) return;
    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      target.hidden = open;
    });
  });
}

renderCommittee();
setupNav();
markActiveNav();
setupCollapsibles();
