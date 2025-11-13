# Práctica 2
- **Autor:** Gabriel Sánchez Muñoz
- **Fecha:** 11/10/25

## Organización de directorios

El proyecto se ha estructurado siguiendo el patrón MVC (Modelo-Vista-Controlador):

- **model/**: Contiene los modelos de datos ([Producto.js](./model/Producto.js)) y la conexión a la base de datos ([db.js](./model/db.js)).
- **views/**: Plantillas HTML usando Nunjucks para el renderizado del frontend.
- **routes/**: Define las rutas y controladores de la aplicación ([router_tienda.js](./routes/router_tienda.js)).
- **public/**: Archivos estáticos (CSS, JS, imágenes) servidos directamente.
- **datos/**: Archivos JSON de categorías de productos de Mercadona.

## Bootstrap y Nunjucks Templates

El frontend se ha implementado usando **Bootstrap 5.3.8** para el diseño responsive y **Nunjucks** como motor de plantillas.

Vistas principales en `views/` usadas por la aplicación:

- `base.html`: Plantilla base que incluye la navbar (con el badge del carrito) y los CDN de Bootstrap. Otras plantillas extienden de esta usando `{% extends "base.html" %}`. La plantilla utiliza variables globales inyectadas desde el router como `cantidadProductos` y `precioTotal`.
- `portada.html`: Página principal con un carrusel (`carousel`) para productos destacados y una sección de tarjetas (`card`) para mostrar productos adicionales. Los datos se inyectan desde la ruta `/` como `productosCarrusel` y `productosCards`.
- `busqueda.html`: Plantilla para mostrar resultados de búsqueda. Espera `productosCards` y la `query` utilizada.
- `carrito.html`: Muestra los productos añadidos al carrito con controles para aumentar/disminuir cantidad y resumen del precio total.
- `test.html`: Plantilla auxiliar para pruebas y depuración.
- `components/`: Carpeta con plantillas parciales reutilizables (por ejemplo: tarjetas de producto, fragmentos de formulario, headers/footers, etc.).

Nunjucks se configura en `tienda.js` para renderizar las vistas con caché deshabilitado en desarrollo y recarga automática.

## Router de la tienda

El archivo `routes/router_tienda.js` define las rutas de la aplicación usando Express Router. Rutas y comportamiento principales:

- `GET /` — Portada (`portada.html`): carga productos (excluye la categoría "Aceite, vinagre y sal" en el filtrado), construye `productosCarrusel` (primeros 3) y `productosCards` (resto hasta un máximo), e inyecta `cantidadProductos` y `precioTotal` para la plantilla.
- `GET /carrito/:id` — Añadir producto al carrito: añade el producto dado por `:id` a la sesión (`req.session.cart`) y actualiza `req.session.totalPrice`. Redirige a la página anterior.
- `GET /carrito` — Ver carrito (`carrito.html`): muestra los items del carrito con sus cantidades y detalles de producto, además de `cantidadProductos` y `precioTotal`.
- `GET /carrito/aumentarItem/:id` — Incrementar cantidad: incrementa la cantidad del ítem en sesión y redirige a `/carrito`.
- `GET /carrito/disminuirItem/:id` — Disminuir/remover ítem: decrementa la cantidad o elimina el ítem del carrito si la cantidad llega a 0; redirige a `/carrito`.
- `GET /buscar` — Búsqueda (`busqueda.html`): recibe la query en `req.query.q`, realiza una búsqueda por `texto_1`, `texto_2` y `categoria` (regex insensible a mayúsculas) y devuelve `productosCards` para la plantilla.

Otras notas:
- El router utiliza la sesión (`express-session`) para almacenar el carrito y el precio total. Hay utilidades internas para calcular `cantidadDeProductos` y mostrar el badge en `base.html`.
- Las rutas regresan errores 500 con el mensaje cuando algo falla (try/catch en cada handler).

Este enfoque modular separa la lógica de rutas del servidor principal y facilita la escalabilidad y el mantenimiento del proyecto.

## Servidor Express

El archivo [tienda.js](./tienda.js) es el punto de entrada de la aplicación:

- Configura Express y Nunjucks como motor de plantillas.
- Conecta a la base de datos MongoDB mediante [db.js](./model/db.js).
- Monta el router de la tienda en la ruta raíz (`/`).
- Sirve archivos estáticos desde el directorio `public` en `/static`.
- Incluye rutas de prueba `/hola` y `/test` para verificar el funcionamiento.

El servidor se inicia en el puerto definido en `.env` (por defecto 8000) y se puede ejecutar en modo desarrollo con recarga automática usando `npm run dev`.


