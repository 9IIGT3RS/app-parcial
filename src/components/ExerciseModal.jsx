function ExerciseModal({ exercise, onClose, onAddToPlan, isInPlan }) {
  // Si no hay ejercicio seleccionado, no renderizamos nada
  if (!exercise) return null

  return (
    <>
      {/* Fondo oscuro detrás del modal */}
      <div className="modal-backdrop-custom" onClick={onClose} />

      {/* Contenedor del modal */}
      <div className="modal-custom">
        <div className="modal-custom-dialog">

          {/* Cabecera */}
          <div className="modal-custom-header">
            <h5 className="modal-custom-title text-capitalize">
              {exercise.name}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* Cuerpo */}
          <div className="modal-custom-body">
            <div className="row g-4">

              {/* Columna izquierda: GIF */}
              <div className="col-md-5 text-center">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="img-fluid rounded modal-gif"
                />
              </div>

              {/* Columna derecha: información */}
              <div className="col-md-7">

                {/* Músculos objetivo — puede ser targetMuscles o bodyParts según la API */}
                <div className="mb-3">
                  <h6 className="detail-label"><i class="fa-solid fa-dumbbell"></i>Músculo Principal</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {(exercise.targetMuscles?.length > 0
                      ? exercise.targetMuscles
                      : exercise.bodyParts ?? []
                    ).map((m) => (
                      <span key={m} className="badge bg-primary text-capitalize">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Músculos secundarios */}
                {(exercise.secondaryMuscles?.length > 0) && (
                  <div className="mb-3">
                    <h6 className="detail-label">💪 Músculos Secundarios</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {exercise.secondaryMuscles.map((m) => (
                        <span key={m} className="badge bg-secondary text-capitalize">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipamiento */}
                <div className="mb-3">
                  <h6 className="detail-label">🏋️ Equipamiento</h6>
                  <p className="text-capitalize mb-0">
                    {exercise.equipments?.join(', ') || 'Sin equipamiento'}
                  </p>
                </div>

                {/* Instrucciones */}
                {exercise.instructions?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="detail-label">📋 Instrucciones</h6>
                    <ol className="instructions-list">
                      {exercise.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Pie del modal */}
          <div className="modal-custom-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button
              className={`btn ${isInPlan ? 'btn-success' : 'btn-warning'}`}
              onClick={() => { onAddToPlan(exercise); onClose() }}
              disabled={isInPlan}
            >
              {isInPlan ? '✓ Ya está en tu plan' : '+ Añadir al plan'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default ExerciseModal
