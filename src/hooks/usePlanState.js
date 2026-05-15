import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContextValue'
import { loadOrCreateDefaultPlan } from '../services/defaultPlanService'
import { toBackendPlanPayload, updatePlan } from '../services/planService'
import useLocalStorage from './useLocalStorage'

function mergePlanExercises(primaryExercises = [], secondaryExercises = []) {
  const seen = new Set()
  const merged = []

  ;[...primaryExercises, ...secondaryExercises].forEach((exercise) => {
    if (!exercise?.exerciseId || seen.has(exercise.exerciseId)) return

    seen.add(exercise.exerciseId)
    merged.push(exercise)
  })

  return merged
}

function usePlanState() {
  const { isAuthenticated, token } = useAuth()
  const [guestPlan, setGuestPlan] = useLocalStorage('fitplan-plan', [])
  const [backendPlan, setBackendPlan] = useState(null)
  const [backendPlanExercises, setBackendPlanExercises] = useState([])
  const [planLoading, setPlanLoading] = useState(false)
  const [planError, setPlanError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setBackendPlan(null)
      setBackendPlanExercises([])
      setPlanLoading(false)
      setPlanError(null)
      return
    }

    let isCurrent = true

    const loadPlan = async () => {
      try {
        setPlanLoading(true)
        setPlanError(null)
        const result = await loadOrCreateDefaultPlan(token)
        let nextBackendPlan = result.plan
        let nextExercises = result.exercises
        const hasGuestExercises = guestPlan.some((exercise) => exercise?.exerciseId)

        if (hasGuestExercises) {
          const mergedExercises = mergePlanExercises(result.exercises, guestPlan)
          const hasNewGuestExercises = mergedExercises.length > result.exercises.length

          if (hasNewGuestExercises) {
            nextBackendPlan = await updatePlan(
              result.plan.id,
              toBackendPlanPayload(result.plan.name, mergedExercises),
              token,
            )
            nextExercises = mergedExercises
          }
        }

        if (isCurrent) {
          setBackendPlan(nextBackendPlan)
          setBackendPlanExercises(nextExercises)

          if (hasGuestExercises) {
            setGuestPlan([])
          }
        }
      } catch (err) {
        if (isCurrent) {
          setPlanError(err.message || 'No se pudo cargar tu plan.')
          setBackendPlan(null)
          setBackendPlanExercises([])
        }
      } finally {
        if (isCurrent) {
          setPlanLoading(false)
        }
      }
    }

    loadPlan()

    return () => {
      isCurrent = false
    }
  }, [isAuthenticated, token, guestPlan, setGuestPlan])

  const plan = isAuthenticated ? backendPlanExercises : guestPlan

  const saveBackendPlan = async (nextExercises) => {
    if (!backendPlan) {
      setPlanError('Tu plan aun se esta cargando.')
      return
    }

    const updatedPlan = await updatePlan(
      backendPlan.id,
      toBackendPlanPayload(backendPlan.name, nextExercises),
      token,
    )

    setBackendPlan(updatedPlan)
    setBackendPlanExercises(nextExercises)
  }

  const addToPlan = async (exercise) => {
    const alreadyIn = plan.some((ex) => ex.exerciseId === exercise.exerciseId)
    if (!alreadyIn) {
      const nextPlan = [...plan, exercise]

      if (isAuthenticated) {
        try {
          setPlanError(null)
          await saveBackendPlan(nextPlan)
        } catch (err) {
          setPlanError(err.message || 'No se pudo actualizar tu plan.')
        }
      } else {
        setGuestPlan(nextPlan)
      }
    }
  }

  const removeFromPlan = async (exerciseId) => {
    const nextPlan = plan.filter((ex) => ex.exerciseId !== exerciseId)

    if (isAuthenticated) {
      try {
        setPlanError(null)
        await saveBackendPlan(nextPlan)
      } catch (err) {
        setPlanError(err.message || 'No se pudo actualizar tu plan.')
      }
    } else {
      setGuestPlan(nextPlan)
    }
  }

  return {
    plan,
    addToPlan,
    removeFromPlan,
    planLoading,
    planError,
  }
}

export default usePlanState
