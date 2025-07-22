"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, QrCode, Barcode, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { events } from "@/lib/events" // Importar eventos do arquivo centralizado
import type { Event, PurchaseDetails, OrderDetails } from "@/lib/types" // Importar tipos

export default function PaymentPage() {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  // Atualizar o estado para a nova estrutura de quantidades
  const [selectedTicketQuantities, setSelectedTicketQuantities] = useState<Record<string, Record<string, number>>>({})
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [addRefundTicket, setAddRefundTicket] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedPurchase = localStorage.getItem("currentPurchase")
    if (storedPurchase) {
      const purchaseDetails: PurchaseDetails = JSON.parse(storedPurchase)
      const foundEvent = events.find((e) => e.id === purchaseDetails.eventId)
      if (foundEvent) {
        setEvent(foundEvent)
        setSelectedTicketQuantities(purchaseDetails.sectorQuantities) // Usar a nova estrutura
      } else {
        router.push("/") // Redirecionar se o evento não for encontrado
      }
    } else {
      router.push("/") // Redirecionar se não houver dados de compra
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando detalhes do pedido...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nenhum pedido para processar</h1>
          <Button onClick={() => router.push("/")}>Voltar para Home</Button>
        </div>
      </div>
    )
  }

  const getSelectedItems = () => {
    const items = []
    for (const sectorId in selectedTicketQuantities) {
      const sector = event.sectors.find((s) => s.id === sectorId)
      if (sector && sector.ticketTypes) {
        for (const ticketTypeId in selectedTicketQuantities[sectorId]) {
          const quantity = selectedTicketQuantities[sectorId][ticketTypeId]
          if (quantity > 0) {
            const ticketType = sector.ticketTypes.find((tt) => tt.id === ticketTypeId)
            if (ticketType) {
              items.push({
                name: `${event.title} - ${sector.name} (${ticketType.name})`,
                quantity,
                price: ticketType.price,
                eventId: event.id,
                sectorId: sector.id,
                ticketTypeId: ticketType.id,
              })
            }
          }
        }
      }
    }
    return items
  }

  const items = getSelectedItems()
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const serviceFee = subtotal * 0.1 // 10% de taxa de serviço
  const refundTicketFee = addRefundTicket ? subtotal * 0.1 : 0 // 10% do subtotal para ingresso reembolso
  const total = subtotal + serviceFee + refundTicketFee

  const handleFinalizePayment = () => {
    const orderDetails: OrderDetails = {
      orderId: `TH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      total: Number.parseFloat(total.toFixed(2)),
      paymentStatus: "Aprovado", // Simulado como aprovado
      paymentMethod: paymentMethod === "credit-card" ? "Cartão de Crédito" : paymentMethod === "pix" ? "Pix" : "Boleto",
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        eventId: item.eventId,
        sectorId: item.sectorId,
        ticketTypeId: item.ticketTypeId, // Garantir que ticketTypeId está no item do pedido
      })),
      serviceFee: Number.parseFloat(serviceFee.toFixed(2)),
      refundTicketAdded: addRefundTicket,
      refundTicketFee: Number.parseFloat(refundTicketFee.toFixed(2)),
    }

    // Salvar o novo pedido no array de pedidos do usuário
    const existingOrdersString = localStorage.getItem("userOrders")
    const existingOrders: OrderDetails[] = existingOrdersString ? JSON.parse(existingOrdersString) : []
    existingOrders.push(orderDetails)
    localStorage.setItem("userOrders", JSON.stringify(existingOrders))

    router.push("/confirmacao-pedido")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <CardTitle className="text-3xl font-bold">Finalizar Pagamento</CardTitle>
          <CardDescription>Selecione a forma de pagamento e finalize sua compra.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Resumo do Pedido */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Resumo do Pedido</h3>
            <div className="border rounded-lg p-4 space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa de Serviço (10%)</span>
                <span>R$ {serviceFee.toFixed(2)}</span>
              </div>
              {addRefundTicket && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Ingresso Reembolso (10%)</span>
                  <span>R$ {refundTicketFee.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total a Pagar</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Opções de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Forma de Pagamento</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="credit-card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem id="credit-card" value="credit-card" className="sr-only" />
                <CreditCard className="mb-3 h-6 w-6" />
                Cartão de Crédito
              </Label>
              <Label
                htmlFor="pix"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem id="pix" value="pix" className="sr-only" />
                <QrCode className="mb-3 h-6 w-6" />
                Pix
              </Label>
              <Label
                htmlFor="boleto"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem id="boleto" value="boleto" className="sr-only" />
                <Barcode className="mb-3 h-6 w-6" />
                Boleto Bancário
              </Label>
            </RadioGroup>
          </div>

          {/* Opção de Ingresso Reembolso */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="refund-ticket"
              checked={addRefundTicket}
              onCheckedChange={(checked) => setAddRefundTicket(!!checked)}
            />
            <label
              htmlFor="refund-ticket"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Adicionar Ingresso Reembolso (+10% do subtotal)
            </label>
          </div>

          {/* Botão Finalizar Pagamento */}
          <Button onClick={handleFinalizePayment} className="w-full" size="lg">
            <Check className="w-4 h-4 mr-2" />
            Finalizar Pagamento
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
