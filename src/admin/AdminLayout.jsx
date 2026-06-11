import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/admin/dashboard', label: 'Panel', icon: '🏠' },
  { to: '/admin/beneficios', label: 'Beneficios', icon: '🎁' },
  { to: '/admin/fechas', label: 'Fechas', icon: '📅' },
  { to: '/admin/avisos', label: 'Avisos', icon: '🔔' },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    try {
      await logout()
      navigate('/admin/login')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-primary-800 text-white shadow-lg" role="banner">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/admin/dashboard" className="font-bold text-lg hover:opacity-90">
              Admin · Chiguayante
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-primary-200 text-sm truncate max-w-[160px]">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-primary-900 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white min-h-[40px]"
              aria-label="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex">
        {/* Sidebar desktop */}
        <nav
          className="hidden lg:block w-56 bg-white shadow-md min-h-screen pt-6"
          aria-label="Menú de administración"
        >
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-6 px-6 border-t pt-4">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-800 text-base font-medium flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver sitio público
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
            <nav
              className="bg-white w-64 min-h-screen pt-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              aria-label="Menú de administración móvil"
            >
              <div className="flex items-center justify-between px-4 mb-4">
                <span className="font-bold text-lg text-gray-900">Menú Admin</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Cerrar menú"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-1 px-3">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium ${
                          isActive ? 'bg-primary-100 text-primary-800' : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
