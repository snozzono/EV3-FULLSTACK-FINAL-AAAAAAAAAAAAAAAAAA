import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import AdminUsuarios from '../AdminUsuarios.jsx'
import { AuthProvider } from '../../context/AuthContext.jsx'

describe('AdminUsuarios', () => {
  beforeEach(() => {
    localStorage.setItem('session', JSON.stringify({ token: 't', username: 'admin', nombre: 'Admin', email: 'admin@x', rol: 'ADMIN' }))
    global.fetch = vi.fn(async (url, opts) => {
      if (String(url).includes('/api/users') && (!opts || !opts.method)) {
        return new Response(JSON.stringify([
          { id: 10, username: 'u1', nombre: 'User Uno', email: 'u1@x', role: 'CLIENTE' },
          { id: 20, username: 'u2', nombre: 'User Dos', email: 'u2@x', role: 'ADMIN' },
        ]), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      if (String(url).includes('/api/users/10') && opts?.method === 'DELETE') {
        return new Response(null, { status: 204 })
      }
      return new Response(null, { status: 404 })
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('lista usuarios y elimina uno', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminUsuarios />
        </BrowserRouter>
      </AuthProvider>
    )
    expect(await screen.findByText('User Uno')).toBeInTheDocument()
    expect(screen.getByText('User Dos')).toBeInTheDocument()

    const deleteBtn = screen.getAllByRole('button', { name: 'Eliminar' })[0]
    const user = userEvent.setup()
    await user.click(deleteBtn)

    expect(await screen.findByText('User Dos')).toBeInTheDocument()
    expect(screen.queryByText('User Uno')).not.toBeInTheDocument()
  })
})