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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте логин и пароль.')
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
            {error && <div className="error-msg">⚠️ {error}</div>}
            <div className="forum-panel" style={{ marginBottom: 16, background: '#f0f4e8', borderColor: '#c0c8a8' }}>
              <div className="forum-panel__body" style={{ padding: '8px 12px', fontSize: 11, color: '#556' }}>
                <b>Тестовый вход:</b> логин <b>123</b>, пароль <b>123</b>
              </div>
            </div>
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
              {loading ? '⏳ Вход...' : '→ Войти в систему'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
