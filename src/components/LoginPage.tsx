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
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    // Validación básica
    if (!username.trim()) {
      setFieldErrors({ username: 'El usuario es obligatorio' });
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setFieldErrors({ password: 'La contraseña es obligatoria' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ username, password });
      
      // Guardar token en localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      toast.success(`¡Bienvenido ${response.nombre}!`, {
        description: `Rol: ${response.role === 'ADMINISTRADOR' ? 'Administrador' : 'Recepcionista'}`,
      });
      
      onLogin(response);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          'Usuario o contraseña incorrectos';
      
      // Mostrar error general
      setError(errorMessage);
      
      // Mostrar errores en campos específicos si aplica
      if (errorMessage.toLowerCase().includes('usuario') || 
          errorMessage.toLowerCase().includes('username')) {
        setFieldErrors({ username: errorMessage });
      } else if (errorMessage.toLowerCase().includes('contraseña') || 
                 errorMessage.toLowerCase().includes('password')) {
        setFieldErrors({ password: errorMessage });
      } else {
        // Error general - mostrar en ambos campos
        setFieldErrors({
          username: 'Credenciales incorrectas',
          password: 'Credenciales incorrectas',
        });
      }
      
      toast.error('Error de autenticación', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Imagen de fondo sin efectos */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2ODc5MzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hotel background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido del login */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* Card de login */}
        <div className="w-full max-w-md">
          {/* Card container casi transparente */}
          <div className="relative bg-gray-900/30 backdrop-blur-md border border-gray-700/30 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Logo y título */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-400 border border-yellow-500/50 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Hotel className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-light text-gray-200 mb-2 tracking-wide">
                Sistema de Reservas
              </h1>
              <p className="text-gray-400 text-sm">
                Acceso exclusivo para personal
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Mensaje de error general */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-200 text-sm font-medium">Error de autenticación</p>
                      <p className="text-red-300/90 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Campo de usuario */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300 text-sm">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // Limpiar error del campo cuando el usuario empiece a escribir
                    if (fieldErrors.username) {
                      setFieldErrors({ ...fieldErrors, username: undefined });
                    }
                    if (error) {
                      setError('');
                    }
                  }}
                  className={`bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-[#FF6B35] focus:bg-white/25 transition-all duration-300 h-12 rounded-xl ${
                    fieldErrors.username ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50' : ''
                  }`}
                  required
                />
                {fieldErrors.username && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Campo de contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 text-sm">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Limpiar error del campo cuando el usuario empiece a escribir
                      if (fieldErrors.password) {
                        setFieldErrors({ ...fieldErrors, password: undefined });
                      }
                      if (error) {
                        setError('');
                      }
                    }}
                    className={`bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-[#FF6B35] focus:bg-white/25 transition-all duration-300 h-12 rounded-xl pr-12 ${
                      fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.password}
                  </p>
                )}
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