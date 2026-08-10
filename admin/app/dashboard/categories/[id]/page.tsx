import { getCategoryById } from "@/app/lib/actions"
import { notFound } from "next/navigation"
import { CategoryForm, DeleteCategoryButton } from "@/components/forms/category-form"

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params

  const category = await getCategoryById(id)
  if (!category) notFound()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Editar Categoria</h1>
      <CategoryForm
        mode="edit"
        id={id}
        defaultValues={{
          name: category.name,
          imageUrl: category.imageUrl,
        }}
      />
      <div className="mt-4">
        <DeleteCategoryButton id={id} />
      </div>
    </>
  )
}
