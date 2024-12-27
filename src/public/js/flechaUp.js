document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopButton = document.getElementById("scrollToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollToTopButton.style.display = "flex"; // Mostrar la flecha
    } else {
      scrollToTopButton.style.display = "none"; // Ocultar la flecha
    }
  });
});
