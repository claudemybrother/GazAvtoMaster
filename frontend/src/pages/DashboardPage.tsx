import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/endpoints'
import type { DashboardStats, MonthlyRevenueDto, TopModelDto, StatusDistDto } from '../types'
import Layout from '../components/Layout/Layout'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const fmt = (n: number) => n.toLocaleString('ru-RU')
const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const MONTH_NAMES: Record<string, string> = {
  '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр',
  '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг',
  '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек'
}

const PIE_COLORS = ['#2563eb', '#d97706', '#7c3aed', '#16a34a', '#dc2626']

function fmtMonth(m: string) {
  const [, mm] = m.split('-')
  return MONTH_NAMES[mm] ?? m
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthly, setMonthly] = useState<MonthlyRevenueDto[]>([])
  const [topModels, setTopModels] = useState<TopModelDto[]>([])
  const [statusDist, setStatusDist] = useState<StatusDistDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats().then(r => setStats(r.data)),
      dashboardApi.getMonthlyRev().then(r => setMonthly(r.data)).catch(() => {}),
      dashboardApi.getTopModels().then(r => setTopModels(r.data)).catch(() => {}),
      dashboardApi.getStatusDist().then(r => setStatusDist(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  return (
    <Layout stats={stats ? { totalCars: stats.totalCars, availableCars: stats.availableCars, totalClients: stats.totalClients, totalDeals: stats.totalDeals } : undefined}>
      <div className="breadcrumb">🏠 Главная</div>

      {loading ? (
        <div className="loading"><span className="spinner" /> Загрузка данных...</div>
      ) : stats ? (
        <>
          {/* ---- STATS GRID ---- */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card__label">🚗 Всего автомобилей</div>
              <div className="stat-card__value">{fmt(stats.totalCars)}</div>
            </div>
            <div className="stat-card stat-card--green">
              <div className="stat-card__label">✅ В наличии</div>
              <div className="stat-card__value">{fmt(stats.availableCars)}</div>
            </div>
            <div className="stat-card stat-card--orange">
              <div className="stat-card__label">📋 Зарезервировано</div>
              <div className="stat-card__value">{fmt(stats.reservedCars)}</div>
            </div>
            <div className="stat-card stat-card--purple">
              <div className="stat-card__label">💼 Продано</div>
              <div className="stat-card__value">{fmt(stats.soldCars)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">👥 Клиентов</div>
              <div className="stat-card__value">{fmt(stats.totalClients)}</div>
            </div>
            <div className="stat-card stat-card--green">
              <div className="stat-card__label">🤝 Сделок</div>
              <div className="stat-card__value">{fmt(stats.totalDeals)}</div>
            </div>
            <div className="stat-card stat-card--orange">
              <div className="stat-card__label">🔑 Тест-драйвов</div>
              <div className="stat-card__value">{fmt(stats.totalTestDrives)}</div>
            </div>
            <div className="stat-card stat-card--green" style={{ gridColumn: 'span 2' }}>
              <div className="stat-card__label">💰 Общая выручка</div>
              <div className="stat-card__value" style={{ fontSize: 22 }}>{fmtPrice(stats.totalRevenue)}</div>
            </div>
          </div>

          {/* ---- CHARTS ---- */}
          <div className="charts-grid">
            {/* Выручка по месяцам */}
            <div className="chart-card chart-card--full">
              <div className="chart-card__title">📈 Выручка по месяцам (последние 12 месяцев)</div>
              {monthly.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}>Нет данных о продажах</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthly.map(m => ({ ...m, label: fmtMonth(m.month) }))}
                    margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
                      tickFormatter={v => `${(v / 1_000_000).toFixed(1)}М`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                      formatter={(v) => [fmtPrice(Number(v)), 'Выручка']}
                      labelFormatter={l => `Месяц: ${l}`}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2}
                      fill="url(#revenueGrad)" dot={{ r: 3, fill: '#2563eb' }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Топ моделей */}
            <div className="chart-card">
              <div className="chart-card__title">🏆 Топ-5 моделей по продажам</div>
              {topModels.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}>Нет данных</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topModels} layout="vertical"
                    margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="model" tick={{ fontSize: 12, fill: '#0f172a' }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                      formatter={(v) => [v, 'Продаж']} />
                    <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Статусы автомобилей */}
            <div className="chart-card">
              <div className="chart-card__title">🗂️ Статусы автомобилей</div>
              {statusDist.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}>Нет данных</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusDist} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusDist.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                      formatter={(v, name) => [v, name]} />
                    <Legend iconType="circle" iconSize={8}
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ---- INFO TABLE ---- */}
          <div className="forum-panel">
            <div className="forum-panel__header">
              <span className="forum-panel__title">ℹ️ О системе</span>
            </div>
            <div className="forum-panel__body">
              <div className="info-list">
                {[
                  { label: 'Организация', value: 'ООО «ГазАвтоМастер»' },
                  { label: 'Система',     value: 'Управление автосалоном v1.0' },
                  { label: 'Стек',        value: 'ASP.NET Core 8 / React 18 / PostgreSQL' },
                  { label: 'Таблиц в БД',value: 'brands, models, statuses, cars, clients, roles, employees, deals, reservations, test_drives' },
                ].map(({ label, value }) => (
                  <div key={label} className="info-list__row">
                    <span className="info-list__key">{label}</span>
                    <span className="info-list__val">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Layout>
  )
}
