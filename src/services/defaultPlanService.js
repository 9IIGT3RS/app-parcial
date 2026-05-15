import { getAllExercises } from './exerciseService'
import {
  createPlan,
  getPlans,
  toBackendPlanPayload,
} from './planService'

export const DEFAULT_PLAN_NAME = 'Mi Plan'

export function findDefaultPlan(plans, planName = DEFAULT_PLAN_NAME) {
  return plans.find((plan) => plan.name === planName) || null
}

export function enrichPlanExercises(planExercises = [], fullExercises = []) {
  const exerciseById = new Map(
    fullExercises.map((exercise) => [exercise.exerciseId, exercise]),
  )

  return planExercises.map((planExercise) => {
    const fullExercise = exerciseById.get(planExercise.exerciseId)
    return fullExercise || {
      exerciseId: planExercise.exerciseId,
      name: planExercise.name,
    }
  })
}

export async function loadOrCreateDefaultPlan(token, planName = DEFAULT_PLAN_NAME) {
  if (!token) {
    throw new Error('Token requerido para cargar el plan')
  }

  const plans = await getPlans(token)
  const plan = findDefaultPlan(plans, planName)
    || await createPlan(toBackendPlanPayload(planName, []), token)

  const fullExercises = await getAllExercises()
  const exercises = enrichPlanExercises(plan.exercises, fullExercises)

  return {
    plan,
    exercises,
  }
}
