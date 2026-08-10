import { RestaurantForm } from "@/components/forms/restaurant-form"

export default function NewRestaurantPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Novo Restaurante</h1>
      <RestaurantForm mode="create" />
    </>
  )
}
