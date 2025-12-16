let isDarkMode= false;


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
    isDarkMode=false; 
}

function setDarkMode() {
    const html = document.documentElement;

    // Hvis allerede dark, gør den ingenting
    if (html.classList.contains("dark")) return;

    html.classList.add("dark");
    localStorage.setItem("mode", "dark");
    isDarkMode=true; 
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

  // Farve tema på knapperne når man trykker på dem 

  function setTheme(color) {
    const root = document.documentElement;
    if(isDarkMode) {root.style.setProperty("--primary-foreground", "#fff");} else {root.style.setProperty("--primary-foreground", "#000");}

    if (color === "default") {
        root.style.setProperty("--primary", "#d8bfd8");
    }

    if (color === "blue") {
        root.style.setProperty("--primary", "lightblue");
    }

    if (color === "green") {
        root.style.setProperty("--primary", "lightseagreen");
    }

    if (color === "grey") {
        root.style.setProperty("--primary", "silver");
    }

    if (color === "beige") {
        root.style.setProperty("--primary", "#d4b895");
    }

    localStorage.setItem("selectedTheme", color);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode === "dark") {
        document.documentElement.classList.add("dark");
        isDarkMode = true;
    } else {
        document.documentElement.classList.remove("dark");
        isDarkMode = false;
    }

    // Og indlæs også farvetema (hvis du har det)
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) setTheme(savedTheme);
});
