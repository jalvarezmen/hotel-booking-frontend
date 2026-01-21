import { User, DoorOpen, Users, Clock } from 'lucide-react';
import { Reservation } from '../../services/types';
import { Badge } from '../common/Badge';
import { formatCurrency, formatTime, translateReservationStatus, translateRoomType } from '../../utils/formatters';

interface ReservationCardProps {
  reservation: Reservation;
  type: 'checkin' | 'checkout';
  onAction: (id: number, action: 'checkin' | 'checkout') => void;
}

export function ReservationCard({ reservation, type, onAction }: ReservationCardProps) {
  const actionLabel = type === 'checkin' ? 'Check-in' : 'Check-out';
  const canPerformAction = 
    (type === 'checkin' && reservation.status === 'CONFIRMED') ||
    (type === 'checkout' && reservation.status === 'ACTIVE');

  return (
    <div className="bg-white rounded-lg border border-[#D4C5B0]/30 p-5 hover:shadow-md hover:shadow-[#FF6B35]/5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#3E2723] text-lg">
            {reservation.guest.fullName}
          </h3>
          <p className="text-sm text-[#8B7355] mt-1">
            Reserva #{reservation.reservationNumber}
          </p>
        </div>
        <Badge status={reservation.status}>
          {translateReservationStatus(reservation.status)}
        </Badge>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-[#8B7355]">
          <DoorOpen className="w-4 h-4" />
          <span>
            Hab. {reservation.room.roomNumber} • {translateRoomType(reservation.room.roomType)}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#8B7355]">
          <Users className="w-4 h-4" />
          <span>{reservation.numberOfGuests} huésped{reservation.numberOfGuests > 1 ? 'es' : ''}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#8B7355]">
          <User className="w-4 h-4" />
          <span>{reservation.guest.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#8B7355]">
          <Clock className="w-4 h-4" />
          <span>{reservation.numberOfNights} noche{reservation.numberOfNights > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-[#D4C5B0]/20">
        <span className="text-sm font-medium text-[#8B7355]">Total:</span>
        <span className="text-lg font-bold text-[#3E2723]">
          {formatCurrency(reservation.totalAmount)}
        </span>
      </div>

      {/* Action Button */}
      {canPerformAction && (
        <button
          onClick={() => onAction(reservation.id, type)}
          className={`w-full mt-4 px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-300 ${
            type === 'checkin'
              ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA07A] shadow-md hover:shadow-lg'
              : 'bg-gradient-to-r from-[#8B7355] to-[#D4C5B0] hover:from-[#D4C5B0] hover:to-[#8B7355] shadow-md hover:shadow-lg'
          }`}
        >
          {actionLabel}
        </button>
      )}

      {reservation.checkInTime && type === 'checkout' && (
        <p className="text-xs text-[#8B7355] mt-2 text-center">
          Check-in: {formatTime(reservation.checkInTime)}
        </p>
      )}
    </div>
  );
}