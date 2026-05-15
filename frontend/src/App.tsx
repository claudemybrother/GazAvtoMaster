import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CarsPage from './pages/CarsPage'
import ClientsPage from './pages/ClientsPage'
import DealsPage from './pages/DealsPage'
import ReservationsPage from './pages/ReservationsPage'
import TestDrivesPage from './pages/TestDrivesPage'
import AdminPage from './pages/AdminPage'
import ClientCardPage from './pages/ClientCardPage'
import AuditPage from './pages/AuditPage'
import ReferencesPage from './pages/ReferencesPage'
import Notifications from './components/UI/Notifications'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuth()
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, user } = useAuth()
  if (!isAuth) return <Navigate to="/login" replace />
  if (user?.role !== 'Администратор') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Notifications />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/cars" element={<PrivateRoute><CarsPage /></PrivateRoute>} />
        <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
        <Route path="/deals" element={<PrivateRoute><DealsPage /></PrivateRoute>} />
        <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
        <Route path="/test-drives" element={<PrivateRoute><TestDrivesPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin/audit" element={<AdminRoute><AuditPage /></AdminRoute>} />
        <Route path="/admin/references" element={<AdminRoute><ReferencesPage /></AdminRoute>} />
        <Route path="/clients/:id" element={<PrivateRoute><ClientCardPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
