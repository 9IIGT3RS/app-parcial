function ExerciseCard({ exercise, onAddToPlan, onShowDetail, isInPlan }) {
  return (
    <div className="col">
      <div className="card exercise-card h-100">

        {/* GIF animado del ejercicio */}
        <div className="card-img-wrapper">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="card-img-top exercise-gif"
            loading="lazy"
          />
        </div>

        <div className="card-body d-flex flex-column">
          {/* Nombre del ejercicio */}
          <h6 className="card-title exercise-name text-capitalize">
            {exercise.name}
          </h6>

          {/* Músculo principal */}
          <p className="card-text">
            <small className="text-muted text-capitalize">
              <i class="fa-solid fa-dumbbell"></i> {exercise.targetMuscles?.[0] || 'Sin clasificar'}
            </small>
          </p>

          {/* Botones  */}
          <div className="mt-auto d-flex gap-2">

            {/* Ver detalles */}
            <button
              className="btn btn-outline-primary btn-sm flex-grow-1"
              onClick={() => onShowDetail(exercise)}
            >
              Ver más
            </button>

            {/* Añadir al plan → deshabilitado si ya está */}
            <button
              className={`btn btn-sm ${isInPlan ? 'btn-success' : 'btn-warning'}`}
              onClick={() => !isInPlan && onAddToPlan(exercise)}
              disabled={isInPlan}
              title={isInPlan ? 'Ya está en tu plan' : 'Añadir al plan'}
            >
              {isInPlan ? '✓' : '+'}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseCard
