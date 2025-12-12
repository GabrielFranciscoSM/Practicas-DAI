import express from "express";
import Producto from "../model/Producto.js";
import session from "express-session";
const router = express.Router();
      

function cantidadDeProductos (req) {
  const cart = (req.session && Array.isArray(req.session.cart)) ? req.session.cart : [];
  return cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
}

async function calcularPrecioTotal(req) {
  const cart = (req.session && Array.isArray(req.session.cart)) ? req.session.cart : [];
  if (!cart.length) return 0;
  const ids = cart.map(item => item.id);
  const productos = ids.length ? await Producto.find({ _id: { $in: ids } }).lean() : [];

  let total = 0;
  for (const item of cart) {
    const prod = productos.find(p => String(p._id) === String(item.id));
    if (!prod) continue;
    const precioUnit = Number(prod.precio_euros) || 0;
    const descuento = Number(prod.descuento) || 0;
    const qty = Number(item.qty) || 1;
    total += precioUnit * (1 - descuento) * qty;
  }
  return total;
}

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


    const total = await calcularPrecioTotal(req);
    res.render('portada.html', { 
      productosCarrusel: productosCarrusel,
      productosCards: productosCards,
      cantidadProductos: cantidadDeProductos(req),
      precioTotal: Number(total || 0).toFixed(2)
    })

  } catch (err) {
	console.error(err)
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
          console.error('Error saving session:', err);
          return res.status(500).send({ error: 'Error saving session' });
        }
        return res.redirect(goBack);
      });
    } else {
      return res.redirect(goBack);
    }
  } catch (err) {
    console.error(err);
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


    // Calcular precio total
    const totalCarrito = await calcularPrecioTotal(req);

    // Renderizar plantilla
    res.render('carrito.html', { 
      productos: productosConQty,
      cantidadProductos: cantidadDeProductos(req),
      precioTotal: Number(totalCarrito || 0).toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// Aumentar cantidad de un ítem en el carrito
router.get('/carrito/aumentarItem/:id', async (req,res) => {
  try{

      // Obtener el carrito y el id del ítem
      const cart = (req.session && req.session.cart) ? req.session.cart : [];
      const itemId = req.params.id;

      // Encontrar item
      const item = cart.find(item => String(item.id) === String(itemId));

      if (item) {
        item.qty = (item.qty || 1) + 1;
      }

      return res.redirect("/carrito")
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
})

// Disminuir cantidad de un item en el carrito
router.get('/carrito/disminuirItem/:id', async (req,res) => {
  try{

      // Obtener el carrito y el id del ítem
      const cart = (req.session && req.session.cart) ? req.session.cart : [];
      const itemId = req.params.id;

      // Encontrar el item
      const item = cart.find(item => String(item.id) === String(itemId));

      // Disminuir cantidad o eliminar si llega a 0
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
    console.error(err);
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
    

    const totalBusqueda = await calcularPrecioTotal(req);
    res.render('busqueda.html', { 
      productosCards: productosCards,
      query: query,
      cantidadProductos: cantidadDeProductos(req),
      precioTotal: Number(totalBusqueda || 0).toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
})


export default router