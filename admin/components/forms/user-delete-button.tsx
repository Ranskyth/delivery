"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteUser, type ActionState } from "@/app/lib/actions"

interface DeleteUserButtonProps {
  id: string
}

export function DeleteUserButton({ id }: DeleteUserButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    await deleteUser(id)
    router.push("/dashboard/users")
    router.refresh()
  }

  const [, deleteAction, deletePending] = useActionState(async () => {
    await handleDelete()
    return { success: true, errors: {} } as ActionState
  }, { success: false, errors: {} } as ActionState)

  return (
    <form action={deleteAction}>
      <Button type="submit" variant="destructive" className="w-full" disabled={deletePending}>
        {deletePending ? "Excluindo..." : "Excluir Usuário"}
      </Button>
    </form>
  )
}
