# Práctica 4

- **Autor:** Gabriel Sánchez Muñoz
- **Fecha:** 13/11/25

## Resumen

Esta entrega amplía la tienda online con una API REST para la gestión de productos, pruebas manuales reproducibles con REST Client y un sistema de logging que facilita el seguimiento de lo que ocurre en el servidor.

## Cambios principales

- Nuevas rutas REST bajo `/api/productos` para listar, crear, actualizar y eliminar productos utilizando Mongoose.
- Archivo `test-api.http` con peticiones preparadas (GET, POST, PUT, DELETE) para probar la API con la extensión REST Client.
- Incorporación de logs detallados tanto en consola como en archivo para registrar peticiones, respuestas y errores relevantes.

## Uso de la API

1. Levantar los servicios con `npm install` y `npm run dev` (requiere MongoDB vía Docker Compose).
2. Consumir los endpoints expuestos en `http://localhost:8000/api/productos`:
	- `GET /api/productos` lista todos los productos disponibles.
	- `GET /api/productos/:id` devuelve un producto por su identificador.
	- `POST /api/productos` crea un nuevo producto (se valida el payload requerido).
	- `PUT /api/productos/:id` actualiza precio y texto de precio del producto indicado.
	- `DELETE /api/productos/:id` elimina un producto por su identificador.

## Testing con REST Client

- Abrir `test-api.http` y ejecutar cada bloque para verificar el comportamiento de la API.
- Cada petición incluye cabeceras y payloads de ejemplo para acelerar las pruebas manuales.

## Sistema de logs

- Logs de consola: ayudan a depurar mientras se desarrolla con `npm run dev`.
- Logs persistidos en archivo: permiten auditar operaciones e investigar incidencias tras la ejecución.

