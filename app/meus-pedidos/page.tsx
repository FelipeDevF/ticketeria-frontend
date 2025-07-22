"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { events } from "@/lib/events" // Importar eventos
import type { OrderDetails } from "@/lib/types" // Importar tipos

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedOrdersString = localStorage.getItem("userOrders")
    if (storedOrdersString) {
      const storedOrders: OrderDetails[] = JSON.parse(storedOrdersString)
      // Ordenar os pedidos do mais recente para o mais antigo
      setOrders(
        storedOrders.sort(
          (a, b) => new Date(b.orderId.split("-")[1]).getTime() - new Date(a.orderId.split("-")[1]).getTime(),
        ),
      )
    }
    setLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const isEventPast = (eventDateString: string, eventTimeString: string) => {
    const [year, month, day] = eventDateString.split("-").map(Number)
    const [hours, minutes] = eventTimeString.split(":").map(Number)
    // Month is 0-indexed in JavaScript Date object
    const eventDateTime = new Date(year, month - 1, day, hours, minutes)
    return eventDateTime < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando seus pedidos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-primary">Meus Pedidos</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Você ainda não fez nenhum pedido.</h2>
              <p className="text-muted-foreground mb-6">Comece a explorar eventos incríveis agora mesmo!</p>
              <Button onClick={() => router.push("/")}>Ver Eventos</Button>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.orderId} className="shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Pedido #{order.orderId}</CardTitle>
                      <CardDescription className="text-sm">Realizado em {order.date}</CardDescription>
                    </div>
                    <Badge variant={order.paymentStatus === "Aprovado" ? "default" : "destructive"} className="text-sm">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Detalhes do Pagamento</h4>
                      <p>
                        <strong>Método:</strong> {order.paymentMethod}
                      </p>
                      <p>
                        <strong>Total:</strong> R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                      <ul className="space-y-1">
                        {order.items.map((item, itemIndex) => {
                          const event = events.find((e) => e.id === item.eventId)
                          const eventPassed = event ? isEventPast(event.date, event.time) : false
                          return (
                            <li key={itemIndex} className="flex justify-between items-center">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                {eventPassed ? (
                                  <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Realizado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-100 text-green-600">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Aguardando
                                  </Badge>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Serviço:</span>
                    <span>R$ {order.serviceFee.toFixed(2)}</span>
                  </div>
                  {order.refundTicketAdded && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Ingresso Reembolso:</span>
                      <span>R$ {order.refundTicketFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total do Pedido:</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
