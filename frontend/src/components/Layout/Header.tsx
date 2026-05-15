import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const isAdmin = user?.role === 'Администратор'
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="site-header__top">
        <NavLink to="/" className="site-header__logo" onClick={closeMenu}>
          <div className="site-header__logo-icon">А</div>
          <div className="site-header__logo-text">
            <div className="site-header__logo-title">ГазАвтоМастер</div>
            <div className="site-header__logo-sub">Система управления автосалоном</div>
          </div>
        </NavLink>

        <div className="site-header__user">
          <button className="theme-toggle" onClick={toggle} title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="site-header__user-name hide-mobile">{user?.fullName}</span>
          <span className="site-header__user-role hide-mobile">{user?.role}</span>
          <button className="btn-logout hide-mobile" onClick={handleLogout}>Выход</button>
          <button className="burger" onClick={() => setMenuOpen(o => !o)} aria-label="Меню">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="site-nav hide-mobile-nav">
        <ul className="site-nav__list">
          <li className="site-nav__item"><NavLink to="/">🏠 Главная</NavLink></li>
          <li className="site-nav__item"><NavLink to="/cars">🚗 Автомобили</NavLink></li>
          <li className="site-nav__item"><NavLink to="/clients">👥 Клиенты</NavLink></li>
          <li className="site-nav__item"><NavLink to="/deals">💼 Сделки</NavLink></li>
          <li className="site-nav__item"><NavLink to="/reservations">📋 Брони</NavLink></li>
          <li className="site-nav__item"><NavLink to="/test-drives">🔑 Тест-драйвы</NavLink></li>
          {isAdmin && (
            <li className="site-nav__item"><NavLink to="/admin">👔 Сотрудники</NavLink></li>
          )}
        </ul>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__user">
            <span>👤</span>
            <div>
              <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{user?.fullName}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.role}</div>
            </div>
          </div>
          <nav className="mobile-menu__nav">
            <NavLink to="/" onClick={closeMenu}>🏠 Главная</NavLink>
            <NavLink to="/cars" onClick={closeMenu}>🚗 Автомобили</NavLink>
            <NavLink to="/clients" onClick={closeMenu}>👥 Клиенты</NavLink>
            <NavLink to="/deals" onClick={closeMenu}>💼 Сделки</NavLink>
            <NavLink to="/reservations" onClick={closeMenu}>📋 Брони</NavLink>
            <NavLink to="/test-drives" onClick={closeMenu}>🔑 Тест-драйвы</NavLink>
            {isAdmin && <NavLink to="/admin" onClick={closeMenu}>👔 Сотрудники</NavLink>}
            {isAdmin && <NavLink to="/admin/audit" onClick={closeMenu}>📜 Журнал аудита</NavLink>}
            {isAdmin && <NavLink to="/admin/references" onClick={closeMenu}>🗂 Справочники</NavLink>}
          </nav>
          <button className="mobile-menu__logout" onClick={handleLogout}>🚪 Выйти</button>
        </div>
      )}
    </header>
  )
}
