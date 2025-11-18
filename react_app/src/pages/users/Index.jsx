import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import RegisterForm from './components/RegisterForm';

const FormReg = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    empresa: '',
    cargo: '',
    rol: 'Cliente'
  });
  const [activeTab, setActiveTab] = useState('properties');

  // Cargar empresas desde MongoDB
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setLoadingEmpresas(true);
        const response = await fetch('https://Boostedapi.vercel.app/api/auth/empresas/todas');
        
        if (!response.ok) {
          throw new Error('Error al cargar empresas');
        }
        
        const empresasData = await response.json();
        
        const empresasOptions = empresasData.map(empresa => ({
          value: empresa.nombre,
          label: empresa.nombre
        }));
        
        setEmpresas(empresasOptions);
      } catch (error) {
        console.error('Error cargando empresas:', error);
        // Fallback con empresas de ejemplo
        setEmpresas([
          { value: 'Boosted', label: 'Boosted' },
          { value: 'Empresa Ejemplo 1', label: 'Empresa Ejemplo 1' },
          { value: 'Empresa Ejemplo 2', label: 'Empresa Ejemplo 2' },
        ]);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    fetchEmpresas();
  }, []);

  const cargos = [
    { value: 'Admin', label: 'Administrador' },
    { value: 'RRHH', label: 'Recursos Humanos' },
    { value: 'Cliente', label: 'Cliente' },
  ];

  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Cliente' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`https://Boostedapi.vercel.app/api/auth/`);
        if (!res.ok) throw new Error('Usuarios no encontrados');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error cargando los usuarios:', err);
        alert('No se pudo cargar la lista de usuarios');
      }
    };

    fetchUsers();
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    if (!formData.nombre || !formData.apellido || !formData.mail || !formData.empresa || !formData.cargo || !formData.rol) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!formData.mail.includes('@')) {
      alert('Por favor ingresa un email válido');
      return;
    }

    try {
      setIsLoading(true);
      
      const userResponse = await fetch('https://Boostedapi.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pass: "",
          estado: "pendiente"
        }),
      });

      if (!userResponse.ok) {
        throw new Error('Error al guardar el usuario');
      }
      
      const saved = await userResponse.json();
      const savedUser = saved?.user;
      
      const mailResponse = await fetch('https://Boostedapi.vercel.app/api/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey: "MI_CLAVE_SECRETA_AQUI",
          to: [formData.mail],
          subject: "Completa tu registro en la plataforma",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00BFFF;">¡Bienvenido a la plataforma!</h2>
              <p>Hola <strong>${formData.nombre} ${formData.apellido}</strong>,</p>
              <p>Has sido registrado en nuestra plataforma. Para completar tu registro y establecer tu contraseña, haz clic en el siguiente botón:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://infoBoosted.vercel.app/set-password?userId=${savedUser?.id || savedUser?._id}" 
                   style="background-color: #00BFFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Establecer Contraseña
                </a>
              </div>
              <p><strong>Datos de tu cuenta:</strong></p>
              <ul>
                <li><strong>Empresa:</strong> ${formData.empresa}</li>
                <li><strong>Cargo:</strong> ${formData.cargo}</li>
                <li><strong>Rol:</strong> ${formData.rol}</li>
              </ul>
              <p style="color: #666; font-size: 12px;">Si no solicitaste este registro, por favor ignora este correo.</p>
            </div>
          `
        }),
      });

      if (!mailResponse.ok) {
        throw new Error('Error al enviar el correo');
      }

      alert('Usuario registrado exitosamente. Se ha enviado un correo para establecer la contraseña.');
      
      setFormData({
        nombre: '',
        apellido: '',
        mail: '',
        empresa: '',
        cargo: '',
        rol: 'user'
      });

      const res = await fetch(`https://Boostedapi.vercel.app/api/auth/`);
      const data = await res.json();
      setUsers(data);

    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error al registrar el usuario: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'properties':
        return (
          <RegisterForm
            formData={formData}
            empresas={empresas}
            cargos={cargos}
            roles={roles}
            onUpdateFormData={updateFormData}
            onRegister={handleRegister}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      {/* AJUSTE CLAVE 1: ml-56 para el sidebar compacto */}
      <main className="ml-56 pt-16 transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Contenedor del Formulario de Registro */}
          <div className="bg-card border border-border rounded-lg shadow-brand">
            <div className="p-6">{getTabContent()}</div>
          </div>

          {/* Tabla de Usuarios Registrados */}
          <div className="bg-card border border-border rounded-lg mt-8 p-6 shadow-brand">
            {/* Título en Dorado (Secondary) para acento */}
            <h2 className="text-xl font-semibold mb-4 text-secondary">Usuarios registrados</h2>

            {users.length === 0 ? (
              <p className="text-muted-foreground">No hay usuarios registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                {/* Estilo de tabla minimalista: sin bordes fuertes en celdas, solo filas sutiles */}
                <table className="min-w-full">
                  {/* Encabezado: Fondo sutil gris oscuro (muted) y texto gris claro (muted-foreground) */}
                  <thead className="bg-muted text-sm text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Nombre</th>
                      <th className="px-4 py-3 text-left font-medium">Empresa</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Cargo</th>
                      <th className="px-4 py-3 text-left font-medium">Rol</th>
                      <th className="px-4 py-3 text-left font-medium">Estado</th>
                      <th className="px-4 py-3 text-left font-medium">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition text-sm text-foreground">
                        {/* Datos de la fila */}
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{u._id}</td> {/* ID en mono y sutil */}
                        <td className="px-4 py-3">{u.nombre || '—'}</td>
                        <td className="px-4 py-3">{u.empresa || '—'}</td>
                        <td className="px-4 py-3 text-primary">{u.mail || '—'}</td> {/* Email en Celeste para destacar */}
                        <td className="px-4 py-3">{u.cargo || '—'}</td>
                        <td className="px-4 py-3">{u.rol || '—'}</td>
                        <td className="px-4 py-3">
                          {/* AJUSTE CLAVE 2: Colores de estado para modo oscuro */}
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            u.estado === 'pendiente' 
                              ? 'bg-warning/20 text-warning' // Amarillo/Ámbar sutil
                              : u.estado === 'activo'
                              ? 'bg-success/20 text-success' // Verde sutil
                              : 'bg-muted/50 text-muted-foreground' // Gris sutil
                          }`}>
                            {u.estado === 'pendiente' ? 'Pendiente' : 
                             u.estado === 'activo' ? 'Activo' : 
                             'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormReg;