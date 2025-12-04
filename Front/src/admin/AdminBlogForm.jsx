import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resolveImageUrl } from '../utils/api'

export default function AdminBlogForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const editing = useMemo(() => Boolean(id), [id])
  const [form, setForm] = useState({ titulo: '', autor: '', contenido: '', imagen: '', activo: true, fechaPublicacion: null })

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
      if (!editing) return
      const resp = await fetch(`http://localhost:8080/api/blogs/${id}`)
      if (resp.ok) {
        const b = await resp.json()
        setForm({ titulo: b.titulo || '', autor: b.autor || '', contenido: b.contenido || '', imagen: b.imagenUrl || '', activo: !!b.activo, fechaPublicacion: b.fechaPublicacion || null })
      }
    }
    load()
  }, [editing, id])

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.titulo) { notify('Falta título', 'warning'); return false }
    return true
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const payload = {
      titulo: String(form.titulo).trim(),
      autor: String(form.autor || '').trim(),
      contenido: String(form.contenido || '').trim(),
      imagenUrl: form.imagen,
      activo: Boolean(form.activo),
      fechaPublicacion: form.fechaPublicacion
    }
    if (editing) {
      const resp = await fetch(`http://localhost:8080/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        notify('Blog guardado', 'success')
        navigate('/admin/blogs')
      } else {
        notify('No se pudo guardar', 'danger')
      }
    } else {
      const resp = await fetch('http://localhost:8080/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        notify('Blog creado', 'success')
        navigate('/admin/blogs')
      } else {
        notify('No se pudo crear', 'danger')
      }
    }
  }

  return (
    <div>
      <h3>{editing ? 'Editar Blog' : 'Nuevo Blog'}</h3>
      <form className="border rounded p-3" onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="titulo">Título</label>
            <input id="titulo" className="form-control" value={form.titulo} onChange={(e) => setField('titulo', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="autor">Autor</label>
            <input id="autor" className="form-control" value={form.autor} onChange={(e) => setField('autor', e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="contenido">Contenido</label>
            <textarea id="contenido" className="form-control" rows={6} value={form.contenido} onChange={(e) => setField('contenido', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="imagenUpload">Imagen</label>
            <div className="d-flex align-items-center gap-3">
              <input id="imagenUpload" type="file" accept="image/*" className="form-control" onChange={async (e) => {
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
              {form.imagen ? (
                <img src={resolveImageUrl(form.imagen)} alt="preview" width={80} height={60} style={{ objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
              ) : null}
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <div className="form-check mt-4">
              <input className="form-check-input" type="checkbox" id="activo" checked={form.activo} onChange={(e) => setField('activo', e.target.checked)} />
              <label className="form-check-label" htmlFor="activo">Activo</label>
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/blogs')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
