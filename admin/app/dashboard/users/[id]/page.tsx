import { getUserById } from "@/app/lib/actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteUserButton } from "@/components/forms/user-delete-button"

interface UserPageProps {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params
  const user = await getUserById(id)
  if (!user) notFound()

  const totalSpent = user.orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
        <Link href="/dashboard/users">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-xl font-medium">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{user.name || "Sem nome"}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">ID:</span>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Email verificado:</span>
              <p>{user.emailVerified ? new Date(user.emailVerified).toLocaleDateString("pt-BR") : "Não verificado"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de Pedidos:</span>
              <span className="font-semibold">{user.orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Gasto:</span>
              <span className="font-semibold">R$ {totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Restaurantes Favoritos:</span>
              <span className="font-semibold">{user.favoriteRestaurants.length}</span>
            </div>
            <div className="mt-6">
              <DeleteUserButton id={id} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {user.orders.length === 0 ? (
              <p className="text-muted-foreground">Nenhum pedido realizado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                        Data
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                        Total
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {user.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 text-sm font-mono">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          R$ {Number(order.totalPrice).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
