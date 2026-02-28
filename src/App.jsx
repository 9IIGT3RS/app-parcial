import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explorer from './pages/Explorer'
import MyPlan from './pages/MyPlan'

function App() {
  // plan = array de ejercicios guardados por el usuario
  // Persiste en localStorage con la clave 'fitplan-plan'
  const [plan, setPlan] = useLocalStorage('fitplan-plan', [])

  /**
   * Añade un ejercicio al plan.
   */
  const addToPlan = (exercise) => {
    const alreadyIn = plan.some((ex) => ex.exerciseId === exercise.exerciseId)
    if (!alreadyIn) {
      setPlan([...plan, exercise])
    }
  }

  /**
   * Elimina un ejercicio del plan.
   */
  const removeFromPlan = (exerciseId) => {
    setPlan(plan.filter((ex) => ex.exerciseId !== exerciseId))
  }

  return (
    <BrowserRouter>
      {/* Navbar recibe la cantidad del plan para mostrar el badge */}
      <Navbar planCount={plan.length} />

      <main>
        <Routes>
          {/* Home: muestra ejercicios destacados */}
          <Route path="/" element={<Home addToPlan={addToPlan} plan={plan} />} />

          {/* Explorer: búsqueda por músculo, permite añadir al plan */}
          <Route path="/explorar" element={<Explorer addToPlan={addToPlan} plan={plan} />} />

          {/* MyPlan: muestra y gestiona el plan guardado */}
          <Route path="/mi-plan" element={<MyPlan plan={plan} removeFromPlan={removeFromPlan} />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
