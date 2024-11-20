const dataUrl = "../file/data.json";
let data;

//Obtener recetas del archivo JSON
async function obtenerRecetas() {
  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }
    //Convierte la respuesta a JSON
    data = await response.json();
    return data;
  } catch (error) {
    Swal.fire({
      text: "Error en la petición realizada. :(",
      color: "black",
      toast: true,
      background: "white",
      confirmButtonText: "Ok",
      confirmButtonColor: "black",
      timer: 5000,
    });
  }
}

// Cargar la página y mostrar recetas al inicio
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = parseInt(urlParams.get("id"), 10);

  data = await obtenerRecetas();

  //Si hay un Id en los parámetros de la Url, muestra el detalle de esta receta
  if (recipeId) {
    cargarDetalleReceta(recipeId);
  } else {
    // Si no, muestra todas las recetas
    mostrarRecetas(data);
  }
});

let currentPage = 1;
const recipePerPage = 8; //Número de recetas por página

function showAlert(message) {
  Swal.fire({
    text: message,
    background: "white",
    color: "#333",
    confirmButtonColor: "#556B2F",
    toast: true,
  });
}

// Función para limpiar el contenedor de recetas
function limpiarContenedorRecetas() {
  const listaNames = document.getElementById("recetas");
  listaNames.innerHTML = "";
}

//Función para mostrar las recetas en la página actual
function mostrarRecetas(arregloRecetas, actualPage = 1) {
  const listaNames = document.getElementById("recetas");
  limpiarContenedorRecetas();

  //Calcular el rango de recetas a mostrar en la página actual
  const firstPage = (actualPage - 1) * recipePerPage;
  const lastPage = firstPage + recipePerPage;
  const recipesPage = arregloRecetas.slice(firstPage, lastPage);

  if (listaNames) {
    //Crea un contener principal para las tarjetas de recetas
    const container = document.createElement("div");
    container.className = "container text-center";

    const row = document.createElement("div");
    row.className = "row justify-content-start align-items-center mb-4";
    container.appendChild(row);

    //Crea cada tarjeta de recetas
    recipesPage.forEach((item) => {
      const col = document.createElement("div");
      col.className =
        "col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4";

      const card = document.createElement("div");
      card.className = "card";
      card.style.width = "100%";

      //Enlace que envuelve la imagen apuntando a los detalles de la receta
      const linkWrapper = document.createElement("a");
      linkWrapper.href = `/recipes/recipe?id=${item.id}`;
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
      linkTitle.href = `/recipes/recipe?id=${item.id}`;
      linkTitle.className = "card-title";
      linkTitle.style.textDecoration = "none";

      //Añade el título al cuerpo de la tarjeta y la imagen al enlace envolvente
      cardBody.appendChild(linkTitle);
      linkWrapper.appendChild(img);
      card.appendChild(linkWrapper);
      card.appendChild(cardBody);

      //Añade la tarjeta a la columna y la columna a la fila
      col.appendChild(card);
      row.appendChild(col);
    });

    //Añade el contenedor completo de tarjetas al contenedor principal en el DOM
    listaNames.appendChild(container);
    showPagination(arregloRecetas.length, actualPage);
  }
}
//Paginación en el contenedor
function showPagination(totalRecipes, actualPage) {
  const totalPages = Math.ceil(totalRecipes / recipePerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "pagination justify-content-center";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === actualPage ? "active" : ""}`;

    const link = document.createElement("a");
    link.className = "page-link";
    link.textContent = i;
    link.href = "#";
    link.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = i;
      mostrarRecetas(data, currentPage);
    });

    li.appendChild(link);
    ul.appendChild(li);
  }

  paginationDiv.appendChild(ul);
}

//Búsqueda de recetas
function search() {
  const searchTerm = document
    .getElementById("campo-pesquisa")
    .value.toLowerCase();

  // Filtra recetas en base al término de búsqueda
  const filteredRecetas = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm)
      ) ||
      item.tags.toLowerCase().includes(searchTerm)
  );

  if (filteredRecetas.length === 0) {
    showAlert(
      "No se encontraron recetas. Intenta con otro término de búsqueda."
    );
  } else {
    currentPage = 1;
    mostrarRecetas(filteredRecetas, currentPage);
  }
}

function cargarDetalleReceta(recipeId) {
  const receta = data.find((item) => item.id === recipeId);

  if (receta) {
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
}
