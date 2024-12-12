let data;
const apiUrl = "/api/recipes";

// Obtener todas las recetas
async function obtenerRecetas() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }

    data = await response.json();
    return data;
  } catch (error) {
    mostrarAlerta("Error al cargar las recetas. Intenta más tarde.");
    console.error(error);
  }
}

// Obtener receta por ID
async function obtenerRecetaPorId(recipeId) {
  try {
    const response = await fetch(`${apiUrl}/${recipeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }

    const receta = await response.json();
    return receta;
  } catch (error) {
    mostrarAlerta("Error al obtener la receta.");
    console.error(error);
  }
}

// Mostrar alerta con SweetAlert
function mostrarAlerta(mensaje) {
  Swal.fire({
    text: mensaje,
    color: "black",
    toast: true,
    background: "white",
    confirmButtonText: "Ok",
    confirmButtonColor: "black",
    timer: 5000,
  });
}

// Cargar recetas al inicio
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  data = await obtenerRecetas();

  if (recipeId) {
    const receta = await obtenerRecetaPorId(recipeId);
    cargarDetalleReceta(receta);
  } else {
    mostrarRecetas(data);
  }
});

let currentPage = 1;
const recipePerPage = 8;

// Limpiar contenedor de recetas
function limpiarContenedorRecetas() {
  const listaNames = document.getElementById("recetas");
  if (listaNames) listaNames.innerHTML = "";
}

// Mostrar recetas paginadas
function mostrarRecetas(arregloRecetas, actualPage = 1) {
  limpiarContenedorRecetas();

  const listaNames = document.getElementById("recetas");
  if (!listaNames) return;

  const container = document.createElement("div");
  container.className = "container text-center";

  const row = document.createElement("div");
  row.className = "row justify-content-start align-items-center mb-4";
  container.appendChild(row);

  const start = (actualPage - 1) * recipePerPage;
  const end = start + recipePerPage;
  const recipesPage = arregloRecetas.slice(start, end);

  recipesPage.forEach((item) => {
    const col = document.createElement("div");
    col.className =
      "col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4";

    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "100%";

    const linkWrapper = document.createElement("a");
    linkWrapper.href = `/recipes/recipe?id=${item._id}`;
    linkWrapper.className = "card-link";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.className = "card-img-top";
    img.style.width = "100%";
    img.style.height = "200px";
    img.style.objectFit = "cover";

    const cardBody = document.createElement("div");
    cardBody.className =
      "card-body d-flex align-items-center justify-content-center";
    cardBody.style.height = "90px";

    const linkTitle = document.createElement("a");
    linkTitle.textContent = item.title;
    linkTitle.href = `/recipes/recipe?id=${item._id}`;
    linkTitle.className = "card-title";
    linkTitle.style.textDecoration = "none";

    cardBody.appendChild(linkTitle);
    linkWrapper.appendChild(img);
    card.appendChild(linkWrapper);
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
  });

  listaNames.appendChild(container);
  showPagination(arregloRecetas.length, actualPage);
}

// Mostrar paginación
function showPagination(totalRecipes, actualPage) {
  const totalPages = Math.ceil(totalRecipes / recipePerPage);
  const paginationDiv = document.getElementById("pagination");
  if (!paginationDiv) return;

  paginationDiv.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "pagination justify-content-center pagination-sm";

  // Definir el rango de páginas visibles
  const maxVisiblePages = 3; // Número máximo de páginas visibles
  let startPage = Math.max(1, actualPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Ajustar si está cerca del inicio o del final
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Botón "Previous"
  if (actualPage > 1) {
    const prevLi = document.createElement("li");
    prevLi.className = "page-item";
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.textContent = "Anterior";
    prevLink.href = "#";
    prevLink.addEventListener("click", function (e) {
      e.preventDefault();
      showPagination(totalRecipes, actualPage - 1);
      mostrarRecetas(data, actualPage - 1);
    });

    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);
  }

  // Números de página
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === actualPage ? "active" : ""}`;

    const link = document.createElement("a");
    link.className = "page-link";
    link.textContent = i;
    link.href = "#";
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showPagination(totalRecipes, i);
      mostrarRecetas(data, i);
    });

    li.appendChild(link);
    ul.appendChild(li);
  }

  // Botón "Next"
  if (actualPage < totalPages) {
    const nextLi = document.createElement("li");
    nextLi.className = "page-item";
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.textContent = "Siguiente";
    nextLink.href = "#";
    nextLink.addEventListener("click", function (e) {
      e.preventDefault();
      showPagination(totalRecipes, actualPage + 1);
      mostrarRecetas(data, actualPage + 1);
    });

    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);
  }

  paginationDiv.appendChild(ul);
}

function search() {
  const searchTerm = document
    .getElementById("campo-pesquisa")
    .value.toLowerCase();

  // Si el término de búsqueda está vacío, mostrar todas las recetas
  if (!searchTerm.trim()) {
    currentPage = 1;
    mostrarRecetas(data, currentPage);
    return;
  }

  // Filtrar recetas en base al término de búsqueda
  const filteredRecetas = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm)
      ) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );

  if (filteredRecetas.length === 0) {
    mostrarAlerta(
      "No se encontraron recetas. Intenta con otro término de búsqueda."
    );
  } else {
    currentPage = 1;
    mostrarRecetas(filteredRecetas, currentPage);
  }
}

// Cargar detalle de una receta
function cargarDetalleReceta(receta) {
  if (!receta) return;

  document.getElementById("title").textContent = receta.title || "";
  document.getElementById("portions").textContent = receta.portions || "";

  const photoRecipe = document.getElementById("photo-recipe");
  if (photoRecipe && receta.image) {
    photoRecipe.src = receta.image;
  }

  const listaIngredientes = document.getElementById("ingredientes");
  listaIngredientes.innerHTML = "";
  receta.ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    listaIngredientes.appendChild(li);
  });

  const contenedorInstrucciones = document.getElementById("instrucciones");
  contenedorInstrucciones.innerHTML = "";
  receta.instruction.forEach((instruction) => {
    const p = document.createElement("p");
    p.textContent = instruction;
    contenedorInstrucciones.appendChild(p);
  });

  const curiosidadContainer = document.getElementById("curiosidad-container");
  if (receta.curiosidad) {
    curiosidadContainer.style.display = "block";
    document.getElementById("curiosidad").textContent = receta.curiosidad;
  } else {
    curiosidadContainer.style.display = "none";
  }
}
