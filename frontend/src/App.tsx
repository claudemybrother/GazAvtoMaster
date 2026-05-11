import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CarsPage from './pages/CarsPage'
import ClientsPage from './pages/ClientsPage'
import DealsPage from './pages/DealsPage'
import ReservationsPage from './pages/ReservationsPage'
import TestDrivesPage from './pages/TestDrivesPage'
import EmployeesPage from './pages/EmployeesPage'
import Notifications from './components/UI/Notifications'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuth()
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />
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
        <Route path="/employees" element={<PrivateRoute><EmployeesPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
