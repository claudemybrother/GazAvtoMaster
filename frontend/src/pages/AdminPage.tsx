import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeesApi, refsApi } from '../api/endpoints'
import type { EmployeeDto, RoleDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'
import { useAuth } from '../context/AuthContext'

const EMPTY = {
  lastName: '', firstName: '', patronymic: '',
  roleId: 1, phone: '', email: '',
  hireDate: new Date().toISOString().slice(0, 10),
  login: '', password: ''
}

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<EmployeeDto[]>([])
  const [roles, setRoles] = useState<RoleDto[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'Администратор') { navigate('/'); return }
    Promise.all([
      employeesApi.getAll().then(r => setEmployees(r.data)),
      refsApi.getRoles().then(r => setRoles(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const openAdd = () => {
    setForm({ ...EMPTY, roleId: roles[0]?.roleId ?? 1 })
    setEditId(null)
    setError('')
    setModal('add')
  }

  const openEdit = (e: EmployeeDto) => {
    setForm({
      lastName: e.lastName, firstName: e.firstName, patronymic: e.patronymic,
      roleId: e.roleId, phone: e.phone, email: e.email,
      hireDate: e.hireDate.slice(0, 10), login: e.login, password: ''
    })
    setEditId(e.employeeId)
    setError('')
    setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, hireDate: new Date(form.hireDate).toISOString() }
      if (modal === 'add') {
        const { data } = await employeesApi.create(payload)
        setEmployees(prev => [...prev, data])
      } else if (editId != null) {
        const { data } = await employeesApi.update(editId, payload)
        setEmployees(prev => prev.map(e => e.employeeId === editId ? data : e))
      }
      setModal(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить сотрудника?')) return
    await employeesApi.delete(id)
    setEmployees(prev => prev.filter(e => e.employeeId !== id))
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: k === 'roleId' ? Number(e.target.value) : e.target.value }))

  return (
    <Layout>
      <div className="breadcrumb">🏠 <a href="/">Главная</a> <span>›</span> 👔 Управление сотрудниками</div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">👔 Сотрудники</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn--secondary" onClick={() => navigate('/admin/audit')}>📜 Журнал аудита</button>
            <button className="btn btn--secondary" onClick={() => navigate('/admin/references')}>🗂 Справочники</button>
            <button className="btn btn--primary" onClick={openAdd}>+ Добавить сотрудника</button>
          </div>
        </div>
        <div className="forum-panel__body">
          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : (
            <div className="forum-table-wrap">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>#</th><th>ФИО</th><th>Роль</th><th>Телефон</th>
                    <th>Email</th><th>Логин</th><th>Принят</th><th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr><td colSpan={8} className="empty-state">Нет сотрудников</td></tr>
                  ) : employees.map(e => (
                    <tr key={e.employeeId}>
                      <td className="muted">{e.employeeId}</td>
                      <td><b>{e.lastName}</b> {e.firstName} {e.patronymic}</td>
                      <td><span className={`badge ${e.roleName === 'Администратор' ? 'badge--available' : 'badge--info'}`}>{e.roleName}</span></td>
                      <td>{e.phone}</td>
                      <td>{e.email}</td>
                      <td style={{ fontFamily: 'monospace' }}>{e.login}</td>
                      <td className="muted">{new Date(e.hireDate).toLocaleDateString('ru-RU')}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn--sm btn--edit" onClick={() => openEdit(e)}>✏ Изменить</button>
                          <button className="btn btn--sm btn--delete" onClick={() => handleDelete(e.employeeId)}>🗑 Удалить</button>
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
        <Modal title={modal === 'add' ? 'Добавить сотрудника' : 'Редактировать сотрудника'} onClose={() => setModal(null)}>
          {error && <div className="error-msg">⚠ {error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Фамилия</label>
              <input className="form-input" value={form.lastName} onChange={f('lastName')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Имя</label>
              <input className="form-input" value={form.firstName} onChange={f('firstName')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Отчество</label>
              <input className="form-input" value={form.patronymic} onChange={f('patronymic')} />
            </div>
            <div className="form-group">
              <label className="form-label">Роль</label>
              <select className="form-input" value={form.roleId} onChange={f('roleId')}>
                {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input className="form-input" value={form.phone} onChange={f('phone')} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={f('email')} />
            </div>
            <div className="form-group">
              <label className="form-label">Дата приёма</label>
              <input className="form-input" type="date" value={form.hireDate} onChange={f('hireDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Логин</label>
              <input className="form-input" value={form.login} onChange={f('login')} required />
            </div>
            <div className="form-group">
              <label className="form-label">{modal === 'edit' ? 'Новый пароль (если меняется)' : 'Пароль'}</label>
              <input className="form-input" type="password" value={form.password} onChange={f('password')} />
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
