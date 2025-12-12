import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
	categoria: {
		type: String,
		required: true,
		trim: true,  
	},
    subsection: {
		type: String,
		required: true,
		trim: true,  
    },
	url_img: {
		type: String,
		required: true,
		trim: true,
    },
    texto_1: {
        type: String,
		required: true,
		trim: true,  
    },
    texto_2: {
        type: String,
		required: true,
		trim: true,  
    },
    texto_precio: {
        type: String,
		required: true,
		trim: true,  
    },
    precio_euros: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'El precio debe ser un valor mayor o igual a 0'
        }    
    },
    descuento: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
        validate: {
            validator: function(v) {
                return v >= 0 && v <= 1;
            },
            message: 'El descuento debe ser un valor entre 0 y 1'
        }
    }
	
})

const Producto = mongoose.model('Producto', productoSchema);
export default Producto