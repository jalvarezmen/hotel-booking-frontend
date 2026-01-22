import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '../ui/calendar';
import { DoorOpen, DoorClosed, Users } from 'lucide-react';
import { reservationsApi } from '../../services/reservationsApi';
import { Reservation } from '../../services/types';
import { translateRoomType } from '../../utils/formatters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ReservationsByDate {
  [date: string]: {
    checkIns: Reservation[];
    checkOuts: Reservation[];
  };
}

export function ReservationsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations', 'active'],
    queryFn: () => reservationsApi.getActive(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error al cargar las reservas</p>
          <p className="text-sm text-[#8B7355]">Por favor, intenta de nuevo más tarde</p>
        </div>
      </div>
    );
  }

  // Organizar reservas por fecha
  const reservationsByDate: ReservationsByDate = {};

  if (reservations && Array.isArray(reservations)) {
    reservations.forEach((reservation) => {
      try {
        const checkInDate = reservation.checkInDate?.split('T')[0] || reservation.checkInDate; // YYYY-MM-DD
        const checkOutDate = reservation.checkOutDate?.split('T')[0] || reservation.checkOutDate;

        if (checkInDate) {
          // Agregar check-in
          if (!reservationsByDate[checkInDate]) {
            reservationsByDate[checkInDate] = { checkIns: [], checkOuts: [] };
          }
          reservationsByDate[checkInDate].checkIns.push(reservation);
        }

        if (checkOutDate) {
          // Agregar check-out
          if (!reservationsByDate[checkOutDate]) {
            reservationsByDate[checkOutDate] = { checkIns: [], checkOuts: [] };
          }
          reservationsByDate[checkOutDate].checkOuts.push(reservation);
        }
      } catch (err) {
        console.error('Error procesando reserva:', err, reservation);
      }
    });
  }

  // Funciones para verificar si un día tiene reservas
  const hasCheckIn = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return reservationsByDate[dateString]?.checkIns.length > 0;
  };

  const hasCheckOut = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return reservationsByDate[dateString]?.checkOuts.length > 0;
  };

  // Manejar clic en fecha
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    const dayReservations = reservationsByDate[dateString];
    
    if (dayReservations && 
        (dayReservations.checkIns.length > 0 || dayReservations.checkOuts.length > 0)) {
      setIsDialogOpen(true);
    }
  };

  const selectedDayReservations = selectedDate
    ? reservationsByDate[selectedDate.toISOString().split('T')[0]]
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#3E2723]">Calendario de Reservas</h3>
          <p className="text-sm text-[#8B7355]">
            Haz clic en un día para ver los check-ins y check-outs
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[#8B7355]">Check-in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#8B7355]" />
            <span className="text-[#8B7355]">Check-out</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D4C5B0]/30 p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            hasCheckIn,
            hasCheckOut,
          }}
          modifiersClassNames={{
            hasCheckIn: 'relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-[#FF6B35]',
            hasCheckOut: 'relative before:content-[""] before:absolute before:bottom-1 before:left-1/2 before:transform before:-translate-x-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#8B7355] before:ml-1',
          }}
          className="bg-white"
        />
      </div>

      {/* Dialog con detalles del día seleccionado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'America/Bogota',
              })}
            </DialogTitle>
            <DialogDescription>
              Reservas programadas para este día
            </DialogDescription>
          </DialogHeader>

          {selectedDayReservations && (
            <div className="space-y-6">
              {/* Check-ins */}
              {selectedDayReservations.checkIns.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DoorOpen className="w-5 h-5 text-[#FF6B35]" />
                    <h4 className="font-semibold text-[#3E2723]">
                      Check-ins ({selectedDayReservations.checkIns.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {selectedDayReservations.checkIns.map((reservation) => (
                      <Card key={reservation.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-[#3E2723]">
                                {reservation.guest.fullName}
                              </p>
                              <p className="text-sm text-[#8B7355]">
                                Reserva #{reservation.reservationNumber}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Llegada
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-[#8B7355]">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Habitación:</span>
                              <span>Hab. {reservation.room.roomNumber} • {translateRoomType(reservation.room.roomType)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{reservation.numberOfGuests} huésped{reservation.numberOfGuests > 1 ? 'es' : ''}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Check-outs */}
              {selectedDayReservations.checkOuts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DoorClosed className="w-5 h-5 text-[#8B7355]" />
                    <h4 className="font-semibold text-[#3E2723]">
                      Check-outs ({selectedDayReservations.checkOuts.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {selectedDayReservations.checkOuts.map((reservation) => (
                      <Card key={reservation.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-[#3E2723]">
                                {reservation.guest.fullName}
                              </p>
                              <p className="text-sm text-[#8B7355]">
                                Reserva #{reservation.reservationNumber}
                              </p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                              Salida
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-[#8B7355]">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Habitación:</span>
                              <span>Hab. {reservation.room.roomNumber} • {translateRoomType(reservation.room.roomType)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{reservation.numberOfGuests} huésped{reservation.numberOfGuests > 1 ? 'es' : ''}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
