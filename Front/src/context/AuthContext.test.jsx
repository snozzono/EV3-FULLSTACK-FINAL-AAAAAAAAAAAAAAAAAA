import React from 'react'
import { render, screen } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './AuthContext.jsx'

function TriggerRegister({ payload }) {
  const { register, user } = useAuth()
  const [status, setStatus] = useState('')
  useEffect(() => {
    let mounted = true
    register(payload).then((res) => {
      if (!mounted) return
      setStatus(res.ok ? 'ok' : 'error')
    })
    return () => { mounted = false }
  }, [])
  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="username">{user?.username || ''}</div>
      <div data-testid="email">{user?.email || ''}</div>
      <div data-testid="token">{user?.token ? 'yes' : ''}</div>
    </div>
  )
}

describe('AuthContext.register', () => {
  beforeEach(() => {
    localStorage.clear()
    global.fetch = vi.fn(async (url, opts) => {
      if (String(url).includes('/api/auth/register')) {
        const body = JSON.parse(opts.body)
        if (!body.password || String(body.password).length < 8) {
          return new Response(null, { status: 400 })
        }
        const data = {
          token: 'fake-jwt',
          username: body.username,
          nombre: body.nombre,
          email: body.email,
          role: 'CLIENTE',
        }
        return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(null, { status: 404 })
    })
  })

  it('registra con payload válido y guarda sesión', async () => {
    const payload = { nombre: 'Juan', email: 'juan@gmail.com', password: 'password1234' }
    render(
      <AuthProvider>
        <TriggerRegister payload={payload} />
      </AuthProvider>
    )
    expect(await screen.findByTestId('status')).toHaveTextContent('ok')
    expect(screen.getByTestId('username')).toHaveTextContent('juan@gmail.com')
    expect(screen.getByTestId('email')).toHaveTextContent('juan@gmail.com')
    expect(screen.getByTestId('token')).toHaveTextContent('yes')
  })

  it('falla con contraseña corta', async () => {
    const payload = { nombre: 'Malo', email: 'malo@gmail.com', password: '123' }
    render(
      <AuthProvider>
        <TriggerRegister payload={payload} />
      </AuthProvider>
    )
    expect(await screen.findByTestId('status')).toHaveTextContent('error')
    expect(screen.getByTestId('token')).toBeEmptyDOMElement()
  })
})