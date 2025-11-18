import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Comprar() {
  const { items, total, clear, checkout } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!checkout) navigate('/carrito', { replace: true })
  }, [checkout, navigate])

  const itemsTotal = total
  const shippingCost = checkout?.envio === 'domicilio' ? 3990 : 0
  const tax = Math.round(itemsTotal * 0.19)
  const grandTotal = itemsTotal + shippingCost + tax

  const handleSubmit = async () => {
    if (!checkout) {
      alert('Completa tus datos de compra en el carrito.')
      return navigate('/carrito')
    }
    if (items.length === 0) return alert('Tu carrito está vacío.')
    const errs = {}
    if (!checkout.name) errs.name = 'Requerido'
    if (!checkout.email || !/\S+@\S+\.\S+/.test(checkout.email)) errs.email = 'Correo inválido'
    if (!checkout.telefono || String(checkout.telefono).replace(/\D/g, '').length < 9) errs.telefono = 'Inválido'
    if (checkout.envio === 'domicilio') {
      if (!checkout.region) errs.region = 'Requerido'
      if (!checkout.comuna) errs.comuna = 'Requerido'
      if (!checkout.address) errs.address = 'Requerido'
    }
    if (checkout.pago === 'tarjeta') {
      const digits = String(checkout.tarjeta || '').replace(/\D/g, '')
      if (!digits || digits.length < 16) errs.tarjeta = 'Inválida'
      if (!checkout.cuotas) errs.cuotas = 'Requerido'
    }
    if (Object.keys(errs).length) {
      alert('Faltan datos. Vuelve al carrito para corregir.')
      return navigate('/carrito')
    }
    if (!user?.token) {
      alert('Debes iniciar sesión para confirmar la compra.')
      return navigate('/login')
    }
    try {
      const resp = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ items: items.map(p => ({ id: p.id, qty: p.qty })) })
      })
      if (!resp.ok) {
        alert('No se pudo procesar la compra. Intenta nuevamente.')
        return
      }
      const order = await resp.json()
      alert(`Compra realizada. Boleta ${order.numero}. Total $${order.total}`)
      clear()
      navigate('/perfil')
    } catch {
      alert('Error de red al procesar la compra.')
    }
  }

  const pickupReadyText = () => {
    const now = new Date()
    const hour = now.getHours()
    if (hour < 16) {
      const ready = new Date(now)
      ready.setHours(hour + 4)
      return `Retiro en tienda disponible hoy a las ${ready.getHours()}:00`
    }
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    return `Retiro en tienda disponible mañana a las 11:00`
  }

  return (
    <>
      <h2 className="mb-3">Checkout</h2>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-2">Resumen de productos</h6>
                <ul className="list-group">
                  {items.map(p => {
                    const precio = p.precio ?? p.precio_nuevo ?? p.precio_descuento ?? 0
                    return (
                      <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{p.nombre} × {p.qty}</span>
                        <span>${precio * p.qty}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="d-flex justify-content-between mt-3"><span>Productos</span><span>${itemsTotal}</span></div>
                <div className="d-flex justify-content-between"><span>IVA (19%)</span><span>${tax}</span></div>
                <div className="d-flex justify-content-between"><span>Envío</span><span>${shippingCost}</span></div>
                <hr />
                <div className="d-flex justify-content-between"><strong>Total</strong><strong>${grandTotal}</strong></div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h6 className="mb-2">Datos del comprador</h6>
            <div className="row g-2">
              <div className="col-md-6"><div className="text-muted">Nombre</div><div>{checkout?.name || '-'}</div></div>
              <div className="col-md-6"><div className="text-muted">Correo</div><div>{checkout?.email || '-'}</div></div>
              <div className="col-md-6"><div className="text-muted">Teléfono</div><div>{checkout?.telefono || '-'}</div></div>
              {checkout?.envio === 'domicilio' && (
                <>
                  <div className="col-md-6"><div className="text-muted">Región</div><div>{checkout?.region || '-'}</div></div>
                  <div className="col-md-6"><div className="text-muted">Comuna</div><div>{checkout?.comuna || '-'}</div></div>
                  <div className="col-12"><div className="text-muted">Dirección</div><div>{checkout?.address || '-'}</div></div>
                </>
              )}
              <div className="col-md-6"><div className="text-muted">Envío</div><div>{checkout?.envio === 'domicilio' ? 'Domicilio' : 'Retiro en tienda'}</div></div>
              {checkout?.envio === 'retiro' && (
                <div className="col-12"><div className="text-muted">Disponibilidad</div><div>{pickupReadyText()}</div></div>
              )}
              <div className="col-md-6"><div className="text-muted">Pago</div><div>{checkout?.pago === 'tarjeta' ? `Tarjeta •••• ${String(checkout?.tarjeta || '').replace(/\D/g, '').slice(-4) || '----'} (${checkout?.cuotas} cuotas)` : 'Transferencia'}</div></div>
            </div>
            <div className="text-end mt-3">
              <button className="btn btn-warning" type="button" onClick={handleSubmit}>Confirmar Compra</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}