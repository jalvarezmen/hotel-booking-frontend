import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Bed, Hash, Users, DollarSign, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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
}

const initialFormData: RoomFormData = {
  roomNumber: '',
  roomType: RoomType.STANDARD,
  capacity: 1,
  pricePerNight: 0,
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
    queryFn: () => roomsApi.getAll(),
  });

  // Mutation para crear habitación
  const createMutation = useMutation({
    mutationFn: (data: RoomFormData) => roomsApi.create({
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      capacity: data.capacity,
      pricePerNight: data.pricePerNight,
    }),
    onSuccess: () => {
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
      }),
    onSuccess: () => {
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

      {/* Rooms Table */}
      {rooms && rooms.length > 0 ? (
        <div className="bg-white rounded-lg border border-[#E8DED0] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF8F5]">
                <TableHead className="font-semibold text-[#3E2723]">Número</TableHead>
                <TableHead className="font-semibold text-[#3E2723]">Tipo</TableHead>
                <TableHead className="font-semibold text-[#3E2723]">Capacidad</TableHead>
                <TableHead className="font-semibold text-[#3E2723]">Precio/Noche</TableHead>
                <TableHead className="font-semibold text-[#3E2723]">Estado</TableHead>
                <TableHead className="font-semibold text-[#3E2723] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-[#FAF8F5]">
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-[#FFF5E6] text-[#8B7355] border-[#E8DED0]">
                      {roomTypeLabels[room.roomType]}
                    </Badge>
                  </TableCell>
                  <TableCell>{room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(room.pricePerNight)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={room.isAvailable ? 'default' : 'secondary'}
                      className={
                        room.isAvailable
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }
                    >
                      {room.isAvailable ? 'Disponible' : 'Ocupada'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(room)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(room.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 1,
                      })
                    }
                    placeholder="1-10"
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
                  Precio por Noche *
                </Label>
                <div className="relative">
                  <Input
                    id="pricePerNight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerNight: parseFloat(e.target.value) || 0,
                      })
                    }
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
                  Ingresa el precio en pesos argentinos (ARS)
                </p>
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

