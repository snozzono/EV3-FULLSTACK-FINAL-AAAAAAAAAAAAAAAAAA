import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, roles } = useAuth()
  const navigate = useNavigate()
  const goAndClose = (path) => {
    navigate(path)
    const el = document.getElementById('offcanvasNav')
    const api = window.bootstrap?.Offcanvas.getInstance(el) || (el ? new window.bootstrap.Offcanvas(el) : null)
    api?.hide()
  }
  return (
    <>
    <nav className="navbar navbar-dark brand-navbar py-2">
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/anime-and-manga.svg" alt="Manga Store" width="28" height="28" />
          <span>Manga Store</span>
        </Link>
        <div className="d-none d-lg-flex align-items-center ms-3">
          <ul className="navbar-nav flex-row flex-nowrap align-items-center gap-3 mb-0">
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blogs">Blogs</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
          </ul>
        </div>
        <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNav" aria-controls="offcanvasNav" aria-label="Menu">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="d-none d-lg-flex align-items-center ms-auto">
          <ul className="navbar-nav flex-row flex-nowrap align-items-center gap-3 mb-0">
            <li className="nav-item"><NavLink className="nav-link" to="/carrito">Carrito</NavLink></li>
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.nombre} <span className="badge badge-brand ms-1">{user.rol}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user.rol === roles.ADMIN && (
                    <li><NavLink className="dropdown-item" to="/admin/perfil">Panel Admin</NavLink></li>
                  )}
                  {user.rol === roles.CLIENTE && (
                    <li><NavLink className="dropdown-item" to="/cliente/perfil">Mi Perfil</NavLink></li>
                  )}
                  <li><button className="dropdown-item" onClick={() => { if (confirm('¿Estás seguro de cerrar sesión?')) { logout(); navigate('/') } }}>Cerrar sesión</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/registro">Registro</NavLink></li>
              </>
            )}
          </ul>
        </div>

        <div className="offcanvas offcanvas-end brand-offcanvas" tabIndex="-1" id="offcanvasNav" aria-labelledby="offcanvasNavLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavLabel">Menú</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <ul className="navbar-nav flex-grow-1">
              <li className="nav-item"><NavLink className="nav-link btn btn-link w-100 text-start" to="/nosotros" onClick={() => goAndClose('/nosotros')}>Nosotros</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link btn btn-link w-100 text-start" to="/productos" onClick={() => goAndClose('/productos')}>Productos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link btn btn-link w-100 text-start" to="/blogs" onClick={() => goAndClose('/blogs')}>Blogs</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link btn btn-link w-100 text-start" to="/contacto" onClick={() => goAndClose('/contacto')}>Contacto</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link btn btn-link w-100 text-start" to="/carrito" onClick={() => goAndClose('/carrito')}>Carrito</NavLink></li>
            </ul>
            <div>
              {user ? (
                <div className="dropdown">
                  <button className="btn btn-warning w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user.nombre} ({user.rol})
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark w-100">
                    {user.rol === roles.ADMIN && (
                      <li><button className="dropdown-item" onClick={() => goAndClose('/admin/perfil')}>Panel Admin</button></li>
                    )}
                    {user.rol === roles.CLIENTE && (
                      <li><button className="dropdown-item" onClick={() => goAndClose('/cliente/perfil')}>Mi Perfil</button></li>
                    )}
                    <li><button className="dropdown-item" onClick={() => { if (confirm('¿Estás seguro de cerrar sesión?')) { logout(); goAndClose('/') } }}>Cerrar sesión</button></li>
                  </ul>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <NavLink className="btn btn-warning" to="/login" onClick={() => goAndClose('/login')}>Login</NavLink>
                  <NavLink className="btn btn-outline-light" to="/registro" onClick={() => goAndClose('/registro')}>Registro</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    </>
  )
}