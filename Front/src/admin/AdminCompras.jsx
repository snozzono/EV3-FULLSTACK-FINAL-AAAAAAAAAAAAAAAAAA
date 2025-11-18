import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminCompras() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/orders/admin', {
          headers: { Authorization: `Bearer ${user?.token}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          setList(data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.token])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Compras</h3>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Boleta</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Neto</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {!loading && list.map(o => (
              <tr key={o.id}>
                <td>{o.numero}</td>
                <td>{o.cliente?.nombre} ({o.cliente?.username})</td>
                <td>{new Date(o.fecha).toLocaleString()}</td>
                <td>${Number(o.neto || 0).toLocaleString()}</td>
                <td>${Number(o.iva || 0).toLocaleString()}</td>
                <td><strong>${Number(o.total || 0).toLocaleString()}</strong></td>
                <td>{o.items?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}