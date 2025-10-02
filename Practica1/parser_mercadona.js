import fs from 'node:fs'

// https://github.com/taoqf/node-html-parser
// se instala
// npm i node-html-parser
import { parse } from 'node-html-parser';


// Para acumular la informÃ¡cion de los productos
let Info = []

// cambiar el programa para usar una lista de letios archivos html
// con distintas categorÃ­as
// elemento:
//<div class="grid-layout__main-container" style="height: calc(-76px + 100vh)">
// ...
// </div>

const categorias = ['arroz.html', 'aceites.html', 'aves_y_jamon.html', "cereales.html"]

let html
const root = []

//POr cada archivo parseamos su html
for (let i = 0; i < categorias.length; i++) {
	html = (Lee_archivo(categorias.at(i)))
	root.push(parse(html))
}


for (let i = 0; i < root.length; i++) {

	//Obtenemos las subcategoria de cada categoria
	const subsections = root.at(i).querySelectorAll('section.section')

	for (let j = 0; j < subsections.length; j++) {
		//Por cada subcategoria obtenemos lista de productos, nombre de categorías y nombre de la subcategoría
		const lista_productos = subsections.at(j).querySelectorAll('div.product-cell')
		const subsection = subsections.at(j).querySelector('h2.headline1-b').text
		const nombre_categoria = root.at(i).querySelector('h1').text

		for (const producto of lista_productos) {
			Info.push(producto_to_JSON(producto, nombre_categoria, subsection))
		}

	}

}

const string_para_guardar_en_fomato_json = JSON.stringify(Info, null, 2)

try {
	fs.writeFileSync('datos_mercadona.json', string_para_guardar_en_fomato_json)
	console.log('Guardado archivo')
} catch (error) {
	console.error('Error guardando archivo: ', error)
}

//Función para generar los datos JSON
function producto_to_JSON(producto, categoria, subsection) {

	const img = producto.querySelector('img')
	const url_img = img.attrs.src
	const texto_1 = img.attrs.alt
	const t2 = producto.querySelector('div.product-format')
	const texto_2 = Arregla_texto(t2.text)
	const texto_precio = Arregla_texto(producto.querySelector('div.product-price').innerText)
	const r1 = texto_precio.match(/(\d+),?(\d+)?(.+)/)

	const precio_euros = (r1.length > 2) ? Number(r1[1] + '.' + r1[2]) : undefined
	const info_prod = {
		categoria,
		subsection,
		url_img,
		texto_1,
		texto_2,
		texto_precio,
		precio_euros
	}

	return info_prod
}

function Arregla_texto(texto) {
	let arreglado = texto.replace('\n', '')
	arreglado = arreglado.replace(/\s+/g, ' ')
	return arreglado.trim()
}


function Lee_archivo(archivo) {
	try {
		return fs.readFileSync(archivo, 'utf8')
	} catch (error) {
		console.error('Error leyendo archivo: ', error);
	}
}
