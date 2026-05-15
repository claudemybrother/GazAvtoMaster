import { useEffect, useState } from 'react'
import { testDrivesApi, carsApi, clientsApi } from '../api/endpoints'
import type { TestDriveDto, CarDto, ClientDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'
import { useAuth } from '../context/AuthContext'

const EMPTY = { carId: 0, clientId: 0, employeeId: 0, tdDate: new Date().toISOString().slice(0, 10), feedback: '' }

export default function TestDrivesPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<TestDriveDto[]>([])
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
      testDrivesApi.getAll().then(r => setRows(r.data)),
      carsApi.getAll().then(r => setCars(r.data)),
      clientsApi.getAll().then(r => setClients(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    return !q || `${r.carInfo} ${r.clientName} ${r.employeeName} ${r.feedback || ''}`.toLowerCase().includes(q)
  })

  const openAdd = () => {
    setForm({ ...EMPTY, carId: cars[0]?.carId ?? 0, clientId: clients[0]?.clientId ?? 0, employeeId: user?.employeeId ?? 0 })
    setEditId(null); setError(''); setModal('add')
  }

  const openEdit = (t: TestDriveDto) => {
    setForm({ carId: t.carId, clientId: t.clientId, employeeId: t.employeeId, tdDate: t.tdDate.slice(0, 10), feedback: t.feedback ?? '' })
    setEditId(t.tdId); setError(''); setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, tdDate: new Date(form.tdDate).toISOString() }
      if (modal === 'add') {
        const { data } = await testDrivesApi.create(payload)
        setRows(prev => [...prev, data])
      } else if (editId != null) {
        const { data } = await testDrivesApi.update(editId, payload)
        setRows(prev => prev.map(r => r.tdId === editId ? data : r))
      }
      setModal(null)
    } catch { setError('Ошибка сохранения') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить запись о тест-драйве?')) return
    await testDrivesApi.delete(id)
    setRows(prev => prev.filter(r => r.tdId !== id))
  }

  const fv = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: ['carId', 'clientId', 'employeeId'].includes(k) ? Number(e.target.value) : e.target.value }))

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 🔑 Тест-драйвы</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">🔑 Журнал тест-драйвов</span>
          <button className="btn btn--primary" onClick={openAdd}>+ Добавить тест-драйв</button>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по авто, клиенту, отзыву..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <span className="muted">Найдено: {filtered.length}</span>
          </div>
          {loading ? <div className="loading"><span className="spinner" /> Загрузка...</div> : (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr><th>#</th><th>Автомобиль</th><th>Клиент</th><th>Менеджер</th><th>Дата</th><th>Отзыв</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">Тест-драйвы не найдены</td></tr>
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
                      <td>
                        <div className="action-btns">
                          <button className="btn btn--sm btn--edit" onClick={() => openEdit(t)}>✏ Изменить</button>
                          <button className="btn btn--sm btn--delete" onClick={() => handleDelete(t.tdId)}>🗑 Удалить</button>
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
        <Modal title={modal === 'add' ? 'Добавить тест-драйв' : 'Редактировать тест-драйв'} onClose={() => setModal(null)}>
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
              <label className="form-label">Дата</label>
              <input className="form-input" type="date" value={form.tdDate} onChange={fv('tdDate')} />
            </div>
            <div className="form-group form-group--full">
              <label className="form-label">Отзыв клиента</label>
              <textarea className="form-input" value={form.feedback} onChange={fv('feedback')} rows={3} placeholder="Необязательно" />
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
