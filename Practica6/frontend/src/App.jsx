import { useState } from "react"
import Navegacion from "./components/Navegacion"
import Resultados from "./components/Resultados"

function App() {

  const [peticion, setPeticion] = useState('')

  const handleChange = (evt) => {
	  const value = evt.target.value
    console.log('App.jsx detected change:', value)
	  setPeticion(value)
  }

  return (
    <>
		<Navegacion onChange={handleChange}/>
		<Resultados de={peticion} />
    </>
  )
}
export default App