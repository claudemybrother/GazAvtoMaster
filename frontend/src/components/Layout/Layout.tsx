import { type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  stats?: { totalCars: number; availableCars: number; totalClients: number; totalDeals: number }
}

export default function Layout({ children, stats }: LayoutProps) {
  return (
    <div className="app-wrapper">
      <Header />
      <div className="main-body">
        <Sidebar stats={stats} />
        <main className="page-content">{children}</main>
      </div>
      <footer className="site-footer">
        © 2026 ООО «ГазАвтоМастер» — Система управления автосалоном v1.0
      </footer>
    </div>
  )
}
