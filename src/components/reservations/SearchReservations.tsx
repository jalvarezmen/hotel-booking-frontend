import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Hash, User, Calendar, Building2, Users, Clock, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { reservationsApi } from '../../services/reservationsApi';
import { Reservation, ReservationStatus } from '../../services/types';
import { formatCurrency, formatDate, translateRoomType } from '../../utils/formatters';

type SearchType = 'number' | 'name';

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  EXPIRED: 'bg-orange-50 text-orange-700 border-orange-200',
};

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Expirada',
};

export function SearchReservations() {
  const [searchType, setSearchType] = useState<SearchType>('number');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query para buscar reservas
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['reservations', 'search', searchType, debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return [];
      }

      if (searchType === 'number') {
        try {
          const result = await reservationsApi.searchByNumber(debouncedQuery);
          return Array.isArray(result) ? result : [result];
        } catch (err: any) {
          // Si no encuentra por número exacto, retornar array vacío
          if (err.response?.status === 404) {
            return [];
          }
          throw err;
        }
      } else {
        return await reservationsApi.searchByGuestName(debouncedQuery);
      }
    },
    enabled: debouncedQuery.trim().length > 0,
    retry: false,
  });

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const hasResults = searchResults && searchResults.length > 0;
  const hasSearched = debouncedQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3E2723]">Buscar Reservas</h1>
        <p className="text-[#8B7355] mt-1">
          Busca reservas por número de reserva o nombre de huésped con resultados en tiempo real
        </p>
      </div>

      {/* Search Section */}
      <Card className="bg-white border-[#D4C5B0]/30">
        <CardContent className="p-6">
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as SearchType)}>
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#FFF5F0] border border-[#FFE5D9] rounded-xl p-1">
              <TabsTrigger 
                value="number" 
                className="flex items-center gap-2 data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-[#8B7355] data-[state=active]:shadow-md transition-all duration-200"
              >
                <Hash className="w-4 h-4" />
                Por Número de Reserva
              </TabsTrigger>
              <TabsTrigger 
                value="name" 
                className="flex items-center gap-2 data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-[#8B7355] data-[state=active]:shadow-md transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Por Nombre de Huésped
              </TabsTrigger>
            </TabsList>

            <TabsContent value="number" className="mt-0">
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B7355] w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Ej: RES-2026-4581DB"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white border-[#D4C5B0]/50"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-[#8B7355] mt-2">
                Ingresa el número completo de la reserva (búsqueda exacta)
              </p>
            </TabsContent>

            <TabsContent value="name" className="mt-0">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B7355] w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Ej: Juan, Pérez, Juan Pérez"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white border-[#D4C5B0]/50"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-[#8B7355] mt-2">
                Ingresa nombre o apellido del huésped (búsqueda parcial)
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <Card className="bg-white border-[#D4C5B0]/30">
          <CardContent className="py-12 text-center">
            <div className="text-red-500 mb-2">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-red-600 font-medium">Error al buscar reservas</p>
            <p className="text-[#8B7355] text-sm mt-2">
              Por favor, intenta de nuevo más tarde
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && hasSearched && !hasResults && (
        <Card className="bg-white border-[#D4C5B0]/30">
          <CardContent className="py-12 text-center">
            <Search className="w-16 h-16 text-[#D4C5B0] mx-auto mb-4" />
            <p className="text-[#8B7355] text-lg">No se encontraron reservas</p>
            <p className="text-[#8B7355] text-sm mt-2">
              {searchType === 'number'
                ? 'Verifica que el número de reserva sea correcto'
                : 'Intenta con otro nombre o apellido'}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && hasResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#3E2723]">
              Resultados ({searchResults.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <Card className="bg-white border-[#D4C5B0]/30">
          <CardContent className="py-12 text-center">
            <Search className="w-16 h-16 text-[#D4C5B0] mx-auto mb-4" />
            <p className="text-[#8B7355] text-lg">Comienza tu búsqueda</p>
            <p className="text-[#8B7355] text-sm mt-2">
              {searchType === 'number'
                ? 'Ingresa un número de reserva para buscar'
                : 'Ingresa un nombre de huésped para buscar'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ReservationCardProps {
  reservation: Reservation;
}

function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border-[#D4C5B0]/30">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{reservation.guest.fullName}</CardTitle>
            <CardDescription>Reserva #{reservation.reservationNumber}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={statusColors[reservation.status]}
          >
            {statusLabels[reservation.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reservation Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-[#8B7355]">
            <Building2 className="w-4 h-4" />
            <span>
              Hab. {reservation.room.roomNumber} •{' '}
              {translateRoomType(reservation.room.roomType)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#8B7355]">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#8B7355]">
            <Users className="w-4 h-4" />
            <span>
              {reservation.numberOfGuests}{' '}
              {reservation.numberOfGuests === 1 ? 'huésped' : 'huéspedes'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#8B7355]">
            <Clock className="w-4 h-4" />
            <span>
              {reservation.numberOfNights}{' '}
              {reservation.numberOfNights === 1 ? 'noche' : 'noches'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#8B7355]">
            <User className="w-4 h-4" />
            <span>{reservation.guest.phone}</span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-[#D4C5B0]/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#8B7355]">Total:</span>
            <span className="text-xl font-bold text-[#3E2723]">
              {formatCurrency(reservation.totalAmount)}
            </span>
          </div>
        </div>

        {/* Status-specific info */}
        {reservation.checkInTime && (
          <div className="text-xs text-[#8B7355]">
            Check-in: {new Date(reservation.checkInTime).toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
        {reservation.checkOutTime && (
          <div className="text-xs text-[#8B7355]">
            Check-out: {new Date(reservation.checkOutTime).toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

