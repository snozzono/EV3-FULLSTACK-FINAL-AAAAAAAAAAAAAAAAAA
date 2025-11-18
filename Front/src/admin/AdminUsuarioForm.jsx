import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../context/roles'
import { isValidEmailDomain, isValidPassword, maxLength, isValidRun } from '../utils/validators'

export default function AdminUsuarioForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const editing = Boolean(id)
  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '',
    password: '',
    rol: ROLES.CLIENTE,
  })
  const [errors, setErrors] = useState({})
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

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.run) e.run = 'RUN requerido'
    else if (!isValidRun(form.run)) e.run = 'RUN inválido'
    if (!form.nombre) e.nombre = 'Nombre requerido'
    else if (!maxLength(form.nombre, 50)) e.nombre = 'Máximo 50'
    if (!form.apellidos) e.apellidos = 'Apellidos requeridos'
    else if (!maxLength(form.apellidos, 100)) e.apellidos = 'Máximo 100'
    if (!form.email) e.email = 'Correo requerido'
    else if (!maxLength(form.email, 100)) e.email = 'Máximo 100'
    else if (!isValidEmailDomain(form.email)) e.email = 'Dominios permitidos: duoc.cl, profesor.duoc.cl, gmail.com'
    if (!form.fechaNacimiento) e.fechaNacimiento = 'Fecha nacimiento requerida'
    if (!editing) {
      if (!form.password) e.password = 'Contraseña requerida'
      else if (!isValidPassword(form.password)) e.password = 'Entre 4 y 10 caracteres'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!editing) return
      const resp = await fetch(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
      if (!resp.ok) return
      const data = await resp.json()
      if (mounted) setForm({ run: data.run || data.username || '', nombre: data.nombre || '', apellidos: data.apellidos || '', email: data.email || '', fechaNacimiento: data.fechaNacimiento || '', password: '', rol: data.role })
    }
    load()
    return () => { mounted = false }
  }, [id, editing, user?.token])

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    if (editing) {
      const resp = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, role: form.rol })
      })
      if (resp.ok) {
        notify('Usuario actualizado', 'success')
      } else {
        notify('No se pudo actualizar', 'danger')
        return
      }
    } else {
      const resp = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ nombre: form.nombre, apellidos: form.apellidos, email: form.email, username: form.run, password: form.password, role: form.rol, fechaNacimiento: form.fechaNacimiento })
      })
      if (resp.ok) {
        notify('Usuario creado', 'success')
      } else {
        notify('No se pudo crear', 'danger')
        return
      }
    }
    navigate('/admin/usuarios')
  }

  return (
    <div>
      <h3 className="mb-3">{editing ? 'Editar usuario' : 'Nuevo usuario'}</h3>
      <form onSubmit={onSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">RUN</label>
            <input className={`form-control ${errors.run ? 'is-invalid' : ''}`} value={form.run} onChange={(e) => setField('run', e.target.value)} placeholder="12345678K" />
            {errors.run && <div className="invalid-feedback">{errors.run}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellidos</label>
            <input className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} value={form.apellidos} onChange={(e) => setField('apellidos', e.target.value)} />
            {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(e) => setField('email', e.target.value)} />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha nacimiento</label>
            <input type="date" className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`} value={form.fechaNacimiento} onChange={(e) => setField('fechaNacimiento', e.target.value)} />
            {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
          </div>
          {!editing && (
            <div className="col-md-6">
              <label className="form-label">Contraseña</label>
              <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={(e) => setField('password', e.target.value)} />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              <div className="form-text">Entre 4 y 10 caracteres</div>
            </div>
          )}
          <div className="col-md-4">
            <label className="form-label">Rol</label>
            <select className="form-select" value={form.rol} onChange={(e) => setField('rol', e.target.value)}>
              <option value={ROLES.ADMIN}>Administrador</option>
              <option value={ROLES.CLIENTE}>Cliente</option>
            </select>
          </div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}