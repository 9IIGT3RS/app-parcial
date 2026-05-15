import { apiRequest } from '../api/client'

function normalizePlanList(response) {
  if (Array.isArray(response)) return response.map(fromBackendPlan)
  if (Array.isArray(response?.data)) return response.data.map(fromBackendPlan)
  return []
}

export function toBackendPlanExercise(exercise) {
  return {
    exerciseId: exercise.exerciseId,
    name: exercise.name,
  }
}

export function toBackendPlanPayload(name, exercises = []) {
  return {
    name,
    exercises: exercises.map(toBackendPlanExercise),
  }
}

export function fromBackendPlan(plan) {
  if (!plan) return null

  return {
    ...plan,
    id: plan.id || plan._id,
    exercises: Array.isArray(plan.exercises) ? plan.exercises : [],
  }
}

export async function getPlans(token) {
  const response = await apiRequest('/api/plans', { token })
  return normalizePlanList(response)
}

export async function getPlanById(id, token) {
  const response = await apiRequest(`/api/plans/${id}`, { token })
  return fromBackendPlan(response)
}

export async function createPlan(payload, token) {
  const response = await apiRequest('/api/plans', {
    method: 'POST',
    body: payload,
    token,
  })

  return fromBackendPlan(response)
}

export async function updatePlan(id, payload, token) {
  const response = await apiRequest(`/api/plans/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  })

  return fromBackendPlan(response)
}

export async function deletePlan(id, token) {
  return apiRequest(`/api/plans/${id}`, {
    method: 'DELETE',
    token,
  })
}
