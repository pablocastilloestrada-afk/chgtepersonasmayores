import React from 'react'
import { useFechas } from '../hooks/useFechas'
import FechaCard from '../components/FechaCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function FechasImportantes() {
  const { fechas, loading, error } = useFechas()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Fechas Importantes</h1>
      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
        Esté al tanto de los plazos, eventos y reuniones importantes para las personas mayores de Chiguayante.
      </p>

      {loading && <LoadingSpinner mensaje="Cargando fechas..." />}

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-800" role="alert">
          <p className="font-bold text-lg mb-1">Error al cargar las fechas</p>
          <p className="text-base">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {fechas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4" aria-hidden="true">📅</div>
              <p className="text-xl text-gray-600">No hay fechas próximas por el momento.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-base mb-4" aria-live="polite">
                {fechas.length} fecha{fechas.length !== 1 ? 's' : ''} próxima{fechas.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-col gap-4" role="list" aria-label="Lista de fechas importantes">
                {fechas.map((fecha) => (
                  <div key={fecha.id} role="listitem">
                    <FechaCard fecha={fecha} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
