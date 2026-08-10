import { CategoryForm } from "@/components/forms/category-form"

export default function NewCategoryPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Nova Categoria</h1>
      <CategoryForm mode="create" />
    </>
  )
}
