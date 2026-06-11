import React, { useState } from 'react'
import { useAvisos } from '../hooks/useAvisos'
import AvisoCard from '../components/AvisoCard'
import LoadingSpinner from '../components/LoadingSpinner'

const FILTROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'urgente', label: '🚨 Urgente' },
  { value: 'importante', label: '⚠️ Importante' },
  { value: 'normal', label: '📢 Normal' },
]

export default function Avisos() {
  const { avisos, loading, error } = useAvisos()
  const [filtro, setFiltro] = useState('todos')

  const avisosFiltrados =
    filtro === 'todos' ? avisos : avisos.filter((a) => a.urgencia === filtro)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Avisos Municipales</h1>
      <p className="text-gray-600 text-lg mb-6">
        Noticias y comunicados de la Municipalidad de Chiguayante
      </p>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Filtrar avisos">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`px-4 py-2 rounded-full text-base font-medium border-2 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300 ${
              filtro === f.value
                ? 'bg-primary-700 text-white border-primary-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
            }`}
            aria-pressed={filtro === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error && (
        <p className="text-red-600 text-lg text-center py-8">
          Error al cargar los avisos. Intente nuevamente.
        </p>
      )}

      {!loading && !error && avisosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-xl">No hay avisos en esta categoría</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {avisosFiltrados.map((aviso) => (
          <AvisoCard key={aviso.id} aviso={aviso} />
        ))}
      </div>
    </div>
  )
}
