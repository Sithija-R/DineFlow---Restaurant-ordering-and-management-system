
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute() {
  const { isAuthenticated, userInfo } = useAuthStore();
  const location = useLocation();


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (userInfo?.role !== "ADMIN") {
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
}

