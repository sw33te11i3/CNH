import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Splash } from './pages/Splash';
import { DigitalDriverLicense } from './pages/DigitalDriverLicense';

import { Login } from './pages/Login';
import { DriverMenu } from './pages/DriverMenu';
import { Infractions } from './pages/Infractions';


// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminPanel } from './pages/admin/AdminPanel';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Admin */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />

          {/* Rotas Protegidas (App) */}
          <Route path="/app" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="condutor" element={<DriverMenu />} />
            <Route path="infracoes" element={<Infractions />} />
            <Route path="cnh" element={<DigitalDriverLicense />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>
          {/* Redirect unknown routes to splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
