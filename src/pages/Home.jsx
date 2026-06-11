import React from 'react'
import { Link } from 'react-router-dom'
import { useBeneficios } from '../hooks/useBeneficios'
import { useFechas } from '../hooks/useFechas'
import { useAvisos } from '../hooks/useAvisos'

function SectionCard({ to, icon, title, description, count, colorClass, ariaLabel }) {
  return (
    <Link
      to={to}
      className={`card block p-6 hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-primary-300 rounded-xl ${colorClass}`}
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl" aria-hidden="true">{icon}</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-base">{description}</p>
        </div>
        <div className="flex flex-col items-center">
          {count !== null && (
            <span className="bg-primary-700 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center" aria-label={`${count} disponibles`}>
              {count}
            </span>
          )}
          <svg className="w-5 h-5 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const { beneficios, loading: loadingB } = useBeneficios()
  const { fechas, loading: loadingF } = useFechas()
  const { avisos, loading: loadingA } = useAvisos()

  const countB = loadingB ? null : beneficios.length
  const countF = loadingF ? null : fechas.length
  const countA = loadingA ? null : avisos.length

  // Check for urgent avisos
  const hayUrgente = avisos.some((a) => a.urgencia === 'urgente')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Welcome section */}
      <section className="mb-8" aria-labelledby="bienvenida-titulo">
        <div className="bg-primary-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <svg className="w-7 h-7 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 id="bienvenida-titulo" className="text-2xl font-bold leading-tight">
                Bienvenido/a
              </h1>
              <p className="text-primary-200 text-base">Municipalidad de Chiguayante</p>
            </div>
          </div>
          <p className="text-primary-100 text-lg leading-relaxed">
            Aquí encontrará información sobre beneficios sociales, fechas importantes y avisos municipales para personas mayores de Chiguayante.
          </p>
        </div>
      </section>

      {/* Urgent notice banner */}
      {hayUrgente && (
        <section className="mb-6" aria-label="Aviso urgente">
          <Link
            to="/avisos"
            className="block bg-red-50 border-2 border-red-500 rounded-xl p-4 hover:bg-red-100 transition-colors focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-red-800 font-bold text-lg">¡Hay avisos urgentes!</p>
                <p className="text-red-700 text-base">Toque aquí para ver los avisos urgentes</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Navigation cards */}
      <section aria-labelledby="servicios-titulo">
        <h2 id="servicios-titulo" className="text-2xl font-bold text-gray-800 mb-4">
          Servicios disponibles
        </h2>
        <div className="flex flex-col gap-4">
          <SectionCard
            to="/beneficios"
            icon="🎁"
            title="Beneficios Sociales"
            description="Beneficios de salud, vivienda, economía y más"
            count={countB}
            colorClass="border-l-4 border-green-500"
            ariaLabel={`Beneficios Sociales, ${countB !== null ? countB + ' disponibles' : 'cargando'}`}
          />
          <SectionCard
            to="/fechas"
            icon="📅"
            title="Fechas Importantes"
            description="Plazos, eventos y reuniones próximas"
            count={countF}
            colorClass="border-l-4 border-blue-500"
            ariaLabel={`Fechas Importantes, ${countF !== null ? countF + ' disponibles' : 'cargando'}`}
          />
          <SectionCard
            to="/avisos"
            icon="🔔"
            title="Avisos Municipales"
            description="Noticias y comunicados importantes"
            count={countA}
            colorClass="border-l-4 border-orange-500"
            ariaLabel={`Avisos Municipales, ${countA !== null ? countA + ' disponibles' : 'cargando'}`}
          />
        </div>
      </section>

      {/* Footer info */}
      <section className="mt-8 bg-gray-100 rounded-xl p-5" aria-label="Información de contacto">
        <h2 className="text-lg font-bold text-gray-800 mb-2">¿Necesita ayuda?</h2>
        <p className="text-gray-600 text-base leading-relaxed">
          Contáctese con la Municipalidad de Chiguayante. Nuestro personal está disponible para orientarle sobre los beneficios y servicios disponibles.
        </p>
      </section>
    </div>
  )
}
