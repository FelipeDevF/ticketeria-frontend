"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, LogIn, LogOut, UserCircle, ShoppingBag, Settings, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/modules/auth"
import { ReactNode, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useCart } from "@/components/CartContext"

interface CartItem {
  eventId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  sectorId?: string
  sectorName?: string
  ticketTypeId?: string
  ticketTypeName?: string
  price: number
  quantity: number
}

interface HeaderProps {
  title?: string
  showNav?: boolean
  cartItemsCount?: number
  cartItems?: CartItem[]
  onCartClick?: () => void
  onCartQuantityChange?: (item: CartItem, newQuantity: number) => void
  onCartCheckout?: () => void
  getTotalPrice?: () => number
  formatDate?: (date: string) => string
  onLoginClick?: () => void
  childrenRight?: ReactNode
}

export function Header({
  title = "TicketHub",
  showNav = true,
  onLoginClick,
  childrenRight,
}: HeaderProps) {
  const { session, isAuthenticated, isLoading } = useSession()
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cart, updateQuantity, getTotalItems, getTotalPrice } = useCart()

  const handleLogin = () => {
    if (onLoginClick) return onLoginClick()
    router.push("/cadastro")
  }
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      const { signOut } = await import("next-auth/react")
      await signOut({ callbackUrl: "/" })
    }
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              {title}
            </Link>
          </div>
          {showNav && (
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#eventos" className="text-muted-foreground hover:text-primary">
                Eventos
              </a>
              <a href="#categorias" className="text-muted-foreground hover:text-primary">
                Categorias
              </a>
              <a href="#sobre" className="text-muted-foreground hover:text-primary">
                Sobre
              </a>
              <a href="#contato" className="text-muted-foreground hover:text-primary">
                Contato
              </a>
            </nav>
          )}
          <div className="flex items-center gap-3">
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative bg-transparent"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Carrinho de Compras</DialogTitle>
                  <DialogDescription>
                    {cart.length === 0 ? "Seu carrinho está vazio" : `${getTotalItems()} item(s) no carrinho`}
                  </DialogDescription>
                </DialogHeader>
                {cart.length > 0 && (
                  <>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cart.map((item, idx) => (
                        <div key={item.eventId + (item.ticketTypeId || idx)} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.eventTitle}</h4>
                            {item.sectorName && item.ticketTypeName && (
                              <p className="text-xs text-muted-foreground">
                                {item.sectorName} - {item.ticketTypeName}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {item.eventDate} - {item.eventTime}
                            </p>
                            <p className="text-sm font-semibold">R$ {item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.eventId, item.ticketTypeId || "", item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.eventId, item.ticketTypeId || "", item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span>R$ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Button 
                      onClick={() => {
                        if (cart.length > 0) {
                          const purchaseDetails: {
                            eventId: string;
                            sectorQuantities: Record<string, Record<string, number>>;
                          } = {
                            eventId: cart[0].eventId,
                            sectorQuantities: {},
                          }
                          cart.forEach((item) => {
                            if (!purchaseDetails.sectorQuantities[item.sectorId]) {
                              purchaseDetails.sectorQuantities[item.sectorId] = {}
                            }
                            purchaseDetails.sectorQuantities[item.sectorId][item.ticketTypeId] = item.quantity
                          })
                          localStorage.setItem("currentPurchase", JSON.stringify(purchaseDetails))
                        }
                        setIsCartOpen(false)
                        router.push("/pagamento")
                      }} 
                      className="w-full mt-4"
                      size="lg"
                    >
                      Finalizar Compra
                    </Button>
                  </>
                )}
              </DialogContent>
            </Dialog>
            {childrenRight}
            {!isAuthenticated ? (
              <Button onClick={handleLogin} size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || "Avatar"} />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/meus-pedidos">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 