import { useCallback, useState } from 'react'

//Para que el plan del usuario no se pierda al recargar la página.
function useLocalStorage(key, initial) {
  // Al crear el estado, intentamos leer desde localStorage primero
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      // Si existe algo guardado, lo parseamos de JSON a objeto/array
      return saved !== null ? JSON.parse(saved) : initial
    } catch {
      // Si hay un error de parseo, usamos el valor inicial
      return initial
    }
  })

  // Esta función reemplaza al "setter" normal de useState
  // Guarda en el estado Y en localStorage al mismo tiempo
  const setValueAndSave = useCallback((newValue) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }, [key])

  return [value, setValueAndSave]
}

export default useLocalStorage
