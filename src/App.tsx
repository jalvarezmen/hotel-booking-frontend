import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { PlaceholderView } from './components/placeholder/PlaceholderView';
import { reservationsApi } from './services/reservationsApi';
import { mockTodayReservations } from './services/mockData';
import type { User } from './services/types';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Modo demo - cambiar a false cuando el backend esté disponible
const DEMO_MODE = false;

function MainApp() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');

  // Query para obtener reservas del día
  const { data: todayData, isLoading, error } = useQuery({
    queryKey: ['reservations', 'today'],
    queryFn: async () => {
      if (DEMO_MODE) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockTodayReservations;
      }
      return reservationsApi.getToday();
    },
    enabled: user !== null && currentView === 'dashboard',
  });

  const queryClientInstance = useQueryClient();

  // Mutation para check-in
  const checkInMutation = useMutation({
    mutationFn: async (id: number) => {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Check-in realizado exitosamente (Demo)');
        return;
      }
      return reservationsApi.checkIn(id);
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['reservations', 'today'] });
      if (!DEMO_MODE) {
        toast.success('Check-in realizado exitosamente');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al realizar check-in');
    },
  });

  // Mutation para check-out
  const checkOutMutation = useMutation({
    mutationFn: async (id: number) => {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Check-out realizado exitosamente (Demo)');
        return;
      }
      return reservationsApi.checkOut(id);
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['reservations', 'today'] });
      if (!DEMO_MODE) {
        toast.success('Check-out realizado exitosamente');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al realizar check-out');
    },
  });

  const handleLogin = (username: string, role: 'gerente' | 'recepcionista') => {
    setUser({ username, role });
    toast.success(`¡Bienvenido, ${username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    toast.success('Sesión cerrada correctamente');
  };

  const handleCheckIn = (id: number) => {
    checkInMutation.mutate(id);
  };

  const handleCheckOut = (id: number) => {
    checkOutMutation.mutate(id);
  };

  // Si no hay usuario, mostrar login
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#FAF8F5]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'dashboard' && (
            <>
              {isLoading && <LoadingSpinner />}
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-800">
                  Error al cargar las reservas. Por favor, verifica que el servidor esté en funcionamiento.
                </div>
              )}
              {todayData && (
                <Dashboard
                  data={todayData}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              )}
            </>
          )}
          
          {currentView === 'new-reservation' && (
            <PlaceholderView
              title="Nueva Reserva"
              description="Esta sección permitirá crear nuevas reservas con un formulario multi-paso para ingresar datos del huésped, fechas y seleccionar habitación."
            />
          )}
          
          {currentView === 'search' && (
            <PlaceholderView
              title="Buscar Reservas"
              description="Aquí podrás buscar reservas por número de reserva o nombre de huésped, con resultados en tiempo real."
            />
          )}
          
          {currentView === 'rooms' && (
            <PlaceholderView
              title="Gestión de Habitaciones"
              description="Gestiona las habitaciones del hotel: ver listado completo, crear, editar y eliminar habitaciones."
            />
          )}
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}