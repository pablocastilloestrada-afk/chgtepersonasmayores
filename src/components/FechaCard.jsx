import React from 'react'

const tipoConfig = {
  plazo: { label: 'Plazo', className: 'bg-red-100 text-red-800 border-red-300' },
  evento: { label: 'Evento', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  reunion: { label: 'Reunión', className: 'bg-green-100 text-green-800 border-green-300' },
  otro: { label: 'Otro', className: 'bg-gray-100 text-gray-800 border-gray-300' },
}

function formatearFecha(fechaTimestamp) {
  if (!fechaTimestamp) return { dia: '--', mes: '--', anio: '--', completa: 'Sin fecha' }
  let date
  if (fechaTimestamp.toDate) {
    date = fechaTimestamp.toDate()
  } else if (fechaTimestamp instanceof Date) {
    date = fechaTimestamp
  } else {
    date = new Date(fechaTimestamp)
  }
  const dia = date.getDate()
  const mes = date.toLocaleString('es-CL', { month: 'short' }).replace('.', '')
  const anio = date.getFullYear()
  const completa = date.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return { dia, mes, anio, completa }
}

export default function FechaCard({ fecha }) {
  const config = tipoConfig[fecha.tipo] || tipoConfig.otro
  const { dia, mes, anio, completa } = formatearFecha(fecha.fecha)

  return (
    <article className="card p-5 flex gap-4" aria-label={`Fecha: ${fecha.titulo}`}>
      {/* Date badge */}
      <div
        className="flex-shrink-0 bg-primary-700 text-white rounded-xl flex flex-col items-center justify-center w-16 h-16 shadow-md"
        aria-hidden="true"
      >
        <span className="text-2xl font-bold leading-none">{dia}</span>
        <span className="text-xs font-medium uppercase tracking-wide leading-none mt-1">{mes}</span>
        <span className="text-xs opacity-75 leading-none">{anio}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 mb-1">
          <span
            className={`inline-block text-sm font-semibold px-3 py-0.5 rounded-full border ${config.className}`}
            aria-label={`Tipo: ${config.label}`}
          >
            {config.label}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 leading-snug mb-1">
          {fecha.titulo}
        </h3>
        <time
          dateTime={fecha.fecha?.toDate ? fecha.fecha.toDate().toISOString() : ''}
          className="text-sm text-gray-500 mb-1 block"
        >
          {completa}
        </time>
        {fecha.descripcion && (
          <p className="text-gray-600 text-base leading-relaxed mt-1">
            {fecha.descripcion}
          </p>
        )}
        {fecha.lugar && (
          <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{fecha.lugar}</span>
          </div>
        )}
      </div>
    </article>
  )
}
