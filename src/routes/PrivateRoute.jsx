import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra un indicador mientras se verifica la autenticación
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
