import { Link } from 'react-router-dom'

function MyPlan({ plan, removeFromPlan }) {
  return (
    <div className="myplan-page">

      {/* ── CABECERA ─────────────────────────────────────────── */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Mi Plan</h1>
          <p className="page-subtitle">
            {plan.length > 0
              ? `Tienes ${plan.length} ejercicio${plan.length !== 1 ? 's' : ''} en tu plan`
              : 'Aún no tienes ejercicios en tu plan'}
          </p>
        </div>
      </div>

      <div className="container py-5">

        {/* Plan vacío */}
        {plan.length === 0 && (
          <div className="empty-plan text-center py-5">
            <div className="empty-icon">📋</div>
            <h4 className="mt-3">Tu plan está vacío</h4>
            <p className="text-muted mb-4">
              Explora los ejercicios disponibles y añade los que quieras practicar.
            </p>
            <Link to="/explorar" className="btn btn-warning btn-lg px-5">
              Explorar ejercicios
            </Link>
          </div>
        )}

        {/* Lista del plan */}
        {plan.length > 0 && (
          <>
            {/* Grid de ejercicios del plan */}
            <div className="row g-4">
              {plan.map((exercise, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={exercise.exerciseId}>
                  <div className="plan-card">

                    {/* Número de orden */}
                    <div className="plan-number">#{index + 1}</div>

                    {/* GIF pequeño */}
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="plan-gif"
                      loading="lazy"
                    />

                    {/* Info del ejercicio */}
                    <div className="plan-info">
                      <h6 className="plan-exercise-name text-capitalize">
                        {exercise.name}
                      </h6>
                      <p className="plan-muscle text-capitalize text-muted mb-0">
                        <i class="fa-solid fa-dumbbell"></i> {exercise.targetMuscles?.[0] || 'Sin clasificar'}
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      className="btn btn-outline-danger btn-sm plan-remove-btn"
                      onClick={() => removeFromPlan(exercise.exerciseId)}
                      title="Eliminar del plan"
                    >
                      ✕
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/* Botón para limpiar todo el plan */}
            <div className="text-center mt-5">
              <Link to="/explorar" className="btn btn-outline-warning me-3">
                + Añadir más ejercicios
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default MyPlan
