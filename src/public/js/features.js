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
