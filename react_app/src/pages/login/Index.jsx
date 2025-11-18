"use client";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from '../../components/AppIcon';
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  // Función para obtener el estado del tema (dark o light)
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://Boostedapi.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res?.ok && data?.success) {
        // Guardamos token en sessionStorage
        setError(data.message || "error");
        sessionStorage.setItem("cargo", data?.usr?.cargo);
        sessionStorage.setItem("email", data?.usr?.email);
        sessionStorage.setItem("user", data?.usr?.name);
        sessionStorage.setItem("token", data?.token);

        navigate(from, { replace: true });
      } else {
        setError(data.message || "Error de login");
        sessionStorage.clear();
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
      sessionStorage.clear();
    }
  };

  return (
    // Contenedor principal: Fondo negro
    <div className="flex items-center justify-center min-h-screen bg-background">

      {/* Formulario: Más compacto, sombra difuminada y borde sutil */}
      {/* Se mantiene  en el formulario para un toque elegante. */}
      <form
        onSubmit={handleSubmit}
        className="bg-card p-10 shadow-xl shadow-black/50 border border-border/50 w-full max-w-xs transition-colors duration-300"
      >
        <div className="flex justify-center mb-6">
          {/* Avatar Minimalista: Círculo Celeste, Borde sutil, Ícono Celeste */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border-2 border-border/50 text-primary">
            <Icon name="Bot" size={24} color="#fff" />

          </div>
        </div>

        {/* Título: Peso más ligero */}
        <h2 className="text-xl font-light mb-8 text-center text-foreground tracking-wider">
          Portal de Ingreso
        </h2>

        {/* Mensaje de error: Box elegante */}
        {error && <p className="text-error mb-4 p-2 text-sm bg-error/10 border border-error/50 rounded-lg">{error}</p>}

        {/* Campo de Email */}
        <div className="mb-6">
          <label className="block mb-2 text-xs font-light text-muted-foreground uppercase">Email</label>
          <input
            type="email"
            // AJUSTES CLAVE: 
            // 1. Fondo negro sutil (bg-input) -> Evita el blanco.
            // 2. Borde redondeado sutil ().
            // 3. Focus: Borde Celeste y anillo Celeste (ring-primary)
            className="w-full border border-border p-3  bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="mb-8">
          <label className="block mb-2 text-xs font-light text-muted-foreground uppercase">Contraseña</label>
          <input
            type="password"
            // AJUSTES CLAVE:
            // 1. Fondo negro sutil (bg-input) -> Evita el blanco.
            // 2. Borde redondeado sutil ().
            // 3. Focus: Borde Celeste y anillo Celeste (ring-primary)
            className="w-full border border-border p-3  bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón de Ingreso: Gradiente Celeste sutil */}
        <button
          type="submit"
          className="w-full relative p-0.5  overflow-hidden transition-all duration-300 group shadow-lg shadow-primary/30" // Reducción de redondeo a 
        >
          {/* Gradiente de fondo al hacer hover (Dorado sutil) */}
          <span className="absolute inset-0 bg-primary/80 group-hover:bg-gradient-to-r group-hover:from-primary/90 group-hover:to-secondary/60 transition-all duration-300 ease-in-out"></span>

          {/* Contenido del botón */}
          <span className="relative w-full block bg-primary py-3  font-semibold text-primary-foreground group-hover:text-card-foreground group-hover:bg-transparent transition-all duration-300">
            Ingresar
          </span>
        </button>

        {/* Footer: Texto más sutil en Dorado */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Portal exclusivo para empleados de <span className="text-secondary font-semibold hover:text-secondary/80 transition-colors cursor-default">Boosted</span>.
        </p>
      </form>
    </div>
  );
}