import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DoorOpen, DoorClosed, Users, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { reservationsApi } from '../../services/reservationsApi';
import { Reservation } from '../../services/types';
import { translateRoomType } from '../../utils/formatters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
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

export function ReservationsView() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
        const checkInDate = reservation.checkInDate?.split('T')[0] || reservation.checkInDate;
        const checkOutDate = reservation.checkOutDate?.split('T')[0] || reservation.checkOutDate;

        if (checkInDate) {
          if (!reservationsByDate[checkInDate]) {
            reservationsByDate[checkInDate] = { checkIns: [], checkOuts: [] };
          }
          reservationsByDate[checkInDate].checkIns.push(reservation);
        }

        if (checkOutDate) {
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

  // Obtener todas las fechas únicas
  const allDates = Object.keys(reservationsByDate).sort();

  // Filtrar fechas del mes actual
  const currentYear = currentMonth.getFullYear();
  const currentMonthNum = currentMonth.getMonth();

  const datesThisMonth = allDates.filter(dateStr => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getFullYear() === currentYear && date.getMonth() === currentMonthNum;
  });

  // Agrupar por semana para mejor visualización
  const weeks: { date: string; checkIns: Reservation[]; checkOuts: Reservation[] }[][] = [];
  let currentWeek: { date: string; checkIns: Reservation[]; checkOuts: Reservation[] }[] = [];

  datesThisMonth.forEach((dateStr, index) => {
    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay();
    
    // Si es domingo o el primer día, empezar nueva semana
    if (dayOfWeek === 0 || index === 0) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
    }
    
    currentWeek.push({
      date: dateStr,
      ...reservationsByDate[dateStr]
    });
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthNum - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthNum + 1, 1));
  };

  const selectedDayReservations = selectedDate ? reservationsByDate[selectedDate] : null;

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#3E2723]">Vista de Reservas</h3>
          <p className="text-sm text-[#8B7355]">
            Haz clic en un día para ver los detalles de check-ins y check-outs
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

      {/* Navegación de mes */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-[#D4C5B0]/30 p-4">
        <Button
          variant="outline"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h4 className="text-lg font-semibold text-[#3E2723]">
          {monthNames[currentMonthNum]} {currentYear}
        </h4>
        <Button
          variant="outline"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista de días con reservas */}
      {datesThisMonth.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="py-12 text-center">
            <CalendarIcon className="w-16 h-16 text-[#D4C5B0] mx-auto mb-4" />
            <p className="text-[#8B7355] text-lg">No hay reservas para este mes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {datesThisMonth.map((dateStr) => {
            const dayReservations = reservationsByDate[dateStr];
            const date = new Date(dateStr + 'T00:00:00');
            const total = (dayReservations.checkIns.length || 0) + (dayReservations.checkOuts.length || 0);

            return (
              <Card
                key={dateStr}
                className="bg-white cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleDateClick(dateStr)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl font-bold text-[#3E2723] min-w-[40px]">
                          {date.getDate()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#3E2723]">
                            {date.toLocaleDateString('es-CO', {
                              weekday: 'long',
                              month: 'long',
                              timeZone: 'America/Bogota',
                            })}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            {dayReservations.checkIns.length > 0 && (
                              <div className="flex items-center gap-1 text-sm text-[#8B7355]">
                                <DoorOpen className="w-4 h-4 text-[#FF6B35]" />
                                <span>{dayReservations.checkIns.length} check-in{dayReservations.checkIns.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            {dayReservations.checkOuts.length > 0 && (
                              <div className="flex items-center gap-1 text-sm text-[#8B7355]">
                                <DoorClosed className="w-4 h-4 text-[#8B7355]" />
                                <span>{dayReservations.checkOuts.length} check-out{dayReservations.checkOuts.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Preview de reservas */}
                      <div className="mt-2 space-y-1">
                        {dayReservations.checkIns.slice(0, 2).map((reservation) => (
                          <div key={reservation.id} className="text-sm text-[#8B7355]">
                            <span className="text-[#FF6B35] font-medium">→</span> {reservation.guest.fullName} - Hab. {reservation.room.roomNumber}
                          </div>
                        ))}
                        {dayReservations.checkOuts.slice(0, 2).map((reservation) => (
                          <div key={reservation.id} className="text-sm text-[#8B7355]">
                            <span className="text-[#8B7355] font-medium">←</span> {reservation.guest.fullName} - Hab. {reservation.room.roomNumber}
                          </div>
                        ))}
                        {total > 4 && (
                          <div className="text-sm text-[#8B7355] font-medium">
                            +{total - 4} más...
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20">
                      {total} {total === 1 ? 'reserva' : 'reservas'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog con detalles del día seleccionado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && new Date(selectedDate + 'T00:00:00-05:00').toLocaleDateString('es-CO', {
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

