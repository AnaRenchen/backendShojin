let data;
let filteredData = [];
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
    filteredData = [...data]; // Una copia de data que inicializa filteredData con todas las recetas inicialmente
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

  await obtenerRecetas();

  if (recipeId) {
    const receta = await obtenerRecetaPorId(recipeId);
    cargarDetalleReceta(receta);
  } else {
    mostrarRecetas(filteredData, currentPage);
  }
});

let currentPage = 1;
const recipePerPage = 8;

// Limpiar contenedor de recetas antes de mostrar un nuevo set
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
  //Recetas por página
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
    img.style.height = "250px";
    img.style.objectFit = "cover";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex  justify-content-center";

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
  // Calcula el número de páginas necesario para mostrar todas las recetas
  const totalPages = Math.ceil(totalRecipes / recipePerPage);
  const paginationDiv = document.getElementById("pagination");
  if (!paginationDiv) return;

  paginationDiv.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "pagination justify-content-center pagination-sm";

  // Definir el rango de páginas visibles
  const maxVisiblePages = 3; // Número máximo de páginas visibles
  //Ajusta el número de la página inicial y final que se mostrarán de acuerdo con la página actual y el máximo de páginas visibles
  let startPage = Math.max(1, actualPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Ajustar si está cerca del inicio o del final
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Botón "Anterior"
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
      mostrarRecetas(filteredData, actualPage - 1);
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
      mostrarRecetas(filteredData, i);
    });

    li.appendChild(link);
    ul.appendChild(li);
  }

  // Botón "Siguiente"
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
      mostrarRecetas(filteredData, actualPage + 1);
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
    filteredData = [...data]; // Restaurar los datos completos
    currentPage = 1;
    mostrarRecetas(filteredData, currentPage);
    return;
  }

  // Filtrar recetas en base al término de búsqueda. Si alguna propiedad coincide entonces se agrega a un nuevo arreglo filteredData
  filteredData = data.filter((item) => {
    const titleMatches = item.title.toLowerCase().includes(searchTerm);
    const descriptionMatches = item.description
      .toLowerCase()
      .includes(searchTerm);

    // Búsqueda de ingredientes dentro de subgrupos
    const ingredientsMatches = item.ingredients.some((group) =>
      group.items.some((ingredient) => {
        if (typeof ingredient === "string") {
          return ingredient.toLowerCase().includes(searchTerm);
        } else if (typeof ingredient === "object") {
          return (
            (ingredient.text &&
              ingredient.text.toLowerCase().includes(searchTerm)) ||
            (ingredient.linkText &&
              ingredient.linkText.toLowerCase().includes(searchTerm)) ||
            (ingredient.link &&
              ingredient.link.toLowerCase().includes(searchTerm))
          );
        }
        return false;
      })
    );

    const tagsMatches = item.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );

    return (
      titleMatches || descriptionMatches || ingredientsMatches || tagsMatches
    );
  });

  if (filteredData.length === 0) {
    mostrarAlerta(
      "No se encontraron recetas. Intenta con otro término de búsqueda."
    );
  } else {
    currentPage = 1; // Para mostrar la primera página de resultados
    mostrarRecetas(filteredData, currentPage); // Muestra las recetas filtradas
  }
}

// Cargar detalle de una receta a partir del parámetro receta que contiene sus datos
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

  receta.ingredients.forEach((section) => {
    // Si hay un subtítulo, agregarlo como un encabezado
    if (section.subtitle) {
      const subtitle = document.createElement("h6");
      subtitle.textContent = section.subtitle;
      subtitle.className = "subtitle-ingredients";
      listaIngredientes.appendChild(subtitle);
    }

    // Crear la lista de ingredientes para esta sección
    const ul = document.createElement("ul");

    section.items.forEach((ingredient) => {
      const li = document.createElement("li");
      li.className = "ingredient-item";

      if (typeof ingredient === "string") {
        // Si es texto plano, agrégalo directamente
        li.textContent = ingredient;
      } else if (
        typeof ingredient === "object" &&
        ingredient.text &&
        ingredient.linkText &&
        ingredient.link
      ) {
        // Si es un objeto con texto y enlace, crea el contenido mixto
        const span = document.createElement("span");
        span.textContent = ingredient.text;

        const a = document.createElement("a");
        a.textContent = ingredient.linkText;
        a.href = ingredient.link;
        a.className = "ingredient-link"; // Clase personalizada

        li.appendChild(span);
        li.appendChild(a);
      }

      ul.appendChild(li);
    });

    listaIngredientes.appendChild(ul);
  });

  const contenedorInstrucciones = document.getElementById("instrucciones");
  contenedorInstrucciones.innerHTML = ""; // Limpiamos el contenedor antes de renderizar

  receta.instruction.forEach((instruction) => {
    const p = document.createElement("p");

    if (typeof instruction === "string") {
      // Si es texto plano, agrégalo directamente
      p.textContent = instruction;
    } else if (
      typeof instruction === "object" &&
      instruction.text &&
      instruction.linkText &&
      instruction.link
    ) {
      // Si es un objeto con texto y enlace, crea contenido mixto
      const span = document.createElement("span");
      span.textContent = instruction.text;

      const a = document.createElement("a");
      a.textContent = instruction.linkText;
      a.href = instruction.link;
      a.className = "instruction-link";

      p.appendChild(span);
      p.appendChild(a);
    } else if (typeof instruction === "object" && instruction.link) {
      // Si es un objeto que solo contiene un enlace
      const a = document.createElement("a");
      a.textContent = instruction.linkText || instruction.link;
      a.href = instruction.link;
      a.className = "instruction-link";

      p.appendChild(a);
    }

    contenedorInstrucciones.appendChild(p);
  });

  // Renderizar notas
  const notesList = document.getElementById("notas-container");
  if (receta.notes && Array.isArray(receta.notes) && receta.notes.length > 0) {
    notesList.style.display = "block";
    notesList.innerHTML = "<h5 class='h5-receta'>Notas:</h5>"; // Agregamos el título de las notas

    const ul = document.createElement("ul"); // Lista para las notas
    ul.className = "notes-list";

    receta.notes.forEach((note) => {
      const li = document.createElement("li");
      li.className = "notes-item";

      if (typeof note === "string") {
        // Si es texto plano, agrégalo directamente
        li.textContent = note;
      } else if (
        typeof note === "object" &&
        note.text &&
        note.linkText &&
        note.link
      ) {
        // Si es un objeto con texto y enlace, crea el contenido mixto
        const span = document.createElement("span");
        span.textContent = note.text;

        const a = document.createElement("a");
        a.textContent = note.linkText;
        a.href = note.link;
        a.className = "notes-link"; // Clase personalizada

        li.appendChild(span);
        li.appendChild(a);
      }

      ul.appendChild(li);
    });

    notesList.appendChild(ul);
  } else {
    notesList.style.display = "none";
    notesList.innerHTML = ""; // Limpiar contenido si no hay notas
  }

  const curiosidadContainer = document.getElementById("curiosidad-container");
  if (receta.curiosidad) {
    curiosidadContainer.style.display = "block";
    document.getElementById("curiosidad").textContent = receta.curiosidad;
  } else {
    curiosidadContainer.style.display = "none";
  }
}
