import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { resolveImageUrl } from '../utils/api'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const precio = product.precio ?? product.precio_nuevo ?? product.precio_descuento ?? 0
  const imgSrc = resolveImageUrl(product.imagenUrl || product.imagen)

  return (
    <div className="card h-100">
      <img
        src={imgSrc}
        className="card-img-top"
        alt={product.nombre}
        style={{ height: 320, objectFit: 'cover', width: '100%' }}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = 'https://placehold.co/600x800/0d6efd/ffffff?text=Manga'
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text text-muted">{product.categoria}</p>
        <p className="card-text">{product.descripcion}</p>
        <div className="mt-auto d-flex gap-2 align-items-center">
          <span className="fw-bold price">${precio}</span>
          <Link to={`/producto/${product.id}`} className="btn btn-warning btn-sm">Ver</Link>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => { add(product, 1); alert('Producto agregado al carrito'); }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}