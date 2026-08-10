"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createCategory, deleteCategory, type ActionState } from "@/app/lib/actions"

interface CategoryFormProps {
  mode: "create" | "edit"
  defaultValues?: {
    name: string
    imageUrl: string
  }
  id?: string
}

export function CategoryForm({ mode, defaultValues, id }: CategoryFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    mode === "create"
      ? createCategory
      : async (prev: ActionState, formData: FormData) => {
          const { updateCategory } = await import("@/app/lib/actions")
          return updateCategory(id!, prev, formData)
        },
    { success: false, errors: {} } as ActionState
  )

  if (state.success) {
    router.push("/dashboard/categories")
    router.refresh()
  }

  return (
    <Card className="w-full">
      <CardContent>
        <form action={formAction} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!state.errors?.name?.length}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                id="name"
                name="name"
                defaultValue={defaultValues?.name}
                disabled={pending}
                aria-invalid={!!state.errors?.name?.length}
              />
              {state.errors?.name && <FieldError>{state.errors.name[0]}</FieldError>}
            </Field>
            <Field data-invalid={!!state.errors?.imageUrl?.length}>
              <FieldLabel htmlFor="imageUrl">URL da Imagem</FieldLabel>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={defaultValues?.imageUrl}
                disabled={pending}
                aria-invalid={!!state.errors?.imageUrl?.length}
              />
              {state.errors?.imageUrl && <FieldError>{state.errors.imageUrl[0]}</FieldError>}
            </Field>
            <Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

interface DeleteCategoryButtonProps {
  id: string
}

export function DeleteCategoryButton({ id }: DeleteCategoryButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    await deleteCategory(id)
    router.push("/dashboard/categories")
    router.refresh()
  }

  const [, deleteAction, deletePending] = useActionState(async () => {
    await handleDelete()
    return { success: true, errors: {} } as ActionState
  }, { success: false, errors: {} } as ActionState)

  return (
    <form action={deleteAction}>
      <Button type="submit" variant="destructive" disabled={deletePending}>
        {deletePending ? "Excluindo..." : "Excluir"}
      </Button>
    </form>
  )
}
