import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { resolveImageUrl } from '../utils/api'

export default function ProductoDetalle() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  useEffect(() => {
    const load = async () => {
      const resp = await fetch(`http://localhost:8080/api/products/${id}`)
      if (resp.ok) setProducto(await resp.json())
    }
    load()
  }, [id])
  const { add } = useCart()

  if (!producto) return <p>Producto no encontrado.</p>
  const precio = producto.precio ?? producto.precio_nuevo ?? producto.precio_descuento ?? 0
  const imgSrc = resolveImageUrl(producto.imagenUrl || producto.imagen)

  return (
    <div className="row">
      <div className="col-md-6">
        <img src={imgSrc} alt={producto.nombre} className="img-fluid" style={{ height: 320, objectFit: 'cover', width: '100%' }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x800/0d6efd/ffffff?text=Manga' }} />
      </div>
      <div className="col-md-6">
        <h2>{producto.nombre}</h2>
        <p className="text-muted">{producto.categoria}</p>
        <p>{producto.descripcion}</p>
        <p className="fs-4 fw-bold">${precio}</p>
        <button
          className="btn btn-warning"
          onClick={() => { add(producto, 1); alert('Producto agregado al carrito'); }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}