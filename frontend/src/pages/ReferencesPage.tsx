import { useEffect, useState } from 'react'
import { refsApi } from '../api/endpoints'
import type { BrandDto, ModelDto } from '../types'
import Layout from '../components/Layout/Layout'
import Modal from '../components/UI/Modal'

// ─── Brand form ───────────────────────────────────────────
const EMPTY_BRAND = { brandName: '', country: '' }
// ─── Model form ───────────────────────────────────────────
const EMPTY_MODEL = { brandId: 0, modelName: '', bodyType: '', engineVol: '', fuelType: '' }

type Tab = 'brands' | 'models'
type ModalMode = 'add' | 'edit' | null

export default function ReferencesPage() {
  const [tab, setTab] = useState<Tab>('brands')

  // ── data ────────────────────────────────────────────────
  const [brands, setBrands]   = useState<BrandDto[]>([])
  const [models, setModels]   = useState<ModelDto[]>([])
  const [loading, setLoading] = useState(true)

  // ── brand modal ─────────────────────────────────────────
  const [bModal, setBModal]   = useState<ModalMode>(null)
  const [bForm,  setBForm]    = useState(EMPTY_BRAND)
  const [bEditId, setBEditId] = useState<number | null>(null)
  const [bError,  setBError]  = useState('')
  const [bSaving, setBSaving] = useState(false)

  // ── model modal ─────────────────────────────────────────
  const [mModal, setMModal]   = useState<ModalMode>(null)
  const [mForm,  setMForm]    = useState(EMPTY_MODEL)
  const [mEditId, setMEditId] = useState<number | null>(null)
  const [mError,  setMError]  = useState('')
  const [mSaving, setMSaving] = useState(false)

  // ── search ───────────────────────────────────────────────
  const [bSearch, setBSearch] = useState('')
  const [mSearch, setMSearch] = useState('')

  useEffect(() => {
    Promise.all([
      refsApi.getBrands().then(r => setBrands(r.data)),
      refsApi.getModels().then(r => setModels(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  // ═══════════════════════════════════════════════════════
  //  BRANDS
  // ═══════════════════════════════════════════════════════
  const openAddBrand = () => {
    setBForm(EMPTY_BRAND)
    setBEditId(null)
    setBError('')
    setBModal('add')
  }

  const openEditBrand = (b: BrandDto) => {
    setBForm({ brandName: b.brandName, country: b.country })
    setBEditId(b.brandId)
    setBError('')
    setBModal('edit')
  }

  const saveBrand = async () => {
    if (!bForm.brandName.trim()) { setBError('Введите название марки'); return }
    setBSaving(true); setBError('')
    try {
      if (bModal === 'add') {
        const { data } = await refsApi.createBrand(bForm)
        setBrands(prev => [...prev, data].sort((a, b) => a.brandName.localeCompare(b.brandName, 'ru')))
      } else if (bEditId != null) {
        const { data } = await refsApi.updateBrand(bEditId, bForm)
        setBrands(prev => prev.map(b => b.brandId === bEditId ? data : b))
      }
      setBModal(null)
    } catch (err: any) {
      setBError(err.response?.data?.message || 'Ошибка сохранения')
    } finally {
      setBSaving(false)
    }
  }

  const deleteBrand = async (id: number, name: string) => {
    if (!confirm(`Удалить марку «${name}»?`)) return
    try {
      await refsApi.deleteBrand(id)
      setBrands(prev => prev.filter(b => b.brandId !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления')
    }
  }

  const filteredBrands = brands.filter(b =>
    b.brandName.toLowerCase().includes(bSearch.toLowerCase()) ||
    b.country.toLowerCase().includes(bSearch.toLowerCase())
  )

  // ═══════════════════════════════════════════════════════
  //  MODELS
  // ═══════════════════════════════════════════════════════
  const openAddModel = () => {
    setMForm({ ...EMPTY_MODEL, brandId: brands[0]?.brandId ?? 0 })
    setMEditId(null)
    setMError('')
    setMModal('add')
  }

  const openEditModel = (m: ModelDto) => {
    setMForm({
      brandId: m.brandId,
      modelName: m.modelName,
      bodyType: m.bodyType,
      engineVol: String(m.engineVol),
      fuelType: m.fuelType,
    })
    setMEditId(m.modelId)
    setMError('')
    setMModal('edit')
  }

  const saveModel = async () => {
    if (!mForm.modelName.trim()) { setMError('Введите название модели'); return }
    if (!mForm.brandId) { setMError('Выберите марку'); return }
    setMSaving(true); setMError('')
    try {
      const payload = { ...mForm, engineVol: Number(mForm.engineVol) }
      if (mModal === 'add') {
        const { data } = await refsApi.createModel(payload)
        setModels(prev => [...prev, data])
      } else if (mEditId != null) {
        const { data } = await refsApi.updateModel(mEditId, payload)
        setModels(prev => prev.map(m => m.modelId === mEditId ? data : m))
      }
      setMModal(null)
    } catch (err: any) {
      setMError(err.response?.data?.message || 'Ошибка сохранения')
    } finally {
      setMSaving(false)
    }
  }

  const deleteModel = async (id: number, name: string) => {
    if (!confirm(`Удалить модель «${name}»?`)) return
    try {
      await refsApi.deleteModel(id)
      setModels(prev => prev.filter(m => m.modelId !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления')
    }
  }

  const filteredModels = models.filter(m =>
    m.modelName.toLowerCase().includes(mSearch.toLowerCase()) ||
    m.brandName.toLowerCase().includes(mSearch.toLowerCase()) ||
    m.bodyType.toLowerCase().includes(mSearch.toLowerCase()) ||
    m.fuelType.toLowerCase().includes(mSearch.toLowerCase())
  )

  // ─── helpers ────────────────────────────────────────────
  const bf = (k: keyof typeof bForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBForm(prev => ({ ...prev, [k]: e.target.value }))

  const mf = (k: keyof typeof mForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setMForm(prev => ({ ...prev, [k]: k === 'brandId' ? Number(e.target.value) : e.target.value }))

  // ═══════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <Layout>
      <div className="breadcrumb">
        🏠 <a href="/">Главная</a> <span>›</span> 🗂 Справочники
      </div>

      <div className="forum-panel">
        <div className="forum-panel__header">
          <span className="forum-panel__title">🗂 Справочники</span>
        </div>

        {/* Tabs */}
        <div className="ref-tabs">
          <button
            className={`ref-tab${tab === 'brands' ? ' ref-tab--active' : ''}`}
            onClick={() => setTab('brands')}
          >
            🏷 Марки автомобилей
          </button>
          <button
            className={`ref-tab${tab === 'models' ? ' ref-tab--active' : ''}`}
            onClick={() => setTab('models')}
          >
            🚗 Модели автомобилей
          </button>
        </div>

        <div className="forum-panel__body">
          {loading ? (
            <div className="loading"><span className="spinner" /> Загрузка...</div>
          ) : tab === 'brands' ? (
            <>
              {/* ── Brands ── */}
              <div className="table-toolbar">
                <input
                  className="form-input search-input"
                  placeholder="🔍 Поиск по марке или стране..."
                  value={bSearch}
                  onChange={e => setBSearch(e.target.value)}
                />
                <button className="btn btn--primary" onClick={openAddBrand}>+ Добавить марку</button>
              </div>

              <div className="forum-table-wrap">
                <table className="forum-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Название марки</th>
                      <th>Страна</th>
                      <th>Кол-во моделей</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrands.length === 0 ? (
                      <tr><td colSpan={5} className="empty-state">Нет марок</td></tr>
                    ) : filteredBrands.map(b => (
                      <tr key={b.brandId}>
                        <td className="muted">{b.brandId}</td>
                        <td><b>{b.brandName}</b></td>
                        <td>{b.country}</td>
                        <td className="muted">
                          {models.filter(m => m.brandId === b.brandId).length}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn--sm btn--edit" onClick={() => openEditBrand(b)}>✏ Изменить</button>
                            <button className="btn btn--sm btn--delete" onClick={() => deleteBrand(b.brandId, b.brandName)}>🗑 Удалить</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              {/* ── Models ── */}
              <div className="table-toolbar">
                <input
                  className="form-input search-input"
                  placeholder="🔍 Поиск по модели, марке, кузову..."
                  value={mSearch}
                  onChange={e => setMSearch(e.target.value)}
                />
                <button className="btn btn--primary" onClick={openAddModel}>+ Добавить модель</button>
              </div>

              <div className="forum-table-wrap">
                <table className="forum-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Марка</th>
                      <th>Модель</th>
                      <th>Тип кузова</th>
                      <th>Объём, л</th>
                      <th>Топливо</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.length === 0 ? (
                      <tr><td colSpan={7} className="empty-state">Нет моделей</td></tr>
                    ) : filteredModels.map(m => (
                      <tr key={m.modelId}>
                        <td className="muted">{m.modelId}</td>
                        <td>{m.brandName}</td>
                        <td><b>{m.modelName}</b></td>
                        <td>{m.bodyType}</td>
                        <td>{m.engineVol}</td>
                        <td>{m.fuelType}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn--sm btn--edit" onClick={() => openEditModel(m)}>✏ Изменить</button>
                            <button className="btn btn--sm btn--delete" onClick={() => deleteModel(m.modelId, m.modelName)}>🗑 Удалить</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ Brand Modal ══════════════════════════════════ */}
      {bModal && (
        <Modal
          title={bModal === 'add' ? '➕ Добавить марку' : '✏ Редактировать марку'}
          onClose={() => setBModal(null)}
        >
          {bError && <div className="error-msg">⚠ {bError}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Название марки *</label>
              <input className="form-input" placeholder="Например: ГАЗ" value={bForm.brandName} onChange={bf('brandName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Страна</label>
              <input className="form-input" placeholder="Например: Россия" value={bForm.country} onChange={bf('country')} />
            </div>
          </div>
          <div className="modal__footer">
            <button className="btn btn--secondary" onClick={() => setBModal(null)}>Отмена</button>
            <button className="btn btn--primary" onClick={saveBrand} disabled={bSaving}>
              {bSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </Modal>
      )}

      {/* ══ Model Modal ══════════════════════════════════ */}
      {mModal && (
        <Modal
          title={mModal === 'add' ? '➕ Добавить модель' : '✏ Редактировать модель'}
          onClose={() => setMModal(null)}
        >
          {mError && <div className="error-msg">⚠ {mError}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Марка *</label>
              <select className="form-input" value={mForm.brandId} onChange={mf('brandId')}>
                {brands.map(b => (
                  <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Название модели *</label>
              <input className="form-input" placeholder="Например: Газель Next" value={mForm.modelName} onChange={mf('modelName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Тип кузова</label>
              <input className="form-input" placeholder="Например: Фургон" value={mForm.bodyType} onChange={mf('bodyType')} />
            </div>
            <div className="form-group">
              <label className="form-label">Объём двигателя (л)</label>
              <input className="form-input" type="number" step="0.1" min="0" placeholder="2.7" value={mForm.engineVol} onChange={mf('engineVol')} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Тип топлива</label>
              <select className="form-input" value={mForm.fuelType} onChange={mf('fuelType')}>
                <option value="">— выберите —</option>
                <option>Бензин</option>
                <option>Дизель</option>
                <option>Газ</option>
                <option>Гибрид</option>
                <option>Электро</option>
              </select>
            </div>
          </div>
          <div className="modal__footer">
            <button className="btn btn--secondary" onClick={() => setMModal(null)}>Отмена</button>
            <button className="btn btn--primary" onClick={saveModel} disabled={mSaving}>
              {mSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
