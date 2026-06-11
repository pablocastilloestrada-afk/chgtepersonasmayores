import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-primary-700 text-white shadow-lg" role="banner">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <svg className="w-6 h-6 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <Link to="/" className="flex flex-col hover:opacity-90 transition-opacity" aria-label="Ir al inicio - Municipalidad de Chiguayante">
          <span className="font-bold text-lg leading-tight">Personas Mayores</span>
          <span className="text-primary-200 text-base leading-tight">Municipalidad de Chiguayante</span>
        </Link>
      </div>
    </header>
  )
}
