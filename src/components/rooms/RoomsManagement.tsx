import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Bed, Hash, Users, DollarSign, Building2, Image, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
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
import { roomsApi } from '../../services/roomsApi';
import { Room, RoomType } from '../../services/types';
import { formatCurrency } from '../../utils/formatters';

interface RoomFormData {
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  pricePerNight: number;
  imageUrl: string;
}

const initialFormData: RoomFormData = {
  roomNumber: '',
  roomType: RoomType.STANDARD,
  capacity: 1,
  pricePerNight: 0,
  imageUrl: '',
};

const roomTypeLabels: Record<RoomType, string> = {
  [RoomType.STANDARD]: 'Estándar',
  [RoomType.SUPERIOR]: 'Superior',
  [RoomType.DELUXE]: 'Deluxe',
  [RoomType.SUITE]: 'Suite',
};

export function RoomsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RoomFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});

  const queryClient = useQueryClient();

  // Query para obtener todas las habitaciones
  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const roomsData = await roomsApi.getAll();
      console.log('Habitaciones obtenidas:', roomsData);
      roomsData.forEach(room => {
        console.log(`Habitación ${room.roomNumber}: imageUrl =`, room.imageUrl);
      });
      return roomsData;
    },
  });

  // Mutation para crear habitación
  const createMutation = useMutation({
    mutationFn: (data: RoomFormData) => roomsApi.create({
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      capacity: data.capacity,
      pricePerNight: data.pricePerNight,
      imageUrl: data.imageUrl && data.imageUrl.trim() !== '' ? data.imageUrl.trim() : undefined,
    }),
    onSuccess: (newRoom) => {
      // Debug: verificar que la respuesta incluya imageUrl
      console.log('Habitación creada:', newRoom);
      console.log('ImageUrl recibido:', newRoom.imageUrl);
      
      // Actualizar la cache directamente con la respuesta del servidor
      queryClient.setQueryData(['rooms'], (oldRooms: Room[] = []) => {
        return [...oldRooms, newRoom];
      });
      // Invalidar para asegurar que se recarguen todos los datos
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Habitación creada exitosamente');
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la habitación';
      toast.error(message);
    },
  });

  // Mutation para actualizar habitación
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoomFormData }) =>
      roomsApi.update(id, {
        roomNumber: data.roomNumber,
        roomType: data.roomType,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight,
        imageUrl: data.imageUrl && data.imageUrl.trim() !== '' ? data.imageUrl.trim() : undefined,
      }),
    onSuccess: (updatedRoom) => {
      // Actualizar la cache directamente con la respuesta del servidor
      queryClient.setQueryData(['rooms'], (oldRooms: Room[] = []) => {
        return oldRooms.map(room => room.id === updatedRoom.id ? updatedRoom : room);
      });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Habitación actualizada exitosamente');
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la habitación';
      toast.error(message);
    },
  });

  // Mutation para eliminar habitación
  const deleteMutation = useMutation({
    mutationFn: (id: number) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Habitación eliminada exitosamente');
      setIsDeleteDialogOpen(false);
      setDeleteRoomId(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar la habitación';
      toast.error(message);
    },
  });

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        imageUrl: room.imageUrl || '',
      });
    } else {
      setSelectedRoom(null);
      setFormData(initialFormData);
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoom(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleOpenDeleteDialog = (roomId: number) => {
    setDeleteRoomId(roomId);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoomFormData, string>> = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'El número de habitación es requerido';
    }

    if (formData.capacity < 1 || formData.capacity > 10) {
      newErrors.capacity = 'La capacidad debe estar entre 1 y 10 personas';
    }

    if (formData.pricePerNight <= 0) {
      newErrors.pricePerNight = 'El precio por noche debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedRoom) {
      updateMutation.mutate({ id: selectedRoom.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-800">
        Error al cargar las habitaciones. Por favor, verifica que el servidor esté en funcionamiento.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2723]">Gestión de Habitaciones</h1>
          <p className="text-[#8B7355] mt-1">
            Administra las habitaciones del hotel: crear, editar y eliminar
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#FF6B35] hover:bg-[#FF8C42]">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Habitación
        </Button>
      </div>

      {/* Rooms Grid */}
      {rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card 
              key={room.id} 
              className="bg-white border-[#E8DED0] overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Imagen de la habitación */}
              <div className="relative h-48 w-full overflow-hidden bg-[#FAF8F5]">
                {room.imageUrl && room.imageUrl.trim() !== '' ? (
                  <>
                    <img
                      src={room.imageUrl}
                      alt={`Habitación ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onLoad={() => console.log('Imagen cargada exitosamente:', room.imageUrl)}
                      onError={(e) => {
                        console.error('Error cargando imagen:', room.imageUrl, e);
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent && !parent.querySelector('.error-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'error-placeholder w-full h-full flex items-center justify-center';
                          placeholder.innerHTML = `
                            <svg class="w-16 h-16 text-[#D4C5B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bed className="w-16 h-16 text-[#D4C5B0]" />
                  </div>
                )}
                {/* Badge de Estado */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={room.isAvailable ? 'default' : 'secondary'}
                    className={
                      room.isAvailable
                        ? 'bg-green-100 text-green-800 border-green-300 font-medium'
                        : 'bg-red-100 text-red-800 border-red-300 font-medium'
                    }
                  >
                    {room.isAvailable ? 'Disponible' : 'Ocupada'}
                  </Badge>
                </div>
                {/* Menú de acciones */}
                <div className="absolute top-3 left-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                        type="button"
                      >
                        <MoreVertical className="w-4 h-4 text-[#3E2723]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-white border-[#E8DED0]">
                      <DropdownMenuItem
                        onClick={() => handleOpenDialog(room)}
                        className="cursor-pointer focus:bg-[#FAF8F5]"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDeleteDialog(room.id)}
                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#3E2723]">#{room.roomNumber}</h3>
                    <p className="text-sm text-[#8B7355] mt-0.5">
                      {roomTypeLabels[room.roomType]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-[#8B7355] pt-2 border-t border-[#E8DED0]">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#FF6B35]">
                      {formatCurrency(room.pricePerNight)}
                    </span>
                    <span className="text-sm text-[#8B7355]">/noche</span>
                  </div>
                </div>
              </CardContent>

              {/* Footer con botones de acción */}
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(room)}
                  className="flex-1 border-[#E8DED0] text-[#3E2723] hover:bg-[#FAF8F5] hover:border-[#D4C5B0]"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDeleteDialog(room.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#E8DED0] p-12 text-center">
          <Bed className="w-16 h-16 mx-auto mb-4 text-[#D4C5B0]" />
          <h3 className="text-lg font-semibold text-[#3E2723] mb-2">No hay habitaciones registradas</h3>
          <p className="text-[#8B7355] mb-4">
            Comienza creando tu primera habitación en el hotel
          </p>
          <Button onClick={() => handleOpenDialog()} className="bg-[#FF6B35] hover:bg-[#FF8C42]">
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Habitación
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl bg-white border-[#E8DED0] shadow-2xl backdrop-blur-0">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35]/10 to-[#FF8C42]/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#3E2723]">
                  {selectedRoom ? 'Editar Habitación' : 'Nueva Habitación'}
                </DialogTitle>
                <DialogDescription className="text-[#8B7355] mt-1">
                  {selectedRoom
                    ? 'Modifica los datos de la habitación'
                    : 'Ingresa los datos de la nueva habitación'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 py-4">
              {/* Número de Habitación */}
              <div className="space-y-2">
                <Label htmlFor="roomNumber" className="text-[#3E2723] font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#FF6B35]" />
                  Número de Habitación *
                </Label>
                <div className="relative">
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNumber: e.target.value })
                    }
                    placeholder="Ej: 101, 205, 310..."
                    className={`h-12 rounded-xl bg-[#FEFDFB] border-[#E8DED0] text-[#3E2723] placeholder:text-[#8B7355]/50 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all ${
                      errors.roomNumber ? 'border-red-400 ring-2 ring-red-400/20' : ''
                    }`}
                  />
                </div>
                {errors.roomNumber && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.roomNumber}
                  </p>
                )}
              </div>

              {/* Tipo de Habitación */}
              <div className="space-y-2">
                <Label htmlFor="roomType" className="text-[#3E2723] font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF6B35]" />
                  Tipo de Habitación *
                </Label>
                <Select
                  value={formData.roomType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, roomType: value as RoomType })
                  }
                >
                  <SelectTrigger 
                    id="roomType"
                    className="h-12 rounded-xl bg-[#FEFDFB] border-[#E8DED0] text-[#3E2723] focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.entries(roomTypeLabels).map(([value, label]) => (
                      <SelectItem 
                        key={value} 
                        value={value}
                        className="cursor-pointer focus:bg-[#FAF8F5]"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Capacidad */}
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-[#3E2723] font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF6B35]" />
                  Capacidad (personas) *
                </Label>
                <div className="relative">
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.capacity || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Permitir campo vacío mientras el usuario escribe
                      if (value === '') {
                        setFormData({
                          ...formData,
                          capacity: 0,
                        });
                      } else {
                        const numValue = parseInt(value, 10);
                        if (!isNaN(numValue)) {
                          setFormData({
                            ...formData,
                            capacity: numValue,
                          });
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // Si está vacío al perder el foco, establecer valor por defecto
                      if (!e.target.value || parseInt(e.target.value, 10) < 1) {
                        setFormData({
                          ...formData,
                          capacity: 1,
                        });
                      }
                    }}
                    placeholder="Ingresa el número de personas (1-10)"
                    className={`h-12 rounded-xl bg-[#FEFDFB] border-[#E8DED0] text-[#3E2723] placeholder:text-[#8B7355]/50 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all ${
                      errors.capacity ? 'border-red-400 ring-2 ring-red-400/20' : ''
                    }`}
                  />
                </div>
                {errors.capacity && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.capacity}
                  </p>
                )}
              </div>

              {/* Precio por Noche */}
              <div className="space-y-2">
                <Label htmlFor="pricePerNight" className="text-[#3E2723] font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                  $ Precio por Noche *
                </Label>
                <div className="relative">
                  <Input
                    id="pricePerNight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerNight || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Permitir campo vacío mientras el usuario escribe
                      if (value === '') {
                        setFormData({
                          ...formData,
                          pricePerNight: 0,
                        });
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          setFormData({
                            ...formData,
                            pricePerNight: numValue,
                          });
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // Si está vacío al perder el foco, establecer valor por defecto
                      if (!e.target.value || parseFloat(e.target.value) <= 0) {
                        setFormData({
                          ...formData,
                          pricePerNight: 0,
                        });
                      }
                    }}
                    placeholder="0.00"
                    className={`h-12 rounded-xl bg-[#FEFDFB] border-[#E8DED0] text-[#3E2723] placeholder:text-[#8B7355]/50 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all ${
                      errors.pricePerNight ? 'border-red-400 ring-2 ring-red-400/20' : ''
                    }`}
                  />
                </div>
                {errors.pricePerNight && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.pricePerNight}
                  </p>
                )}
                <p className="text-xs text-[#8B7355] mt-1">
                  Ingresa el precio en dólares (USD)
                </p>
              </div>

              {/* URL de Imagen */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-[#3E2723] font-medium flex items-center gap-2">
                  <Image className="w-4 h-4 text-[#FF6B35]" />
                  URL de Imagen (Opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="h-12 rounded-xl bg-[#FEFDFB] border-[#E8DED0] text-[#3E2723] placeholder:text-[#8B7355]/50 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                  />
                </div>
                <p className="text-xs text-[#8B7355] mt-1">
                  Ingresa la URL de la imagen de la habitación (JPG, PNG, GIF, WEBP)
                </p>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Vista previa" 
                      className="w-full h-32 object-cover rounded-lg border border-[#E8DED0]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="h-11 rounded-xl border-[#E8DED0] text-[#3E2723] hover:bg-[#FAF8F5] hover:border-[#D4C5B0] transition-all"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-11 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA07A] text-white border-none shadow-lg hover:shadow-[#FF6B35]/40 transition-all duration-300 rounded-xl font-medium"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </span>
                ) : selectedRoom ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Actualizar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Habitación
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-[#3E2723]">
                  ¿Eliminar habitación?
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-[#8B7355] mt-2">
              Esta acción no se puede deshacer. La habitación será eliminada permanentemente
              del sistema y no podrás recuperarla.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-3">
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteRoomId(null);
              }}
              className="h-11 rounded-xl border-[#E8DED0] text-[#3E2723] hover:bg-[#FAF8F5] hover:border-[#D4C5B0] transition-all"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteRoomId) {
                  deleteMutation.mutate(deleteRoomId);
                }
              }}
              className="h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-none shadow-lg hover:shadow-red-600/40 transition-all duration-300 rounded-xl font-medium"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Eliminando...
                </span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

