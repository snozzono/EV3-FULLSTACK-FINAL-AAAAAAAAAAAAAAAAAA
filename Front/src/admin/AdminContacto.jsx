import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminContacto() {
  const { user } = useAuth()
  const [list, setList] = useState([])

  useEffect(() => {
    const load = async () => {
      const resp = await fetch('http://localhost:8080/api/contact', {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
      if (resp.ok) setList(await resp.json())
    }
    load()
  }, [user])

  const toggleResuelto = async (msg) => {
    const resp = await fetch(`http://localhost:8080/api/contact/${msg.id}/resuelto?resuelto=${msg.resuelto ? 'false' : 'true'}` , {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    if (resp.ok) {
      const updated = await resp.json()
      setList(prev => prev.map(x => x.id === updated.id ? updated : x))
    }
  }

  const onDelete = async (id) => {
    const resp = await fetch(`http://localhost:8080/api/contact/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    if (resp.ok) {
      setList(prev => prev.filter(x => x.id !== id))
    }
  }

  return (
    <div>
      <h3>Mensajes de Contacto</h3>
      {list.length === 0 ? (
        <p>No hay mensajes aún.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Resuelto?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(m => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.email}</td>
                  <td>{m.asunto}</td>
                  <td>{m.mensaje}</td>
                  <td>{new Date(m.creadoEn).toLocaleString()}</td>
                  <td>{m.resuelto ? <span className="badge bg-success">Resuelto</span> : <span className="badge bg-secondary">No resuelto</span>}</td>
                  <td className="text-end" style={{ minWidth: 190 }}>
                    <div className="d-flex flex-wrap justify-content-end gap-2">
                      <button className="btn btn-sm btn-warning" onClick={() => toggleResuelto(m)}>Resuelto?</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(m.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}