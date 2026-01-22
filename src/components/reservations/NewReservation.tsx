import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  User, Calendar, Bed, CheckCircle2, ArrowLeft, ArrowRight, 
  Mail, Phone, FileText, Users, Building2, DollarSign, Image 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { reservationsApi } from '../../services/reservationsApi';
import { roomsApi } from '../../services/roomsApi';
import { CreateReservationDTO, Room, RoomType } from '../../services/types';
import { formatCurrency, translateRoomType } from '../../utils/formatters';

interface GuestFormData {
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
}

interface ReservationFormData {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  roomId: number | null;
}

const roomTypeLabels: Record<RoomType, string> = {
  [RoomType.STANDARD]: 'Estándar',
  [RoomType.SUPERIOR]: 'Superior',
  [RoomType.DELUXE]: 'Deluxe',
  [RoomType.SUITE]: 'Suite',
};

const inputBaseClass = 'border-[#D4C5B0]/50 text-[#3E2723] placeholder:text-[#8B7355] bg-white focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20';

export function NewReservation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [guestData, setGuestData] = useState<GuestFormData>({
    firstName: '',
    lastName: '',
    documentNumber: '',
    email: '',
    phone: '',
  });
  const [reservationData, setReservationData] = useState<ReservationFormData>({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    roomId: null,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [selectedRoomType, setSelectedRoomType] = useState<string>('ALL');

  const queryClient = useQueryClient();

  // Query para obtener habitaciones disponibles
  const { data: availableRooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['availableRooms', reservationData.checkInDate, reservationData.checkOutDate, selectedRoomType],
    queryFn: async () => {
      if (!reservationData.checkInDate || !reservationData.checkOutDate) {
        return [];
      }
      return roomsApi.getAvailable(
        reservationData.checkInDate,
        reservationData.checkOutDate,
        selectedRoomType !== 'ALL' ? selectedRoomType : undefined
      );
    },
    enabled: currentStep >= 3 && !!reservationData.checkInDate && !!reservationData.checkOutDate,
  });

  // Mutation para crear reserva
  const createMutation = useMutation({
    mutationFn: (data: CreateReservationDTO) => reservationsApi.create(data),
    onSuccess: (reservation) => {
      // Invalidar queries de reservas para actualizar el Dashboard
      queryClient.invalidateQueries({ queryKey: ['reservations', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success(`Reserva creada exitosamente. Número: ${reservation.reservationNumber}`);
      // Resetear formulario
      setCurrentStep(1);
      setGuestData({
        firstName: '',
        lastName: '',
        documentNumber: '',
        email: '',
        phone: '',
      });
      setReservationData({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        roomId: null,
      });
      setSelectedRoomType('ALL');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear la reserva');
    },
  });

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    
    if (!guestData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (guestData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!guestData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (guestData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (!guestData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es obligatorio';
    } else if (guestData.documentNumber.trim().length < 5) {
      newErrors.documentNumber = 'El documento debe tener al menos 5 caracteres';
    }
    
    if (!guestData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!guestData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(guestData.phone)) {
      newErrors.phone = 'El teléfono debe tener un formato válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    // Obtener fecha de hoy en formato YYYY-MM-DD para comparación sin problemas de zona horaria
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    if (!reservationData.checkInDate) {
      newErrors.checkInDate = 'La fecha de entrada es obligatoria';
    } else {
      // Comparar strings de fecha directamente (YYYY-MM-DD)
      if (reservationData.checkInDate < todayString) {
        newErrors.checkInDate = 'La fecha de entrada no puede ser anterior a hoy';
      }
    }
    
    if (!reservationData.checkOutDate) {
      newErrors.checkOutDate = 'La fecha de salida es obligatoria';
    } else if (reservationData.checkInDate) {
      const checkIn = new Date(reservationData.checkInDate);
      const checkOut = new Date(reservationData.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'La fecha de salida debe ser posterior a la de entrada';
      }
    }
    
    if (!reservationData.numberOfGuests || reservationData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'Debe haber al menos 1 huésped';
    } else if (reservationData.numberOfGuests > 10) {
      newErrors.numberOfGuests = 'El número de huéspedes no puede exceder 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!reservationData.roomId) {
        toast.error('Por favor selecciona una habitación');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!reservationData.roomId) {
      toast.error('Por favor selecciona una habitación');
      return;
    }

    const reservationDTO: CreateReservationDTO = {
      guest: {
        firstName: guestData.firstName.trim(),
        lastName: guestData.lastName.trim(),
        documentNumber: guestData.documentNumber.trim(),
        email: guestData.email.trim(),
        phone: guestData.phone.trim(),
      },
      roomId: reservationData.roomId,
      checkInDate: reservationData.checkInDate,
      checkOutDate: reservationData.checkOutDate,
      numberOfGuests: reservationData.numberOfGuests,
    };

    createMutation.mutate(reservationDTO);
  };

  const selectedRoom = availableRooms?.find(r => r.id === reservationData.roomId);
  const nights = reservationData.checkInDate && reservationData.checkOutDate
    ? Math.ceil(
        (new Date(reservationData.checkOutDate).getTime() - 
         new Date(reservationData.checkInDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    : 0;
  const totalAmount = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  const steps = [
    { number: 1, title: 'Datos del Huésped', icon: User },
    { number: 2, title: 'Fechas y Huéspedes', icon: Calendar },
    { number: 3, title: 'Seleccionar Habitación', icon: Bed },
    { number: 4, title: 'Confirmación', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3E2723]">Nueva Reserva</h1>
        <p className="text-[#8B7355] mt-1">
          Completa el formulario para crear una nueva reserva
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                      : isCompleted
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                      : 'bg-white border-[#D4C5B0] text-[#8B7355]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-[#3E2723]' : 'text-[#8B7355]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    isCompleted ? 'bg-[#FF6B35]' : 'bg-[#D4C5B0]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <Card className="bg-white border-[#D4C5B0]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <User className="w-5 h-5" />}
            {currentStep === 2 && <Calendar className="w-5 h-5" />}
            {currentStep === 3 && <Bed className="w-5 h-5" />}
            {currentStep === 4 && <CheckCircle2 className="w-5 h-5" />}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Ingresa los datos personales del huésped'}
            {currentStep === 2 && 'Selecciona las fechas de estadía y número de huéspedes'}
            {currentStep === 3 && 'Elige una habitación disponible para las fechas seleccionadas'}
            {currentStep === 4 && 'Revisa los detalles y confirma la reserva'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Guest Data */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#3E2723]">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={guestData.firstName}
                    onChange={(e) => {
                      setGuestData({ ...guestData, firstName: e.target.value });
                      if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                    }}
                    placeholder="Juan"
                    className={`${inputBaseClass} ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#3E2723]">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={guestData.lastName}
                    onChange={(e) => {
                      setGuestData({ ...guestData, lastName: e.target.value });
                      if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                    }}
                    placeholder="Pérez"
                    className={`${inputBaseClass} ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber" className="text-[#3E2723]">Número de Documento *</Label>
                <Input
                  id="documentNumber"
                  value={guestData.documentNumber}
                  onChange={(e) => {
                    setGuestData({ ...guestData, documentNumber: e.target.value });
                    if (errors.documentNumber) setErrors({ ...errors, documentNumber: undefined });
                  }}
                  placeholder="12345678"
                  className={`${inputBaseClass} ${errors.documentNumber ? 'border-red-500' : ''}`}
                />
                {errors.documentNumber && (
                  <p className="text-sm text-red-500">{errors.documentNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#3E2723]">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestData.email}
                  onChange={(e) => {
                    setGuestData({ ...guestData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="juan.perez@example.com"
                  className={`${inputBaseClass} ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#3E2723]">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={guestData.phone}
                  onChange={(e) => {
                    setGuestData({ ...guestData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="+54 11 1234-5678"
                  className={`${inputBaseClass} ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Dates and Guests */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInDate" className="text-[#3E2723]">Fecha de Entrada *</Label>
                  <Input
                    id="checkInDate"
                    type="date"
                    value={reservationData.checkInDate}
                    onChange={(e) => {
                      setReservationData({ ...reservationData, checkInDate: e.target.value });
                      if (errors.checkInDate) setErrors({ ...errors, checkInDate: undefined });
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className={`${inputBaseClass} ${errors.checkInDate ? 'border-red-500' : ''}`}
                  />
                  {errors.checkInDate && (
                    <p className="text-sm text-red-500">{errors.checkInDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOutDate" className="text-[#3E2723]">Fecha de Salida *</Label>
                  <Input
                    id="checkOutDate"
                    type="date"
                    value={reservationData.checkOutDate}
                    onChange={(e) => {
                      setReservationData({ ...reservationData, checkOutDate: e.target.value });
                      if (errors.checkOutDate) setErrors({ ...errors, checkOutDate: undefined });
                    }}
                    min={reservationData.checkInDate || new Date().toISOString().split('T')[0]}
                    className={`${inputBaseClass} ${errors.checkOutDate ? 'border-red-500' : ''}`}
                  />
                  {errors.checkOutDate && (
                    <p className="text-sm text-red-500">{errors.checkOutDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfGuests" className="text-[#3E2723]">Número de Huéspedes *</Label>
                <Input
                  id="numberOfGuests"
                  type="number"
                  min="1"
                  max="10"
                  value={reservationData.numberOfGuests || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir campo vacío mientras el usuario escribe
                    if (value === '') {
                      setReservationData({
                        ...reservationData,
                        numberOfGuests: 0,
                      });
                    } else {
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue)) {
                        setReservationData({
                          ...reservationData,
                          numberOfGuests: numValue,
                        });
                      }
                    }
                    if (errors.numberOfGuests) setErrors({ ...errors, numberOfGuests: undefined });
                  }}
                  onBlur={(e) => {
                    // Si está vacío al perder el foco, establecer valor por defecto
                    if (!e.target.value || parseInt(e.target.value, 10) < 1) {
                      setReservationData({
                        ...reservationData,
                        numberOfGuests: 1,
                      });
                    }
                  }}
                  placeholder="Ingresa el número de huéspedes (1-10)"
                  className={`${inputBaseClass} ${errors.numberOfGuests ? 'border-red-500' : ''}`}
                />
                {errors.numberOfGuests && (
                  <p className="text-sm text-red-500">{errors.numberOfGuests}</p>
                )}
                <p className="text-sm text-[#8B7355]">
                  El número de huéspedes debe ser entre 1 y 10
                </p>
              </div>

              {reservationData.checkInDate && reservationData.checkOutDate && (
                <div className="mt-4 p-4 bg-[#F0EAE0] rounded-lg">
                  <p className="text-sm text-[#3E2723]">
                    <strong>Estadía:</strong> {nights} {nights === 1 ? 'noche' : 'noches'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Room Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomType">Filtrar por Tipo de Habitación</Label>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los tipos</SelectItem>
                    {Object.entries(roomTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoadingRooms ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : availableRooms && availableRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms
                    .filter(room => selectedRoomType === 'ALL' || room.roomType === selectedRoomType)
                    .map((room) => (
                      <Card
                        key={room.id}
                        className={`bg-white border-[#D4C5B0]/30 cursor-pointer transition-all ${
                          reservationData.roomId === room.id
                            ? 'ring-2 ring-[#FF6B35] border-[#FF6B35]'
                            : 'hover:border-[#FF6B35]'
                        }`}
                        onClick={() => setReservationData({ ...reservationData, roomId: room.id })}
                      >
                        <CardContent className="p-0">
                          {room.imageUrl ? (
                            <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                              <img
                                src={room.imageUrl}
                                alt={`Habitación ${room.roomNumber}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-48 w-full bg-gradient-to-br from-[#FF6B35]/10 to-[#FF8C42]/10 flex items-center justify-center rounded-t-xl">
                              <Building2 className="w-16 h-16 text-[#FF6B35]/30" />
                            </div>
                          )}
                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-[#3E2723]">
                                Habitación {room.roomNumber}
                              </h3>
                              <Badge variant="outline">
                                {translateRoomType(room.roomType)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#8B7355]">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(room.pricePerNight)}/noche</span>
                              </div>
                            </div>
                            {reservationData.numberOfGuests > room.capacity && (
                              <p className="text-sm text-red-500">
                                La capacidad de esta habitación es menor al número de huéspedes
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#8B7355]">
                    No hay habitaciones disponibles para las fechas seleccionadas.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && selectedRoom && (
            <div className="space-y-6">
              {/* Guest Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#3E2723] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Datos del Huésped
                </h3>
                <div className="bg-[#F0EAE0] rounded-lg p-4 space-y-2">
                  <p><strong>Nombre completo:</strong> {guestData.firstName} {guestData.lastName}</p>
                  <p><strong>Documento:</strong> {guestData.documentNumber}</p>
                  <p><strong>Email:</strong> {guestData.email}</p>
                  <p><strong>Teléfono:</strong> {guestData.phone}</p>
                </div>
              </div>

              {/* Reservation Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#3E2723] flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Detalles de la Reserva
                </h3>
                <div className="bg-[#F0EAE0] rounded-lg p-4 space-y-2">
                  <p><strong>Fecha de entrada:</strong> {new Date(reservationData.checkInDate + 'T00:00:00-05:00').toLocaleDateString('es-CO', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    timeZone: 'America/Bogota'
                  })}</p>
                  <p><strong>Fecha de salida:</strong> {new Date(reservationData.checkOutDate + 'T00:00:00-05:00').toLocaleDateString('es-CO', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    timeZone: 'America/Bogota'
                  })}</p>
                  <p><strong>Número de noches:</strong> {nights}</p>
                  <p><strong>Número de huéspedes:</strong> {reservationData.numberOfGuests}</p>
                </div>
              </div>

              {/* Room Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#3E2723] flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  Habitación Seleccionada
                </h3>
                <div className="bg-[#F0EAE0] rounded-lg p-4 space-y-2">
                  <p><strong>Habitación:</strong> {selectedRoom.roomNumber}</p>
                  <p><strong>Tipo:</strong> {translateRoomType(selectedRoom.roomType)}</p>
                  <p><strong>Capacidad:</strong> {selectedRoom.capacity} {selectedRoom.capacity === 1 ? 'persona' : 'personas'}</p>
                  <p><strong>Precio por noche:</strong> {formatCurrency(selectedRoom.pricePerNight)}</p>
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#FF6B35] text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total a pagar:</span>
                  <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
                </div>
                <p className="text-sm mt-2 opacity-90">
                  {nights} {nights === 1 ? 'noche' : 'noches'} × {formatCurrency(selectedRoom.pricePerNight)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF8C42]"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF8C42]"
          >
            {createMutation.isPending ? (
              <>
                <LoadingSpinner />
                Creando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Reserva
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

