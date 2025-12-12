export default function Navegacion({ onChange }) {
	return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm mb-4 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">

            <div className="flex items-center space-x-3">
            <a className="navbar-brand mr-3" href="/">Mi Tienda Online</a>
            <form className="flex items-center" role="search" action="/busqueda-anticipada" method="GET" id="search-form">
                <input className="border rounded px-3 py-2 h-10 mr-2" type="search" name="q" placeholder="Buscar productos..."
                aria-label="Search" required id="search-input" onChange={onChange}/>
                <button className="btn-mercadona px-3 py-2 rounded h-10" type="submit">Búsqueda Anticipada</button>
            </form>

            </div>
        </div>
        </nav>

	)
}