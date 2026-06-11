import React, { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useAvisos } from '../hooks/useAvisos'
import LoadingSpinner from '../components/LoadingSpinner'

const urgencias = [
  { value: 'normal', label: 'Normal' },
  { value: 'importante', label: 'Importante' },
  { value: 'urgente', label: 'Urgente' },
]

const urgenciaColores = {
  urgente: 'bg-red-100 text-red-800',
  importante: 'bg-orange-100 text-orange-800',
  normal: 'bg-gray-100 text-gray-700',
}

const formVacio = {
  titulo: '',
  contenido: '',
  urgencia: 'normal',
  activo: true,
  expiraEn: '',
}

export default function AdminAvisos() {
  const { avisos, loading, error, agregarAviso, actualizarAviso, eliminarAviso } = useAvisos(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formVacio)
  const [guardando, setGuardando] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState(null)
  const [mensaje, setMensaje] = useState('')

  function abrirFormNuevo() {
    setForm(formVacio)
    setEditando(null)
    setMostrarForm(true)
    setMensaje('')
  }

  function abrirFormEditar(a) {
    let expiraEnStr = ''
    if (a.expiraEn) {
      const d = a.expiraEn.toDate ? a.expiraEn.toDate() : new Date(a.expiraEn)
      expiraEnStr = d.toISOString().slice(0, 10)
    }
    setForm({
      titulo: a.titulo || '',
      contenido: a.contenido || '',
      urgencia: a.urgencia || 'normal',
      activo: a.activo !== false,
      expiraEn: expiraEnStr,
    })
    setEditando(a.id)
    setMostrarForm(true)
    setMensaje('')
  }

  function cancelar() {
    setMostrarForm(false)
    setEditando(null)
    setForm(formVacio)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      const datos = {
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        urgencia: form.urgencia,
        activo: form.activo,
      }
      if (form.expiraEn) {
        datos.expiraEn = Timestamp.fromDate(new Date(form.expiraEn))
      } else {
        datos.expiraEn = null
      }
      if (editando) {
        await actualizarAviso(editando, datos)
        setMensaje('✅ Aviso actualizado correctamente.')
      } else {
        await agregarAviso(datos)
        setMensaje('✅ Aviso agregado correctamente.')
      }
      setMostrarForm(false)
      setEditando(null)
      setForm(formVacio)
    } catch (err) {
      console.error(err)
      setMensaje('❌ Error al guardar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function handleEliminar(id) {
    try {
      await eliminarAviso(id)
      setConfirmEliminar(null)
      setMensaje('✅ Aviso eliminado.')
    } catch (err) {
      setMensaje('❌ Error al eliminar: ' + err.message)
    }
  }

  function formatearFecha(ts) {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avisos</h1>
          <p className="text-gray-600 text-base">Gestione los avisos municipales</p>
        </div>
        {!mostrarForm && (
          <button onClick={abrirFormNuevo} className="btn-primary">
            + Agregar aviso
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className={`rounded-xl p-4 mb-5 text-base font-medium ${
            mensaje.startsWith('✅')
              ? 'bg-green-50 text-green-800 border-2 border-green-300'
              : 'bg-red-50 text-red-800 border-2 border-red-300'
          }`}
          role="status"
        >
          {mensaje}
        </div>
      )}

      {/* Form */}
      {mostrarForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            {editando ? 'Editar aviso' : 'Nuevo aviso'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="titulo" className="label-field">Título *</label>
              <input id="titulo" name="titulo" type="text" value={form.titulo} onChange={handleChange} required className="input-field" placeholder="Título del aviso" />
            </div>
            <div>
              <label htmlFor="contenido" className="label-field">Contenido *</label>
              <textarea id="contenido" name="contenido" value={form.contenido} onChange={handleChange} required rows={5} className="input-field resize-y" placeholder="Texto completo del aviso" />
            </div>
            <div>
              <label htmlFor="urgencia" className="label-field">Urgencia *</label>
              <select id="urgencia" name="urgencia" value={form.urgencia} onChange={handleChange} className="input-field">
                {urgencias.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="expiraEn" className="label-field">Fecha de expiración (opcional)</label>
              <input id="expiraEn" name="expiraEn" type="date" value={form.expiraEn} onChange={handleChange} className="input-field" />
              <p className="text-sm text-gray-500 mt-1">Si se establece, el aviso dejará de mostrarse después de esta fecha.</p>
            </div>
            <div className="flex items-center gap-3">
              <input id="activo" name="activo" type="checkbox" checked={form.activo} onChange={handleChange} className="w-5 h-5 accent-primary-700" />
              <label htmlFor="activo" className="text-lg font-medium text-gray-700">Activo (visible en el sitio público)</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={guardando} className="btn-primary">
                {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" onClick={cancelar} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading && <LoadingSpinner mensaje="Cargando avisos..." />}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4" role="alert">
          <p className="text-red-800 font-bold">Error al cargar: {error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="space-y-4">
          {avisos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-xl text-gray-500">No hay avisos registrados</p>
              <button onClick={abrirFormNuevo} className="btn-primary mt-4">Agregar el primero</button>
            </div>
          ) : (
            avisos.map((a) => (
              <div key={a.id} className="bg-white rounded-xl shadow-md p-5">
                {confirmEliminar === a.id ? (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                    <p className="text-red-800 font-bold text-lg mb-3">¿Eliminar "{a.titulo}"?</p>
                    <p className="text-red-700 text-base mb-4">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleEliminar(a.id)} className="btn-danger">Sí, eliminar</button>
                      <button onClick={() => setConfirmEliminar(null)} className="btn-secondary">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className={`text-sm font-semibold px-3 py-0.5 rounded-full ${urgenciaColores[a.urgencia] || urgenciaColores.normal}`}>
                          {urgencias.find((u) => u.value === a.urgencia)?.label || a.urgencia}
                        </span>
                        {!a.activo && (
                          <span className="text-sm font-semibold px-3 py-0.5 rounded-full bg-gray-200 text-gray-600">
                            Inactivo
                          </span>
                        )}
                        {a.creadoEn && (
                          <span className="text-sm text-gray-500 py-0.5">
                            {formatearFecha(a.creadoEn)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{a.titulo}</h3>
                      <p className="text-gray-600 text-base mt-1 line-clamp-2">{a.contenido}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => abrirFormEditar(a)}
                        className="bg-primary-100 text-primary-800 hover:bg-primary-200 px-4 py-2 rounded-lg text-base font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-400"
                        aria-label={`Editar ${a.titulo}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmEliminar(a.id)}
                        className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-lg text-base font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Eliminar ${a.titulo}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
