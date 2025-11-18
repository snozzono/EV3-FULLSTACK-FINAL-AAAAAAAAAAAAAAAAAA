import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminBlogs from '../AdminBlogs.jsx'
import { AuthProvider } from '../../context/AuthContext.jsx'

describe('AdminBlogs', () => {
  beforeEach(() => {
    localStorage.setItem('session', JSON.stringify({ token: 't', username: 'admin', nombre: 'Admin', email: 'admin@x', rol: 'ADMIN' }))
    global.fetch = vi.fn(async (url, opts) => {
      if (String(url).includes('/api/blogs') && (!opts || !opts.method)) {
        return new Response(JSON.stringify([
          { id: 1, titulo: 'Blog A', autor: 'Autor A', contenido: '...' },
          { id: 2, titulo: 'Blog B', autor: 'Autor B', contenido: '...' },
        ]), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      if (String(url).includes('/api/blogs') && opts?.method === 'POST') {
        const body = JSON.parse(opts.body)
        return new Response(JSON.stringify({ id: 3, ...body }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      if (String(url).includes('/api/blogs/1') && opts?.method === 'DELETE') {
        return new Response(null, { status: 204 })
      }
      return new Response(null, { status: 404 })
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('lista blogs, crea y elimina', async () => {
    render(
      <AuthProvider>
        <AdminBlogs />
      </AuthProvider>
    )
    expect(await screen.findByText('Blog A')).toBeInTheDocument()
    expect(screen.getByText('Blog B')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Nuevo' }))
    await user.type(screen.getByLabelText('Título'), 'Blog C')
    await user.type(screen.getByLabelText('Autor'), 'Autor C')
    await user.type(screen.getByLabelText('Contenido'), 'Texto')
    await user.click(screen.getByRole('button', { name: 'Crear' }))

    expect(await screen.findByText('Blog C')).toBeInTheDocument()

    const rowA = screen.getByText('Blog A').closest('tr')
    await user.click(within(rowA).getByRole('button', { name: 'Eliminar' }))
    expect(await screen.findByText('Blog B')).toBeInTheDocument()
    expect(screen.queryByText('Blog A')).not.toBeInTheDocument()
  })
})