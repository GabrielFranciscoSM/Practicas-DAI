import 'dotenv/config'
import mongoose from 'mongoose'
	
import connectDB from './model/db.js'
import Producto from './model/Producto.js'
import User from './model/User.js'
import fs from 'node:fs'


await connectDB()

await Vaciar_base_de_datos()
	
const datos_productos = Lee_archivo('datos/datos_mercadona.json')
const lista_productos = JSON.parse(datos_productos)
	
await Guardar_en_modelo(Producto, lista_productos)

const datos_usuarios = Lee_archivo('datos/usuarios.json')
const lista_usuarios = JSON.parse(datos_usuarios)

await Guardar_usuarios(lista_usuarios)
	
mongoose.connection.close()

// Función para vaciar la base de datos
async function Vaciar_base_de_datos() {
	try {
		await Producto.deleteMany({})
		await User.deleteMany({})
		console.log('Base de datos vaciada correctamente')
	} catch (error) {
		console.error(`Error vaciando la base de datos: ${error.message}`)
	}
}
			
async function Guardar_en_modelo(modelo, lista) {
	try {
		const insertados = await modelo.insertMany(lista)           // await siempre en funciones async
		console.log(`Insertados ${insertados.length} documentos en ${modelo.modelName}`)
	} catch (error) {
		console.error(`Error guardando lista ${error.message}`)
	}
}

async function Guardar_usuarios(lista) {
	try {
		for (const usuario of lista) {
			const nuevoUsuario = new User(usuario)
			await nuevoUsuario.save()
		}
		console.log(`Insertados ${lista.length} usuarios`)
	} catch (error) {
		console.error(`Error guardando usuarios: ${error.message}`)
	}
}

function Lee_archivo(archivo) {
	try {
		return fs.readFileSync(archivo, 'utf8')
	} catch (error) {
		console.error('Error leyendo archivo: ', error);
	}
}