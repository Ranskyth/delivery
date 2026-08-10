import { getOrders } from "@/app/lib/actions"
import { OrdersTable } from "@/components/tables/orders-table"

export default async function OrdersPage() {
  const orders = await getOrders()

  const data = orders.map((o) => ({
    id: o.id,
    userId: o.userId,
    restaurantId: o.restaurantId,
    deliveryFee: Number(o.deliveryFee),
    deliveryTimeMinutes: o.deliveryTimeMinutes,
    subtotalPrice: Number(o.subtotalPrice),
    totalPrice: Number(o.totalPrice),
    totalDiscounts: Number(o.totalDiscounts),
    createdAt: o.createdAt,
    status: o.status,
    user: { name: o.user.name, email: o.user.email },
    restaurant: { name: o.restaurant.name },
    products: o.products.map((p) => ({
      product: {
        name: p.product.name,
        price: Number(p.product.price),
        imageUrl: p.product.imageUrl,
      },
      quantity: p.quantity,
    })),
  }))

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <OrdersTable data={data} />
    </>
  )
}
