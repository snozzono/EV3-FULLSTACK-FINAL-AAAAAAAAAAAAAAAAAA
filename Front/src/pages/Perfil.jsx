import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidEmailDomain, maxLength, isValidPassword } from '../utils/validators'
import { REGIONES } from '../data/regiones-comunas'

export default function Perfil() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const regiones = REGIONES
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    email: user?.email || '',
    direccion: user?.direccion || '',
    region: user?.region || regiones[0]?.id || '',
    comuna: user?.comuna || '',
    fechaNacimiento: user?.fechaNacimiento || '',
  })
  const [errors, setErrors] = useState({})
  const [toastVisible, setToastVisible] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    // si no hay sesión, enviar a login
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.token) return
      try {
        const resp = await fetch('http://localhost:8080/api/orders/mine', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          setOrders(data)
        }
      } finally {
        setLoadingOrders(false)
      }
    }
    loadOrders()
  }, [user?.token])

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const comunasDisponibles = useMemo(() => {
    return (regiones.find((r) => r.id === form.region)?.comunas || [])
  }, [form.region, regiones])

  const validate = () => {
    const e = {}
    if (!form.nombre) e.nombre = 'Nombre requerido'
    else if (!maxLength(form.nombre, 50)) e.nombre = 'Máximo 50'
    if (!form.apellidos) e.apellidos = 'Apellidos requeridos'
    else if (!maxLength(form.apellidos, 100)) e.apellidos = 'Máximo 100'
    if (!form.email) e.email = 'Correo requerido'
    else if (!maxLength(form.email, 100)) e.email = 'Máximo 100'
    else if (!isValidEmailDomain(form.email)) e.email = 'Dominios: duoc.cl, profesor.duoc.cl, gmail.com, tienda.local'
    if (!form.direccion) e.direccion = 'Dirección requerida'
    else if (!maxLength(form.direccion, 300)) e.direccion = 'Máximo 300'
    if (!form.region) e.region = 'Seleccione región'
    if (!form.comuna) e.comuna = 'Seleccione comuna'
    if (form.password || form.passwordConfirm) {
      if (!isValidPassword(form.password || '')) e.password = 'Mínimo 8 caracteres'
      if ((form.password || '') !== (form.passwordConfirm || '')) e.passwordConfirm = 'Las contraseñas no coinciden'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const res = await updateProfile({
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.email,
      direccion: form.direccion,
      region: form.region,
      comuna: form.comuna,
      fechaNacimiento: form.fechaNacimiento,
    })
    if (!res.ok) return
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
    setEditing(false)
  }

  return (
    <div>
      <h2 className="mb-3">Mi Perfil</h2>
      {!editing ? (
        <div className="card">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4"><div className="text-muted small">Nombre</div><div>{form.nombre || '-'}</div></div>
              <div className="col-md-4"><div className="text-muted small">Apellidos</div><div>{form.apellidos || '-'}</div></div>
              <div className="col-md-4"><div className="text-muted small">Correo</div><div>{form.email || '-'}</div></div>
              <div className="col-md-8"><div className="text-muted small">Dirección</div><div>{form.direccion || '-'}</div></div>
              <div className="col-md-4"><div className="text-muted small">Región</div><div>{regiones.find(r => r.id === form.region)?.nombre || '-'}</div></div>
              <div className="col-md-4"><div className="text-muted small">Comuna</div><div>{form.comuna || '-'}</div></div>
              <div className="col-md-4"><div className="text-muted small">Fecha de nacimiento</div><div>{form.fechaNacimiento || '-'}</div></div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary" onClick={() => setEditing(true)}>Modificar</button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="row g-3">
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
            <div className="col-md-4">
              <label className="form-label">Correo</label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(e) => setField('email', e.target.value)} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="col-md-8">
              <label className="form-label">Dirección</label>
              <input className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} value={form.direccion} onChange={(e) => setField('direccion', e.target.value)} />
              {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Región</label>
              <select className={`form-select ${errors.region ? 'is-invalid' : ''}`} value={form.region} onChange={(e) => setField('region', e.target.value)}>
                <option value="">Seleccione</option>
                {regiones.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
              {errors.region && <div className="invalid-feedback">{errors.region}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Comuna</label>
              <select className={`form-select ${errors.comuna ? 'is-invalid' : ''}`} value={form.comuna} onChange={(e) => setField('comuna', e.target.value)}>
                <option value="">Seleccione</option>
                {comunasDisponibles.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Fecha de nacimiento (opcional)</label>
              <input type="date" className="form-control" value={form.fechaNacimiento} onChange={(e) => setField('fechaNacimiento', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nueva contraseña (opcional)</label>
              <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password || ''} onChange={(e) => setField('password', e.target.value)} />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Confirmar contraseña</label>
              <input type="password" className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`} value={form.passwordConfirm || ''} onChange={(e) => setField('passwordConfirm', e.target.value)} />
              {errors.passwordConfirm && <div className="invalid-feedback">{errors.passwordConfirm}</div>}
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      )}
      <div className="mt-4">
        <h4>Historial de compras</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Boleta</th>
                <th>Fecha</th>
                <th>Neto</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Items</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!loadingOrders && orders.map(o => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{new Date(o.fecha).toLocaleString()}</td>
                  <td>${Number(o.neto || 0).toLocaleString()}</td>
                  <td>${Number(o.iva || 0).toLocaleString()}</td>
                  <td><strong>${Number(o.total || 0).toLocaleString()}</strong></td>
                  <td>{o.items?.length || 0}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                      const isAdmin = (user?.rol === 'ADMIN')
                      navigate(isAdmin ? `/admin/compras/${o.id}` : `/cliente/perfil/${o.id}`)
                    }}>Ver detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Toast de confirmación */}
      {toastVisible && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">Datos guardados exitosamente.</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastVisible(false)} aria-label="Close"></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
