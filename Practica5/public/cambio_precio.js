const cambiar_precio = (evt) => {
	const botón = evt.target 				// elemento al que se hecho click


    const idProducto = botón.getAttribute('idProducto')			// identificar a que producto pertenece

	// identificar a que producto pertenece 
	// identificar el <input > que le corresponde
	const input = botón.parentElement.querySelector('input.producto-id')
	// tomar el valor de entrada del input
	const precio = input.value

	// Obtener el sufijo del precio actual desde el atributo precioTexto
	const textoPrecioAnterior = input.getAttribute('precioTexto')
	let sufijo = ' € /ud.'
	if (textoPrecioAnterior) {
		const indiceEuro = textoPrecioAnterior.indexOf('€')
		if (indiceEuro !== -1) {
			sufijo = textoPrecioAnterior.substring(indiceEuro)
		}
	}

	// Formatear el nuevo precio (ej: 1.5 -> "1,50")
	const precioNum = parseFloat(precio)
	const precioFormateado = isNaN(precioNum) ? precio : precioNum.toFixed(2).replace('.', ',')
	const nuevoTextoPrecio = precioFormateado + sufijo
	
	fetch(`/api/productos/${idProducto}`,{
			method: "PUT",
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				precio_euros: precio,
				texto_precio: nuevoTextoPrecio
			})
		})
		.then(res => res.json())
		.then( res => {
			console.log(res)
			// poner el precio actualizado
			if (res.error) {
				alert('Error: ' + res.mensaje)
			} else {
				const precioElement = botón.closest('.card-body').querySelector('.precio-normal')
				if (precioElement) {
					precioElement.textContent = res.producto.texto_precio
				}
			}
		})
		.catch(err => {
			console.error(err)
			// poner mesaje de error
			alert('Error al conectar con el servidor')
	})
} 

// sacar los botones_cambiar_precio aqui
// ...
const botones_cambiar_precio = document.getElementsByClassName('cambiar-precio-btn')
for (const botón of botones_cambiar_precio) {
	botón.addEventListener('click', cambiar_precio)
}