import { useEffect, useState } from 'react'
import { reservationsApi } from '../api/endpoints'
import type { ReservationDto } from '../types'
import Layout from '../components/Layout/Layout'

const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export default function ReservationsPage() {
  const [rows, setRows] = useState<ReservationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    reservationsApi.getAll().then(r => setRows(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    return !q || `${r.carInfo} ${r.clientName} ${r.employeeName}`.toLowerCase().includes(q)
  })

  const isExpired = (d: string) => new Date(d) < new Date()

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 📋 Бронирования</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">📋 Журнал бронирований</span>
          <span className="muted" style={{ color: '#cde' }}>{rows.length} записей</span>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по авто, клиенту..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <span className="muted">Найдено: {filtered.length}</span>
          </div>
          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>#</th><th>Автомобиль</th><th>Клиент</th><th>Менеджер</th>
                    <th>Дата брони</th><th>Истекает</th><th>Залог</th><th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="empty-state">Бронирования не найдены</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.reservationId}>
                      <td className="muted">{r.reservationId}</td>
                      <td>{r.carInfo}</td>
                      <td>{r.clientName}</td>
                      <td className="muted">{r.employeeName}</td>
                      <td className="muted">{new Date(r.reservationDate).toLocaleDateString('ru-RU')}</td>
                      <td className="muted">{new Date(r.expiryDate).toLocaleDateString('ru-RU')}</td>
                      <td className="price">{fmtPrice(r.deposit)}</td>
                      <td>
                        {isExpired(r.expiryDate)
                          ? <span className="badge badge--sold">Истекла</span>
                          : <span className="badge badge--reserved">Активна</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
