import React from 'react'

export default function LoadingSpinner({ mensaje = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-label={mensaje}>
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mb-4" />
      <p className="text-lg text-gray-600">{mensaje}</p>
    </div>
  )
}
