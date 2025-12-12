document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value;

    // Si la consulta es muy corta, no hacer nada
    if (query.length < 2) {
        return;
    }

    console.log('Searching for:', query);

    

    // Hacer una petición para obtener las cards HTML renderizadas
    fetch(`/api/busqueda-anticipada/${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(productos => {
            // Limpiar el contenedor antes de agregar nuevos productos
            const tarjetas = document.getElementById('tarjetas');
            tarjetas.innerHTML = '';

            // Mostrar cada producto usando la función muestraProducto
            productos.forEach(producto => {
                muestraProducto(producto);
            });
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
});

function muestraProducto(p) {  								// para cada producto p
	const template = document.getElementById('plantilla')	// la plantilla
	const clonado = template.content.cloneNode(true)        // se clona

    clonado.querySelector('img').src = p.url_img;
    clonado.querySelector('.texto1').textContent = p.texto_1;
    clonado.querySelector('img').setAttribute('alt', p.texto_1 || 'Producto');
    clonado.querySelector('.texto2').textContent = p.texto_2;

	const textoPrecioAnterior = p.texto_precio
	let prefijo = ''
	let sufijo = ' € /ud.'
	if (textoPrecioAnterior) {
		const indiceEuro = textoPrecioAnterior.indexOf('€')
		if (indiceEuro !== -1) {
			prefijo = textoPrecioAnterior.substring(0, indiceEuro).trim()
			sufijo = textoPrecioAnterior.substring(indiceEuro)
		}
	}

    clonado.querySelector('.precio-prefijo').textContent = prefijo;
    clonado.querySelector('.precio-sufijo').textContent = " " +sufijo;

    const tarjetas = document.getElementById('tarjetas')	
	tarjetas.append(clonado)
}