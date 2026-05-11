import { useEffect, useState } from 'react'
import { testDrivesApi } from '../api/endpoints'
import type { TestDriveDto } from '../types'
import Layout from '../components/Layout/Layout'

export default function TestDrivesPage() {
  const [rows, setRows] = useState<TestDriveDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    testDrivesApi.getAll().then(r => setRows(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    return !q || `${r.carInfo} ${r.clientName} ${r.employeeName} ${r.feedback || ''}`.toLowerCase().includes(q)
  })

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 🔑 Тест-драйвы</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">🔑 Журнал тест-драйвов</span>
          <span className="muted" style={{ color: '#cde' }}>{rows.length} записей</span>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по авто, клиенту, отзыву..."
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
                    <th>Дата</th><th>Отзыв</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="empty-state">Тест-драйвы не найдены</td></tr>
                  ) : filtered.map(t => (
                    <tr key={t.tdId}>
                      <td className="muted">{t.tdId}</td>
                      <td>{t.carInfo}</td>
                      <td>{t.clientName}</td>
                      <td className="muted">{t.employeeName}</td>
                      <td className="muted">{new Date(t.tdDate).toLocaleDateString('ru-RU')}</td>
                      <td style={{ fontStyle: t.feedback ? 'normal' : 'italic', color: t.feedback ? 'inherit' : '#999' }}>
                        {t.feedback ? `"${t.feedback}"` : 'Без отзыва'}
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
