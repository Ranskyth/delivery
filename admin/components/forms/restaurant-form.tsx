"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { createRestaurant, deleteRestaurant, type ActionState } from "@/app/lib/actions"

interface RestaurantFormProps {
  mode: "create" | "edit"
  defaultValues?: {
    name: string
    imageUrl: string
    deliveryFee: number
    deliveryTimeMinutes: number
  }
  id?: string
}

export function RestaurantForm({ mode, defaultValues, id }: RestaurantFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    mode === "create"
      ? createRestaurant
      : async (prev: ActionState, formData: FormData) => {
          const { updateRestaurant } = await import("@/app/lib/actions")
          return updateRestaurant(id!, prev, formData)
        },
    { success: false, errors: {} } as ActionState
  )

  if (state.success) {
    router.push("/dashboard/restaurants")
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
            <Field data-invalid={!!state.errors?.deliveryFee?.length}>
              <FieldLabel htmlFor="deliveryFee">Taxa de Entrega (R$)</FieldLabel>
              <Input
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                step="0.01"
                defaultValue={defaultValues?.deliveryFee}
                disabled={pending}
                aria-invalid={!!state.errors?.deliveryFee?.length}
              />
              {state.errors?.deliveryFee && <FieldError>{state.errors.deliveryFee[0]}</FieldError>}
            </Field>
            <Field data-invalid={!!state.errors?.deliveryTimeMinutes?.length}>
              <FieldLabel htmlFor="deliveryTimeMinutes">Tempo de Entrega (min)</FieldLabel>
              <Input
                id="deliveryTimeMinutes"
                name="deliveryTimeMinutes"
                type="number"
                defaultValue={defaultValues?.deliveryTimeMinutes}
                disabled={pending}
                aria-invalid={!!state.errors?.deliveryTimeMinutes?.length}
              />
              {state.errors?.deliveryTimeMinutes && <FieldError>{state.errors.deliveryTimeMinutes[0]}</FieldError>}
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

interface DeleteRestaurantButtonProps {
  id: string
}

export function DeleteRestaurantButton({ id }: DeleteRestaurantButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    await deleteRestaurant(id)
    router.push("/dashboard/restaurants")
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
