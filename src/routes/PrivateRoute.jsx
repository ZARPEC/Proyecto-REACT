import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si el usuario no está autenticado o no tiene el rol adecuado
  if (!isAuthenticated || (requiredRole && requiredRole !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
