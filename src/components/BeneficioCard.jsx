import React from 'react'
import { Link } from 'react-router-dom'

const categoriaConfig = {
  salud: {
    label: 'Salud',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  vivienda: {
    label: 'Vivienda',
    className: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  economico: {
    label: 'Económico',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  recreacion: {
    label: 'Recreación',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  transporte: {
    label: 'Transporte',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
}

export default function BeneficioCard({ beneficio }) {
  const config = categoriaConfig[beneficio.categoria] || {
    label: beneficio.categoria,
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  const descripcionCorta =
    beneficio.descripcion && beneficio.descripcion.length > 100
      ? beneficio.descripcion.substring(0, 100) + '...'
      : beneficio.descripcion

  return (
    <Link
      to={`/beneficios/${beneficio.id}`}
      className="card block p-5 hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-primary-300 rounded-xl"
      aria-label={`Ver detalles del beneficio: ${beneficio.titulo}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-sm font-semibold px-3 py-1 rounded-full border mb-2 ${config.className}`}
            aria-label={`Categoría: ${config.label}`}
          >
            {config.label}
          </span>
          <h3 className="text-xl font-bold text-gray-900 mb-1 leading-snug">
            {beneficio.titulo}
          </h3>
          {descripcionCorta && (
            <p className="text-gray-600 text-base leading-relaxed">
              {descripcionCorta}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 mt-1" aria-hidden="true">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}
