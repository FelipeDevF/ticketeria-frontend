"use client"

import { CheckCircle, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { OrderDetails } from "@/lib/types"

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedOrdersString = localStorage.getItem("userOrders")
    if (storedOrdersString) {
      const storedOrders: OrderDetails[] = JSON.parse(storedOrdersString)
      if (storedOrders.length > 0) {
        setOrderDetails(storedOrders[storedOrders.length - 1])
        // Limpar o carrinho persistente e a compra atual do localStorage após a confirmação
        localStorage.removeItem("currentPurchase")
        localStorage.removeItem("userCart")
      } else {
        router.push("/")
      }
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando confirmação do pedido...</p>
      </div>
    )
  }

  if (!orderDetails) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <CardTitle className="text-3xl font-bold text-green-600">Pedido Confirmado!</CardTitle>
          <p className="text-muted-foreground text-lg">Sua compra foi realizada com sucesso.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Um e-mail com os detalhes do seu pedido e os ingressos foi enviado para o seu endereço de e-mail.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Detalhes do Pedido</h3>
              <p>
                <strong>ID do Pedido:</strong> {orderDetails.orderId}
              </p>
              <p>
                <strong>Data:</strong> {orderDetails.date}
              </p>
              <p>
                <strong>Status do Pagamento:</strong>{" "}
                <span className="font-medium text-green-600">{orderDetails.paymentStatus}</span>
              </p>
              <p>
                <strong>Método de Pagamento:</strong> {orderDetails.paymentMethod}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resumo da Compra</h3>
              {orderDetails.items.map((item, index) => (
                <p key={index} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>R$ {(item.quantity * item.price).toFixed(2)}</span>
                </p>
              ))}
              <p className="flex justify-between mt-2">
                <span>Taxa de Serviço:</span>
                <span>R$ {orderDetails.serviceFee.toFixed(2)}</span>
              </p>
              {orderDetails.refundTicketAdded && (
                <p className="flex justify-between text-green-600">
                  <span>Ingresso Reembolso:</span>
                  <span>R$ {orderDetails.refundTicketFee.toFixed(2)}</span>
                </p>
              )}
              <Separator className="my-2" />
              <p className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {orderDetails.total.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" passHref>
              <Button className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Voltar para a Home
              </Button>
            </Link>
            <Link href="/meus-pedidos" passHref>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ver Meus Pedidos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
