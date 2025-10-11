import express from "express";
import Producto from "../model/Producto.js";
const router = express.Router();
      
// Portada en /
router.get('/', async (req, res)=>{
  try {
    // Queremos elegir un producto por cada "categoria".
    // Estrategia: obtener las categorias distintas y, para cada una,
    // seleccionar un producto aleatorio (si hay varios) usando count+skip.
    const categorias = await Producto.distinct('categoria');
    const productosParaMostrar = [];
    for (const cat of categorias) {
      // Filtrar categoría "Aceite, vinagre y sal" porque no tiene fotos válidas
      if (cat === 'Aceite, vinagre y sal') continue;
      
      const producto = await Producto.findOne({ categoria: cat });
      if (producto) productosParaMostrar.push(producto);
    }

    res.render('portada.html', { productos: productosParaMostrar })    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
	console.error(err)
    res.status(500).send({ error: err.message })
  }
})

// ... más rutas aquí en la siguiente sesión

export default router