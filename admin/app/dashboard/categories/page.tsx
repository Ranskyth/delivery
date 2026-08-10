import { getCategories } from "@/app/lib/actions"
import { CategoriesTable } from "@/components/tables/categories-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Link href="/dashboard/categories/new">
          <Button>Nova Categoria</Button>
        </Link>
      </div>
      <CategoriesTable data={categories} />
    </>
  )
}
