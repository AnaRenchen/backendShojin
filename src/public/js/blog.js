let data;
let filteredData = [];
const apiUrl = "/api/posts";

let currentPage = 1;
const postsPerPage = 5;

// Obtener todos los posts
async function obtenerPosts() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Error al obtener posts");

    data = await response.json();
    filteredData = [...data];
    mostrarPosts(filteredData, currentPage);
  } catch (error) {
    console.error(error);
  }
}

// Obtener post por ID
async function obtenerPostsPorId(postId) {
  try {
    const response = await fetch(`${apiUrl}/${postId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }

    const post = await response.json();
    return post;
  } catch (error) {
    mostrarAlerta("Error al obtener post.");
    console.error(error);
  }
}

function mostrarPosts(posts, page = 1) {
  const container = document.getElementById("posts");
  container.innerHTML = "";

  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const postsPage = posts.slice(start, end);

  postsPage.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post-preview";

    // TÍTULO
    const title = document.createElement("a");
    title.href = `/blog/post?id=${post._id}`;
    title.textContent = post.title;
    title.className = "post-title";

    // RESUMEN
    const excerpt = document.createElement("p");
    excerpt.className = "post-excerpt";
    excerpt.textContent = cortarTexto(post.content, 300);

    // AUTOR Y FECHA
    const meta = document.createElement("p");
    meta.className = "post-meta";
    meta.textContent = `Por ${post.author} · ${formatearFecha(post.createdAt)}`;

    postDiv.appendChild(title);
    postDiv.appendChild(excerpt);
    postDiv.appendChild(meta); // se agrega debajo del resumen

    container.appendChild(postDiv);
  });

  showPagination(posts.length, page);
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function cortarTexto(texto, maxChars) {
  if (texto.length <= maxChars) return texto;
  return texto.substring(0, maxChars) + "...";
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) return;

  try {
    const response = await fetch(`${apiUrl}/${postId}`);
    if (!response.ok) throw new Error("Error al cargar la entrada");

    const post = await response.json();
    renderPost(post);
  } catch (error) {
    console.error(error);
  }
});

function renderPost(post) {
  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-author").textContent = `Por ${post.author}`;
  document.getElementById("post-date").textContent = formatearFecha(
    post.createdAt
  );

  // Convertir saltos de línea en párrafos
  const contentDiv = document.getElementById("post-content");
  contentDiv.innerHTML = "";

  const paragraphs = post.content.split("\n\n");

  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    contentDiv.appendChild(p);
  });

  // Imagen (opcional)
  const img = document.getElementById("post-image");

  if (post.image) {
    img.src = post.image;
    img.alt = post.title;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }
}

function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function showPagination(totalPosts, page) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "pagination justify-content-center pagination-sm";

  if (page > 1) {
    ul.appendChild(createPageItem("Anterior", page - 1));
  }

  for (let i = 1; i <= totalPages; i++) {
    ul.appendChild(createPageItem(i, i, i === page));
  }

  if (page < totalPages) {
    ul.appendChild(createPageItem("Siguiente", page + 1));
  }

  paginationDiv.appendChild(ul);
}

function createPageItem(text, page, active = false) {
  const li = document.createElement("li");
  li.className = `page-item ${active ? "active" : ""}`;

  const a = document.createElement("a");
  a.className = "page-link";
  a.href = "#";
  a.textContent = text;

  a.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = page;
    mostrarPosts(filteredData, currentPage);
  });

  li.appendChild(a);
  return li;
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerPosts();
});
