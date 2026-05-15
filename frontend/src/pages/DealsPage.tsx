import { useEffect, useState } from 'react'
import { dealsApi, carsApi, clientsApi, employeesApi } from '../api/endpoints'
import type { DealDto, CarDto, ClientDto, EmployeeDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'
import { useAuth } from '../context/AuthContext'

const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
const PAYMENT_BADGE: Record<string, string> = { 'Наличные': 'badge--available', 'Кредит': 'badge--reserved', 'Лизинг': 'badge--sold' }
const PAYMENTS = ['Наличные', 'Кредит', 'Лизинг']

const EMPTY = { carId: 0, clientId: 0, employeeId: 0, dealDate: new Date().toISOString().slice(0, 10), finalPrice: 0, paymentType: 'Наличные', notes: '' }

export default function DealsPage() {
  const { user } = useAuth()
  const [deals, setDeals] = useState<DealDto[]>([])
  const [cars, setCars] = useState<CarDto[]>([])
  const [clients, setClients] = useState<ClientDto[]>([])
  const [employees, setEmployees] = useState<EmployeeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      dealsApi.getAll().then(r => setDeals(r.data)),
      carsApi.getAll().then(r => setCars(r.data)),
      clientsApi.getAll().then(r => setClients(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = deals.filter(d => {
    const q = search.toLowerCase()
    return !q || `${d.carInfo} ${d.clientName} ${d.employeeName} ${d.paymentType}`.toLowerCase().includes(q)
  })

  const openAdd = () => {
    setForm({ ...EMPTY, carId: cars[0]?.carId ?? 0, clientId: clients[0]?.clientId ?? 0, employeeId: user?.employeeId ?? 0 })
    setEditId(null); setError(''); setModal('add')
  }

  const openEdit = (d: DealDto) => {
    setForm({ carId: d.carId, clientId: d.clientId, employeeId: d.employeeId, dealDate: d.dealDate.slice(0, 10), finalPrice: d.finalPrice, paymentType: d.paymentType, notes: d.notes ?? '' })
    setEditId(d.dealId); setError(''); setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, dealDate: new Date(form.dealDate).toISOString() }
      if (modal === 'add') {
        const { data } = await dealsApi.create(payload)
        setDeals(prev => [...prev, data])
      } else if (editId != null) {
        const { data } = await dealsApi.update(editId, payload)
        setDeals(prev => prev.map(d => d.dealId === editId ? data : d))
      }
      setModal(null)
    } catch { setError('Ошибка сохранения') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить сделку?')) return
    await dealsApi.delete(id)
    setDeals(prev => prev.filter(d => d.dealId !== id))
  }

  const fv = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: ['carId', 'clientId', 'employeeId'].includes(k) ? Number(e.target.value) : k === 'finalPrice' ? parseFloat(e.target.value) || 0 : e.target.value }))

  const total = filtered.reduce((s, d) => s + d.finalPrice, 0)

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 💼 Сделки</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">💼 Журнал сделок</span>
          <button className="btn btn--primary" onClick={openAdd}>+ Добавить сделку</button>
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
                  <tr><th>#</th><th>Автомобиль</th><th>Клиент</th><th>Менеджер</th><th>Дата</th><th>Сумма</th><th>Оплата</th><th>Примечание</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="empty-state">Сделки не найдены</td></tr>
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
                      <td>
                        <div className="action-btns">
                          <button className="btn btn--sm btn--edit" onClick={() => openEdit(d)}>✏ Изменить</button>
                          <button className="btn btn--sm btn--delete" onClick={() => handleDelete(d.dealId)}>🗑 Удалить</button>
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
        <Modal title={modal === 'add' ? 'Добавить сделку' : 'Редактировать сделку'} onClose={() => setModal(null)}>
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
              <label className="form-label">Дата сделки</label>
              <input className="form-input" type="date" value={form.dealDate} onChange={fv('dealDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Сумма (руб.)</label>
              <input className="form-input" type="number" value={form.finalPrice} onChange={fv('finalPrice')} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Способ оплаты</label>
              <select className="form-input" value={form.paymentType} onChange={fv('paymentType')}>
                {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group form-group--full">
              <label className="form-label">Примечания</label>
              <input className="form-input" value={form.notes} onChange={fv('notes')} />
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
