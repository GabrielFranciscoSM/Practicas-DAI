document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value;

    // Si la consulta es muy corta, no hacer nada
    if (query.length < 2) {
        return;
    }

    // Hacer una petición para obtener las cards HTML renderizadas
    fetch(`/api/busqueda-anticipada/${encodeURIComponent(query)}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('resultados').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
});