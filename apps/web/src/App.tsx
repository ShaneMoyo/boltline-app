import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';

const PartsListPage = lazy(() => import('./pages/parts/PartsListPage.tsx'));
const PartDetailPage = lazy(() => import('./pages/parts/PartDetailPage.tsx'));
const PartFormPage = lazy(() => import('./pages/parts/PartFormPage.tsx'));
const BOMPage = lazy(() => import('./pages/bom/BOMPage.tsx'));
const InventoryPage = lazy(() => import('./pages/inventory/InventoryPage.tsx'));
const WorkOrdersPage = lazy(() => import('./pages/workorders/WorkOrdersPage.tsx'));
const WorkOrderDetailPage = lazy(() => import('./pages/workorders/WorkOrderDetailPage.tsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.tsx'));

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `py-4 border-b-2 text-sm font-medium transition-colors ${
          isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-900'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function PageLoader() {
  return <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 px-6 flex items-center gap-8">
          <NavLink to="/" className="text-lg font-bold text-blue-700 py-4 mr-4 no-underline">
            ⚡ Boltline
          </NavLink>
          <NavItem to="/parts" label="Parts" />
          <NavItem to="/inventory" label="Inventory" />
          <NavItem to="/work-orders" label="Work Orders" />
          <NavItem to="/dashboard" label="Dashboard" />
        </nav>

        <main className="p-6">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/parts" replace />} />
              <Route path="/parts" element={<PartsListPage />} />
              <Route path="/parts/new" element={<PartFormPage />} />
              <Route path="/parts/:id" element={<PartDetailPage />} />
              <Route path="/parts/:id/edit" element={<PartFormPage />} />
              <Route path="/parts/:id/bom" element={<BOMPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/work-orders" element={<WorkOrdersPage />} />
              <Route path="/work-orders/:id" element={<WorkOrderDetailPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
