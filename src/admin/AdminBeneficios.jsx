import React, { useState } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useBeneficios } from '../hooks/useBeneficios'

const CATEGORIAS = [
  { value: 'salud', label: '🏥 Salud' },
  { value: 'vivienda', label: '🏠 Vivienda' },
  { value: 'economico', label: '💰 Económico' },
  { value: 'recreacion', label: '🎭 Recreación' },
  { value: 'transporte', label: '🚌 Transporte' },
]

const EMPTY_FORM = {
  titulo: '', descripcion: '', categoria: 'salud',
  requisitos: '', comoPostular: '', contacto: '', activo: true, orden: 0,
}

export default function AdminBeneficios() {
  const { beneficios, loading } = useBeneficios()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openNew() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(b) {
    setForm({
      titulo: b.titulo || '',
      descripcion: b.descripcion || '',
      categoria: b.categoria || 'salud',
      requisitos: Array.isArray(b.requisitos) ? b.requisitos.join('\n') : b.requisitos || '',
      comoPostular: b.comoPostular || '',
      contacto: b.contacto || '',
      activo: b.activo !== false,
      orden: b.orden || 0,
    })
    setEditId(b.id)
    setShowForm(true)
    setError('')
    window.scrollTo(0, 0)
  }

  function closeForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo.trim()) { setError('El título es obligatorio.'); return }
    setSaving(true)
    setError('')
    const data = {
      ...form,
      requisitos: form.requisitos.split('\n').map(s => s.trim()).filter(Boolean),
      orden: Number(form.orden),
      actualizadoEn: Timestamp.now(),
    }
    try {
      if (editId) {
        await updateDoc(doc(db, 'beneficios', editId), data)
      } else {
        await addDoc(collection(db, 'beneficios'), { ...data, creadoEn: Timestamp.now() })
      }
      closeForm()
    } catch (err) {
      setError('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, titulo) {
    if (!window.confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return
    await deleteDoc(doc(db, 'beneficios', id))
  }

  async function toggleActivo(b) {
    await updateDoc(doc(db, 'beneficios', b.id), { activo: !b.activo, actualizadoEn: Timestamp.now() })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Beneficios Sociales</h1>
        <button
          onClick={openNew}
          className="bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-base hover:bg-primary-800 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          + Nuevo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-primary-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editId ? 'Editar Beneficio' : 'Nuevo Beneficio'}
          </h2>
          {error && <p className="text-red-600 mb-3 font-medium">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                  placeholder="Nombre del beneficio"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                >
                  {CATEGORIAS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Orden de aparición</label>
                <input
                  type="number"
                  value={form.orden}
                  onChange={e => setForm({ ...form, orden: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                  min={0}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                  placeholder="Descripción del beneficio..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Requisitos <span className="font-normal text-gray-500">(uno por línea)</span>
                </label>
                <textarea
                  value={form.requisitos}
                  onChange={e => setForm({ ...form, requisitos: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                  placeholder="Ser mayor de 65 años&#10;Estar inscrito en RSH&#10;..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cómo postular</label>
                <textarea
                  value={form.comoPostular}
                  onChange={e => setForm({ ...form, comoPostular: e.target.value })}
                  rows={2}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                  placeholder="Pasos para postular al beneficio..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contacto</label>
                <input
                  type="text"
                  value={form.contacto}
                  onChange={e => setForm({ ...form, contacto: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                  placeholder="Oficina, dirección, teléfono..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={e => setForm({ ...form, activo: e.target.checked })}
                    className="w-5 h-5 accent-primary-700"
                  />
                  <span className="text-base font-medium text-gray-700">Beneficio activo (visible al público)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-700 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-primary-800 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear Beneficio'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Cargando...</p>
      ) : beneficios.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow">
          <p className="text-4xl mb-3">🎁</p>
          <p className="text-lg">No hay beneficios. Haga clic en "+ Nuevo" para agregar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {beneficios.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-base truncate">{b.titulo}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {b.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {CATEGORIAS.find(c => c.value === b.categoria)?.label || b.categoria}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{b.descripcion}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActivo(b)}
                  className="text-xs px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                  title={b.activo ? 'Desactivar' : 'Activar'}
                >
                  {b.activo ? '👁️' : '🚫'}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="text-xs px-3 py-2 rounded-lg bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.titulo)}
                  className="text-xs px-3 py-2 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
