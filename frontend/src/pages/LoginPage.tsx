import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: doLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authApi.login({ login, password })
      doLogin(data)
      navigate('/')
    } catch {
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-box__header">
          <div className="login-box__logo">🚗</div>
          <div className="login-box__title">ГазАвтоМастер</div>
          <div className="login-box__sub">Система управления автосалоном</div>
        </div>
        <div className="login-box__body">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">⚠ {error}</div>}
            <div className="form-group">
              <label className="form-label" htmlFor="login">Логин</label>
              <input
                id="login" type="text" className="form-input"
                value={login} onChange={e => setLogin(e.target.value)}
                placeholder="Введите логин" autoFocus required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Пароль</label>
              <input
                id="password" type="password" className="form-input"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль" required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти в систему'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
