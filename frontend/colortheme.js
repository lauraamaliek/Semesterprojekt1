console.log("Toggle lukker");

const btn = document.getElementById("theme-btn");
const menu = document.getElementById("theme-dropdown");

// Toggle dropdown
btn.addEventListener("click", () => { 
    console.log("hahaha");
    menu.classList.toggle("hidden");
});