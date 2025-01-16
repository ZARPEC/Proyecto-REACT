import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Navbar from "./components/navbar";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const NavbarContainer = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Navbar /> : null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthProvider>
);

const navbarRoot = ReactDOM.createRoot(document.getElementById("navbar"));
navbarRoot.render(
  <AuthProvider>
    <React.StrictMode>
      <NavbarContainer />
    </React.StrictMode>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
