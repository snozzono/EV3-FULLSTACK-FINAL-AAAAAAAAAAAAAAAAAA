import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { REGIONES } from '../data/regiones-comunas'
import { isValidEmailDomain, isValidPassword, isValidRun, maxLength } from '../utils/validators'

export default function Registro() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    password2: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.run) e.run = 'RUN requerido'
    else if (!isValidRun(form.run)) e.run = 'RUN inválido, sin puntos ni guión, con DV'
    if (!form.nombre) e.nombre = 'Nombre requerido'
    else if (!maxLength(form.nombre, 50)) e.nombre = 'Máximo 50 caracteres'
    if (!form.apellidos) e.apellidos = 'Apellidos requeridos'
    else if (!maxLength(form.apellidos, 100)) e.apellidos = 'Máximo 100 caracteres'
    if (!form.email) e.email = 'Correo requerido'
    else if (!maxLength(form.email, 100)) e.email = 'Máximo 100 caracteres'
    else if (!isValidEmailDomain(form.email)) e.email = 'Dominios permitidos: duoc.cl, profesor.duoc.cl, gmail.com'
    if (!form.password) e.password = 'Contraseña requerida'
    else if (!isValidPassword(form.password)) e.password = 'Mínimo 8 caracteres'
    if (form.password !== form.password2) e.password2 = 'Las contraseñas no coinciden'
    if (!form.direccion) e.direccion = 'Dirección requerida'
    else if (!maxLength(form.direccion, 300)) e.direccion = 'Máximo 300 caracteres'
    if (!form.region) e.region = 'Región requerida'
    if (!form.comuna) e.comuna = 'Comuna requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setMessage('')
    if (!validate()) return
    const res = await register({
      run: form.run,
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.email,
      password: form.password,
      fechaNacimiento: form.fechaNacimiento,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion,
    })
    if (!res.ok) {
      setMessage(res.error || 'Error al registrar')
      return
    }
    navigate('/')
  }

  const regiones = REGIONES
  const comunas = regiones.find((r) => r.id === form.region)?.comunas || []

  return (
    <div className="container" style={{ maxWidth: 880 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="mb-2">Registro de usuario</h2>
          <p className="text-muted mb-4">Completa tus datos para crear tu cuenta.</p>
          {message && <div className="alert alert-danger">{message}</div>}
          <form onSubmit={onSubmit} noValidate>
            {/* Identificación */}
            <h5 className="mt-2">Identificación</h5>
            <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label className="form-label">RUN</label>
            <input className={`form-control ${errors.run ? 'is-invalid' : ''}`} value={form.run} onChange={(e) => setField('run', e.target.value)} placeholder="19011022K" />
            {errors.run && <div className="invalid-feedback">{errors.run}</div>}
          </div>
          <div className="col-md-5">
            <label className="form-label">Nombre</label>
            <input className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellidos</label>
            <input className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} value={form.apellidos} onChange={(e) => setField('apellidos', e.target.value)} />
            {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Fecha Nacimiento</label>
            <input type="date" className="form-control" value={form.fechaNacimiento} onChange={(e) => setField('fechaNacimiento', e.target.value)} />
          </div>
            </div>

            {/* Acceso */}
            <h5>Acceso</h5>
            <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="usuario@duoc.cl" />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={(e) => setField('password', e.target.value)} />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">Confirmar</label>
            <input type="password" className={`form-control ${errors.password2 ? 'is-invalid' : ''}`} value={form.password2} onChange={(e) => setField('password2', e.target.value)} />
            {errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
          </div>
            </div>

            {/* Dirección */}
            <h5>Dirección</h5>
            <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Región</label>
            <select className={`form-select ${errors.region ? 'is-invalid' : ''}`} value={form.region} onChange={(e) => setField('region', e.target.value)}>
              <option value="">Seleccione…</option>
              {regiones.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
            {errors.region && <div className="invalid-feedback">{errors.region}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Comuna</label>
            <select className={`form-select ${errors.comuna ? 'is-invalid' : ''}`} value={form.comuna} onChange={(e) => setField('comuna', e.target.value)}>
              <option value="">Seleccione…</option>
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
          </div>
          <div className="col-md-8">
            <label className="form-label">Dirección</label>
            <input className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} value={form.direccion} onChange={(e) => setField('direccion', e.target.value)} />
            {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
          </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <button type="submit" className="btn btn-warning">Registrarse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}