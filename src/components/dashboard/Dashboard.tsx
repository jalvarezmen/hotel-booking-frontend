import React, { useState } from 'react';
import { Calendar as CalendarIcon, DoorOpen, TrendingUp, Users, CalendarDays } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ReservationCard } from './ReservationCard';
import { TodayReservations } from '../../services/types';
import { formatCurrency } from '../../utils/formatters';
import { Input } from '../ui/input';
import { Button } from '../ui/button';


interface DashboardProps {
  data: TodayReservations;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onCheckIn: (id: number) => void;
  onCheckOut: (id: number) => void;
}

export function Dashboard({ data, selectedDate, onDateChange, onCheckIn, onCheckOut }: DashboardProps) {
  const [localDate, setLocalDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const displayDate = selectedDate || localDate;
  
  const totalReservations = data.checkIns.length + data.checkOuts.length;
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setLocalDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setLocalDate(today);
    if (onDateChange) {
      onDateChange(today);
    }
  };

  const dateObj = new Date(displayDate + 'T00:00:00');
  const isToday = displayDate === new Date().toISOString().split('T')[0];
  const totalRevenue = [...data.checkIns, ...data.checkOuts].reduce(
    (sum, r) => sum + r.totalAmount,
    0
  );
  // Total de hu\u00e9spedes (para futuras estad\u00edsticas)
  // const totalGuests = [...data.checkIns, ...data.checkOuts].reduce(
  //   (sum, r) => sum + r.numberOfGuests,
  //   0
  // );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2723]">Dashboard</h1>
          <p className="text-[#8B7355] mt-1">
            {isToday ? 'Resumen de actividad de hoy' : 'Resumen de actividad'} - {dateObj.toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        {/* Selector de fecha */}
        <div className="flex items-center gap-3 bg-white rounded-lg border border-[#D4C5B0]/30 p-4">
          <div className="flex items-center gap-2 flex-1">
            <CalendarDays className="w-5 h-5 text-[#8B7355]" />
            <label htmlFor="date-selector" className="text-sm font-medium text-[#3E2723]">
              Seleccionar fecha:
            </label>
            <Input
              id="date-selector"
              type="date"
              value={displayDate}
              onChange={handleDateChange}
              className="max-w-[200px] bg-white"
            />
          </div>
          {!isToday && (
            <Button
              onClick={handleTodayClick}
              variant="outline"
              className="border-[#D4C5B0] text-[#8B7355] hover:bg-[#FAF8F5]"
            >
              Ver Hoy
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={isToday ? "Reservas Hoy" : "Reservas"}
          value={totalReservations}
          icon={CalendarIcon}
          color="orange"
        />
        <StatsCard
          title="Check-ins"
          value={data.checkIns.length}
          icon={DoorOpen}
          color="beige"
        />
        <StatsCard
          title="Check-outs"
          value={data.checkOuts.length}
          icon={Users}
          color="brown"
        />
        <StatsCard
          title={isToday ? "Ingresos del Día" : "Ingresos"}
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-ins */}
        <div>
          <h2 className="text-lg font-semibold text-[#3E2723] mb-4 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-[#FF6B35] to-[#FF8C42] rounded-full mr-3" />
            Llegadas {isToday ? 'de Hoy' : ''} ({data.checkIns.length})
          </h2>
          <div className="space-y-4">
            {data.checkIns.length > 0 ? (
              data.checkIns.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  type="checkin"
                  onAction={onCheckIn}
                />
              ))
            ) : (
              <div className="bg-[#FAF8F5] rounded-lg p-8 text-center border border-[#D4C5B0]/30">
                <DoorOpen className="w-12 h-12 text-[#D4C5B0] mx-auto mb-3" />
                <p className="text-[#8B7355]">No hay llegadas programadas {isToday ? 'para hoy' : 'para esta fecha'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Check-outs */}
        <div>
          <h2 className="text-lg font-semibold text-[#3E2723] mb-4 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-[#8B7355] to-[#D4C5B0] rounded-full mr-3" />
            Salidas {isToday ? 'de Hoy' : ''} ({data.checkOuts.length})
          </h2>
          <div className="space-y-4">
            {data.checkOuts.length > 0 ? (
              data.checkOuts.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  type="checkout"
                  onAction={onCheckOut}
                />
              ))
            ) : (
              <div className="bg-[#FAF8F5] rounded-lg p-8 text-center border border-[#D4C5B0]/30">
                <Users className="w-12 h-12 text-[#D4C5B0] mx-auto mb-3" />
                <p className="text-[#8B7355]">No hay salidas programadas {isToday ? 'para hoy' : 'para esta fecha'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}