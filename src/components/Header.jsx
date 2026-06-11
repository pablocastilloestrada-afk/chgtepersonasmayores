import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/': 'Inicio',
  '/beneficios': 'Beneficios Sociales',
  '/fechas': 'Fechas Importantes',
  '/avisos': 'Avisos Municipales',
}

export default function Header({ pageTitle }) {
  const location = useLocation()
  const title = pageTitle || PAGE_TITLES[location.pathname] || 'Personas Mayores'

  return (
    <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-40" role="banner">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="flex-shrink-0 w-11 h-11 bg-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Ir al inicio"
        >
          <svg className="w-6 h-6 text-primary-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-lg leading-tight truncate">{title}</span>
          <span className="text-primary-200 text-base leading-tight truncate">
            Municipalidad de Chiguayante
          </span>
        </div>
      </div>
    </header>
  )
}
