import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-shell__main">
        <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
