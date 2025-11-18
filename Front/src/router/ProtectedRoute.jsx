import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../context/roles'

export default function ProtectedRoute({ children, allowRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowRoles && allowRoles.length && !allowRoles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }
  return children
}

export { ROLES }