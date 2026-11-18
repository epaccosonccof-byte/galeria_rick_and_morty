# Galería de personajes de Rick and Morty

Actividad práctica de Desarrollo Web en Entorno Servidor (DWES).

## 1. Requisitos cumplidos

- Consumo de The Rick and Morty API mediante `fetch`.
- Cuadrícula adaptable: cuatro tarjetas en escritorio, dos en tablet y una en celular.
- Tarjetas con imagen, nombre, estado, especie y última ubicación.
- Color del estado: verde (Alive), rojo (Dead) y gris (unknown).
- Modal de Bootstrap con detalle del personaje.
- Paginación entre las páginas que informa la API.
- Manejo de errores de petición y respuesta HTTP.
- Preparado para publicar como sitio estático en Vercel.

## 2. Archivos del proyecto

- `index.html`: estructura de la página, enlaces a Bootstrap y modal.
- `css/estilos.css`: colores, tarjetas, modal y ajustes visuales.
- `js/app.js`: petición a la API, creación de tarjetas, detalle y paginación.

## 3. Cómo ejecutar

1. Descomprime la carpeta.
2. Abre `index.html` en el navegador. También puedes abrir la carpeta en Visual Studio Code y usar Live Server.
3. Necesitas conexión a internet porque Bootstrap y la API se cargan desde internet.

No requiere XAMPP, PHP, base de datos ni clave API.

## 4. Cómo funciona

1. Al cargar el documento, JavaScript ejecuta `cargarPersonajes()`.
2. `fetch()` solicita `https://rickandmortyapi.com/api/character?page=1`.
3. `respuesta.json()` convierte el JSON recibido en un objeto JavaScript.
4. `datos.results` contiene los personajes. `forEach()` recorre el arreglo y `crearTarjeta()` genera el HTML de cada tarjeta.
5. El botón Detalle llama a `verDetalle(id)`. Esta función consulta `/character/{id}` y muestra los datos en el modal de Bootstrap.
6. Los botones Anterior y Siguiente modifican la variable `pagina` y vuelven a ejecutar `cargarPersonajes()`.
7. `try/catch` permite mostrar un mensaje si ocurre un error. Se comprueba `respuesta.ok` porque `fetch` no considera automáticamente un 404 como error de JavaScript.

## 5. Explicación de conceptos importantes

### `async` y `await`
`async` permite declarar una función asíncrona. `await` espera el resultado de una operación, como `fetch`, sin bloquear toda la página.

### `fetch()`
Realiza una petición HTTP a una dirección. En esta actividad se utiliza para pedir personajes a la API.

### JSON
Es el formato en que la API entrega los datos. Por ejemplo, cada personaje contiene propiedades como `name`, `status`, `species`, `image`, `origin` y `location`.

### `datos.results`
Es el arreglo con los personajes de la página solicitada. La información de paginación está en `datos.info`.

### Modal de Bootstrap
Es una ventana emergente. Al pulsar Detalle se consulta un personaje por su ID y se colocan sus datos dentro del modal.

### `try/catch`
`try` ejecuta el código que puede producir un error. `catch` captura el error y permite mostrar un mensaje en vez de dejar la página sin explicación.

## 6. Publicar en Vercel

1. Sube el contenido de esta carpeta a un repositorio público de GitHub.
2. Entra a https://vercel.com e inicia sesión con GitHub.
3. Selecciona Add New > Project e importa el repositorio.
4. Selecciona el framework Other si aparece.
5. Deja vacíos Build Command y Output Directory.
6. Pulsa Deploy.
7. Abre el enlace `.vercel.app` que entrega Vercel.

Cuando actualices el repositorio, Vercel volverá a publicar el sitio automáticamente.

## 7. API utilizada

Documentación y datos: https://rickandmortyapi.com/documentation
