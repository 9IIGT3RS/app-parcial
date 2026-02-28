import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getExercises } from '../services/exerciseService'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseModal from '../components/ExerciseModal'

function Home({ addToPlan, plan }) {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)

  /**
   * useEffect se ejecuta una vez al montar el componente ([] como dependencia).
   * Llama al servicio para obtener ejercicios destacados.
   */
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true)
        const data = await getExercises(6)   // Pedimos 6 ejercicios
        setExercises(data)
      } catch (err) {
        setError('No se pudieron cargar los ejercicios. Intenta de nuevo.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, []) // [] = solo se ejecuta al montar, no en cada re-render

  return (
    <>
      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-eyebrow">Tu entrenamiento, tu plan</span>
            <h1 className="hero-title">
              Descubre y planifica<br />
              <span className="hero-highlight">tus ejercicios</span>
            </h1>
            <p className="hero-subtitle">
              Explora cientos de ejercicios, aprende la técnica correcta
              y crea tu plan personalizado en segundos.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/explorar" className="btn btn-warning btn-lg fw-semibold px-4">
                Explorar ejercicios
              </Link>
              <Link to="/mi-plan" className="btn btn-outline-light btn-lg px-4">
                Ver mi plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES RÁPIDAS ─────────────────────────────────── */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: '🔍', title: 'Busca por músculo', desc: 'Filtra ejercicios por grupo muscular' },
              { icon: '📋', title: 'Crea tu plan', desc: 'Guarda los ejercicios que más te gustan' },
              { icon: '🎬', title: 'Ve el movimiento', desc: 'GIFs animados de cada ejercicio' },
            ].map((f) => (
              <div className="col-md-4" key={f.title}>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h5 className="feature-title">{f.title}</h5>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EJERCICIOS DESTACADOS ────────────────────────────── */}
      <section className="featured-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Ejercicios Destacados</h2>
            <p className="section-subtitle">Una muestra de lo que puedes explorar</p>
          </div>

          {/* Estado: cargando */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" />
              <p className="mt-3 text-muted">Cargando ejercicios...</p>
            </div>
          )}

          {/* Estado: error */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {/* Estado: datos cargados */}
          {!loading && !error && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.exerciseId}
                  exercise={exercise}
                  onAddToPlan={addToPlan}
                  onShowDetail={setSelectedExercise}
                  isInPlan={plan.some((ex) => ex.exerciseId === exercise.exerciseId)}
                />
              ))}
            </div>
          )}

          {/* CTA para ir al explorador */}
          {!loading && !error && (
            <div className="text-center mt-5">
              <Link to="/explorar" className="btn btn-outline-warning btn-lg px-5">
                Ver todos los ejercicios →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Modal de detalles — se muestra solo cuando hay un ejercicio seleccionado */}
      <ExerciseModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onAddToPlan={addToPlan}
        isInPlan={plan.some((ex) => ex.exerciseId === selectedExercise?.exerciseId)}
      />
    </>
  )
}

export default Home
