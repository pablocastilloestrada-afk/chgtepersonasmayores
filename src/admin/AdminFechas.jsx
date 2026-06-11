import React, { useState } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useFechas } from '../hooks/useFechas'

const TIPOS = [
  { value: 'plazo', label: '⏰ Plazo' },
  { value: 'evento', label: '🎉 Evento' },
  { value: 'reunion', label: '🤝 Reunión' },
  { value: 'otro', label: '📌 Otro' },
]

function toDateInputValue(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toISOString().slice(0, 10)
}

const EMPTY_FORM = { titulo: '', descripcion: '', fecha: '', tipo: 'evento', lugar: '', activo: true }

export default function AdminFechas() {
  const { fechas, loading } = useFechas(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openNew() { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError(''); window.scrollTo(0,0) }
  function openEdit(f) {
    setForm({ titulo: f.titulo || '', descripcion: f.descripcion || '', fecha: toDateInputValue(f.fecha), tipo: f.tipo || 'evento', lugar: f.lugar || '', activo: f.activo !== false })
    setEditId(f.id); setShowForm(true); setError(''); window.scrollTo(0,0)
  }
  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo.trim()) { setError('El título es obligatorio.'); return }
    if (!form.fecha) { setError('La fecha es obligatoria.'); return }
    setSaving(true); setError('')
    const data = {
      titulo: form.titulo, descripcion: form.descripcion,
      fecha: Timestamp.fromDate(new Date(form.fecha + 'T12:00:00')),
      tipo: form.tipo, lugar: form.lugar, activo: form.activo,
    }
    try {
      if (editId) {
        await updateDoc(doc(db, 'fechas', editId), data)
      } else {
        await addDoc(collection(db, 'fechas'), { ...data, creadoEn: Timestamp.now() })
      }
      closeForm()
    } catch (err) {
      setError('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, titulo) {
    if (!window.confirm(`¿Eliminar "${titulo}"?`)) return
    await deleteDoc(doc(db, 'fechas', id))
  }

  function formatFecha(ts) {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fechas Importantes</h1>
        <button onClick={openNew} className="bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-base hover:bg-primary-800 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300">
          + Nueva
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-primary-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{editId ? 'Editar Fecha' : 'Nueva Fecha'}</h2>
          {error && <p className="text-red-600 mb-3 font-medium">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
              <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                placeholder="Nombre del evento o plazo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha *</label>
                <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500">
                  {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                rows={2} className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                placeholder="Detalle de la fecha..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lugar</label>
              <input type="text" value={form.lugar} onChange={e => setForm({...form, lugar: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:border-primary-500"
                placeholder="Dirección o lugar del evento" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} className="w-5 h-5 accent-primary-700" />
              <span className="text-base font-medium text-gray-700">Visible al público</span>
            </label>
            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={saving} className="bg-primary-700 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-primary-800 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-primary-300">
                {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear Fecha'}
              </button>
              <button type="button" onClick={closeForm} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-8">Cargando...</p>
      ) : fechas.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-lg">No hay fechas. Haga clic en "+ Nueva" para agregar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {fechas.map((f) => (
            <div key={f.id} className="bg-white rounded-xl shadow p-4 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">{f.titulo}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${f.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {f.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {TIPOS.find(t => t.value === f.tipo)?.label || f.tipo}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">📅 {formatFecha(f.fecha)}</p>
                {f.lugar && <p className="text-gray-500 text-sm">📍 {f.lugar}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(f)} className="text-xs px-3 py-2 rounded-lg bg-primary-100 text-primary-800 hover:bg-primary-200 font-medium">Editar</button>
                <button onClick={() => handleDelete(f.id, f.titulo)} className="text-xs px-3 py-2 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 font-medium">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
