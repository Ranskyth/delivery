import { getUsers } from "@/app/lib/actions"
import { UsersTable } from "@/components/tables/users-table"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Usuários</h1>
      <UsersTable data={users} />
    </>
  )
}
