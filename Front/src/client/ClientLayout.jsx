import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ClientLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="row">
      <aside className="col-12 col-md-3 col-lg-2 border-end">
        <div className="p-3">
          <h5>Cliente</h5>
          <div className="text-muted small mb-2">{user?.nombre} ({user?.rol})</div>
          <nav className="nav flex-column">
            <Link className="nav-link" to="/cliente/perfil">Perfil</Link>
          </nav>
          <button className="btn btn-danger mt-3" onClick={() => { if (confirm('¿Estás seguro de cerrar sesión?')) { logout(); navigate('/') } }}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="col-12 col-md-9 col-lg-10 p-3">
        <Outlet />
      </main>
    </div>
  )
}