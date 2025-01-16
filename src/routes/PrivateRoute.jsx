import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, isLoading, setPreviousPath } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  
  if (!isAuthenticated) {
    setPreviousPath(location.pathname); 
    return <Navigate to="/unauthorized" />;
  }


  if (requiredRole && requiredRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
