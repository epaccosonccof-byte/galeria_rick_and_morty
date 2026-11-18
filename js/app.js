// Dirección base de la API pública.
const API_URL = "https://rickandmortyapi.com/api";

// Elementos HTML que vamos a utilizar desde JavaScript.
const contenedor = document.getElementById("contenedorPersonajes");
const mensaje = document.getElementById("mensaje");
const paginaActual = document.getElementById("paginaActual");
const totalPersonajes = document.getElementById("totalPersonajes");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");

// Estado de la paginación.
let pagina = 1;
let totalPaginas = 42;

// Instancia del modal de Bootstrap.
const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));

// Al iniciar la página, solicitamos la primera página de personajes.
document.addEventListener("DOMContentLoaded", cargarPersonajes);

// Eventos de los botones de paginación.
btnAnterior.addEventListener("click", () => {
    if (pagina > 1) {
        pagina--;
        cargarPersonajes();
    }
});

btnSiguiente.addEventListener("click", () => {
    if (pagina < totalPaginas) {
        pagina++;
        cargarPersonajes();
    }
});

// Consulta a la API y muestra las tarjetas.
async function cargarPersonajes() {
    contenedor.innerHTML = "";
    mensaje.className = "alert alert-info";
    mensaje.textContent = "Cargando personajes...";
    mensaje.classList.remove("d-none");

    try {
        // fetch realiza la petición HTTP a la página indicada.
        const respuesta = await fetch(`${API_URL}/character?page=${pagina}`);

        // fetch no falla automáticamente con estados HTTP como 404 o 500.
        if (!respuesta.ok) {
            throw new Error(`La API respondió con el estado ${respuesta.status}`);
        }

        // Convertimos la respuesta JSON a un objeto JavaScript.
        const datos = await respuesta.json();

        totalPaginas = datos.info.pages;
        totalPersonajes.textContent = `${datos.info.count} personajes en total`;

        // Recorremos el arreglo results y creamos una tarjeta por personaje.
        datos.results.forEach(personaje => {
            contenedor.innerHTML += crearTarjeta(personaje);
        });

        mensaje.classList.add("d-none");
        actualizarPaginacion();

    } catch (error) {
        contenedor.innerHTML = "";
        mensaje.className = "alert alert-danger";
        mensaje.textContent = "No se pudieron cargar los personajes. Comprueba tu conexión e inténtalo nuevamente.";
        console.error("Error al cargar personajes:", error);
    }
}

// Construye el HTML de una tarjeta con los datos de un personaje.
function crearTarjeta(personaje) {
    const estadoClase = obtenerClaseEstado(personaje.status);

    return `
        <div class="col-12 col-sm-6 col-lg-3">
            <article class="tarjeta-personaje shadow-sm">
                <img src="${personaje.image}" alt="Imagen de ${escaparHTML(personaje.name)}">
                <div class="tarjeta-contenido">
                    <h3>${escaparHTML(personaje.name)}</h3>
                    <p class="estado">
                        <span class="punto ${estadoClase}"></span>
                        ${escaparHTML(personaje.status)} - ${escaparHTML(personaje.species)}
                    </p>
                    <p class="ubicacion">
                        <strong>Última ubicación:</strong><br>
                        ${escaparHTML(personaje.location.name)}
                    </p>
                    <button class="btn btn-primary btn-sm"
                        onclick="verDetalle(${personaje.id})">
                        Detalle
                    </button>
                </div>
            </article>
        </div>
    `;
}

// Devuelve la clase CSS según el estado del personaje.
function obtenerClaseEstado(estado) {
    if (estado === "Alive") return "alive";
    if (estado === "Dead") return "dead";
    return "unknown";
}

// Consulta un personaje individual usando su ID y abre el modal.
async function verDetalle(id) {
    const contenido = document.getElementById("contenidoDetalle");
    const titulo = document.getElementById("tituloModal");

    contenido.innerHTML = "Cargando información...";
    titulo.textContent = "Detalle del personaje";
    modal.show();

    try {
        // Esta ruta devuelve un solo personaje: /character/{id}
        const respuesta = await fetch(`${API_URL}/character/${id}`);

        if (!respuesta.ok) {
            throw new Error(`No se encontró el personaje. Estado: ${respuesta.status}`);
        }

        const personaje = await respuesta.json();
        const fecha = new Date(personaje.created).toLocaleDateString("es-PE");

        titulo.textContent = personaje.name;

        contenido.innerHTML = `
            <div class="row g-4">
                <div class="col-md-5 text-center">
                    <img class="detalle-imagen" src="${personaje.image}"
                         alt="Imagen de ${escaparHTML(personaje.name)}">
                </div>
                <div class="col-md-7">
                    ${filaDetalle("ID", personaje.id)}
                    ${filaDetalle("Estado", personaje.status)}
                    ${filaDetalle("Especie", personaje.species)}
                    ${filaDetalle("Género", personaje.gender)}
                    ${filaDetalle("Tipo", personaje.type || "Sin tipo")}
                    ${filaDetalle("Origen", personaje.origin.name)}
                    ${filaDetalle("Última ubicación", personaje.location.name)}
                    ${filaDetalle("Episodios", personaje.episode.length)}
                    ${filaDetalle("Creado", fecha)}
                </div>
            </div>
        `;
    } catch (error) {
        contenido.innerHTML = `<div class="alert alert-danger mb-0">
            No se pudo obtener el detalle del personaje. Inténtalo nuevamente.
        </div>`;
        console.error("Error al consultar el detalle:", error);
    }
}

// Genera una fila del detalle. Se reutiliza para no repetir estructura HTML.
function filaDetalle(etiqueta, valor) {
    return `
        <div class="detalle-fila">
            <strong>${escaparHTML(etiqueta)}</strong>
            <span>${escaparHTML(String(valor))}</span>
        </div>
    `;
}

// Evita interpretar como HTML los textos recibidos desde la API.
function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caracter]);
}

// Actualiza el texto y habilita/deshabilita los botones de páginas.
function actualizarPaginacion() {
    paginaActual.textContent = `Página ${pagina} de ${totalPaginas}`;
    btnAnterior.disabled = pagina === 1;
    btnSiguiente.disabled = pagina === totalPaginas;
}
