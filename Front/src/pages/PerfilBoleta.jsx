import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PerfilBoleta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    const load = async () => {
      if (!user?.token) return
      try {
        const resp = await fetch('http://localhost:8080/api/orders/mine', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          const found = data.find(o => String(o.id) === String(id)) || null
          setOrder(found)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.token, id])

  if (loading) {
    return <div>Cargando boleta...</div>
  }

  if (!order) {
    return (
      <div>
        <h2>Boleta no encontrada</h2>
        <Link className="btn btn-secondary mt-2" to="/cliente/perfil">Volver al perfil</Link>
      </div>
    )
  }

  const fmt = (n) => `$${Number(n || 0).toLocaleString()}`

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Boleta {order.numero}</h2>
        <div className="d-flex gap-2">
          <Link className="btn btn-secondary" to="/cliente/perfil">Volver</Link>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <div className="mb-2"><span className="text-muted">Fecha:</span> {new Date(order.fecha).toLocaleString()}</div>
              <div className="d-flex justify-content-between"><span>Neto</span><span>{fmt(order.neto)}</span></div>
              <div className="d-flex justify-content-between"><span>IVA</span><span>{fmt(order.iva)}</span></div>
              <hr />
              <div className="d-flex justify-content-between"><strong>Total</strong><strong>{fmt(order.total)}</strong></div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-2">Detalle de productos</h6>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Cantidad</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map(it => (
                      <tr key={it.id}>
                        <td>{it.nombre}</td>
                        <td className="text-end">{fmt(it.precioUnitario)}</td>
                        <td className="text-end">{it.cantidad}</td>
                        <td className="text-end">{fmt(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}