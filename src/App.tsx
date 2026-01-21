import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { RoomsManagement } from './components/rooms/RoomsManagement';
import { NewReservation } from './components/reservations/NewReservation';
import { PendingReservations } from './components/reservations/PendingReservations';
import { SearchReservations } from './components/reservations/SearchReservations';
import { UsersManagement } from './components/users/UsersManagement';
import { reservationsApi } from './services/reservationsApi';
import { mockTodayReservations } from './services/mockData';
import type { LoginResponse } from './services/types';

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
  // Verificar si hay una sesión guardada
  const getStoredUser = (): LoginResponse | null => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    if (stored && token) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState<LoginResponse | null>(getStoredUser());
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Función para determinar si la fecha seleccionada es hoy
  const isTodaySelected = () => {
    return selectedDate === new Date().toISOString().split('T')[0];
  };

  // Query para obtener reservas según la fecha seleccionada
  const { data: todayData, isLoading, error } = useQuery({
    queryKey: ['reservations', selectedDate],
    queryFn: async () => {
      if (DEMO_MODE) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockTodayReservations;
      }
      if (isTodaySelected()) {
        return reservationsApi.getToday();
      }
      return reservationsApi.getByDate(selectedDate);
    },
    enabled: user !== null && currentView === 'dashboard',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const queryClientInstance = useQueryClient();

  // Refrescar reservas cuando cambias a la vista del dashboard o cambias la fecha
  useEffect(() => {
    if (currentView === 'dashboard' && user) {
      queryClientInstance.invalidateQueries({ queryKey: ['reservations', selectedDate] });
    }
  }, [currentView, user, selectedDate, queryClientInstance]);

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
      queryClientInstance.invalidateQueries({ queryKey: ['reservations', selectedDate] });
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
      queryClientInstance.invalidateQueries({ queryKey: ['reservations', selectedDate] });
      if (!DEMO_MODE) {
        toast.success('Check-out realizado exitosamente');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al realizar check-out');
    },
  });

  const handleLogin = (userData: LoginResponse) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
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
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              )}
            </>
          )}
          
          {currentView === 'new-reservation' && <NewReservation />}
          
          {currentView === 'pending-reservations' && <PendingReservations />}
          
          {currentView === 'search' && <SearchReservations />}
          
          {currentView === 'rooms' && <RoomsManagement />}
          
          {currentView === 'users' && user?.role === 'ADMINISTRADOR' && <UsersManagement />}
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