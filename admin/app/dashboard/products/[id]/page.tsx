import { getProductById, getRestaurants, getCategories } from "@/app/lib/actions"
import { notFound } from "next/navigation"
import { ProductForm, DeleteProductButton } from "@/components/forms/product-form"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const [restaurants, categories] = await Promise.all([getRestaurants(), getCategories()])

  const restaurantList = restaurants.map((r) => ({ id: r.id, name: r.name }))
  const categoryList = categories.map((c) => ({ id: c.id, name: c.name }))

  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm
        mode="edit"
        id={id}
        restaurants={restaurantList}
        categories={categoryList}
        defaultValues={{
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: Number(product.price),
          discountPercentage: product.discountPercentage,
          restaurantId: product.restaurantId,
          categoryId: product.categoryId,
        }}
      />
      <div className="mt-4">
        <DeleteProductButton id={id} />
      </div>
    </>
  )
}
