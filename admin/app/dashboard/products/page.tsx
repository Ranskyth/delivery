import { getProducts } from "@/app/lib/actions"
import { ProductsTable } from "@/components/tables/products-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProductsPage() {
  const products = await getProducts()

  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    price: Number(p.price),
    discountPercentage: p.discountPercentage,
    restaurantId: p.restaurantId,
    categoryId: p.categoryId,
    restaurant: { name: p.restaurant.name },
    category: { name: p.category.name },
  }))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/dashboard/products/new">
          <Button>Novo Produto</Button>
        </Link>
      </div>
      <ProductsTable data={data} />
    </>
  )
}
