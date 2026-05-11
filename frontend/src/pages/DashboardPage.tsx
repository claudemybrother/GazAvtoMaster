import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/endpoints'
import type { DashboardStats } from '../types'
import Layout from '../components/Layout/Layout'

const fmt = (n: number) => n.toLocaleString('ru-RU')
const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <Layout stats={stats ? { totalCars: stats.totalCars, availableCars: stats.availableCars, totalClients: stats.totalClients, totalDeals: stats.totalDeals } : undefined}>
      <div className="breadcrumb">🏠 Главная</div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">📊 Общая статистика системы</span>
        </div>
        <div className="forum-panel__body">
          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card__label">Всего автомобилей</div>
                <div className="stat-card__value">{fmt(stats.totalCars)}</div>
              </div>
              <div className="stat-card stat-card--green">
                <div className="stat-card__label">В наличии</div>
                <div className="stat-card__value">{fmt(stats.availableCars)}</div>
              </div>
              <div className="stat-card stat-card--orange">
                <div className="stat-card__label">Зарезервировано</div>
                <div className="stat-card__value">{fmt(stats.reservedCars)}</div>
              </div>
              <div className="stat-card stat-card--purple">
                <div className="stat-card__label">Продано</div>
                <div className="stat-card__value">{fmt(stats.soldCars)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Клиентов</div>
                <div className="stat-card__value">{fmt(stats.totalClients)}</div>
              </div>
              <div className="stat-card stat-card--green">
                <div className="stat-card__label">Сделок</div>
                <div className="stat-card__value">{fmt(stats.totalDeals)}</div>
              </div>
              <div className="stat-card stat-card--orange">
                <div className="stat-card__label">Активных броней</div>
                <div className="stat-card__value">{fmt(stats.activeReservations)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Тест-драйвов</div>
                <div className="stat-card__value">{fmt(stats.totalTestDrives)}</div>
              </div>
              <div className="stat-card stat-card--green" style={{ gridColumn: 'span 2' }}>
                <div className="stat-card__label">Общая выручка</div>
                <div className="stat-card__value" style={{ fontSize: 18 }}>{fmtPrice(stats.totalRevenue)}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">ℹ️ О системе</span>
        </div>
        <div className="forum-panel__body">
          <table className="forum-table" style={{ maxWidth: 600 }}>
            <tbody>
              <tr><td style={{ fontWeight: 'bold', width: 180 }}>Организация</td><td>ООО «ГазАвтоМастер»</td></tr>
              <tr><td style={{ fontWeight: 'bold' }}>Система</td><td>Управление автосалоном v1.0</td></tr>
              <tr><td style={{ fontWeight: 'bold' }}>Стек</td><td>ASP.NET Core 8 / React 18 / PostgreSQL</td></tr>
              <tr><td style={{ fontWeight: 'bold' }}>Таблиц в БД</td><td>10 (brands, models, statuses, cars, clients, roles, employees, deals, reservations, test_drives)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
