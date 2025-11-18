import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { REGIONES } from '../data/regiones-comunas'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { resolveImageUrl } from '../utils/api'

export default function Carrito() {
  const { items, remove, updateQty, total, setCheckout } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.nombre || '',
    email: user?.email || '',
    telefono: '',
    region: '',
    comuna: '',
    address: '',
    envio: 'retiro',
    pago: 'tarjeta',
    tarjeta: '',
    cuotas: '1'
  })
  const [errors, setErrors] = useState({})

  const itemsTotal = total
  const shippingCost = form.envio === 'domicilio' ? 3990 : 0
  const tax = Math.round(itemsTotal * 0.19)
  const grandTotal = itemsTotal + shippingCost + tax

  

  const openCheckout = () => {
    if (items.length === 0) return alert('Tu carrito está vacío.')
    const errs = {}
    if (!form.name) errs.name = 'Requerido'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo inválido'
    if (!form.telefono || form.telefono.replace(/\D/g, '').length < 9) errs.telefono = 'Inválido'
    if (form.envio === 'domicilio') {
      if (!form.region) errs.region = 'Requerido'
      if (!form.comuna) errs.comuna = 'Requerido'
      if (!form.address) errs.address = 'Requerido'
    }
    if (form.pago === 'tarjeta') {
      if (!form.tarjeta || form.tarjeta.replace(/\D/g, '').length < 16) errs.tarjeta = 'Inválida'
      if (!form.cuotas) errs.cuotas = 'Requerido'
    }
    setErrors(errs)
    if (Object.keys(errs).length) return alert('Revisa los campos resaltados.')
    setCheckout({ ...form })
    navigate('/carrito/checkout')
  }

  return (
    <>
      <h2 className="mb-3">Carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(p => {
                const precio = p.precio ?? p.precio_nuevo ?? p.precio_descuento ?? 0
                return (
                  <tr key={p.id}>
                    <td style={{ width: 80 }}>
                      <img src={resolveImageUrl(p.imagenUrl || p.imagen)} alt={p.nombre} className="img-fluid"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/80x80/0d6efd/ffffff?text=IMG' }} />
                    </td>
                    <td>{p.nombre}</td>
                    <td>${precio}</td>
                    <td style={{ width: 120 }}>
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        value={p.qty}
                        onChange={e => updateQty(p.id, Number(e.target.value))}
                      />
                    </td>
                    <td>${precio * p.qty}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          <div className="row g-4 mt-3">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between"><span>Productos</span><span>${itemsTotal}</span></div>
                  <div className="d-flex justify-content-between"><span>IVA (19%)</span><span>${tax}</span></div>
                  <div className="d-flex justify-content-between"><span>Envío</span><span>${shippingCost}</span></div>
                  <hr />
                  <div className="d-flex justify-content-between"><strong>Total a pagar</strong><strong>${grandTotal}</strong></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h3 className="mb-3">Datos de compra</h3>
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@correo.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    value={form.telefono}
                    onChange={e => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+56 9 1234 5678"
                  />
                  {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Región</label>
                  <select
                    className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                    value={form.region}
                    onChange={e => setForm({ ...form, region: e.target.value, comuna: '' })}
                  >
                    <option value="">Seleccione</option>
                    {REGIONES.map(r => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                  {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Comuna</label>
                  <select
                    className={`form-select ${errors.comuna ? 'is-invalid' : ''}`}
                    value={form.comuna}
                    onChange={e => setForm({ ...form, comuna: e.target.value })}
                    disabled={!form.region}
                  >
                    <option value="">Seleccione</option>
                    {(REGIONES.find(r => r.id === form.region)?.comunas || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Envío</label>
                  <select
                    className="form-select"
                    value={form.envio}
                    onChange={e => setForm({ ...form, envio: e.target.value })}
                  >
                    <option value="retiro">Retiro en tienda</option>
                    <option value="domicilio">Envío a domicilio</option>
                  </select>
                </div>
                {form.envio === 'domicilio' && (
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="Calle y número"
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                )}
                <div className="col-md-6">
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-select"
                    value={form.pago}
                    onChange={e => setForm({ ...form, pago: e.target.value })}
                  >
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
                {form.pago === 'tarjeta' && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Nº Tarjeta</label>
                      <input
                        type="text"
                        className={`form-control ${errors.tarjeta ? 'is-invalid' : ''}`}
                        value={form.tarjeta}
                        onChange={e => setForm({ ...form, tarjeta: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.tarjeta && <div className="invalid-feedback">{errors.tarjeta}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Cuotas</label>
                      <select
                        className={`form-select ${errors.cuotas ? 'is-invalid' : ''}`}
                        value={form.cuotas}
                        onChange={e => setForm({ ...form, cuotas: e.target.value })}
                      >
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                      </select>
                      {errors.cuotas && <div className="invalid-feedback">{errors.cuotas}</div>}
                    </div>
                  </>
                )}
                <div className="col-12 d-flex justify-content-end gap-2">
                  <button className="btn btn-outline-secondary" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Volver arriba</button>
                  <button className="btn btn-warning" type="button" onClick={openCheckout}>Revisar y pagar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
    </>
  )
}