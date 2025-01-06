import React, { useState, useEffect, useContext} from "react";

import { useForm } from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { AuthContext } from "../context/AuthContext";

// Creamos componentes wrapper para los iconos


function LoginForm() {



  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginSubmit = async (formData) => {
    console.log(formData);
    const response = await fetch("http://localhost:3005/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      login(token);
      localStorage.setItem("token", token);
      console.log(token);
    } else {
      console.error("Error en la petición");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-600 mt-2">Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(loginSubmit)} className="space-y-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <EmailIcon />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              autoComplete="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "El correo electrónico es obligatorio",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                  message: "correo electrónico inválido",
                },
              })}
            />
          </div>
          {errors?.email && (
            <small style={{ color: "red" }}>{errors.email.message}</small>
          )}

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <LockIcon />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="password"
              placeholder="Introducir contraseña"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es obligatoria",
                },
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />

            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
            </button>
          </div>
          {errors?.password && (
            <small style={{ color: "red" }}>{errors.password.message}</small>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-600">Recordarme</span>
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-600">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <LoginIcon />
            <span>Iniciar Sesión</span>
          </button>

          <p className="text-center text-gray-600 text-sm">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-blue-500 hover:text-blue-600">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
export default LoginForm;
