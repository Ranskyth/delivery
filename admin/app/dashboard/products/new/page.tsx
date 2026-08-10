import { getRestaurants, getCategories } from "@/app/lib/actions"
import { ProductForm } from "@/components/forms/product-form"

export default async function NewProductPage() {
  const [restaurants, categories] = await Promise.all([
    getRestaurants(),
    getCategories(),
  ])

  const restaurantOptions = restaurants.map((r) => ({ id: r.id, name: r.name }))
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }))

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      <ProductForm
        mode="create"
        restaurants={restaurantOptions}
        categories={categoryOptions}
      />
    </>
  )
}
