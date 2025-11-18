import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminUsuarios() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
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
    let mounted = true
    const load = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/users', {
          headers: { Authorization: `Bearer ${user?.token}` }
        })
        if (!resp.ok) throw new Error('Error al cargar')
        const data = await resp.json()
        if (mounted) setList(data)
      } catch {
        setList([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user?.token])

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return
    const resp = await fetch(`http://localhost:8080/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    if (resp.status === 204) {
      setList(prev => prev.filter(u => String(u.id) !== String(id)))
      notify('Usuario eliminado', 'success')
    } else {
      notify('No se pudo eliminar el usuario', 'danger')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Usuarios</h3>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">Nuevo</Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && list.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="text-end">
                  <Link to={`/admin/usuarios/editar/${u.id}`} className="btn btn-sm btn-primary me-2">Editar</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}