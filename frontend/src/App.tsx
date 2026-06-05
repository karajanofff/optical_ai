import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import { AlertsPage } from "./pages/AlertsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DeviceDetailsPage } from "./pages/DeviceDetailsPage";
import { DevicesPage } from "./pages/DevicesPage";
import { LoginPage } from "./pages/LoginPage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { ReportsPage } from "./pages/ReportsPage";
import { TopologyPage } from "./pages/TopologyPage";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoutes />}>
        <Route index element={<DashboardPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="devices/:id" element={<DeviceDetailsPage />} />
        <Route path="topology" element={<TopologyPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
