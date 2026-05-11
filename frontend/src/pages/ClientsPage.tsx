import { useEffect, useState } from 'react'
import { clientsApi } from '../api/endpoints'
import type { ClientDto } from '../types'
import Layout from '../components/Layout/Layout'

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    clientsApi.getAll().then(r => setClients(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    return !q || `${c.lastName} ${c.firstName} ${c.patronymic} ${c.phone} ${c.email}`.toLowerCase().includes(q)
  })

  const age = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 👥 Клиенты</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">👥 Клиентская база</span>
          <span className="muted" style={{ color: '#cde' }}>{clients.length} записей</span>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по ФИО, телефону, email..."
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
                    <th>#</th><th>ФИО</th><th>Телефон</th><th>Email</th>
                    <th>Паспорт</th><th>Возраст</th><th>Адрес</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">Клиенты не найдены</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.clientId}>
                      <td className="muted">{c.clientId}</td>
                      <td><b>{c.lastName}</b> {c.firstName} {c.patronymic}</td>
                      <td><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                      <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{c.passportSeries} {c.passportNumber}</td>
                      <td className="muted">{age(c.birthDate)} лет</td>
                      <td className="muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address}</td>
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
