import { Link, NavLink } from 'react-router-dom'

function Navbar({ planCount }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fitplan-navbar sticky-top">
      <div className="container">

        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          {/* OPCIÓN A — Logo imagen (descomenta si tienes logo.png en /public/) */}
          <img src="/logo.png" alt="PumpPlanner" height="120" />
                                  PUMP-PLANNER  
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/explorar">
                Explorar
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link nav-plan-link" to="/mi-plan">
                Mi Plan
                {/* Badge: solo aparece si hay ejercicios en el plan */}
                {planCount > 0 && (
                  <span className="badge bg-warning text-dark ms-2">
                    {planCount}
                  </span>
                )}
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
