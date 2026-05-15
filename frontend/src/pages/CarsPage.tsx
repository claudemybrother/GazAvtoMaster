import { useEffect, useState } from 'react'
import { carsApi, refsApi } from '../api/endpoints'
import type { CarDto, ModelDto, StatusDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'

const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const STATUS_CLASS: Record<number, string> = { 1: 'badge--available', 2: 'badge--reserved', 3: 'badge--sold' }

const EMPTY_FORM = { vin: '', modelId: 0, year: new Date().getFullYear(), color: '', mileage: 0, price: 0, statusId: 1, arrivalDate: new Date().toISOString().slice(0, 10), notes: '' }

export default function CarsPage() {
  const [cars, setCars] = useState<CarDto[]>([])
  const [models, setModels] = useState<ModelDto[]>([])
  const [statuses, setStatuses] = useState<StatusDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState(0)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      carsApi.getAll().then(r => setCars(r.data)),
      refsApi.getModels().then(r => setModels(r.data)),
      refsApi.getStatuses().then(r => setStatuses(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = cars.filter(c => {
    const q = search.toLowerCase()
    return (!q || `${c.brandName} ${c.modelName} ${c.vin} ${c.color}`.toLowerCase().includes(q))
      && (!filterStatus || c.statusId === filterStatus)
  })

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, modelId: models[0]?.modelId ?? 0 })
    setEditId(null); setError(''); setModal('add')
  }

  const openEdit = (c: CarDto) => {
    setForm({
      vin: c.vin, modelId: c.modelId, year: c.year, color: c.color,
      mileage: c.mileage, price: c.price, statusId: c.statusId,
      arrivalDate: c.arrivalDate.slice(0, 10), notes: c.notes ?? ''
    })
    setEditId(c.carId); setError(''); setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, arrivalDate: new Date(form.arrivalDate).toISOString() }
      if (modal === 'add') {
        const { data } = await carsApi.create(payload)
        setCars(prev => [...prev, data])
      } else if (editId != null) {
        const { data } = await carsApi.update(editId, payload)
        setCars(prev => prev.map(c => c.carId === editId ? data : c))
      }
      setModal(null)
    } catch { setError('Ошибка сохранения') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить автомобиль?')) return
    await carsApi.delete(id)
    setCars(prev => prev.filter(c => c.carId !== id))
  }

  const fv = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: ['modelId', 'year', 'mileage', 'statusId'].includes(k) ? Number(e.target.value) : k === 'price' ? parseFloat(e.target.value) || 0 : e.target.value }))

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 🚗 Автомобили</div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">🚗 Реестр автомобилей</span>
          <button className="btn btn--primary" onClick={openAdd}>+ Добавить автомобиль</button>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по марке, модели, VIN..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="toolbar__select" value={filterStatus} onChange={e => setFilterStatus(Number(e.target.value))}>
              <option value={0}>Все статусы</option>
              {statuses.map(s => <option key={s.statusId} value={s.statusId}>{s.statusName}</option>)}
            </select>
            <span className="muted">Найдено: {filtered.length}</span>
          </div>

          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>#</th><th>Марка / Модель</th><th>Год</th><th>Цвет</th>
                    <th>Пробег</th><th>Цена</th><th>Статус</th><th>VIN</th><th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="empty-state">Автомобили не найдены</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.carId}>
                      <td className="muted">{c.carId}</td>
                      <td><b>{c.brandName}</b> {c.modelName}</td>
                      <td>{c.year}</td>
                      <td>{c.color}</td>
                      <td>{c.mileage === 0 ? <span className="badge badge--info">Новый</span> : `${c.mileage.toLocaleString('ru-RU')} км`}</td>
                      <td className="price">{fmtPrice(c.price)}</td>
                      <td><span className={`badge ${STATUS_CLASS[c.statusId]}`}>{c.statusName}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{c.vin}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn--sm btn--edit" onClick={() => openEdit(c)}>✏ Изменить</button>
                          <button className="btn btn--sm btn--delete" onClick={() => handleDelete(c.carId)}>🗑 Удалить</button>
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
        <Modal title={modal === 'add' ? 'Добавить автомобиль' : 'Редактировать автомобиль'} onClose={() => setModal(null)}>
          {error && <div className="error-msg">⚠ {error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">VIN</label>
              <input className="form-input" value={form.vin} onChange={fv('vin')} maxLength={17} placeholder="17 символов" />
            </div>
            <div className="form-group">
              <label className="form-label">Модель</label>
              <select className="form-input" value={form.modelId} onChange={fv('modelId')}>
                {models.length === 0
                  ? <option value={0}>— нет моделей —</option>
                  : Object.entries(
                      models.reduce<Record<string, typeof models>>((acc, m) => {
                        (acc[m.brandName] ??= []).push(m)
                        return acc
                      }, {})
                    ).map(([brand, list]) => (
                      <optgroup key={brand} label={brand}>
                        {list.map(m => (
                          <option key={m.modelId} value={m.modelId}>{m.modelName}</option>
                        ))}
                      </optgroup>
                    ))
                }
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Год</label>
              <input className="form-input" type="number" value={form.year} onChange={fv('year')} min={1990} max={2030} />
            </div>
            <div className="form-group">
              <label className="form-label">Цвет</label>
              <input className="form-input" value={form.color} onChange={fv('color')} />
            </div>
            <div className="form-group">
              <label className="form-label">Пробег (км)</label>
              <input className="form-input" type="number" value={form.mileage} onChange={fv('mileage')} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Цена (руб.)</label>
              <input className="form-input" type="number" value={form.price} onChange={fv('price')} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Статус</label>
              <select className="form-input" value={form.statusId} onChange={fv('statusId')}>
                {statuses.map(s => <option key={s.statusId} value={s.statusId}>{s.statusName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Дата поступления</label>
              <input className="form-input" type="date" value={form.arrivalDate} onChange={fv('arrivalDate')} />
            </div>
            <div className="form-group form-group--full">
              <label className="form-label">Примечания</label>
              <textarea className="form-input" value={form.notes} onChange={fv('notes')} rows={2} />
            </div>
          </div>
          <div className="modal__footer">
            <button className="btn btn--secondary" onClick={() => setModal(null)}>Отмена</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
