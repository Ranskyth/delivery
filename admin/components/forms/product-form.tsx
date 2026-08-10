"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProduct, deleteProduct, type ActionState } from "@/app/lib/actions"

interface ProductFormProps {
  mode: "create" | "edit"
  defaultValues?: {
    name: string
    description: string
    imageUrl: string
    price: number
    discountPercentage: number
    restaurantId: string
    categoryId: string
  }
  id?: string
  restaurants: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}

export function ProductForm({ mode, defaultValues, id, restaurants, categories }: ProductFormProps) {
  const router = useRouter()
  const [restaurantValue, setRestaurantValue] = useState(defaultValues?.restaurantId || "")
  const [categoryValue, setCategoryValue] = useState(defaultValues?.categoryId || "")

  const [state, formAction, pending] = useActionState(
    mode === "create"
      ? createProduct
      : async (prev: ActionState, formData: FormData) => {
          formData.set("restaurantId", restaurantValue)
          formData.set("categoryId", categoryValue)
          const { updateProduct } = await import("@/app/lib/actions")
          return updateProduct(id!, prev, formData)
        },
    { success: false, errors: {} } as ActionState
  )

  if (state.success) {
    router.push("/dashboard/products")
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
            <Field data-invalid={!!state.errors?.description?.length}>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Input
                id="description"
                name="description"
                defaultValue={defaultValues?.description}
                disabled={pending}
                aria-invalid={!!state.errors?.description?.length}
              />
              {state.errors?.description && <FieldError>{state.errors.description[0]}</FieldError>}
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
            <Field data-invalid={!!state.errors?.price?.length}>
              <FieldLabel htmlFor="price">Preço (R$)</FieldLabel>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={defaultValues?.price}
                disabled={pending}
                aria-invalid={!!state.errors?.price?.length}
              />
              {state.errors?.price && <FieldError>{state.errors.price[0]}</FieldError>}
            </Field>
            <Field data-invalid={!!state.errors?.discountPercentage?.length}>
              <FieldLabel htmlFor="discountPercentage">Desconto (%)</FieldLabel>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                defaultValue={defaultValues?.discountPercentage ?? 0}
                disabled={pending}
                aria-invalid={!!state.errors?.discountPercentage?.length}
              />
              {state.errors?.discountPercentage && <FieldError>{state.errors.discountPercentage[0]}</FieldError>}
            </Field>
            <Field data-invalid={!!state.errors?.restaurantId?.length}>
              <FieldLabel>Restaurante</FieldLabel>
              <input type="hidden" name="restaurantId" value={restaurantValue} />
              <Select
                value={restaurantValue}
                onValueChange={(v) => setRestaurantValue(v ?? "")}
                disabled={pending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um restaurante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {restaurants.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {state.errors?.restaurantId && <FieldError>{state.errors.restaurantId[0]}</FieldError>}
            </Field>
            <Field data-invalid={!!state.errors?.categoryId?.length}>
              <FieldLabel>Categoria</FieldLabel>
              <input type="hidden" name="categoryId" value={categoryValue} />
              <Select
                value={categoryValue}
                onValueChange={(v) => setCategoryValue(v ?? "")}
                disabled={pending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {state.errors?.categoryId && <FieldError>{state.errors.categoryId[0]}</FieldError>}
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

interface DeleteProductButtonProps {
  id: string
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    await deleteProduct(id)
    router.push("/dashboard/products")
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
