import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { CartItem } from "@/lib/types"

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (eventId: string, ticketTypeId: string) => void
  updateQuantity: (eventId: string, ticketTypeId: string, quantity: number, itemData?: Partial<CartItem>) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Carregar do localStorage ao montar
  useEffect(() => {
    const stored = localStorage.getItem("userCart")
    if (stored) {
      setCart(JSON.parse(stored))
    }
  }, [])

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("userCart", JSON.stringify(cart))
  }, [cart])

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.eventId === item.eventId && i.ticketTypeId === item.ticketTypeId
      )
      if (idx !== -1) {
        // Já existe, só soma a quantidade
        const updated = [...prev]
        updated[idx].quantity += item.quantity
        return updated
      }
      return [...prev, item]
    })
  }

  function removeFromCart(eventId: string, ticketTypeId: string) {
    setCart((prev) => prev.filter((i) => i.eventId !== eventId || i.ticketTypeId !== ticketTypeId))
  }

  function updateQuantity(eventId: string, ticketTypeId: string, quantity: number, itemData?: Partial<CartItem>) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.eventId === eventId && i.ticketTypeId === ticketTypeId
      );
      if (idx !== -1) {
        // Atualiza quantidade existente
        return prev
          .map((i) =>
            i.eventId === eventId && i.ticketTypeId === ticketTypeId
              ? { ...i, quantity }
              : i
          )
          .filter((i) => i.quantity > 0);
      } else if (quantity > 0 && itemData) {
        // Adiciona novo item se quantidade > 0 e dados mínimos fornecidos
        return [
          ...prev,
          {
            eventId,
            ticketTypeId,
            quantity,
            eventTitle: itemData.eventTitle || '',
            eventDate: itemData.eventDate || '',
            eventTime: itemData.eventTime || '',
            sectorId: itemData.sectorId || '',
            sectorName: itemData.sectorName || '',
            ticketTypeName: itemData.ticketTypeName || '',
            price: itemData.price || 0,
          }
        ];
      } else {
        return prev;
      }
    });
  }

  function clearCart() {
    setCart([])
  }

  function getTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  function getTotalPrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider")
  return ctx
} 