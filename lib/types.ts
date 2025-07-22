export interface Event {
  id: string
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  venue: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
  capacity: number
  sold: number
  featured: boolean
  organizer: string
  ageRating: string
  sectors: Sector[]
  videos?: Array<{
    id: string
    title: string
    artist: string
    videoId: string
  }>
  salesLocations?: SalesLocation[] // Nova propriedade para locais de venda
}

// Nova interface para os tipos de ingresso dentro de um setor
export interface TicketType {
  id: string
  name: string // Ex: "Inteira", "Meia Entrada", "Solidário"
  price: number
  description?: string
  originalPrice?: number
}

export interface Sector {
  id: string
  name: string
  description: string
  price: number // Preço base do setor (pode ser o preço da inteira)
  originalPrice?: number
  available: number
  total: number
  ticketTypes: TicketType[] // Variações de ingresso dentro do setor
}

export interface CartItem {
  eventId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  sectorId: string
  sectorName: string
  ticketTypeId: string // Adicionar ID do tipo de ingresso
  ticketTypeName: string // Adicionar nome do tipo de ingresso
  price: number
  quantity: number
}

export interface PurchaseDetails {
  eventId: string
  // Agora armazena as quantidades por setor e por tipo de ingresso
  sectorQuantities: Record<string, Record<string, number>>
}

// Nova interface para os itens dentro de um pedido
export interface OrderItem {
  name: string
  quantity: number
  price: number
  eventId: string // Adicionar eventId para buscar detalhes do evento
  sectorId: string
  ticketTypeId: string // Adicionar ID do tipo de ingresso
}

export interface OrderDetails {
  orderId: string
  date: string
  total: number
  paymentStatus: string
  paymentMethod: string
  items: OrderItem[] // Usar a nova interface OrderItem
  serviceFee: number
  refundTicketAdded: boolean
  refundTicketFee: number
}

// Nova interface para Locais de Venda
export interface SalesLocation {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode?: string
  hours?: string
  phone?: string
  mapLink?: string
}
