import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContextValue'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Iniciar Sesion</h1>
          <p className="page-subtitle">Accede a tu cuenta de Pump Planner</p>
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
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
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
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-warning w-100" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="auth-switch text-center mt-3 mb-0">
            No tienes cuenta? <Link to="/register">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
