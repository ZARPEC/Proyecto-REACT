import { WindowSharp } from "@mui/icons-material";
import React, { createContext, useState, useEffect } from "react";
import { set } from "react-hook-form";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [apellido, setApellido] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPath, setPreviousPath] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log(decodedToken);
      setIsAuthenticated(true);
      setRole(decodedToken.rol);
      setIdUsuario(decodedToken.id);
      setNombre(decodedToken.nombreUsuario);
      setApellido(decodedToken.apellidoUsuario);

    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setIsAuthenticated(true);
    setRole(decodedToken.rol);
    localStorage.setItem("rol", decodedToken.rol);
    localStorage.setItem("idUsuario", decodedToken.id);
    localStorage.setItem("nombre", decodedToken.nombreUsuario);
    localStorage.setItem("apellido", decodedToken.apellidoUsuario);
    if(localStorage.getItem("rol") === "Cliente"){
      window.location.href = "/productos";
    }else if(localStorage.getItem("rol") === "Administrador"){
      window.location.href = "/ordenes";
    }
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
        setPreviousPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
