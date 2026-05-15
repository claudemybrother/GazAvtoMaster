import { useEffect, useState } from 'react'
import { reservationsApi, carsApi, clientsApi } from '../api/endpoints'
import type { ReservationDto, CarDto, ClientDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'
import { useAuth } from '../context/AuthContext'

const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const today = () => new Date().toISOString().slice(0, 10)
const nextWeek = () => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

const EMPTY = { carId: 0, clientId: 0, employeeId: 0, reservationDate: today(), expiryDate: nextWeek(), deposit: 0 }

export default function ReservationsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<ReservationDto[]>([])
  const [cars, setCars] = useState<CarDto[]>([])
  const [clients, setClients] = useState<ClientDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      reservationsApi.getAll().then(r => setRows(r.data)),
      carsApi.getAll().then(r => setCars(r.data)),
      clientsApi.getAll().then(r => setClients(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    return !q || `${r.carInfo} ${r.clientName} ${r.employeeName}`.toLowerCase().includes(q)
  })

  const isExpired = (d: string) => new Date(d) < new Date()

  const openAdd = () => {
    setForm({ ...EMPTY, carId: cars[0]?.carId ?? 0, clientId: clients[0]?.clientId ?? 0, employeeId: user?.employeeId ?? 0 })
    setEditId(null); setError(''); setModal('add')
  }

  const openEdit = (r: ReservationDto) => {
    setForm({ carId: r.carId, clientId: r.clientId, employeeId: r.employeeId, reservationDate: r.reservationDate.slice(0, 10), expiryDate: r.expiryDate.slice(0, 10), deposit: r.deposit })
    setEditId(r.reservationId); setError(''); setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, reservationDate: new Date(form.reservationDate).toISOString(), expiryDate: new Date(form.expiryDate).toISOString() }
      if (modal === 'add') {
        const { data } = await reservationsApi.create(payload)
        setRows(prev => [...prev, data])
      } else if (editId != null) {
        const { data } = await reservationsApi.update(editId, payload)
        setRows(prev => prev.map(r => r.reservationId === editId ? data : r))
      }
      setModal(null)
    } catch { setError('Ошибка сохранения') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить бронирование?')) return
    await reservationsApi.delete(id)
    setRows(prev => prev.filter(r => r.reservationId !== id))
  }

  const fv = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: ['carId', 'clientId', 'employeeId'].includes(k) ? Number(e.target.value) : k === 'deposit' ? parseFloat(e.target.value) || 0 : e.target.value }))

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 📋 Бронирования</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">📋 Журнал бронирований</span>
          <button className="btn btn--primary" onClick={openAdd}>+ Добавить бронь</button>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по авто, клиенту..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <span className="muted">Найдено: {filtered.length}</span>
          </div>
          {loading ? <div className="loading"><span className="spinner" /> Загрузка...</div> : (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr><th>#</th><th>Автомобиль</th><th>Клиент</th><th>Менеджер</th><th>Дата брони</th><th>Истекает</th><th>Залог</th><th>Статус</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="empty-state">Бронирования не найдены</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.reservationId}>
                      <td className="muted">{r.reservationId}</td>
                      <td>{r.carInfo}</td>
                      <td>{r.clientName}</td>
                      <td className="muted">{r.employeeName}</td>
                      <td className="muted">{new Date(r.reservationDate).toLocaleDateString('ru-RU')}</td>
                      <td className="muted">{new Date(r.expiryDate).toLocaleDateString('ru-RU')}</td>
                      <td className="price">{fmtPrice(r.deposit)}</td>
                      <td>{isExpired(r.expiryDate) ? <span className="badge badge--sold">Истекла</span> : <span className="badge badge--reserved">Активна</span>}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn--sm btn--edit" onClick={() => openEdit(r)}>✏ Изменить</button>
                          <button className="btn btn--sm btn--delete" onClick={() => handleDelete(r.reservationId)}>🗑 Удалить</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Добавить бронирование' : 'Редактировать бронирование'} onClose={() => setModal(null)}>
          {error && <div className="error-msg">⚠ {error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Автомобиль</label>
              <select className="form-input" value={form.carId} onChange={fv('carId')}>
                {cars.map(c => <option key={c.carId} value={c.carId}>{c.brandName} {c.modelName} ({c.year})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Клиент</label>
              <select className="form-input" value={form.clientId} onChange={fv('clientId')}>
                {clients.map(c => <option key={c.clientId} value={c.clientId}>{c.lastName} {c.firstName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Дата начала</label>
              <input className="form-input" type="date" value={form.reservationDate} onChange={fv('reservationDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Дата окончания</label>
              <input className="form-input" type="date" value={form.expiryDate} onChange={fv('expiryDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Залог (руб.)</label>
              <input className="form-input" type="number" value={form.deposit} onChange={fv('deposit')} min={0} />
            </div>
          </div>
          <div className="modal__footer">
            <button className="btn btn--secondary" onClick={() => setModal(null)}>Отмена</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
