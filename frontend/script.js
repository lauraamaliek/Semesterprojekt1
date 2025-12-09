//Ur på alle sider:
//klokken
class LiveClock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.clockElement = document.createElement("span");
        this.shadowRoot.appendChild(this.clockElement);

        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    updateClock() {
        const now = new Date();
        this.clockElement.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}
customElements.define("live-clock", LiveClock);


// ####################################################
//  SKIFT MELLEM DARK OG LIGHT - Lavede lige en til hver så Light kun giver light og omvendt
// ####################################################

function setLightMode() {
    const html = document.documentElement;

    // Hvis allerede light, gør den ingenting
    if (!html.classList.contains("dark")) return;

    html.classList.remove("dark");
    localStorage.setItem("mode", "light");
}

function setDarkMode() {
    const html = document.documentElement;

    // Hvis allerede dark, gør den ingenting
    if (html.classList.contains("dark")) return;

    html.classList.add("dark");
    localStorage.setItem("mode", "dark");
}

// ####################################################
//  ÅBEN / LUK DROPDOWN (samlet funktion)
// ####################################################
function initThemeDropdown() {
    const btn = document.getElementById("theme-btn");
    const menu = document.getElementById("theme-dropdown");

    if (!btn || !menu) return; // Hvis HTML ikke er loaded endnu

    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });

    // Luk dropdown hvis man klikker udenfor
    document.addEventListener("click", (e) => {
        if (!menu.classList.contains(hidden) && !menu.contains(e.target) && e.target !== btn) {
            menu.classList.add("hidden");
        }
    });
}

// ####################################################
//  // Sørger for at theme-switcher-container findes på ALLE sider
// ####################################################

let container = document.getElementById("theme-switcher-container");

if (!container) {
  // Hvis div'en ikke findes, så opret og indsæt den i toppen af <body>
  container = document.createElement("div");
  container.id = "theme-switcher-container";
  document.body.prepend(container); // indsætter øverst i body
}

// Henter HTML til theme switcher
fetch("/colortheme.html")
  .then(res => res.text())
  .then(html => {
    container.innerHTML = html;

    // Load JS når HTML'en er indsat
    import("/colortheme.js");
  });

  // Farve tema på knapperne når man trykker på dem (Det virker nu 😃)

  function setTheme(color) {
    const root = document.documentElement;

    if (color === "default") {
        root.style.setProperty("--primary", "#8b5cf6");
        root.style.setProperty("--primary-foreground", "#000");
    }

    if (color === "blue") {
        root.style.setProperty("--primary", "lightblue");
        root.style.setProperty("--primary-foreground", "#000");
    }

    if (color === "green") {
        root.style.setProperty("--primary", "lightseagreen");
        root.style.setProperty("--primary-foreground", "#000");
    }

    if (color === "grey") {
        root.style.setProperty("--primary", "silver");
        root.style.setProperty("--primary-foreground", "#000");
    }

    if (color === "beige") {
        root.style.setProperty("--primary", "beige");
        root.style.setProperty("--primary-foreground", "#000");
    }
}
