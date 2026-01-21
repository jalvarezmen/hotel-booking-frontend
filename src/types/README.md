# TypeScript Types & Interfaces

Define aquí tus tipos e interfaces compartidas.

## Ejemplo:

```typescript
// types/hotel.ts
export interface Hotel {
  id: number
  name: string
  description: string
  address: string
  city: string
  country: string
  price: number
  rating: number
  image: string
  amenities: string[]
}

export interface Booking {
  id: number
  hotelId: number
  userId: number
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface User {
  id: number
  email: string
  name: string
  phone?: string
}
```
