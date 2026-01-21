import { Home, Calendar, Search, DoorOpen, LogOut, Clock } from 'lucide-react';
import { User } from '../../services/types';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: User;
  onLogout: () => void;
}

export function Sidebar({ currentView, onViewChange, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new-reservation', label: 'Nueva Reserva', icon: Calendar },
    { id: 'pending-reservations', label: 'Reservas Pendientes', icon: Clock },
    { id: 'search', label: 'Buscar Reservas', icon: Search },
    { id: 'rooms', label: 'Habitaciones', icon: DoorOpen },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-[#D4C5B0]/30 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#D4C5B0]/30">
        <h1 className="text-xl font-semibold text-[#3E2723]">Hotel Manager</h1>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-[#D4C5B0]/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] flex items-center justify-center shadow-md">
            <span className="text-white font-medium text-sm">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#3E2723]">{user.username}</p>
            <p className="text-xs text-[#8B7355] capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white shadow-md'
                  : 'text-[#3E2723] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#D4C5B0]/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#3E2723] hover:bg-[#FAF8F5] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}