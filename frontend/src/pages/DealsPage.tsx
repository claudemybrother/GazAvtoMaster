import { useEffect, useState } from 'react'
import { dealsApi } from '../api/endpoints'
import type { DealDto } from '../types'
import Layout from '../components/Layout/Layout'

const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const PAYMENT_BADGE: Record<string, string> = {
  'Наличные': 'badge--available',
  'Кредит':   'badge--reserved',
  'Лизинг':   'badge--sold',
}

export default function DealsPage() {
  const [deals, setDeals] = useState<DealDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dealsApi.getAll().then(r => setDeals(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = deals.filter(d => {
    const q = search.toLowerCase()
    return !q || `${d.carInfo} ${d.clientName} ${d.employeeName} ${d.paymentType}`.toLowerCase().includes(q)
  })

  const total = filtered.reduce((s, d) => s + d.finalPrice, 0)

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 💼 Сделки</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">💼 Журнал сделок</span>
          <span className="muted" style={{ color: '#cde' }}>{deals.length} записей</span>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по авто, клиенту, менеджеру..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <span className="muted">Найдено: {filtered.length}</span>
            {filtered.length > 0 && <span className="price" style={{ marginLeft: 'auto' }}>Итого: {fmtPrice(total)}</span>}
          </div>
          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>#</th><th>Автомобиль</th><th>Клиент</th><th>Менеджер</th>
                    <th>Дата</th><th>Сумма</th><th>Оплата</th><th>Примечание</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="empty-state">Сделки не найдены</td></tr>
                  ) : filtered.map(d => (
                    <tr key={d.dealId}>
                      <td className="muted">{d.dealId}</td>
                      <td>{d.carInfo}</td>
                      <td>{d.clientName}</td>
                      <td className="muted">{d.employeeName}</td>
                      <td className="muted">{new Date(d.dealDate).toLocaleDateString('ru-RU')}</td>
                      <td className="price">{fmtPrice(d.finalPrice)}</td>
                      <td><span className={`badge ${PAYMENT_BADGE[d.paymentType] || 'badge--info'}`}>{d.paymentType}</span></td>
                      <td className="muted">{d.notes || '—'}</td>
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
