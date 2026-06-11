import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useBeneficios } from '../hooks/useBeneficios'
import { useFechas } from '../hooks/useFechas'
import { useAvisos } from '../hooks/useAvisos'

const DATOS_EJEMPLO = {
  beneficios: [
    {
      titulo: 'Bono de Invierno',
      descripcion: 'Subsidio económico para ayudar a cubrir gastos de calefacción durante los meses de frío.',
      categoria: 'economico',
      requisitos: ['Ser mayor de 65 años', 'Estar inscrito en el Registro Social de Hogares', 'Residir en Chiguayante'],
      comoPostular: 'Acercarse a la municipalidad con su cédula de identidad y certificado de residencia entre junio y agosto.',
      contacto: 'DIDECO Chiguayante — Av. Principal 123 — Tel: 43-2XXXXXX',
      activo: true,
      orden: 1,
    },
    {
      titulo: 'Programa de Salud Adulto Mayor',
      descripcion: 'Control médico, dental y de enfermería gratuito para personas mayores en el CESFAM de Chiguayante.',
      categoria: 'salud',
      requisitos: ['Ser mayor de 60 años', 'Estar inscrito en el CESFAM'],
      comoPostular: 'Llame al CESFAM o preséntese personalmente para inscribirse en el programa.',
      contacto: 'CESFAM Chiguayante — Tel: 43-2XXXXXX — Lunes a Viernes 8:00 a 17:00',
      activo: true,
      orden: 2,
    },
    {
      titulo: 'Taller de Actividad Física',
      descripcion: 'Clases de gimnasia suave, yoga y baile para adultos mayores. Promueve la salud y el bienestar.',
      categoria: 'recreacion',
      requisitos: ['Ser mayor de 60 años', 'Contar con certificado médico de aptitud física'],
      comoPostular: 'Inscribirse en la oficina de Deportes de la municipalidad.',
      contacto: 'Departamento de Deportes — Tel: 43-2XXXXXX',
      activo: true,
      orden: 3,
    },
  ],
  fechas: [
    {
      titulo: 'Postulación Bono de Invierno',
      descripcion: 'Último día para postular al Bono de Invierno en las oficinas municipales.',
      fecha: Timestamp.fromDate(new Date(new Date().getFullYear(), 7, 31)),
      tipo: 'plazo',
      lugar: 'Municipalidad de Chiguayante',
      activo: true,
    },
    {
      titulo: 'Reunión Adultos Mayores',
      descripcion: 'Reunión informativa sobre nuevos beneficios disponibles para el segundo semestre.',
      fecha: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
      tipo: 'reunion',
      lugar: 'Salón Municipal — Av. Principal 123',
      activo: true,
    },
  ],
  avisos: [
    {
      titulo: 'Nueva atención preferencial en CESFAM',
      contenido: 'A partir del próximo lunes, el CESFAM habilitará horario preferencial para adultos mayores de 8:00 a 9:30 hrs sin necesidad de agenda previa.',
      urgencia: 'importante',
      activo: true,
      expiraEn: null,
    },
    {
      titulo: 'Bienvenidos al nuevo portal municipal',
      contenido: 'La Municipalidad de Chiguayante pone a disposición este nuevo portal digital para facilitar el acceso a la información de beneficios y servicios para personas mayores.',
      urgencia: 'normal',
      activo: true,
      expiraEn: null,
    },
  ],
}

export default function AdminDashboard() {
  const { beneficios } = useBeneficios()
  const { fechas } = useFechas()
  const { avisos } = useAvisos()
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function cargarDatosEjemplo() {
    if (!window.confirm('¿Cargar datos de ejemplo? Esto agregará beneficios, fechas y avisos de muestra.')) return
    setCargando(true)
    setMensaje('')
    try {
      for (const b of DATOS_EJEMPLO.beneficios) {
        await addDoc(collection(db, 'beneficios'), { ...b, creadoEn: Timestamp.now(), actualizadoEn: Timestamp.now() })
      }
      for (const f of DATOS_EJEMPLO.fechas) {
        await addDoc(collection(db, 'fechas'), { ...f, creadoEn: Timestamp.now() })
      }
      for (const a of DATOS_EJEMPLO.avisos) {
        await addDoc(collection(db, 'avisos'), { ...a, creadoEn: Timestamp.now() })
      }
      setMensaje('✅ Datos de ejemplo cargados correctamente.')
    } catch (err) {
      setMensaje('❌ Error al cargar los datos: ' + err.message)
    } finally {
      setCargando(false)
    }
  }

  const stats = [
    { label: 'Beneficios', count: beneficios.length, to: '/admin/beneficios', color: 'bg-green-100 text-green-800', icon: '🎁' },
    { label: 'Fechas', count: fechas.length, to: '/admin/fechas', color: 'bg-blue-100 text-blue-800', icon: '📅' },
    { label: 'Avisos', count: avisos.length, to: '/admin/avisos', color: 'bg-orange-100 text-orange-800', icon: '🔔' },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className={`rounded-xl p-5 text-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-4 focus:ring-primary-300 ${s.color}`}
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold">{s.count}</div>
            <div className="text-base font-medium mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Acciones rápidas</h2>
        <div className="flex flex-col gap-3">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <span>{s.icon}</span>
              <span>Administrar {s.label}</span>
              <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Seed data */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
        <h2 className="text-lg font-bold text-yellow-900 mb-2">Datos de ejemplo</h2>
        <p className="text-yellow-800 text-base mb-4">
          Si es la primera vez que configura el sistema, puede cargar datos de ejemplo para ver cómo funciona la aplicación.
        </p>
        {mensaje && <p className="text-base mb-3 font-medium">{mensaje}</p>}
        <button
          onClick={cargarDatosEjemplo}
          disabled={cargando}
          className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-yellow-700 transition-colors disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          {cargando ? 'Cargando...' : '📥 Cargar datos de ejemplo'}
        </button>
      </div>
    </div>
  )
}
