import { useState, useEffect } from "react";
import { getMuscles, getExercisesByMuscle } from "../services/exerciseService";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseModal from "../components/ExerciseModal";

function Explorer({ addToPlan, plan }) {
  const [muscles, setMuscles] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loadingMuscles, setLoadingMuscles] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  /**
   * Al montar la página, cargamos la lista de músculos.
   * Solo ocurre una vez (dependencia vacía []).
   */
  useEffect(() => {
    const fetchMuscles = async () => {
      try {
        const data = await getMuscles();
        setMuscles(data);
      } catch (err) {
        setError("No se pudieron cargar los músculos.");
        console.error(err);
      } finally {
        setLoadingMuscles(false);
      }
    };
    fetchMuscles();
  }, []);

  /**
   * Cada vez que cambia el músculo seleccionado, buscamos sus ejercicios.
   * La dependencia [selectedMuscle] asegura que solo corra cuando cambia.
   */
  useEffect(() => {
    // Si no hay músculo seleccionado, no hacemos nada
    if (!selectedMuscle) return;

    const fetchExercises = async () => {
      try {
        setLoadingExercises(true);
        setError(null);
        const data = await getExercisesByMuscle(selectedMuscle);
        setExercises(data);
      } catch (err) {
        setError(`No se encontraron ejercicios para "${selectedMuscle}".`);
        setExercises([]);
        console.error(err);
      } finally {
        setLoadingExercises(false);
      }
    };

    fetchExercises();
  }, [selectedMuscle]); // Se re-ejecuta solo cuando selectedMuscle cambia

  return (
    <div className="explorer-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Explorar Ejercicios</h1>
          <p className="page-subtitle">
            Selecciona un músculo para ver los ejercicios disponibles
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="muscle-selector-wrapper mb-5">
          {loadingMuscles ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-warning" />
              <span className="ms-2 text-muted">Cargando músculos...</span>
            </div>
          ) : (
            <>
              <label className="form-label fw-semibold mb-3">
                🎯 Selecciona un grupo muscular:
              </label>

              <div className="muscles-grid">
                {[...muscles]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((muscle) => (
                    <button
                      key={muscle.id || muscle.name}
                      className={`muscle-btn ${selectedMuscle === muscle.name ? "active" : ""}`}
                      onClick={() => setSelectedMuscle(muscle.name)}
                    >
                      {muscle.name}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>

        {!selectedMuscle && !loadingMuscles && (
          <div className="empty-state text-center py-5">
            <div className="empty-icon">🏋️</div>
            <h4>Selecciona un músculo para empezar</h4>
            <p className="text-muted">
              Aparecerán los ejercicios disponibles aquí
            </p>
          </div>
        )}

        {loadingExercises && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-3 text-muted">Buscando ejercicios...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loadingExercises && exercises.length > 0 && (
          <>
            <div className="results-header mb-4">
              <h4 className="text-capitalize">
                Ejercicios para:{" "}
                <span className="text-warning">{selectedMuscle}</span>
              </h4>
              <span className="text-muted">
                {exercises.length} ejercicios encontrados
              </span>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.exerciseId}
                  exercise={exercise}
                  onAddToPlan={addToPlan}
                  onShowDetail={setSelectedExercise}
                  isInPlan={plan.some(
                    (ex) => ex.exerciseId === exercise.exerciseId,
                  )}
                />
              ))}
            </div>
          </>
        )}

        {!loadingExercises &&
          selectedMuscle &&
          exercises.length === 0 &&
          !error && (
            <div className="empty-state text-center py-5">
              <div className="empty-icon">🤔</div>
              <h4>Sin resultados</h4>
              <p className="text-muted">
                No se encontraron ejercicios para este músculo.
              </p>
            </div>
          )}
      </div>

      <ExerciseModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onAddToPlan={addToPlan}
        isInPlan={plan.some(
          (ex) => ex.exerciseId === selectedExercise?.exerciseId,
        )}
      />
    </div>
  );
}

export default Explorer;
