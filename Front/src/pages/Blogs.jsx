import { useEffect, useState } from 'react'
import { resolveImageUrl } from '../utils/api'

export default function Blogs() {
  const [selected, setSelected] = useState(null)
  const [list, setList] = useState([])
  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/blogs')
        if (!resp.ok) return
        const data = await resp.json()
        setList(data)
      } catch {
        setList([])
      }
    }
    load()
  }, [])
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-dark">
          <i className="bi bi-newspaper me-3"></i>Blog
        </h1>
        <p className="lead text-muted">Noticias y novedades del mundo del manga</p>
      </div>

      {list.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No hay blogs disponibles
        </div>
      ) : (
        <div className="row g-4">
          {list.map((b) => (
            <div className="col-md-6 col-lg-4" key={b.id}>
              <div className="card h-100 shadow-sm hover-shadow transition">
                <img
                  src={resolveImageUrl(b.imagenUrl) || 'https://placehold.co/600x350?text=Blog'}
                  alt={b.titulo}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = 'https://placehold.co/600x350?text=Blog'
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{b.titulo}</h5>
                  <p className="card-text text-muted">
                    {(b.contenido || '').length > 120 ? `${b.contenido.slice(0, 120)}...` : (b.contenido || '')}
                  </p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#blogModal"
                      onClick={() => setSelected(b)}
                    >
                      <i className="bi bi-book-open me-2"></i>Leer más
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal detalle de blog */}
      <div className="modal fade" id="blogModal" tabIndex="-1" aria-labelledby="blogModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title" id="blogModalLabel">{selected?.titulo || 'Blog'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selected ? (
                <div className="row g-3">
                  <div className="col-md-5">
                    <img
                      src={resolveImageUrl(selected.imagenUrl) || 'https://placehold.co/600x350?text=Blog'}
                      alt={selected.titulo}
                      className="img-fluid rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = 'https://placehold.co/600x350?text=Blog'
                      }}
                    />
                  </div>
                  <div className="col-md-7">
                    <p className="text-muted">{selected.autor}</p>
                    <div>
                      <strong>Contenido:</strong>
                      <p className="mt-2">{selected.contenido}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Sin contenido</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}