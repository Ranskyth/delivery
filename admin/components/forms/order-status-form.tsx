"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus, type ActionState } from "@/app/lib/actions"

interface OrderStatusFormProps {
  orderId: string
  currentStatus: string
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  DELIVERING: "Em Entrega",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
}

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const router = useRouter()
  const [statusValue, setStatusValue] = useState(currentStatus)
  const [state, formAction, pending] = useActionState(updateOrderStatus, {
    success: false,
    errors: {},
  } as ActionState)

  if (state.success) {
    router.refresh()
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="status" value={statusValue} />
      <Select
        value={statusValue}
        onValueChange={(v) => setStatusValue(v ?? currentStatus)}
        disabled={pending}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Atualizando..." : "Atualizar Status"}
      </Button>
    </form>
  )
}
