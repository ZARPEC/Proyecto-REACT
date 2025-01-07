import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PagPrueba from "./pages/Pueba.js";
import LoginForm from "./pages/login.js";
import Categorias from "./pages/productos/categorias.js";
import Productos from "./pages/productos/catalogo.js";
import CarritoDeCompras from "./pages/productos/carrito.js";
import Chechout from "./pages/checkout.js";
import UserManagement from "./pages/usuarios/crudUsuarios.js";
import Unauthorized from "./pages/unauthorized.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PagPrueba />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<CarritoDeCompras />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute requiredRole="Cliente">
                <Chechout />
              </PrivateRoute>
            }
          />
          <Route
            path="/UsuariosAdmin"
            element={
              <PrivateRoute requiredRole="Administrador">
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              
                <Unauthorized />
              
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
