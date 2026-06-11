import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBeneficios } from '../hooks/useBeneficios'
import LoadingSpinner from '../components/LoadingSpinner'

const categoriaConfig = {
  salud: { label: 'Salud', className: 'bg-green-100 text-green-800 border-green-300' },
  vivienda: { label: 'Vivienda', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  economico: { label: 'Económico', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  recreacion: { label: 'Recreación', className: 'bg-purple-100 text-purple-800 border-purple-300' },
  transporte: { label: 'Transporte', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
}

export default function BeneficioDetalle() {
  const { id } = useParams()
  const { getBeneficio } = useBeneficios()
  const [beneficio, setBeneficio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await getBeneficio(id)
        if (!data) {
          setError('No se encontró el beneficio solicitado.')
        } else {
          setBeneficio(data)
        }
      } catch (err) {
        setError('Error al cargar el beneficio.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  if (loading) return <LoadingSpinner mensaje="Cargando beneficio..." />

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6" role="alert">
          <p className="text-red-800 text-xl font-bold mb-2">Error</p>
          <p className="text-red-700 text-lg">{error}</p>
          <Link to="/beneficios" className="btn-secondary mt-4 inline-block">
            Volver a Beneficios
          </Link>
        </div>
      </div>
    )
  }

  const config = categoriaConfig[beneficio.categoria] || {
    label: beneficio.categoria,
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        to="/beneficios"
        className="inline-flex items-center gap-2 text-primary-700 font-semibold text-lg mb-6 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
        aria-label="Volver a la lista de beneficios"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Beneficios
      </Link>

      <article className="card p-6" aria-label={`Detalle del beneficio: ${beneficio.titulo}`}>
        {/* Category badge */}
        <span className={`inline-block text-base font-semibold px-4 py-1 rounded-full border mb-4 ${config.className}`}>
          {config.label}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {beneficio.titulo}
        </h1>

        {/* Description */}
        {beneficio.descripcion && (
          <section className="mb-6" aria-labelledby="descripcion-titulo">
            <h2 id="descripcion-titulo" className="text-xl font-bold text-gray-800 mb-2">
              Descripción
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {beneficio.descripcion}
            </p>
          </section>
        )}

        {/* Requirements */}
        {beneficio.requisitos && beneficio.requisitos.length > 0 && (
          <section className="mb-6" aria-labelledby="requisitos-titulo">
            <h2 id="requisitos-titulo" className="text-xl font-bold text-gray-800 mb-3">
              Requisitos
            </h2>
            <ul className="space-y-2" role="list">
              {beneficio.requisitos.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700 text-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold mt-0.5" aria-hidden="true">
                    {idx + 1}
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* How to apply */}
        {beneficio.comoPostular && (
          <section className="mb-6 bg-blue-50 rounded-xl p-5" aria-labelledby="postular-titulo">
            <h2 id="postular-titulo" className="text-xl font-bold text-blue-900 mb-2">
              ¿Cómo postular?
            </h2>
            <p className="text-blue-800 text-lg leading-relaxed whitespace-pre-wrap">
              {beneficio.comoPostular}
            </p>
          </section>
        )}

        {/* Contact */}
        {beneficio.contacto && (
          <section className="bg-gray-50 rounded-xl p-5" aria-labelledby="contacto-titulo">
            <h2 id="contacto-titulo" className="text-xl font-bold text-gray-800 mb-2">
              Contacto
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {beneficio.contacto}
            </p>
          </section>
        )}
      </article>
    </div>
  )
}
