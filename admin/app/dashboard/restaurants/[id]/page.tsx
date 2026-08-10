import { getRestaurantById } from "@/app/lib/actions"
import { notFound } from "next/navigation"
import { RestaurantForm, DeleteRestaurantButton } from "@/components/forms/restaurant-form"

interface RestaurantPageProps {
  params: Promise<{ id: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params

  const restaurant = await getRestaurantById(id)
  if (!restaurant) notFound()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Editar Restaurante</h1>
      <RestaurantForm
        mode="edit"
        id={id}
        defaultValues={{
          name: restaurant.name,
          imageUrl: restaurant.imageUrl,
          deliveryFee: Number(restaurant.deliveryFee),
          deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        }}
      />
      <div className="mt-4">
        <DeleteRestaurantButton id={id} />
      </div>
    </>
  )
}
