# Práctica 1 
- **Autor:** Gabriel Sánchez Muñoz
- **Fecha:** 2/10/25

## Parser de datos de mercadona

Para parsear los html de las diferentes categorías de productos de mercadona se usa el archivo [parser_mercadona.js](./parser_mercadona.js), que se encargar de leer los diferentes html y generar el archivo [datos_mercadona.json](./datos_mercadona.json).

### Ejercicio extra: subcategorías

Usando adecuadamente los querySelectors se ha conseguido añadir a la base de datos el campo de subcategoría

## Modelos

En el directorio [/model](./model/) se encuentran dos archivos:

- [connectDB.js](./model/connectDB.js): Proporcionado por el profesor permite conectarse a la base de datos.
- [Producto.js](./model/Producto.js): Contiene el esquema del modelo Producto, con cada campo convenientemente tipado.

## Llena de la base de datos

Ejecutando el archivo [seed.js](./seed.js) se rellena la base de datos con el json [datos_mercadona.json](./datos_mercadona.json), usando el modelo [Producto](./model/Producto.js). Además, antes de insertar los productos vaciamos la base de datos para no tener duplicados.

## Consultas

El archivo [consultas.js](./consultas.js) genera diferentes consultas de prueba para la base de datos. El resultado de estas consultas se muestran tanto en consola como en el archivo log [consultas.log](./consultas.log)

## Ejercicio extra: Backup

Para hacer el backup se ha usado el comando mongodump desde el mismo contenedor. Para ello se ha utilizado este comando:

```Bash
podman exec dai_mongo_1 mongodump --username root --password example --authenticationDatabase admin --out /data/db/backup
```

Donde Podman es un sustituto de docker (es intercambiable).

El resultado se encuentra en la carpeta data, que el mismo contenedor monta como volumen. Es decir, podemos acceder localmente al backup.




