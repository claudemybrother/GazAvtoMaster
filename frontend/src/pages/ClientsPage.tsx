import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientsApi } from '../api/endpoints'
import type { ClientDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'

const EMPTY = {
  lastName: '', firstName: '', patronymic: '', phone: '', email: '',
  passportSeries: '', passportNumber: '', birthDate: '1990-01-01', address: ''
}

export default function ClientsPage() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<ClientDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    clientsApi.getAll().then(r => setClients(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    return !q || `${c.lastName} ${c.firstName} ${c.patronymic} ${c.phone} ${c.email}`.toLowerCase().includes(q)
  })

  const age = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24 * 365.25))

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(''); setModal('add') }

  const openEdit = (c: ClientDto) => {
    setForm({
      lastName: c.lastName, firstName: c.firstName, patronymic: c.patronymic,
      phone: c.phone, email: c.email, passportSeries: c.passportSeries,
      passportNumber: c.passportNumber, birthDate: c.birthDate.slice(0, 10), address: c.address
    })
    setEditId(c.clientId); setError(''); setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, birthDate: new Date(form.birthDate).toISOString() }
      if (modal === 'add') {
        const { data } = await clientsApi.create(payload)
        setClients(prev => [...prev, data])
      } else if (editId != null) {
        const { data } = await clientsApi.update(editId, payload)
        setClients(prev => prev.map(c => c.clientId === editId ? data : c))
      }
      setModal(null)
    } catch { setError('Ошибка сохранения') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить клиента?')) return
    await clientsApi.delete(id)
    setClients(prev => prev.filter(c => c.clientId !== id))
  }

  const fv = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 👥 Клиенты</div>
      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">👥 Клиентская база</span>
          <button className="btn btn--primary" onClick={openAdd}>+ Добавить клиента</button>
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
                    <th>Паспорт</th><th>Возраст</th><th>Адрес</th><th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="empty-state">Клиенты не найдены</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.clientId}>
                      <td className="muted">{c.clientId}</td>
                      <td><b>{c.lastName}</b> {c.firstName} {c.patronymic}</td>
                      <td><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                      <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{c.passportSeries} {c.passportNumber}</td>
                      <td className="muted">{age(c.birthDate)} лет</td>
                      <td className="muted" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn--sm btn--edit" onClick={() => navigate(`/clients/${c.clientId}`)}>👤 Карточка</button>
                          <button className="btn btn--sm btn--edit" onClick={() => openEdit(c)}>✏ Изменить</button>
                          <button className="btn btn--sm btn--delete" onClick={() => handleDelete(c.clientId)}>🗑 Удалить</button>
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
        <Modal title={modal === 'add' ? 'Добавить клиента' : 'Редактировать клиента'} onClose={() => setModal(null)}>
          {error && <div className="error-msg">⚠ {error}</div>}
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Фамилия</label><input className="form-input" value={form.lastName} onChange={fv('lastName')} /></div>
            <div className="form-group"><label className="form-label">Имя</label><input className="form-input" value={form.firstName} onChange={fv('firstName')} /></div>
            <div className="form-group"><label className="form-label">Отчество</label><input className="form-input" value={form.patronymic} onChange={fv('patronymic')} /></div>
            <div className="form-group"><label className="form-label">Телефон</label><input className="form-input" value={form.phone} onChange={fv('phone')} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={fv('email')} /></div>
            <div className="form-group"><label className="form-label">Серия паспорта</label><input className="form-input" value={form.passportSeries} onChange={fv('passportSeries')} maxLength={4} /></div>
            <div className="form-group"><label className="form-label">Номер паспорта</label><input className="form-input" value={form.passportNumber} onChange={fv('passportNumber')} maxLength={6} /></div>
            <div className="form-group"><label className="form-label">Дата рождения</label><input className="form-input" type="date" value={form.birthDate} onChange={fv('birthDate')} /></div>
            <div className="form-group form-group--full"><label className="form-label">Адрес</label><input className="form-input" value={form.address} onChange={fv('address')} /></div>
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
