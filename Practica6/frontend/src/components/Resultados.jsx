import { Result } from 'postcss';
import useSWR from 'swr';

// simple fetcher for useSWR
const fetcher = (...args) => fetch(...args).then((res) => {
    if (!res.ok) throw new Error('Network response was not ok')
    return res.json()
})

export default function Resultados({ de }) {

    if (de.length < 3) return <div>...</div>

    const ponProducto = (p = []) => {

        console.log(p)

        const rellenarPLantilla = (producto) => {
            return (<div>
                <img className="w-10/12 h-3/6 bg-gray-400 ml-5"
                    src={producto.url_img}
                    alt={producto.texto_1 || 'Producto'}>
                </img>
                <div className="px-6 py-4">
                    <p className="text texto1 text-gray-400 text-base mb-3" style={{ fontSize: "1rem", lineHeight: "1.4" }}>{producto.texto_1}</p>

                    <p className="texto2 text-gray-700 text-base mb-4 card-text" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                        {producto.texto_2}
                    </p>

                    <div className="precio flex items-baseline gap-2">
                        <span className="precio-prefijo font-bold text-lg">
                            {
                                (() => {
                                    const textoPrecioAnterior = producto.texto_precio
                                    let prefijo = ''
                                    if (textoPrecioAnterior) {
                                        const indiceEuro = textoPrecioAnterior.indexOf('€')
                                        if (indiceEuro !== -1) {
                                            prefijo = textoPrecioAnterior.substring(0, indiceEuro).trim()
                                        }
                                    }
                                    return prefijo
                                })()
                            }
                        </span>
                        <span className="precio-sufijo text-gray-500 text-sm mt-2" style={{ fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px" }}>
                            {
                                (() => {
                                    const textoPrecioAnterior = producto.texto_precio
                                    let sufijo = ' € /ud.'
                                    if (textoPrecioAnterior) {
                                        const indiceEuro = textoPrecioAnterior.indexOf('€')
                                        if (indiceEuro !== -1) {
                                            sufijo = textoPrecioAnterior.substring(indiceEuro)
                                        }
                                    }
                                    return " " + sufijo
                                })()
                            }
                        </span>
                        <div className="px-6 pb-2 text-center">
                            <span className="w-full inline-block rounded-full px-3 py-1 text-sm text-yellow-800 mr-2 mb-2 
                                            border border-yellow-600 hover:bg-yellow-200">Añadir al carro</span>

                        </div>

                    </div>
                </div>

            </div>
            )
        }

        // Render grid container with 4 columns on large screens (lg).
        const result = (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {p.map((producto) => (
                    <div className='max-w-xs rounded overflow-hidden hover:shadow flex flex-col m-2' key={producto._id || producto.id || producto.texto_1}>
                        {rellenarPLantilla(producto)}
                    </div>
                ))}
            </div>
        )

        console.log(result)

        return (result)

    }

    // hook de swr, re-rendiriza en algún cambio de las variables
    const { data, error, isLoading } = useSWR(
        `http://localhost:8000/api/busqueda-anticipada/${de}`,
        fetcher
    );

    return (
        <div>
            {
                isLoading ? (
                    <h1>Cargando</h1>
                ) : data ? (
                    ponProducto(data)
                ) : error ? (<div>{error}</div>) : (<div>...</div>)
            }
        </div>
    )
}