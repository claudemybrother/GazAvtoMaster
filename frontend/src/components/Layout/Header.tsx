import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="site-header">
      <div className="site-header__top">
        <NavLink to="/" className="site-header__logo">
          <div className="site-header__logo-icon">А</div>
          <div className="site-header__logo-text">
            <div className="site-header__logo-title">ГазАвтоМастер</div>
            <div className="site-header__logo-sub">Система управления автосалоном</div>
          </div>
        </NavLink>
        <div className="site-header__user">
          <span>👤</span>
          <span className="site-header__user-name">{user?.fullName}</span>
          <span className="site-header__user-role">{user?.role}</span>
          <button className="btn-logout" onClick={handleLogout}>Выход</button>
        </div>
      </div>
      <nav className="site-nav">
        <ul className="site-nav__list">
          <li className="site-nav__item"><NavLink to="/">🏠 Главная</NavLink></li>
          <li className="site-nav__item"><NavLink to="/cars">🚗 Автомобили</NavLink></li>
          <li className="site-nav__item"><NavLink to="/clients">👥 Клиенты</NavLink></li>
          <li className="site-nav__item"><NavLink to="/deals">💼 Сделки</NavLink></li>
          <li className="site-nav__item"><NavLink to="/reservations">📋 Брони</NavLink></li>
          <li className="site-nav__item"><NavLink to="/test-drives">🔑 Тест-драйвы</NavLink></li>
          <li className="site-nav__item"><NavLink to="/employees">👔 Сотрудники</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}
