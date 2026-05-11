import { useEffect, useState } from 'react'
import { employeesApi } from '../api/endpoints'
import type { EmployeeDto } from '../types'
import Layout from '../components/Layout/Layout'

const ROLE_BADGE: Record<string, string> = {
  'Администратор': 'badge--sold',
  'Менеджер':      'badge--available',
  'Кладовщик':     'badge--info',
}

export default function EmployeesPage() {
  const [rows, setRows] = useState<EmployeeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    employeesApi.getAll().then(r => setRows(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(e => {
    const q = search.toLowerCase()
    return !q || `${e.lastName} ${e.firstName} ${e.roleName} ${e.email} ${e.login}`.toLowerCase().includes(q)
  })

  const workYears = (d: string) => {
    const years = Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    return years < 1 ? 'менее года' : `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`
  }

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 👔 Сотрудники</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">👔 Персонал автосалона</span>
          <span className="muted" style={{ color: '#cde' }}>{rows.length} сотрудников</span>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по ФИО, роли, логину..."
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
                    <th>#</th><th>ФИО</th><th>Роль</th><th>Телефон</th>
                    <th>Email</th><th>Логин</th><th>Принят</th><th>Стаж</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="empty-state">Сотрудники не найдены</td></tr>
                  ) : filtered.map(e => (
                    <tr key={e.employeeId}>
                      <td className="muted">{e.employeeId}</td>
                      <td><b>{e.lastName}</b> {e.firstName} {e.patronymic}</td>
                      <td><span className={`badge ${ROLE_BADGE[e.roleName] || 'badge--info'}`}>{e.roleName}</span></td>
                      <td><a href={`tel:${e.phone}`}>{e.phone}</a></td>
                      <td><a href={`mailto:${e.email}`}>{e.email}</a></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{e.login}</td>
                      <td className="muted">{new Date(e.hireDate).toLocaleDateString('ru-RU')}</td>
                      <td className="muted">{workYears(e.hireDate)}</td>
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
