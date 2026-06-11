import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { user, loading, login, logout } = useAuthContext()
  return { user, loading, login, logout }
}
