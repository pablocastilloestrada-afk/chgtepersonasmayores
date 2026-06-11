import React, { useState } from 'react'
import { useBeneficios } from '../hooks/useBeneficios'
import BeneficioCard from '../components/BeneficioCard'
import LoadingSpinner from '../components/LoadingSpinner'

const categorias = [
  { value: '', label: 'Todos' },
  { value: 'salud', label: 'Salud' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'economico', label: 'Económico' },
  { value: 'recreacion', label: 'Recreación' },
  { value: 'transporte', label: 'Transporte' },
]

export default function Beneficios() {
  const { beneficios, loading, error } = useBeneficios()
  const [filtro, setFiltro] = useState('')

  const beneficiosFiltrados = filtro
    ? beneficios.filter((b) => b.categoria === filtro)
    : beneficios

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Beneficios Sociales</h1>
      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
        Conozca los beneficios disponibles para las personas mayores de Chiguayante.
      </p>

      {/* Category filter */}
      <div className="mb-6" role="group" aria-label="Filtrar por categoría">
        <label htmlFor="filtro-categoria" className="label-field mb-2">
          Filtrar por categoría:
        </label>
        <select
          id="filtro-categoria"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-field"
          aria-label="Seleccionar categoría"
        >
          {categorias.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner mensaje="Cargando beneficios..." />}

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-800" role="alert">
          <p className="font-bold text-lg mb-1">Error al cargar los beneficios</p>
          <p className="text-base">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-gray-500 text-base mb-4" aria-live="polite">
            {beneficiosFiltrados.length === 0
              ? 'No hay beneficios disponibles'
              : `${beneficiosFiltrados.length} beneficio${beneficiosFiltrados.length !== 1 ? 's' : ''} disponible${beneficiosFiltrados.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex flex-col gap-4" role="list" aria-label="Lista de beneficios">
            {beneficiosFiltrados.map((beneficio) => (
              <div key={beneficio.id} role="listitem">
                <BeneficioCard beneficio={beneficio} />
              </div>
            ))}
          </div>

          {beneficiosFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
              <p className="text-xl text-gray-600">
                No hay beneficios en esta categoría
              </p>
              <button
                onClick={() => setFiltro('')}
                className="btn-secondary mt-4"
              >
                Ver todos los beneficios
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
