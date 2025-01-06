import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, isLoading, setPreviousPath } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, guardar la ruta previa antes de redirigir
  if (!isAuthenticated) {
    setPreviousPath(location.pathname); // Guardar la ruta actual
    return <Navigate to="/unauthorized" />;
  }

  // Verificar rol si es necesario
  if (requiredRole && requiredRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
