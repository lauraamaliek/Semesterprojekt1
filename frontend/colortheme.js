document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-btn");
    const menu = document.getElementById("theme-dropdown");

    // Toggle dropdown
    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });
});