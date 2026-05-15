import { useEffect, useState } from 'react'
import { auditApi } from '../api/endpoints'
import type { AuditLogDto } from '../types'
import Layout from '../components/Layout/Layout'

const fmtDt = (s: string) =>
  new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function ActionBadge({ action }: { action: string }) {
  if (action === 'CREATE') return <span className="badge badge--available audit-action--create">CREATE</span>
  if (action === 'UPDATE') return <span className="badge badge--reserved audit-action--update">UPDATE</span>
  if (action === 'DELETE') return <span className="badge badge--sold audit-action--delete">DELETE</span>
  return <span className="badge">{action}</span>
}

const ENTITY_LABELS: Record<string, string> = {
  Deal: '💼 Сделка',
  Car: '🚗 Автомобиль',
  Client: '👥 Клиент',
  Reservation: '📋 Бронь',
  TestDrive: '🔑 Тест-драйв',
  Employee: '👔 Сотрудник',
}

export default function AuditPage() {
  const [rows, setRows] = useState<AuditLogDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => {
    auditApi.getAll(1, 200).then(r => setRows(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || `${r.entityType} ${r.employeeName} ${r.changesJson}`.toLowerCase().includes(q)
    const matchAction = !actionFilter || r.action === actionFilter
    return matchSearch && matchAction
  })

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 👔 <a href="/admin">Сотрудники</a> <span>›</span> 📜 Журнал аудита</div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">📜 Журнал действий (Аудит)</span>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по сотруднику, сущности..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="toolbar__select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option value="">Все действия</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
            <span className="muted">Записей: {filtered.length}</span>
          </div>

          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка журнала...</div>
          ) : (
            <div className="forum-table-wrap audit-table">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Действие</th>
                    <th>Сущность</th>
                    <th>ID</th>
                    <th>Сотрудник</th>
                    <th>Изменения</th>
                    <th>Дата/время</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">
                      {rows.length === 0 ? 'Журнал пуст — создайте, измените или удалите сделку, чтобы появились записи' : 'Ничего не найдено'}
                    </td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.id}>
                      <td className="muted">{r.id}</td>
                      <td><ActionBadge action={r.action} /></td>
                      <td>{ENTITY_LABELS[r.entityType] ?? r.entityType}</td>
                      <td className="muted">{r.entityId}</td>
                      <td style={{ fontWeight: 500 }}>{r.employeeName}</td>
                      <td><div className="audit-changes" title={r.changesJson}>{r.changesJson}</div></td>
                      <td className="muted" style={{ whiteSpace: 'nowrap' }}>{fmtDt(r.createdAt)}</td>
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
