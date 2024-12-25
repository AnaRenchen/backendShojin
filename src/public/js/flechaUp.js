const scrollToTopButton = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  // Si el usuario ha hecho scroll más de 200px
  if (window.scrollY > 400) {
    scrollToTopButton.style.display = "flex"; // Mostrar la flecha
  } else {
    scrollToTopButton.style.display = "none"; // Ocultar la flecha
  }
});
