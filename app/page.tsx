"use client"

import { useState } from "react"
import { Search, Calendar, MapPin, Users, ShoppingCart, Star, Filter, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, Settings, UserCircle, ShoppingBag } from "lucide-react"

// Adicionar as importações necessárias para React Hook Form e Zod
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { events } from "@/lib/events" // Importar eventos do arquivo centralizado
import type { Event, CartItem } from "@/lib/types" // Importar tipos
import { useSession } from "@/modules/auth"

export default function TicketSalesWebsite() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  // Usar o NextAuth em vez do estado local
  const { session, isAuthenticated, isLoading } = useSession()

  // Form para login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.ok) {
        setIsLoginOpen(false)
        loginForm.reset()
      } else {
        alert("Credenciais inválidas. Verifique seu e-mail e senha.")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      alert("Ocorreu um erro ao fazer login. Verifique suas credenciais e tente novamente.")
    }
  }

  const categories = ["all", "Música", "Comédia", "Gastronomia", "Tecnologia", "Teatro"]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredEvents = events.filter((event) => event.featured)

  const addToCart = (event: Event, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.eventId === event.id)
      if (existingItem) {
        return prevCart.map((item) => (item.eventId === event.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prevCart, {
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        sectorId: 'default',
        sectorName: 'Geral',
        ticketTypeId: 'default',
        ticketTypeName: 'Inteira',
        price: event.price,
        quantity
      }]
    })
  }

  const updateCartQuantity = (eventId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.eventId !== eventId))
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.eventId === eventId ? { ...item, quantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getAvailabilityPercentage = (sold: number, capacity: number) => {
    return ((capacity - sold) / capacity) * 100
  }

  const handleLogin = () => {
    setIsLoginOpen(true)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">TicketHub</h1>
            </div>
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
            <div className="flex items-center gap-3">
              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="relative bg-transparent">
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
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.eventId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.eventTitle}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.eventDate)} - {item.eventTime}
                          </p>
                          <p className="text-sm font-semibold">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.eventId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.eventId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {cart.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>R$ {getTotalPrice().toFixed(2)}</span>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            setIsCartOpen(false)
                            setIsCheckoutOpen(true)
                          }}
                          className="w-full"
                        >
                          Finalizar Compra
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>

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
                          {session?.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Encontre os Melhores Eventos</h2>
          <p className="text-xl mb-8 opacity-90">
            Descubra experiências incríveis e garante seu ingresso com facilidade
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar eventos, artistas ou locais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-black"
                />
              </div>
              <Button size="lg" variant="secondary">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Eventos em Destaque</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3">Destaque</Badge>
                    {event.originalPrice && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        -{Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">{event.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{event.rating}</span>
                        <span className="text-xs text-muted-foreground">({event.reviews})</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatDate(event.date)} às {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {event.venue}, {event.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{event.capacity - event.sold} ingressos disponíveis</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          {event.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {event.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <div className="text-2xl font-bold">R$ {event.price.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xs font-medium ${
                              getAvailabilityPercentage(event.sold, event.capacity) > 20
                                ? "text-green-600"
                                : getAvailabilityPercentage(event.sold, event.capacity) > 10
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {getAvailabilityPercentage(event.sold, event.capacity) > 20
                              ? "Disponível"
                              : getAvailabilityPercentage(event.sold, event.capacity) > 10
                                ? "Poucos ingressos"
                                : "Últimos ingressos"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => (window.location.href = `/evento/${event.id}`)} className="w-full">
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section id="eventos" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-3xl font-bold">Todos os Eventos</h3>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas as categorias" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {event.category}
                  </Badge>
                  {event.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      -{Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{event.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {formatDate(event.date)} - {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      {event.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          R$ {event.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <div className="text-lg font-bold">R$ {event.price.toFixed(2)}</div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        getAvailabilityPercentage(event.sold, event.capacity) > 20
                          ? "bg-green-100 text-green-700"
                          : getAvailabilityPercentage(event.sold, event.capacity) > 10
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.capacity - event.sold} restantes
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button onClick={() => (window.location.href = `/evento/${event.id}`)} className="w-full" size="sm">
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum evento encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Entrar na sua conta</DialogTitle>
            <DialogDescription>Digite suas credenciais para acessar sua conta</DialogDescription>
          </DialogHeader>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Ainda não tem uma conta?{" "}
                  <a href="/cadastro" className="text-primary hover:underline font-medium">
                    Cadastre-se aqui
                  </a>
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsLoginOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loginForm.formState.isSubmitting}>
                  {loginForm.formState.isSubmitting ? "Entrando..." : "Entrar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
            <DialogDescription>Complete seus dados para finalizar a compra</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" />
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Resumo do Pedido</h4>
              {cart.map((item) => (
                <div key={item.eventId} className="flex justify-between text-sm">
                  <span>
                    {item.eventTitle} x{item.quantity}
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>R$ {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsCheckoutOpen(false)
                setCart([])
                alert("Compra realizada com sucesso! Você receberá os ingressos por e-mail.")
              }}
            >
              Finalizar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">TicketHub</h4>
              <p className="text-muted-foreground text-sm">
                A melhor plataforma para encontrar e comprar ingressos para os eventos mais incríveis do Brasil.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Eventos</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Música
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Teatro
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Comédia
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Gastronomia
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Suporte</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Política de Reembolso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contato@tickethub.com.br</li>
                <li>(11) 3000-0000</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TicketHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
