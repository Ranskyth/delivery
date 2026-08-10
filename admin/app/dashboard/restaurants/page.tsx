import { getRestaurants } from "@/app/lib/actions"
import { RestaurantsTable } from "@/components/tables/restaurants-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants()

  const data = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl,
    deliveryFee: Number(r.deliveryFee),
    deliveryTimeMinutes: r.deliveryTimeMinutes,
    products: r.products,
    categories: r.categories,
  }))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Restaurantes</h1>
        <Link href="/dashboard/restaurants/new">
          <Button>Novo Restaurante</Button>
        </Link>
      </div>
      <RestaurantsTable data={data} />
    </>
  )
}
