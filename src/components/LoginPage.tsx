import { useState } from 'react';
import { Eye, EyeOff, Hotel } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { authApi } from '../services/authApi';
import type { LoginResponse } from '../services/types';

interface LoginPageProps {
  onLogin: (userData: LoginResponse) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ username, password });
      
      // Guardar token en localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      toast.success(`¡Bienvenido ${response.nombre}!`, {
        description: `Rol: ${response.role === 'ADMINISTRADOR' ? 'Administrador' : 'Recepcionista'}`,
      });
      
      onLogin(response);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Usuario o contraseña incorrectos';
      toast.error('Error de autenticación', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Imagen de fondo con overlay beige/naranja */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2ODc5MzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hotel background"
          className="w-full h-full object-cover"
        />
        {/* Overlay con degradado beige/naranja */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/85 via-[#D4C5B0]/70 to-[#FF6B35]/75 backdrop-blur-[2px]" />
      </div>

      {/* Contenido del login */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* Card de login con efecto glassmorphism beige */}
        <div className="w-full max-w-md">
          {/* Glassmorphism container */}
          <div className="relative backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Logo y título */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35]/30 to-[#FF8C42]/30 backdrop-blur-sm border border-[#FF6B35]/40 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Hotel className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
                Sistema de Reservas
              </h1>
              <p className="text-white/70 text-sm">
                Acceso exclusivo para personal
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Campo de usuario */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white text-sm">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-[#FF6B35]/60 backdrop-blur-sm transition-all duration-300 h-12 rounded-xl"
                  required
                />
              </div>

              {/* Campo de contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-[#FF6B35]/60 backdrop-blur-sm transition-all duration-300 h-12 rounded-xl pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA07A] text-white border-none shadow-lg hover:shadow-[#FF6B35]/40 transition-all duration-300 rounded-xl"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}