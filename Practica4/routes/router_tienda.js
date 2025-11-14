import express from "express";
import Producto from "../model/Producto.js";
import session from "express-session";
import logger from '../logger.js';

const router = express.Router();
      

// Note: cart totals and counts are provided globally by middleware in `tienda.js` via `res.locals`.

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
	logger.error(err)
    res.status(500).send({ error: err.message })
  }
})

// Añadir un producto al carrito (usa :id como parámetro)
router.get('/carrito/:id', async (req, res) => {
  try {
    const productoId = req.params.id;

    // Asegurar que existe la sesión y el carrito
  if (!req.session) req.session = {};
  if (!req.session.cart) req.session.cart = [];

    // Buscar el producto para validar que existe
    const producto = await Producto.findById(productoId).lean();
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    // Si el producto ya está en el carrito, incrementar cantidad; si no, añadir
    const existing = req.session.cart.find(item => String(item.id) === String(productoId));
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      req.session.cart.push({ id: productoId, qty: 1, nombre: producto.texto_1 || producto.texto_2 || producto.categoria });
    }

    // Guardar sesión (si procede) y redirigir de vuelta
    const goBack = req.get('referer') || '/';
    if (req.session && typeof req.session.save === 'function') {
      req.session.save(err => {
        if (err) {
          logger.error('Error saving session:', err);
          return res.status(500).send({ error: 'Error saving session' });
        }
        return res.redirect(goBack);
      });
    } else {
      return res.redirect(goBack);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({ error: err.message });
  }
});

// Mostrar el contenido del carrito
router.get('/carrito', async (req, res) => {
  try {
    const cart = (req.session && req.session.cart) ? req.session.cart : [];

    // Cargar detalles de productos en el carrito
    const ids = cart.map(item => item.id);
    const productos = ids.length ? await Producto.find({ _id: { $in: ids } }).lean() : [];

    // Mapear cantidades
    const productosConQty = cart.map(item => {
      const prod = productos.find(p => String(p._id) === String(item.id)) || { texto_1: item.nombre };
      return { ...prod, qty: item.qty };
    });
    
    
    res.render('carrito.html', { 
      productos: productosConQty
    });

  } catch (err) {
    logger.error(err);
    res.status(500).send({ error: err.message });
  }
});

router.get('/carrito/aumentarItem/:id', async (req,res) => {
  try{
      const cart = (req.session && req.session.cart) ? req.session.cart : [];
      const itemId = req.params.id;

      const item = cart.find(item => String(item.id) === String(itemId));

      if (item) {
        item.qty = (item.qty || 1) + 1;
      }

      return res.redirect("/carrito")
  } catch (err) {
    logger.error(err);
    res.status(500).send({ error: err.message });
  }
})

router.get('/carrito/disminuirItem/:id', async (req,res) => {
  try{
      const cart = (req.session && req.session.cart) ? req.session.cart : [];
      const itemId = req.params.id;

      const item = cart.find(item => String(item.id) === String(itemId));

      if (item) {
        if(item.qty > 1){
          item.qty = (item.qty || 1) - 1;
        }
        else{
          req.session.cart = cart.filter(i => String(i.id) !== String(itemId));
        }
      }

      return res.redirect("/carrito")
  } catch (err) {
    logger.error(err);
    res.status(500).send({ error: err.message });
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
    logger.error(err);
    res.status(500).send({ error: err.message });
  }
})

// ... más rutas aquí en la siguiente sesión

export default router