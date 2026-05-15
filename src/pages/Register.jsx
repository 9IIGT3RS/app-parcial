import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContextValue'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Crear Cuenta</h1>
          <p className="page-subtitle">Registra tu usuario para Pump Planner</p>
        </div>
      </div>

      <div className="container py-5">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" htmlFor="register-name">Nombre</label>
            <input
              id="register-name"
              className="form-control"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <button className="btn btn-warning w-100" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

          <p className="auth-switch text-center mt-3 mb-0">
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
