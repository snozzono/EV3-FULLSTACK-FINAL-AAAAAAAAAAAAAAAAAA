import { useState, useMemo, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { resolveImageUrl } from '../utils/api'

export default function Productos() {
  const [vista, setVista] = useState('grid')
  const [categoria, setCategoria] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 6
  const [productos, setProductos] = useState([])
  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria).filter(Boolean))
    return Array.from(set)
  }, [productos])

  const filtrados = useMemo(() => {
    return productos.filter(p => (categoria ? p.categoria === categoria : true))
  }, [productos, categoria])

  // resetear a página 1 cuando cambia la categoría
  useEffect(() => {
    setPage(1)
  }, [categoria])

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/products')
        if (!resp.ok) return
        const data = await resp.json()
        setProductos(data)
      } catch {
        setProductos([])
      }
    }
    load()
  }, [])

  const pageCount = Math.max(1, Math.ceil(filtrados.length / perPage))
  const visibles = useMemo(() => {
    const start = (page - 1) * perPage
    return filtrados.slice(start, start + perPage)
  }, [filtrados, page])

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="mb-0">Productos</h2>
        <div className="d-flex align-items-center gap-2">
          {/* Botón de ventanas (cambia de vista) */}
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-secondary" onClick={() => setVista('grid')}>Grid</button>
            <button type="button" className="btn btn-secondary" onClick={() => setVista('lista')}>Lista</button>
            <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="visually-hidden">Alternar vistas</span>
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => setVista('grid')}>1.- Grid de productos</button></li>
              <li><button className="dropdown-item" onClick={() => setVista('lista')}>2.- Lista de productos</button></li>
            </ul>
          </div>
          {/* Filtro por categoría */}
          <select className="form-select" style={{ minWidth: 180 }} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {vista === 'grid' ? (
        <div className="row g-3">
          {visibles.map((p) => (
            <div key={p.id} className="col-sm-6 col-lg-4">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map(p => (
                <tr key={p.id}>
                  <td style={{ width: 80 }}><img src={resolveImageUrl(p.imagenUrl || p.imagen)} alt={p.nombre} className="img-fluid" /></td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${(p.precio_nuevo ?? p.precio_descuento ?? 0).toLocaleString()}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación simple */}
      <nav aria-label="Paginación de productos" className="mt-3">
        <ul className="pagination justify-content-center">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
            <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
              <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(n); }}>
                {n}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}