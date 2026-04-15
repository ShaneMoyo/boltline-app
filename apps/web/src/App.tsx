import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';

const PartsListPage = lazy(() => import('./pages/parts/PartsListPage.tsx'));
const PartDetailPage = lazy(() => import('./pages/parts/PartDetailPage.tsx'));
const PartFormPage = lazy(() => import('./pages/parts/PartFormPage.tsx'));
const BOMPage = lazy(() => import('./pages/bom/BOMPage.tsx'));
const InventoryPage = lazy(() => import('./pages/inventory/InventoryPage.tsx'));
const WorkOrdersPage = lazy(() => import('./pages/workorders/WorkOrdersPage.tsx'));
const WorkOrderDetailPage = lazy(() => import('./pages/workorders/WorkOrderDetailPage.tsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.tsx'));
const AboutPage = lazy(() => import('./pages/about/AboutPage.tsx'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage.tsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.tsx'));

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

function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="ml-auto flex items-center gap-3">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
          {(user.name?.[0] ?? user.email[0]).toUpperCase()}
        </div>
      )}
      <span className="text-sm text-gray-700 hidden sm:block">{user.name ?? user.email}</span>
      <button
        onClick={logout}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <div className="min-h-screen bg-gray-50">
              <nav className="bg-white border-b border-gray-200 px-6 flex items-center gap-8">
                <NavLink to="/" className="text-lg font-bold text-blue-700 py-4 mr-4 no-underline">
                  ⚡ Boltline
                </NavLink>
                <NavItem to="/parts" label="Parts" />
                <NavItem to="/inventory" label="Inventory" />
                <NavItem to="/work-orders" label="Work Orders" />
                <NavItem to="/dashboard" label="Dashboard" />
                <NavItem to="/about" label="About" />
                <UserMenu />
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
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
