import { useState } from 'react'
import { maxLength, isValidEmailDomain } from '../utils/validators'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('')
    if (!form.nombre || !form.email || !form.asunto || !form.mensaje) {
      setStatus('Completa todos los campos')
      return
    }
    if (!maxLength(form.nombre, 100)) {
      setStatus('Nombre máximo 100 caracteres')
      return
    }
    if (!maxLength(form.email, 100) || !isValidEmailDomain(form.email)) {
      setStatus('Correo inválido (dominios: duoc.cl, profesor.duoc.cl, gmail.com; máx 100)')
      return
    }
    if (!maxLength(form.asunto, 120)) {
      setStatus('Asunto máximo 120 caracteres')
      return
    }
    if (!maxLength(form.mensaje, 500)) {
      setStatus('Mensaje máximo 500 caracteres')
      return
    }
    try {
      const resp = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!resp.ok) {
        setStatus('Error al enviar')
        return
      }
      setStatus('Enviado correctamente')
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch {
      setStatus('Error de red')
    }
  }

  return (
    <>
      <h2>Contacto</h2>
      <p>Escríbenos para soporte o consultas.</p>
      {status && <div className={`alert ${status.includes('correctamente') ? 'alert-success' : 'alert-warning'}`}>{status}</div>}
      <form className="row g-3" onSubmit={submit}>
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="col-12">
          <label className="form-label">Asunto</label>
          <input className="form-control" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} />
        </div>
        <div className="col-12">
          <label className="form-label">Mensaje</label>
          <textarea className="form-control" rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} />
        </div>
        <div className="col-12">
          <button className="btn btn-warning">Enviar</button>
        </div>
      </form>
    </>
  )
}