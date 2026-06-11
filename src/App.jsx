import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Beneficios from './pages/Beneficios'
import BeneficioDetalle from './pages/BeneficioDetalle'
import FechasImportantes from './pages/FechasImportantes'
import Avisos from './pages/Avisos'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminBeneficios from './admin/AdminBeneficios'
import AdminFechas from './admin/AdminFechas'
import AdminAvisos from './admin/AdminAvisos'
import AdminLayout from './admin/AdminLayout'
import ProtectedRoute from './admin/ProtectedRoute'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pb-nav">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/beneficios"
        element={
          <PublicLayout>
            <Beneficios />
          </PublicLayout>
        }
      />
      <Route
        path="/beneficios/:id"
        element={
          <PublicLayout>
            <BeneficioDetalle />
          </PublicLayout>
        }
      />
      <Route
        path="/fechas"
        element={
          <PublicLayout>
            <FechasImportantes />
          </PublicLayout>
        }
      />
      <Route
        path="/avisos"
        element={
          <PublicLayout>
            <Avisos />
          </PublicLayout>
        }
      />

      {/* Admin routes */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/beneficios"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminBeneficios />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fechas"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminFechas />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/avisos"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminAvisos />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
