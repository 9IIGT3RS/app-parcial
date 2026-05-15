import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import usePlanState from './hooks/usePlanState'
import Home from './pages/Home'
import Explorer from './pages/Explorer'
import MyPlan from './pages/MyPlan'
import Login from './pages/Login'
import Register from './pages/Register'

function AppContent() {
  const { plan, addToPlan, removeFromPlan, planLoading, planError } = usePlanState()

  return (
    <BrowserRouter>
      {/* Navbar recibe la cantidad del plan para mostrar el badge */}
      <Navbar planCount={plan.length} />

      <main>
        {planLoading && (
          <div className="container pt-3">
            <div className="alert alert-info mb-0" role="status">
              Cargando tu plan...
            </div>
          </div>
        )}

        {planError && (
          <div className="container pt-3">
            <div className="alert alert-danger mb-0" role="alert">
              {planError}
            </div>
          </div>
        )}

        <Routes>
          {/* Home: muestra ejercicios destacados */}
          <Route path="/" element={<Home addToPlan={addToPlan} plan={plan} />} />

          {/* Explorer: búsqueda por músculo, permite añadir al plan */}
          <Route path="/explorar" element={<Explorer addToPlan={addToPlan} plan={plan} />} />

          {/* MyPlan: muestra y gestiona el plan guardado */}
          <Route path="/mi-plan" element={<MyPlan plan={plan} removeFromPlan={removeFromPlan} />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
