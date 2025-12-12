import express from "express";
import Producto from "../model/Producto.js";
import logger from '../logger.js';

const router = express.Router();
      
router.get('/productos', async (req, res)=>{
    
    try {
        const productos = await Producto.find();

        if(productos.length === 0){
            return res.status(404).json({ mensaje: 'No se encontraron productos', error: 'No products found' });
        }

        res.status(200).json({productos: productos ,error: null});
    } catch (error) {
        logger.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});

router.get('/productos/:id', async (req, res)=>{

    try {
         const producto =  await Producto.findById(req.params.id);

        if(!producto){
            return res.status(404).json({ mensaje: 'Producto no encontrado', error: 'Product not found' });
        }

        res.status(200).json({producto: producto ,error: null});
    } catch (error) {
        logger.error('Error al obtener el producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});

router.post('/productos', async (req, res)=>{
    const { texto_1, texto_2, precio_euros, texto_precio, url_img, categoria, subsection } = req.body;

    if (!texto_1 || !texto_2 || !precio_euros || !url_img || !categoria || !subsection) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios', error: 'Missing required fields' });
    }

    try {
        const nuevoProducto = new Producto({ texto_1, texto_2, precio_euros, texto_precio, url_img, categoria, subsection });
        await nuevoProducto.save();

        // Responder con el recurso creado
        return res.status(201).json(nuevoProducto);
    } catch (error) {
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            // Recolectar mensajes de error por campo
            const detalles = Object.keys(error.errors).reduce((acc, key) => {
                acc[key] = error.errors[key].message;
                return acc;
            }, {});
            return res.status(400).json({ mensaje: 'Error de validación', detalles, error: 'Validation error' });
        }

        // Para otros errores, devolver 500 y loguear el error en el servidor
        logger.error('Error al guardar nuevo producto:', error);
        return res.status(500).json({ mensaje: 'Error interno al guardar el producto', error: error.message });
    }
});

router.delete('/productos/:id', async (req, res)=>{

    try {
        const resultado = await Producto.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Producto eliminado', resultado, error: null });
    } catch (error) {
        logger.error('Error al eliminar el producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});

router.put('/productos/:id', async (req, res)=>{
    const { precio_euros, texto_precio } = req.body;

    if (precio_euros === undefined || texto_precio === undefined ) {
        return res.status(400).json({ mensaje: 'El campo precio es obligatorio', error: 'Missing required fields' });
    }

    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            { precio_euros, texto_precio },
            { new: true, runValidators: true }
        );
        
        res.status(200).json({ producto: productoActualizado, error: null });
    } catch (error) {
        if (error.name === 'ValidationErMaxViTror') {
            const detalles = Object.keys(error.errors).reduce((acc, key) => {
                acc[key] = error.errors[key].message;
                return acc;
            }, {});
            return res.status(400).json({ mensaje: 'Error de validación', detalles, error: 'Validation error' });
        }
        logger.error('Error al actualizar el producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});

router.get('/busqueda-anticipada/:term', async (req, res) => {
    const termino = req.params.term;

    try {
        const regex = new RegExp(termino, 'i'); // 'i' para búsqueda case-insensitive
        const productos = await Producto.find({
            $or: [
                { texto_1: regex },
                { texto_2: regex },
                { categoria: regex },
                { subsection: regex }
            ]
        }).limit(10); // Limitar resultados para evitar sobrecarga

        res.json(productos);
    }   catch (error) {
        logger.error('Error en búsqueda anticipada:', error);
        res.status(500).send('Error en la búsqueda');
    }
});


export default router