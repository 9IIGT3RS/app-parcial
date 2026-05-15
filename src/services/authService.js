import { apiRequest } from '../api/client'

export function loginUser(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function registerUser(userData) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: userData,
  })
}
