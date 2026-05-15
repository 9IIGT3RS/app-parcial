import { apiRequest } from '../api/client'

function normalizeExerciseList(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

export async function getAllExercises() {
  return normalizeExerciseList(await apiRequest('/api/exercises'))
}

export async function getExercises(limit = 6) {
  const all = await getAllExercises()
  return all.slice(0, limit)
}

export async function getMuscles() {
  const exercises = await getAllExercises()
  const names = new Set()

  exercises.forEach((exercise) => {
    exercise.targetMuscles?.forEach((muscle) => {
      if (muscle) names.add(muscle)
    })
  })

  return [...names].map((name) => ({ name }))
}

export async function getExercisesByMuscle(muscleName) {
  const all = await getAllExercises()
  return all.filter(ex =>
    ex.targetMuscles?.some(m => m.toLowerCase() === muscleName.toLowerCase()) ||
    ex.bodyParts?.some(m => m.toLowerCase() === muscleName.toLowerCase())
  )
}
