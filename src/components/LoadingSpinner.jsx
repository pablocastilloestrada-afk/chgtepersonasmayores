import React from 'react'

export default function LoadingSpinner({ mensaje = 'Cargando...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      role="status"
      aria-label={mensaje}
      aria-live="polite"
    >
      <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mb-4" />
      <p className="text-lg text-gray-600 font-medium">{mensaje}</p>
    </div>
  )
}
