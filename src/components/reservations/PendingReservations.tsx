import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, DollarSign, User, Calendar, Building2, Users, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { reservationsApi } from '../../services/reservationsApi';
import { Reservation, PaymentMethod } from '../../services/types';
import { formatCurrency, formatDate, translateRoomType } from '../../utils/formatters';

export function PendingReservations() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'CASH' as PaymentMethod,
    amount: 0,
    reference: '',
  });

  const queryClient = useQueryClient();

  // Query para obtener reservas pendientes
  const { data: pendingReservations, isLoading } = useQuery({
    queryKey: ['reservations', 'pending'],
    queryFn: () => reservationsApi.getPending(),
  });

  // Mutation para confirmar pago
  const confirmPaymentMutation = useMutation({
    mutationFn: ({ id, payment }: { id: number; payment: typeof paymentData }) =>
      reservationsApi.confirmPayment(id, {
        paymentMethod: payment.paymentMethod,
        amount: payment.amount,
        reference: payment.reference || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Pago confirmado exitosamente');
      setIsPaymentDialogOpen(false);
      setSelectedReservation(null);
      setPaymentData({
        paymentMethod: 'CASH',
        amount: 0,
        reference: '',
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al confirmar el pago');
    },
  });

  const handleConfirmPayment = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setPaymentData({
      paymentMethod: 'CASH',
      amount: reservation.totalAmount,
      reference: '',
    });
    setIsPaymentDialogOpen(true);
  };

  const handleSubmitPayment = () => {
    if (!selectedReservation) return;

    if (paymentData.amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    if (
      (paymentData.paymentMethod === 'CARD' || paymentData.paymentMethod === 'TRANSFER') &&
      !paymentData.reference.trim()
    ) {
      toast.error('La referencia es obligatoria para este método de pago');
      return;
    }

    confirmPaymentMutation.mutate({
      id: selectedReservation.id,
      payment: paymentData,
    });
  };

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3E2723]">Reservas Pendientes</h1>
        <p className="text-[#8B7355] mt-1">
          Confirma el pago de las reservas para que aparezcan en el Dashboard
        </p>
      </div>

      {/* Reservations List */}
      {pendingReservations && pendingReservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingReservations.map((reservation) => (
            <Card
              key={reservation.id}
              className="bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{reservation.guest.fullName}</CardTitle>
                    <CardDescription>Reserva #{reservation.reservationNumber}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pendiente
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

                {/* Confirm Payment Button */}
                <Button
                  onClick={() => handleConfirmPayment(reservation)}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF8C42] text-white"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Confirmar Pago
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white">
          <CardContent className="py-12 text-center">
            <Clock className="w-16 h-16 text-[#D4C5B0] mx-auto mb-4" />
            <p className="text-[#8B7355] text-lg">No hay reservas pendientes</p>
            <p className="text-[#8B7355] text-sm mt-2">
              Todas las reservas están confirmadas
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del pago para confirmar la reserva{' '}
              {selectedReservation?.reservationNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reservation Summary */}
            {selectedReservation && (
              <div className="bg-[#F0EAE0] rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <strong>Huésped:</strong> {selectedReservation.guest.fullName}
                </p>
                <p>
                  <strong>Habitación:</strong> {selectedReservation.room.roomNumber} •{' '}
                  {translateRoomType(selectedReservation.room.roomType)}
                </p>
                <p>
                  <strong>Total:</strong> {formatCurrency(selectedReservation.totalAmount)}
                </p>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pago *</Label>
              <Select
                value={paymentData.paymentMethod}
                onValueChange={(value) =>
                  setPaymentData({ ...paymentData, paymentMethod: value as PaymentMethod })
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentMethodLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {selectedReservation && (
                <p className="text-xs text-[#8B7355]">
                  Total de la reserva: {formatCurrency(selectedReservation.totalAmount)}
                </p>
              )}
            </div>

            {/* Reference */}
            {(paymentData.paymentMethod === 'CARD' || paymentData.paymentMethod === 'TRANSFER') && (
              <div className="space-y-2">
                <Label htmlFor="reference">Referencia *</Label>
                <Input
                  id="reference"
                  value={paymentData.reference}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, reference: e.target.value })
                  }
                  placeholder={
                    paymentData.paymentMethod === 'CARD'
                      ? 'Últimos 4 dígitos de la tarjeta'
                      : 'Número de transferencia'
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={confirmPaymentMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitPayment}
              disabled={confirmPaymentMutation.isPending}
              className="bg-[#FF6B35] hover:bg-[#FF8C42]"
            >
              {confirmPaymentMutation.isPending ? (
                <>
                  <LoadingSpinner />
                  Confirmando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirmar Pago
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

