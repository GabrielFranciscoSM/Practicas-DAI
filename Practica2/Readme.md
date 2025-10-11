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

- [base.html](./views/base.html): Plantilla base que incluye la navbar y los CDN de Bootstrap. Otras plantillas extienden de esta usando `{% extends "base.html" %}`.
- [portada.html](./views/portada.html): Usa componentes de Bootstrap como carruseles (`carousel`), tarjetas (`card`) y utilidades de estilos. Los datos se inyectan mediante variables Nunjucks (`{{ producto.texto_1 }}`).

Nunjucks se configura en [tienda.js](./tienda.js) para renderizar las vistas con caché deshabilitado en desarrollo y recarga automática.

## Router de la tienda

El archivo [router_tienda.js](./routes/router_tienda.js) define las rutas de la aplicación usando Express Router:

- **GET /**: Portada que muestra productos destacados de diferentes categorías en un carrusel. Se obtienen las categorías distintas y se selecciona un producto representativo de cada una para mostrar en la interfaz.

Este enfoque modular permite separar la lógica de rutas del servidor principal y facilita la escalabilidad del proyecto.

## Servidor Express

El archivo [tienda.js](./tienda.js) es el punto de entrada de la aplicación:

- Configura Express y Nunjucks como motor de plantillas.
- Conecta a la base de datos MongoDB mediante [db.js](./model/db.js).
- Monta el router de la tienda en la ruta raíz (`/`).
- Sirve archivos estáticos desde el directorio `public` en `/static`.
- Incluye rutas de prueba `/hola` y `/test` para verificar el funcionamiento.

El servidor se inicia en el puerto definido en `.env` (por defecto 8000) y se puede ejecutar en modo desarrollo con recarga automática usando `npm run dev`.
