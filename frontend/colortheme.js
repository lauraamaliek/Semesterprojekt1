const savedMode = localStorage.getItem("theme-mode");
const savedColor = localStorage.getItem("theme-color");

if (savedMode) document.documentElement.setAttribute("data-theme", savedMode);
if (savedColor) document.documentElement.setAttribute("data-color-theme", savedColor);

// Wait until HTML include is loaded
document.addEventListener("click", (e) => {
    // Toggle dropdown
    if (e.target.id === "theme-toggle-btn") {
        document.getElementById("theme-dropdown").classList.toggle("open");
    }

    // Light / Dark mode
    if (e.target.classList.contains("theme-mode")) {
        const mode = e.target.dataset.mode;

        if (mode === "light") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme-mode", "");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme-mode", "dark");
        }
    }

    // Color theme 
    if (e.target.classList.contains("color-option")) {
        const theme = e.target.dataset.theme;

        if (theme === "default") {
            document.documentElement.removeAttribute("data-color-theme");
            localStorage.setItem("theme-color", "");
        } else {
            document.documentElement.setAttribute("data-color-theme", theme);
            localStorage.setItem("theme-color", theme);
        }
    }
});
