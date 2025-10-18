import express from "express";
import Producto from "../model/Producto.js";
const router = express.Router();
      
// Portada en /
router.get('/', async (req, res)=>{
  try {
    // Obtener todos los productos (excluyendo "Aceite, vinagre y sal")
    const todosLosProductos = await Producto.find({ 
      categoria: { $ne: 'Aceite, vinagre y sal' } 
    });

    // Primeros 3 productos para el carrusel
    const productosCarrusel = todosLosProductos.slice(0, 3);
    
    // Resto de productos para las cards (máximo 50)
    const productosCards = todosLosProductos.slice(3, 53);

    res.render('portada.html', { 
      productosCarrusel: productosCarrusel,
      productosCards: productosCards
    })
  } catch (err) {
	console.error(err)
    res.status(500).send({ error: err.message })
  }
})

// Ruta de búsqueda /buscar
router.get('/buscar', async (req, res) => {
  try {
    // Obtener el parámetro de búsqueda desde req.query
    const query = req.query.q || '';
    
    let productosCards = [];
    
    if (query.trim()) {
      // Buscar productos usando regex (insensible a mayúsculas/minúsculas)
      // Busca en texto_1, texto_2 y categoria
      productosCards = await Producto.find({
        $and: [
          { categoria: { $ne: 'Aceite, vinagre y sal' } },
          {
            $or: [
              { texto_1: { $regex: query, $options: 'i' } },
              { texto_2: { $regex: query, $options: 'i' } },
              { categoria: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      }).limit(50);
    }
    
    res.render('busqueda.html', { 
      productosCards: productosCards,
      query: query
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
})

// ... más rutas aquí en la siguiente sesión

export default router