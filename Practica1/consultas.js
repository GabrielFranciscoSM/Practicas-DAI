import mongoose from 'mongoose'
import fs from 'fs'
    
import connectDB from './model/connectDB.js'
import Producto from './model/Producto.js'

await connectDB()

// Variable para acumular todos los logs
let logCompleto = ''

// Función para guardar logs en archivo
function guardarLog(titulo, datos) {
    const timestamp = new Date().toISOString()
    const contenido = `\n${'='.repeat(80)}\n${titulo}\n${timestamp}\n${'='.repeat(80)}\n${JSON.stringify(datos, null, 2)}\n`
    logCompleto += contenido
    console.log(`✓ ${titulo} - ${datos.length} resultados`)
}

// Consulta de productos con precios bajos mediante el comparador $lt (less than)
const precios_bajos = await Producto.find({ precio_euros: {$lt: 1} },'precio_euros texto_1');
console.log(precios_bajos)
guardarLog('Productos con precios menores a 1€', precios_bajos)

// Consulta de productos que no sean agua usando los operadores $regex
// para buscar productos con agua en su categoría y negarlo con $not
const no_agua = await Producto.find({ categoria: {$not: {$regex: /agua/}} }, 'categoria texto_1');
console.log(no_agua)
guardarLog('Productos que no son agua', no_agua)

// Consulta de productos que no sean cereales. Al no haber agua en la base de datos,
// de esta manera nos cercionamos que funcione correctamente la consulta
// Se añada la opción i para no distinguir mayúsculas y minúsculas
const no_cereales = await Producto.find({ categoria: {$not: {$regex: /cereales/i}} }, 'categoria texto_1');
console.log(no_cereales)
guardarLog('Productos que no son cereales', no_cereales)

// Consulta de aceites ordenados por precio, usando el operador sort con orden ascendente (1)
const aceites_ordenados_precio = await Producto.find({ categoria: {$regex: /aceite/i} },'precio_euros texto_1').sort({precio_euros:1})
console.log(aceites_ordenados_precio)
guardarLog('Aceites ordenados por precio (ascendente)', aceites_ordenados_precio)

// Consulta de productos que no esten en garrafas. Para cercionarnos, consultamos texto_1 y taxto_2
// con el operador $regex y el operador $or para permitir que aparezca en alguno de los campos
const garrafa = await Producto.find({     
    $or: [
        { texto_1: {$regex: /garrafa/i} },
        { texto_2: {$regex: /garrafa/i} }
    ]}, 'categoria texto_1 texto_2')
console.log(garrafa)
guardarLog('Productos en garrafa', garrafa)

// Escribir todo el log en el archivo al final
fs.writeFileSync('consultas.log', logCompleto, 'utf8')
console.log('\n📝 Log guardado en consultas.log')

mongoose.connection.close()
