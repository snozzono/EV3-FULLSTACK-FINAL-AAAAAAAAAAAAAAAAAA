import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="row">
      <aside className="col-12 col-md-3 col-lg-2 border-end">
        <div className="p-3">
          <h5>Administrador</h5>
          <div className="text-muted small mb-2">{user?.nombre} ({user?.rol})</div>
          <nav className="nav flex-column">
            <Link className="nav-link" to="/admin/perfil">Perfil</Link>
            <Link className="nav-link" to="/admin/productos">Productos</Link>
            <Link className="nav-link" to="/admin/blogs">Blogs</Link>
            <Link className="nav-link" to="/admin/contacto">Contacto</Link>
            <Link className="nav-link" to="/admin/usuarios">Usuarios</Link>
            <Link className="nav-link" to="/admin/compras">Compras</Link>
          </nav>
          <button className="btn btn-danger mt-3" onClick={() => { if (confirm('¿Estás seguro de cerrar sesión?')) { logout(); navigate('/') } }}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="col-12 col-md-9 col-lg-10 p-3">
        <Outlet />
      </main>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
        <div id="admin-toast" className="toast text-bg-success" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2200">
          <div className="toast-body">Acción realizada</div>
        </div>
      </div>
    </div>
  )
}