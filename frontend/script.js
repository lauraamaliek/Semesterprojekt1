// Funktion der kaldes når man klikker på knappen
function goToNextPage() {
    const name = document.getElementById("nameInput").value;

    // Gemmer navnet i browserens localStorage
    localStorage.setItem("username", name);

    // Går videre til næste side
    window.location.href = "greeting.html";
}


// ###############################
//   SKIFT MELLEM DARK OG LIGHT
// ###############################

function toggleDarkMode() {
  // Toggle klassen "dark" på <html> elementet
  // Hvis den er der → fjern den
  // Hvis den ikke er der → tilføj den
  document.documentElement.classList.toggle("dark");
}



// ###############################
//   SKIFT FARVETEMA
// ###############################

function setTheme(theme) {
  // Sætter data-attribute på <html>
  // F.eks. data-color-theme="blue"
  document.documentElement.setAttribute("data-color-theme", theme);
}


