import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clientDetailsApi } from '../api/endpoints'
import type { ClientDetailsDto } from '../types'
import Layout from '../components/Layout/Layout'

const fmtDate = (s: string) => new Date(s).toLocaleDateString('ru-RU')
const fmtPrice = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export default function ClientCardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<ClientDetailsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'deals' | 'reservations' | 'testdrives'>('deals')

  useEffect(() => {
    if (!id) return
    clientDetailsApi.getDetails(Number(id))
      .then(r => setData(r.data))
      .catch(() => navigate('/clients'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <Layout>
      <div className="loading"><span className="spinner" /> Загрузка данных клиента...</div>
    </Layout>
  )

  if (!data) return null

  const { client: c, deals, reservations, testDrives } = data
  const initials = `${c.lastName[0] ?? ''}${c.firstName[0] ?? ''}`

  return (
    <Layout>
      <div className="breadcrumb">
        🏠 <a href="/">Главная</a> <span>›</span>
        👥 <a href="/clients">Клиенты</a> <span>›</span>
        {c.lastName} {c.firstName}
      </div>

      <div className="client-card-grid">
        {/* ---- LEFT: INFO ---- */}
        <div className="client-card-info">
          <div className="client-card-info__avatar">{initials}</div>
          <div className="client-card-info__name">{c.lastName} {c.firstName}</div>
          <div className="client-card-info__role">{c.patronymic}</div>

          <div className="client-card-info__row">
            <span className="client-card-info__key">📞 Телефон</span>
            <span className="client-card-info__val">{c.phone || '—'}</span>
          </div>
          <div className="client-card-info__row">
            <span className="client-card-info__key">✉️ Email</span>
            <span className="client-card-info__val">{c.email || '—'}</span>
          </div>
          <div className="client-card-info__row">
            <span className="client-card-info__key">🎂 Дата рожд.</span>
            <span className="client-card-info__val">{fmtDate(c.birthDate)}</span>
          </div>
          <div className="client-card-info__row">
            <span className="client-card-info__key">🪪 Паспорт</span>
            <span className="client-card-info__val">{c.passportSeries} {c.passportNumber}</span>
          </div>
          <div className="client-card-info__row">
            <span className="client-card-info__key">🏠 Адрес</span>
            <span className="client-card-info__val" style={{ wordBreak: 'break-word' }}>{c.address || '—'}</span>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#2563eb' }}>{deals.length}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Сделок</div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#d97706' }}>{reservations.length}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Броней</div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#7c3aed' }}>{testDrives.length}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Тест-драйвов</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn btn--secondary" style={{ width: '100%' }} onClick={() => navigate('/clients')}>
              ← Назад к списку
            </button>
          </div>
        </div>

        {/* ---- RIGHT: TABS ---- */}
        <div className="client-card-tabs">
          <div className="tabs">
            <button className={`tab${tab === 'deals' ? ' active' : ''}`} onClick={() => setTab('deals')}>
              💼 Сделки ({deals.length})
            </button>
            <button className={`tab${tab === 'reservations' ? ' active' : ''}`} onClick={() => setTab('reservations')}>
              📋 Брони ({reservations.length})
            </button>
            <button className={`tab${tab === 'testdrives' ? ' active' : ''}`} onClick={() => setTab('testdrives')}>
              🔑 Тест-драйвы ({testDrives.length})
            </button>
          </div>

          <div className="tab-content">
            {tab === 'deals' && (
              deals.length === 0
                ? <div className="empty-state">Сделки не найдены</div>
                : <div className="forum-table-wrap">
                    <table className="forum-table">
                      <thead>
                        <tr><th>#</th><th>Автомобиль</th><th>Дата</th><th>Сумма</th><th>Оплата</th><th>Менеджер</th></tr>
                      </thead>
                      <tbody>
                        {deals.map(d => (
                          <tr key={d.dealId}>
                            <td className="muted">{d.dealId}</td>
                            <td>{d.carInfo}</td>
                            <td className="muted">{fmtDate(d.dealDate)}</td>
                            <td className="price">{fmtPrice(d.finalPrice)}</td>
                            <td><span className="badge badge--info">{d.paymentType}</span></td>
                            <td className="muted">{d.employeeName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            )}

            {tab === 'reservations' && (
              reservations.length === 0
                ? <div className="empty-state">Бронирования не найдены</div>
                : <div className="forum-table-wrap">
                    <table className="forum-table">
                      <thead>
                        <tr><th>#</th><th>Автомобиль</th><th>Начало</th><th>Истекает</th><th>Залог</th><th>Статус</th></tr>
                      </thead>
                      <tbody>
                        {reservations.map(r => {
                          const expired = new Date(r.expiryDate) < new Date()
                          return (
                            <tr key={r.reservationId}>
                              <td className="muted">{r.reservationId}</td>
                              <td>{r.carInfo}</td>
                              <td className="muted">{fmtDate(r.reservationDate)}</td>
                              <td className="muted">{fmtDate(r.expiryDate)}</td>
                              <td className="price">{fmtPrice(r.deposit)}</td>
                              <td>
                                {expired
                                  ? <span className="badge badge--sold">Истекла</span>
                                  : <span className="badge badge--available">Активна</span>}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
            )}

            {tab === 'testdrives' && (
              testDrives.length === 0
                ? <div className="empty-state">Тест-драйвы не найдены</div>
                : <div className="forum-table-wrap">
                    <table className="forum-table">
                      <thead>
                        <tr><th>#</th><th>Автомобиль</th><th>Дата</th><th>Менеджер</th><th>Отзыв</th></tr>
                      </thead>
                      <tbody>
                        {testDrives.map(t => (
                          <tr key={t.tdId}>
                            <td className="muted">{t.tdId}</td>
                            <td>{t.carInfo}</td>
                            <td className="muted">{fmtDate(t.tdDate)}</td>
                            <td className="muted">{t.employeeName}</td>
                            <td style={{ fontStyle: t.feedback ? 'normal' : 'italic', color: t.feedback ? 'inherit' : '#94a3b8' }}>
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
      </div>
    </Layout>
  )
}
