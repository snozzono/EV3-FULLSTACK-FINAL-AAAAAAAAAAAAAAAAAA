import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidEmailDomain, isValidPassword, maxLength } from '../utils/validators'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Correo es requerido'
    else if (!maxLength(email, 100)) e.email = 'Máximo 100 caracteres'
    else if (!isValidEmailDomain(email)) e.email = 'Dominios permitidos: duoc.cl, profesor.duoc.cl, gmail.com'
    if (!password) e.password = 'Contraseña requerida'
    else if (!isValidPassword(password)) e.password = 'Debe tener entre 4 y 10 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setMessage('')
    if (!validate()) return
    const res = await login(email, password)
    if (!res.ok) {
      setMessage(res.error || 'Error al iniciar sesión')
      return
    }
    navigate('/')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-3">Iniciar sesión</h2>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@duoc.cl" />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            <div className="form-text">Solo correos: @duoc.cl, @profesor.duoc.cl, @gmail.com</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            <div className="form-text">Entre 4 y 10 caracteres</div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Ingresar</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/registro')}>Crear cuenta</button>
          </div>
        </form>
      </div>
    </div>
  )
}