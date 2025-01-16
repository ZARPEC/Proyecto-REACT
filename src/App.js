import { React, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PagPrueba from "./pages/Pueba.js";
import LoginForm from "./pages/login.js";
import Categorias from "./pages/productos/categorias.js";
import Productos from "./pages/productos/catalogo.js";
import CarritoDeCompras from "./pages/productos/carrito.js";
import Chechout from "./pages/checkout.js";
import UserManagement from "./pages/usuarios/crudUsuarios.js";
import ProductTable from "./pages/productos/crudProductos.js";
import CrudOrdenes from "./pages/ordenesCrud.js";
import Unauthorized from "./pages/unauthorized.js";
import CompraRealizada from "./pages/compraRealizada.js";
import OrdenesUsuario from "./pages/usuarios/ordenesUsuario.js";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

const rol = localStorage.getItem("rol");

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                rol == "Cliente" ? (
                  <PrivateRoute>
                    <Productos />{" "}
                  </PrivateRoute>
                ) : (
                  <PrivateRoute>
                    <CrudOrdenes />
                  </PrivateRoute>
                )
              ) : (
                <LoginForm />
              )
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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/productosCrud"
            element={
              <PrivateRoute requiredRole="Administrador">
                <ProductTable />
              </PrivateRoute>
            }
          />

          <Route
            path="/ordenes"
            element={
              <PrivateRoute requiredRole="Administrador">
                <CrudOrdenes />
              </PrivateRoute>
            }
          />
          <Route
            path="/compra-realizada"
            element={
              <PrivateRoute requiredRole="Cliente">
                <CompraRealizada />
              </PrivateRoute>
            }
          />
          <Route
            path="/ordenesUsuario"
            element={
              <PrivateRoute requiredRole="Cliente">
                <OrdenesUsuario />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
