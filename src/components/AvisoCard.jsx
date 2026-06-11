import React from 'react'

const urgenciaConfig = {
  urgente: {
    label: 'Urgente',
    className: 'bg-red-100 text-red-800 border-red-300',
    headerClass: 'border-l-4 border-red-500',
    iconColor: 'text-red-600',
  },
  importante: {
    label: 'Importante',
    className: 'bg-orange-100 text-orange-800 border-orange-300',
    headerClass: 'border-l-4 border-orange-500',
    iconColor: 'text-orange-600',
  },
  normal: {
    label: 'Normal',
    className: 'bg-gray-100 text-gray-700 border-gray-300',
    headerClass: 'border-l-4 border-gray-400',
    iconColor: 'text-gray-500',
  },
}

function formatearFechaCorta(timestamp) {
  if (!timestamp) return ''
  let date
  if (timestamp.toDate) {
    date = timestamp.toDate()
  } else {
    date = new Date(timestamp)
  }
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function AvisoCard({ aviso }) {
  const config = urgenciaConfig[aviso.urgencia] || urgenciaConfig.normal

  const contenidoCorto =
    aviso.contenido && aviso.contenido.length > 150
      ? aviso.contenido.substring(0, 150) + '...'
      : aviso.contenido

  return (
    <article
      className={`card p-5 ${config.headerClass}`}
      aria-label={`Aviso: ${aviso.titulo}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-1 ${config.iconColor}`} aria-hidden="true">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-block text-sm font-semibold px-3 py-0.5 rounded-full border ${config.className}`}
              aria-label={`Urgencia: ${config.label}`}
            >
              {config.label}
            </span>
            {aviso.creadoEn && (
              <time className="text-sm text-gray-500">
                {formatearFechaCorta(aviso.creadoEn)}
              </time>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2">
            {aviso.titulo}
          </h3>
          {contenidoCorto && (
            <p className="text-gray-700 text-base leading-relaxed">
              {contenidoCorto}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
