let lastScrollTop = 0; // Variable para guardar la posición anterior del scroll
const header = document.getElementById("main-header");

// Inicializar el comportamiento del scroll
window.addEventListener("scroll", function () {
  const scrollTop = document.documentElement.scrollTop;

  // Mostrar u ocultar el header dependiendo de la dirección del scroll
  if (scrollTop > lastScrollTop) {
    header.classList.add("hidden");
  } else {
    header.classList.remove("hidden");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evitar valores negativos
});

const scrollToTopButton = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  // Si el usuario ha hecho scroll más de 200px
  if (window.scrollY > 400) {
    scrollToTopButton.style.display = "flex"; // Mostrar la flecha
  } else {
    scrollToTopButton.style.display = "none"; // Ocultar la flecha
  }
});
