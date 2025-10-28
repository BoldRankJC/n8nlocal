"use client";
import { useState, useEffect } from "react"; // Importamos useEffect para leer el tema
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  // Función para obtener el estado del tema (dark o light)
  // NOTA: Esto solo es para leer el tema para fines visuales en el cliente.
  // La aplicación real debería leer la clase 'dark' del <html>.
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
        sessionStorage.setItem("cargo", data?.usr?.cargo); // solo string
        sessionStorage.setItem("email", data?.usr?.email);
        sessionStorage.setItem("user", data?.usr?.name);
        sessionStorage.setItem("token", data?.token);

        navigate(from, { replace: true });
      } else {
        setError(data.message || "Error de login");
        sessionStorage.clear(); // borramos token por seguridad
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
      sessionStorage.clear(); // borramos token por seguridad
    }
  };

  return (
    // Contenedor principal: Ocupa toda la pantalla y usa el fondo del tema (Blanco -> Negro)
    <div className="flex items-center justify-center min-h-screen bg-background">
      
      {/* Formulario: Utiliza bg-card, sombra de marca, y borde dinámico */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-card p-8 rounded-xl shadow-brand border border-border w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          Portal de Ingreso
        </h2>
        
        {/* Mensaje de error: Usa el color 'error' de tu paleta */}
        {error && <p className="text-error mb-4">{error}</p>}
        
        {/* Campo de Email */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-foreground">Email</label>
          <input 
            type="email" 
            // Input: Usa bg-input, borde dinámico y ring dinámico (para el focus)
            className="w-full border border-border p-3 rounded-lg bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        {/* Campo de Contraseña */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-foreground">Contraseña</label>
          <input 
            type="password" 
            // Input: Usa bg-input, borde dinámico y ring dinámico (para el focus)
            className="w-full border border-border p-3 rounded-lg bg-input text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        {/* Botón de Ingreso: Utiliza el color principal (Celeste) */}
        <button 
          type="submit" 
          // Botón: Usa bg-primary y asegura texto en primary-foreground
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-opacity-90 transition-opacity duration-200"
        >
          Ingresar
        </button>
        
        {/* Opcional: Footer con color secundario (Dorado) para un toque */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
            Portal exclusivo para empleados de <span className="text-secondary font-semibold">Boosted</span>.
        </p>
      </form>
    </div>
  );
}