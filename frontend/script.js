// Funktion der kaldes når man klikker på knappen
function goToNextPage() {
    const name = document.getElementById("nameInput").value;

    // Gemmer navnet i browserens localStorage
    localStorage.setItem("username", name);

    // Går videre til næste side
    window.location.href = "greeting.html";
}


// ####################################################
//  LOAD GEMT TEMA (kører når siden åbnes)
// ####################################################
document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("mode");            // "light" eller "dark"
    const savedColor = localStorage.getItem("colortheme");     // fx "blue", "green"

    // Sæt dark/light mode
    if (savedMode === "dark") {
        document.documentElement.classList.add("dark");
    }

    // Sæt farvetema
    if (savedColor) {
        document.documentElement.setAttribute("data-color-theme", savedColor);
    }

    // Aktiver dropdown-menu
    initThemeDropdown();
});


// ####################################################
//  SKIFT MELLEM DARK OG LIGHT
// ####################################################
function toggleDarkMode() {
    const html = document.documentElement;

    html.classList.toggle("dark");

    // Gem valg
    const mode = html.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("mode", mode);
}


// ####################################################
//  SKIFT FARVETEMA (accent color)
// ####################################################
function setTheme(theme) {
    if (theme === "default") {
        document.documentElement.removeAttribute("data-color-theme");
        localStorage.setItem("colortheme", "");
        return;
    }

    document.documentElement.setAttribute("data-color-theme", theme);
    localStorage.setItem("colortheme", theme);
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

// Hent HTML til theme switcher
fetch("/colortheme.html")
  .then(res => res.text())
  .then(html => {
    container.innerHTML = html;

    // Load JS når HTML'en er indsat
    import("/colortheme.js");
  });