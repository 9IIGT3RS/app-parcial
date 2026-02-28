const BASE_URL = '/data'

export async function getExercises(limit = 6) {
  const response = await fetch(`${BASE_URL}/exercises.json`)
  const json = await response.json()
  const all = json?.data ?? []
  return all.slice(0, limit)   // simulamos el ?limit=
}

export async function getMuscles() {
  const response = await fetch(`${BASE_URL}/muscles.json`)
  const json = await response.json()
  return json?.data ?? []
}

export async function getExercisesByMuscle(muscleName) {
  const response = await fetch(`${BASE_URL}/exercises.json`)
  const json = await response.json()
  const all = json?.data ?? []
  // Filtramos localmente por músculo en lugar de pedir otro endpoint
  return all.filter(ex =>
    ex.targetMuscles?.some(m => m.toLowerCase() === muscleName.toLowerCase()) ||
    ex.bodyParts?.some(m => m.toLowerCase() === muscleName.toLowerCase())
  )
}