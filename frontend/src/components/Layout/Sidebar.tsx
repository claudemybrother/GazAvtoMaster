import { NavLink } from 'react-router-dom'

interface SidebarProps {
  stats?: { totalCars: number; availableCars: number; totalClients: number; totalDeals: number }
}

export default function Sidebar({ stats }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <div className="sidebar__title">Навигация</div>
        <ul className="sidebar__list">
          <li><NavLink to="/" end>🏠 Дашборд</NavLink></li>
          <li><NavLink to="/cars">🚗 Автомобили</NavLink></li>
          <li><NavLink to="/clients">👥 Клиенты</NavLink></li>
          <li><NavLink to="/deals">💼 Сделки</NavLink></li>
          <li><NavLink to="/reservations">📋 Бронирования</NavLink></li>
          <li><NavLink to="/test-drives">🔑 Тест-драйвы</NavLink></li>
          <li><NavLink to="/employees">👔 Сотрудники</NavLink></li>
        </ul>
      </div>

      {stats && (
        <div className="sidebar__section">
          <div className="sidebar__title">Статистика</div>
          <div className="sidebar__stat">
            <span className="sidebar__stat-num">{stats.availableCars}</span>
            авто в наличии
          </div>
          <div className="sidebar__stat">
            <span className="sidebar__stat-num">{stats.totalClients}</span>
            клиентов
          </div>
          <div className="sidebar__stat">
            <span className="sidebar__stat-num">{stats.totalDeals}</span>
            сделок
          </div>
        </div>
      )}

      <div className="sidebar__section">
        <div className="sidebar__title">Справочники</div>
        <ul className="sidebar__list">
          <li><NavLink to="/cars">🏷️ Марки и модели</NavLink></li>
        </ul>
      </div>
    </aside>
  )
}
