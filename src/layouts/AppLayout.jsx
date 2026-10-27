
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'

import AppHeader from '../components/shell/AppHeader.jsx'
import OfflineBanner from '../components/shell/OfflineBanner.jsx'
import BottomNav from '../components/shell/BottomNav.jsx'
import ViewErrorBoundary from '../components/shell/ViewErrorBoundary.jsx'
import ViewSkeleton from '../components/ui/ViewSkeleton.jsx'

// APP SHELL: siempre montado.
// Solo cambia lo que se pinta en <Outlet />
export default function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className="app-shell">
      <AppHeader />

      <OfflineBanner />

      <main className="app-main container py-3">
        {/* Al cambiar de ruta se limpia el error anterior */}
        <ViewErrorBoundary key={pathname}>
          <Suspense fallback={<ViewSkeleton />}>
            <Outlet />
          </Suspense>
        </ViewErrorBoundary>
      </main>

      <BottomNav />
    </div>
  )
}
