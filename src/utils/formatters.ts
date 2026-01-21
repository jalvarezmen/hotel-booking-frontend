// Formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Formatear fecha
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Formatear fecha corta
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Formatear hora
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Traducir tipo de habitación
export const translateRoomType = (type: string): string => {
  const translations: Record<string, string> = {
    STANDARD: 'Estándar',
    SUPERIOR: 'Superior',
    DELUXE: 'Deluxe',
    SUITE: 'Suite',
  };
  return translations[type] || type;
};

// Traducir estado de reserva
export const translateReservationStatus = (status: string): string => {
  const translations: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    ACTIVE: 'Activa',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
    EXPIRED: 'Expirada',
  };
  return translations[status] || status;
};

// Traducir método de pago
export const translatePaymentMethod = (method: string): string => {
  const translations: Record<string, string> = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
  };
  return translations[method] || method;
};
