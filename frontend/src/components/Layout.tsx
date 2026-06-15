import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout() {
  const [isToggled, setIsToggled] = useState(false)

  return (
    <div className={`app-shell ${isToggled ? 'app-shell--toggled' : ''}`}>
      <Sidebar open={isToggled} onClose={() => setIsToggled(false)} />
      <div className="app-shell__main">
        <Header onMenuToggle={() => setIsToggled((v) => !v)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
