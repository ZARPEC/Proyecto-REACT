import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PagPrueba from "./pages/Pueba.js"
import LoginForm from "./pages/login.js"
import Categorias from "./pages/productos/categorias.js";
import Productos from "./pages/productos/catalogo.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PagPrueba />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/productos" element={<Productos/>} />
      </Routes>
    </Router>
  );
}

export default App;
