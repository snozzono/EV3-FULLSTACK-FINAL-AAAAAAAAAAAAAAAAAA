import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import AdminProductos from '../AdminProductos.jsx'
import { AuthProvider } from '../../context/AuthContext.jsx'

describe('AdminProductos', () => {
  beforeEach(() => {
    localStorage.setItem('session', JSON.stringify({ token: 't', username: 'admin', nombre: 'Admin', email: 'admin@x', rol: 'ADMIN' }))
    global.fetch = vi.fn(async (url, opts) => {
      if (String(url).includes('/api/products') && (!opts || !opts.method)) {
        return new Response(JSON.stringify([
          { id: 1, nombre: 'Prod A', categoria: 'Cat', precio: 1000, stock: 5, imagenUrl: 'http://img/a.jpg' },
          { id: 2, nombre: 'Prod B', categoria: 'Cat', precio: 2000, stock: 0, imagenUrl: 'http://img/b.jpg' },
        ]), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      if (String(url).includes('/api/products/1') && opts?.method === 'DELETE') {
        return new Response(null, { status: 204 })
      }
      return new Response(null, { status: 404 })
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('lista productos y elimina uno', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminProductos />
        </BrowserRouter>
      </AuthProvider>
    )
    expect(await screen.findByText('Prod A')).toBeInTheDocument()
    expect(screen.getByText('Prod B')).toBeInTheDocument()

    const deleteBtn = screen.getAllByRole('button', { name: 'Eliminar' })[0]
    const user = userEvent.setup()
    await user.click(deleteBtn)

    expect(await screen.findByText('Prod B')).toBeInTheDocument()
    expect(screen.queryByText('Prod A')).not.toBeInTheDocument()
  })
})