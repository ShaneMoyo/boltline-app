import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 px-6 py-0 flex items-center gap-8">
          <span className="text-lg font-bold text-blue-700 py-4 mr-4">⚡ Boltline</span>
          <NavLink
            to="/parts"
            className={({ isActive }) =>
              `py-4 border-b-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`
            }
          >
            Parts
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `py-4 border-b-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`
            }
          >
            Inventory
          </NavLink>
          <NavLink
            to="/work-orders"
            className={({ isActive }) =>
              `py-4 border-b-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`
            }
          >
            Work Orders
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `py-4 border-b-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`
            }
          >
            Dashboard
          </NavLink>
        </nav>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/parts" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
