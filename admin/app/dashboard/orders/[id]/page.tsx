import { getOrderById } from "@/app/lib/actions"
import { notFound } from "next/navigation"
import { OrderStatusForm } from "@/components/forms/order-status-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  DELIVERING: "Em Entrega",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
}

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
        <Link href="/dashboard/orders">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">ID:</span>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Cliente:</span>
              <p>{order.user.name || order.user.email}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Restaurante:</span>
              <p>{order.restaurant.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Data:</span>
              <p>{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status Atual:</span>
              <p className="font-semibold">{statusLabels[order.status]}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atualizar Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusForm orderId={id} currentStatus={order.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>R$ {Number(order.subtotalPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Descontos:</span>
              <span className="text-green-600">
                -R$ {Number(order.totalDiscounts).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entrega:</span>
              <span>R$ {Number(order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>R$ {Number(order.totalPrice).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.products.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qtd: {item.quantity} x R$ {Number(item.product.price).toFixed(2)}
                  </p>
                </div>
                <span className="font-medium">
                  R$ {(Number(item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
