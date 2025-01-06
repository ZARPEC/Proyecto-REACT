import { WindowSharp } from "@mui/icons-material";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPath, setPreviousPath] = useState(null); // Estado para la ruta previa

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setIsAuthenticated(true);
      setRole(decodedToken.rol);
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setIsAuthenticated(true);
    setRole(decodedToken.rol);
    localStorage.setItem("rol", decodedToken.rol);
    window.location.href = "/"; 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        isLoading,
        login,
        logout,
        setPreviousPath, // Exponer la función para guardar la ruta previa
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
