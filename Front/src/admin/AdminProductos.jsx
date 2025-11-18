import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { resolveImageUrl } from '../utils/api'

export default function AdminProductos() {
  const { user } = useAuth()
  const [productos, setProductos] = useState([])
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
      const resp = await fetch('http://localhost:8080/api/products/admin', {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
      if (!resp.ok) return
      setProductos(await resp.json())
    }
    load()
  }, [])
  const toggleActivo = async (p) => {
    const resp = await fetch(`http://localhost:8080/api/products/${p.id}/activo?activo=${p.activo ? 'false' : 'true'}` , {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    if (resp.ok) {
      const updated = await resp.json()
      setProductos((prev) => prev.map((x) => x.id === updated.id ? updated : x))
      notify(updated.activo ? 'Producto activado' : 'Producto desactivado', 'success')
    } else {
      notify('No se pudo cambiar el estado', 'danger')
    }
  }
  const onDelete = async (id) => {
    if (!confirm('¿Eliminar producto?')) return
    const resp = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    if (resp.status === 204) {
      setProductos((prev) => prev.filter((p) => String(p.id) !== String(id)))
      notify('Producto eliminado', 'success')
    } else {
      notify('No se pudo eliminar el producto', 'danger')
    }
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Productos</h3>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">Nuevo</Link>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td><img src={resolveImageUrl(p.imagenUrl || p.imagen) || 'https://via.placeholder.com/60x60?text=%20'} width={60} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/60x60?text=%20' }} /></td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${Number(p.precio ?? 0).toLocaleString()}</td>
                <td>{p.stock ?? 0}{(p.stockCritico != null && Number(p.stock) <= Number(p.stockCritico)) ? <span className="badge bg-danger ms-2">Crítico</span> : null}</td>
                <td>{p.activo ? <span className="badge bg-success">Activo</span> : <span className="badge bg-secondary">Inactivo</span>}</td>
                <td className="text-end">
                  <Link to={`/admin/productos/editar/${p.id}`} className="btn btn-sm btn-secondary me-2">Editar</Link>
                  <button onClick={() => toggleActivo(p)} className="btn btn-sm btn-warning me-2">{p.activo ? 'Desactivar' : 'Activar'}</button>
                  <button onClick={() => onDelete(p.id)} className="btn btn-sm btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}