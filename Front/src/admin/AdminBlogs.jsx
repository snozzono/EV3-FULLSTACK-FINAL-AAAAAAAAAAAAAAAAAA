import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resolveImageUrl } from '../utils/api'

export default function AdminBlogs() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const notify = (msg, type = 'success') => {
    const el = document.getElementById('admin-toast')
    if (!el) return
    el.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning')
    el.classList.add(type === 'success' ? 'text-bg-success' : type === 'danger' ? 'text-bg-danger' : 'text-bg-warning')
    const body = el.querySelector('.toast-body')
    if (body) body.textContent = msg
    const toast = window.bootstrap?.Toast.getOrCreateInstance(el)
    toast?.show()
  }

  useEffect(() => {
    const load = async () => {
      const resp = await fetch('http://localhost:8080/api/blogs/admin', { headers: { Authorization: `Bearer ${user?.token}` } })
      if (!resp.ok) return
      const data = await resp.json()
      setList(data)
    }
    load()
  }, [])

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar blog?')) return
    const resp = await fetch(`http://localhost:8080/api/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } })
    if (resp.status === 204) {
      setList((prev) => prev.filter((b) => String(b.id) !== String(id)))
      notify('Blog eliminado', 'success')
    } else {
      notify('No se pudo eliminar', 'danger')
    }
  }
  

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Blogs</h3>
        <Link to="/admin/blogs/nuevo" className="btn btn-primary">Nuevo</Link>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id}>
                <td style={{ width: 80 }}>
                  {b.imagenUrl && <img src={resolveImageUrl(b.imagenUrl)} alt={b.titulo} width={80} height={60} style={{ objectFit: 'cover' }} />}
                </td>
                <td>{b.titulo}</td>
                <td>{b.autor}</td>
                <td>{b.fechaPublicacion ? new Date(b.fechaPublicacion).toLocaleDateString() : ''}</td>
                <td>{b.activo ? <span className="badge bg-success">Activo</span> : <span className="badge bg-secondary">Inactivo</span>}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-warning me-2" onClick={async () => {
                    const resp = await fetch(`http://localhost:8080/api/blogs/${b.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                      body: JSON.stringify({
                        titulo: b.titulo,
                        autor: b.autor,
                        contenido: b.contenido,
                        imagenUrl: b.imagenUrl,
                        activo: !b.activo,
                        fechaPublicacion: b.fechaPublicacion
                      })
                    })
                    if (resp.ok) {
                      const updated = await resp.json()
                      setList(prev => prev.map(x => x.id === updated.id ? updated : x))
                      notify(updated.activo ? 'Blog activado' : 'Blog desactivado', 'success')
                    } else {
                      notify('No se pudo cambiar el estado', 'danger')
                    }
                  }}>{b.activo ? 'Desactivar' : 'Activar'}</button>
                  <Link className="btn btn-sm btn-secondary me-2" to={`/admin/blogs/editar/${b.id}`}>Editar</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(b.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}