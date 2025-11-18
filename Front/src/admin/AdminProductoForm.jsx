import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { maxLength, isNonNegativeInteger, isNonNegativeNumber } from '../utils/validators'

export default function AdminProductoForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = Boolean(id)
  const { user } = useAuth()
  const [categorias, setCategorias] = useState([])
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
      // cargar categorías desde listado público
      const respList = await fetch('http://localhost:8080/api/products')
      if (respList.ok) {
        const list = await respList.json()
        setCategorias(Array.from(new Set(list.map((p) => p.categoria).filter(Boolean))))
      }
      // si estamos editando, cargar producto específico
      if (editing) {
        const resp = await fetch(`http://localhost:8080/api/products/${id}`)
        if (resp.ok) {
          const cur = await resp.json()
          setForm({
            nombre: cur.nombre || '',
            descripcion: cur.descripcion || '',
            precio_nuevo: Number(cur.precio || 0),
            stock: Number(cur.stock || 0),
            stockCritico: Number(cur.stockCritico || 0),
            categoria: cur.categoria || '',
            imagen: cur.imagenUrl || '',
            activo: Boolean(cur.activo ?? true),
          })
        }
      }
    }
    load()
  }, [id, editing])

  const [form, setForm] = useState(() => ({
    nombre: '',
    descripcion: '',
    precio_nuevo: 0,
    stock: 0,
    stockCritico: 0,
    categoria: categorias[0] || '',
    imagen: '',
    activo: true,
  }))
  const [errors, setErrors] = useState({})

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.nombre) e.nombre = 'Nombre requerido'
    else if (!maxLength(form.nombre, 100)) e.nombre = 'Máximo 100'
    if (form.descripcion && !maxLength(form.descripcion, 500)) e.descripcion = 'Máximo 500'
    if (form.precio_nuevo === '' || form.precio_nuevo === null) e.precio_nuevo = 'Precio requerido'
    else if (!isNonNegativeNumber(form.precio_nuevo)) e.precio_nuevo = 'Debe ser número ≥ 0'
    if (form.stock === '' || form.stock === null) e.stock = 'Stock requerido'
    else if (!isNonNegativeInteger(form.stock)) e.stock = 'Solo enteros ≥ 0'
    if (form.stockCritico !== '' && !isNonNegativeInteger(form.stockCritico)) e.stockCritico = 'Entero ≥ 0'
    if (!form.categoria) e.categoria = 'Seleccione categoría'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const payload = {
      id,
      nombre: String(form.nombre).trim(),
      descripcion: String(form.descripcion || '').trim(),
      precio: Number(form.precio_nuevo),
      stock: Number(form.stock),
      categoria: form.categoria,
      imagenUrl: form.imagen,
      activo: Boolean(form.activo),
    }
    if (editing) {
      const resp = await fetch(`http://localhost:8080/api/products/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        notify('Producto guardado', 'success')
        navigate('/admin/productos')
      } else {
        notify('No se pudo guardar', 'danger')
      }
    } else {
      const resp = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        notify('Producto creado', 'success')
        navigate('/admin/productos')
      } else {
        notify('No se pudo crear', 'danger')
      }
    }
  }

  return (
    <div>
      <h3 className="mb-3">{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
      <form onSubmit={onSubmit} noValidate>
        <div className="row g-3">
          
          <div className="col-md-8">
            <label className="form-label">Nombre</label>
            <input className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          <div className="col-md-12">
            <label className="form-label">Descripción (opcional)</label>
            <textarea rows={3} className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} value={form.descripcion} onChange={(e) => setField('descripcion', e.target.value)} />
            {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">Precio</label>
            <input type="number" step="0.01" className={`form-control ${errors.precio_nuevo ? 'is-invalid' : ''}`} value={form.precio_nuevo} onChange={(e) => setField('precio_nuevo', e.target.value)} />
            {errors.precio_nuevo && <div className="invalid-feedback">{errors.precio_nuevo}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">Stock</label>
            <input type="number" className={`form-control ${errors.stock ? 'is-invalid' : ''}`} value={form.stock} onChange={(e) => setField('stock', e.target.value)} />
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">Stock crítico (opcional)</label>
            <input type="number" className={`form-control ${errors.stockCritico ? 'is-invalid' : ''}`} value={form.stockCritico} onChange={(e) => setField('stockCritico', e.target.value)} />
            {errors.stockCritico && <div className="invalid-feedback">{errors.stockCritico}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">Categoría</label>
            <select className={`form-select ${errors.categoria ? 'is-invalid' : ''}`} value={form.categoria} onChange={(e) => setField('categoria', e.target.value)}>
              <option value="">Seleccione</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Subir imagen</label>
            <input type="file" className="form-control" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const fd = new FormData()
              fd.append('file', file)
              const resp = await fetch('http://localhost:8080/api/upload/image', { method: 'POST', headers: { Authorization: `Bearer ${user?.token}` }, body: fd })
              if (resp.ok) {
                const data = await resp.json()
                setField('imagen', data.url)
              }
            }} />
          </div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/productos')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}