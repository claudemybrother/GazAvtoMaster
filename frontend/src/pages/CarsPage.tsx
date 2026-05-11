import { useEffect, useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { carsApi } from '../api/endpoints'
import type { CarDto } from '../types'
import Layout from '../components/Layout/Layout'

const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const STATUS_MAP: Record<number, { label: string; badge: string; col: string }> = {
  1: { label: 'В наличии',    badge: 'badge--available', col: 'available' },
  2: { label: 'Зарезервирован', badge: 'badge--reserved', col: 'reserved' },
  3: { label: 'Продан',       badge: 'badge--sold',      col: 'sold' },
}

function KanbanCard({ car }: { car: CarDto }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: car.carId })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}`}
      {...attributes} {...listeners}
    >
      <div className="kanban-card__title">{car.brandName} {car.modelName}</div>
      <div className="kanban-card__meta">
        📅 {car.year} · 🎨 {car.color}<br />
        🛣️ {car.mileage.toLocaleString('ru-RU')} км<br />
        VIN: <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{car.vin.slice(-6)}</span>
      </div>
      <div className="kanban-card__price">{fmtPrice(car.price)}</div>
    </div>
  )
}

export default function CarsPage() {
  const [cars, setCars] = useState<CarDto[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'table' | 'kanban'>('table')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState(0)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    carsApi.getAll().then(r => setCars(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = cars.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || `${c.brandName} ${c.modelName} ${c.vin} ${c.color}`.toLowerCase().includes(q)
    const matchStatus = !filterStatus || c.statusId === filterStatus
    return matchSearch && matchStatus
  })

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    // over.id может быть column id (число — statusId) или carId
    const newStatusId = typeof over.id === 'string' && over.id.startsWith('col-')
      ? parseInt(over.id.replace('col-', ''))
      : null
    if (!newStatusId) return
    const carId = active.id as number
    setCars(prev => prev.map(c => c.carId === carId ? { ...c, statusId: newStatusId, statusName: STATUS_MAP[newStatusId].label } : c))
    await carsApi.updateStatus(carId, newStatusId)
  }

  const columns = [1, 2, 3]

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 🚗 Автомобили</div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">🚗 Реестр автомобилей</span>
          <div className="view-toggle">
            <button className={`view-toggle__btn${view === 'table' ? ' active' : ''}`} onClick={() => setView('table')}>☰ Таблица</button>
            <button className={`view-toggle__btn${view === 'kanban' ? ' active' : ''}`} onClick={() => setView('kanban')}>⊞ Канбан</button>
          </div>
        </div>
        <div className="forum-panel__body">
          <div className="toolbar">
            <input className="toolbar__search" placeholder="🔍 Поиск по марке, модели, VIN..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="toolbar__select" value={filterStatus} onChange={e => setFilterStatus(Number(e.target.value))}>
              <option value={0}>Все статусы</option>
              <option value={1}>В наличии</option>
              <option value={2}>Зарезервирован</option>
              <option value={3}>Продан</option>
            </select>
            <span className="muted">Найдено: {filtered.length}</span>
          </div>

          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : view === 'table' ? (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>#</th><th>Марка / Модель</th><th>Год</th><th>Цвет</th>
                    <th>Пробег</th><th>Цена</th><th>Статус</th>
                    <th>Дата поступления</th><th>VIN</th>
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
                      <td><span className={`badge ${STATUS_MAP[c.statusId]?.badge}`}>{c.statusName}</span></td>
                      <td className="muted">{new Date(c.arrivalDate).toLocaleDateString('ru-RU')}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{c.vin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="kanban-board">
                {columns.map(statusId => {
                  const colCars = filtered.filter(c => c.statusId === statusId)
                  const info = STATUS_MAP[statusId]
                  return (
                    <div key={statusId} className={`kanban-col kanban-col--${info.col}`}>
                      <div className="kanban-col__header">
                        {info.label}
                        <span className="kanban-col__count">{colCars.length}</span>
                      </div>
                      <div className="kanban-col__body">
                        <SortableContext items={colCars.map(c => c.carId)} strategy={verticalListSortingStrategy}>
                          {colCars.map(c => <KanbanCard key={c.carId} car={c} />)}
                        </SortableContext>
                        {colCars.length === 0 && <div className="empty-state" style={{ padding: 16 }}>Пусто</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </DndContext>
          )}
        </div>
      </div>
    </Layout>
  )
}
