import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PagPrueba from "./pages/Pueba.js";
import LoginForm from "./pages/login.js";
import Categorias from "./pages/productos/categorias.js";
import Productos from "./pages/productos/catalogo.js";
import CarritoDeCompras from "./pages/productos/carrito.js";
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
