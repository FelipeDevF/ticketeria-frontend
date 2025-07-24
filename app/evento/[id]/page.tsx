"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Star,
  Plus,
  Minus,
  Clock,
  Phone,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { events } from "@/lib/events"
import type { CartItem, PurchaseDetails } from "@/lib/types"
import Header from "@/components/Header"
import { useCart } from "@/components/CartContext"

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const { cart, updateQuantity } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const event = events.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <Button onClick={() => (window.location.href = "/")}>Voltar para Home</Button>
        </div>
      </div>
    )
  }

  // Efeito para carregar o carrinho e as quantidades selecionadas do localStorage ao montar
  useEffect(() => {
    let alreadyLoaded = false;
    if (!alreadyLoaded) {
      const storedCartString = localStorage.getItem("userCart")
      if (storedCartString) {
        const storedCart: CartItem[] = JSON.parse(storedCartString)
        storedCart.forEach((item) => {
          if (item.eventId === eventId) {
            updateQuantity(eventId, item.ticketTypeId, item.quantity)
          }
        })
      }
      alreadyLoaded = true;
    }
  }, []) // Array de dependências vazio para rodar só uma vez

  // Remover o estado local de selectedTicketQuantities
  // updateTicketTypeQuantity agora só chama updateQuantity do contexto global
  const updateTicketTypeQuantity = (
    sectorId: string,
    ticketTypeId: string,
    newQuantity: number,
    itemData?: Partial<CartItem>
  ) => {
    updateQuantity(event.id, ticketTypeId, Math.max(0, Math.min(10, newQuantity)), itemData)
  }

  // Função para obter a quantidade do carrinho global
  const getCartQuantity = (sectorId: string, ticketTypeId: string) => {
    const item = cart.find(
      (i) => i.eventId === event.id && i.sectorId === sectorId && i.ticketTypeId === ticketTypeId
    )
    return item ? item.quantity : 0
  }

  const getTotalSelectedQuantity = () => {
    return cart
      .filter((item) => item.eventId === event.id)
      .reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalSelectedPrice = () => {
    return cart
      .filter((item) => item.eventId === event.id)
      .reduce((total, item) => {
        const sector = event.sectors.find((s) => s.id === item.sectorId)
        const ticketType = sector?.ticketTypes.find((tt) => tt.id === item.ticketTypeId)
        return ticketType ? total + ticketType.price * item.quantity : total
      }, 0)
  }

  const handleLogin = () => {
    setIsLoginOpen(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      console.log("Dados do login:", data)
      setUser({
        name: "João Silva",
        email: data.email,
        avatar: "/placeholder.svg?height=32&width=32",
      })
      setIsLoggedIn(true)
      setIsLoginOpen(false)
    } catch (error) {
      console.error("Erro no login:", error)
    }
  }

  // O botão Comprar Agora só redireciona para pagamento
  const handleBuyNow = () => {
    router.push("/pagamento")
  }

  const handleCartCheckout = () => {
    const purchaseDetails: PurchaseDetails = {
      eventId: event.id,
      sectorQuantities: {},
    }
    cart.forEach((item) => {
      if (!purchaseDetails.sectorQuantities[item.sectorId]) {
        purchaseDetails.sectorQuantities[item.sectorId] = {}
      }
      purchaseDetails.sectorQuantities[item.sectorId][item.ticketTypeId] = item.quantity
    })
    localStorage.setItem("currentPurchase", JSON.stringify(purchaseDetails))
    setIsCartOpen(false)
    router.push("/pagamento")
  }

  // Certifique-se de que as funções utilitárias estão presentes
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

  return (
    <div className="min-h-screen bg-background">
      <Header
        showNav={false}
        onLoginClick={() => setIsLoginOpen(true)}
        childrenRight={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        }
      />
      {/* Event Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge>{event.category}</Badge>
                {event.featured && <Badge variant="secondary">Destaque</Badge>}
                {event.originalPrice && (
                  <Badge variant="destructive">
                    -{Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{event.rating}</span>
                  <span className="text-sm text-muted-foreground">({event.reviews} avaliações)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{event.description}</p>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">Sobre o Evento</h3>
                <p className="text-muted-foreground leading-relaxed">{event.fullDescription}</p>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Data e Horário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{formatDate(event.date)}</div>
                    <div className="text-muted-foreground">{event.time}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Local
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-muted-foreground">{event.location}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Capacidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{event.capacity.toLocaleString()} pessoas</div>
                    <div className="text-muted-foreground">
                      {(event.capacity - event.sold).toLocaleString()} ingressos disponíveis
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Organizador: </span>
                      <span className="text-muted-foreground">{event.organizer}</span>
                    </div>
                    <div>
                      <span className="font-medium">Classificação: </span>
                      <span className="text-muted-foreground">{event.ageRating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sectors Information Tabs */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Setores Disponíveis</h3>
                <p className="text-muted-foreground">Conheça os detalhes de cada setor do evento</p>
              </div>

              <Tabs defaultValue={event.sectors[0]?.id} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {event.sectors.map((sector) => (
                    <TabsTrigger key={sector.id} value={sector.id} className="text-xs lg:text-sm">
                      {sector.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {event.sectors.map((sector) => (
                  <TabsContent key={sector.id} value={sector.id} className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{sector.name}</span>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {sector.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  R$ {sector.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-xl font-bold text-primary">R$ {sector.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardTitle>
                        <CardDescription>{sector.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Disponibilidade</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      sector.available / sector.total > 0.5
                                        ? "bg-green-500"
                                        : sector.available / sector.total > 0.2
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                    }`}
                                    style={{ width: `${(sector.available / sector.total) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {sector.available}/{sector.total}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Status</h4>
                              <Badge
                                variant={
                                  sector.available > 50
                                    ? "default"
                                    : sector.available > 10
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {sector.available > 50
                                  ? "Disponível"
                                  : sector.available > 10
                                    ? "Poucos ingressos"
                                    : "Últimos ingressos"}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Capacidade Total</h4>
                              <p className="text-muted-foreground">{sector.total.toLocaleString()} pessoas</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Ingressos Vendidos</h4>
                              <p className="text-muted-foreground">
                                {(sector.total - sector.available).toLocaleString()} ingressos
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Sales Locations Section */}
            {event.salesLocations && event.salesLocations.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Locais de Venda</h3>
                  <p className="text-muted-foreground">Encontre pontos de venda físicos para este evento.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {event.salesLocations.map((location) => (
                    <Card key={location.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {location.address}, {location.city} - {location.state}
                            {location.zipCode && `, ${location.zipCode}`}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {location.hours && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Horário: {location.hours}</span>
                          </div>
                        )}
                        {location.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>Telefone: {location.phone}</span>
                          </div>
                        )}
                        {location.mapLink && (
                          <Button variant="outline" size="sm" asChild className="mt-2 bg-transparent">
                            <a href={location.mapLink} target="_blank" rel="noopener noreferrer">
                              Ver no Mapa
                              <MapPin className="w-3 h-3 ml-2" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {event.videos && event.videos.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Prévia dos Artistas</h3>
                  <p className="text-muted-foreground">Confira algumas das músicas que você vai ouvir no evento</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {event.videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${video.videoId}?si=ku_xZNOCxvoIrMs1&amp;controls=0`} 
                          title={video.title} 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen></iframe>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Purchase */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Comprar Ingressos</CardTitle>
                <CardDescription>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getAvailabilityPercentage(event.sold, event.capacity) > 20
                        ? "bg-green-100 text-green-700"
                        : getAvailabilityPercentage(event.sold, event.capacity) > 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {getAvailabilityPercentage(event.sold, event.capacity) > 20
                      ? "Disponível"
                      : getAvailabilityPercentage(event.sold, event.capacity) > 10
                        ? "Poucos ingressos"
                        : "Últimos ingressos"}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Escolha seu setor e tipo de ingresso:</h4>

                  <Accordion type="multiple" className="w-full">
                    {event.sectors.map((sector) => (
                      <AccordionItem key={sector.id} value={sector.id}>
                        <AccordionTrigger className="flex justify-between items-center py-3 px-4 text-base font-semibold">
                          <span>{sector.name}</span>
                          <span className="text-sm text-muted-foreground">
                            R$ {sector.price.toFixed(2)}
                            {sector.originalPrice && (
                              <span className="line-through ml-2">R$ {sector.originalPrice.toFixed(2)}</span>
                            )}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 border-t bg-muted/20">
                          <div className="space-y-4">
                            {sector.ticketTypes.map((ticketType) => (
                              <div key={ticketType.id} className="border rounded-lg p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{ticketType.name}</div>
                                    {ticketType.description && (
                                      <p className="text-xs text-muted-foreground">{ticketType.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-2">
                                      {ticketType.originalPrice && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          R$ {ticketType.originalPrice.toFixed(2)}
                                        </span>
                                      )}
                                      <span className="font-bold">R$ {ticketType.price.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <Label>Quantidade</Label>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateTicketTypeQuantity(sector.id, ticketType.id, getCartQuantity(sector.id, ticketType.id) - 1)}
                                      disabled={getCartQuantity(sector.id, ticketType.id) <= 0}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">
                                      {getCartQuantity(sector.id, ticketType.id)}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const exists = !!cart.find(
                                          (i) => i.eventId === event.id && i.sectorId === sector.id && i.ticketTypeId === ticketType.id
                                        );

                                        if (exists) {
                                          updateTicketTypeQuantity(sector.id, ticketType.id, getCartQuantity(sector.id, ticketType.id) + 1)
                                        } else {
                                          updateTicketTypeQuantity(sector.id, ticketType.id, 1, {
                                            eventTitle: event.title,
                                            eventDate: event.date,
                                            eventTime: event.time,
                                            sectorId: sector.id,
                                            sectorName: sector.name,
                                            ticketTypeName: ticketType.name,
                                            price: ticketType.price,
                                          })
                                        }
                                      }}
                                      disabled={
                                        getCartQuantity(sector.id, ticketType.id) >= 10 || // Limite por tipo
                                        getTotalSelectedQuantity() >= sector.available // Limite total do setor
                                      }
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {getTotalSelectedQuantity() > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal ({getTotalSelectedQuantity()}x)</span>
                          <span>R$ {getTotalSelectedPrice().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa de serviço</span>
                          <span>R$ {(getTotalSelectedPrice() * 0.1).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>R$ {(getTotalSelectedPrice() * 1.1).toFixed(2)}</span>
                        </div>
                      </div>

                      <Button onClick={handleBuyNow} className="w-full" size="lg">
                        Comprar Agora
                      </Button>
                    </>
                  )}

                  {getTotalSelectedQuantity() === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Selecione a quantidade de ingressos nos setores desejados
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
    </div>
  )
}
