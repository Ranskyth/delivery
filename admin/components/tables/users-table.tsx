"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { EyeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntityTable, features } from "@/components/entity-table"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  orders: unknown[]
}

const columnHelper = createColumnHelper<typeof features, User>()

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => (
      <div className="flex items-center gap-3">
        {info.row.original.image ? (
          <img
            src={info.row.original.image}
            alt={info.row.original.name || "User"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-medium">
              {(info.row.original.name || info.row.original.email || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="font-medium">{info.row.original.name || "Sem nome"}</span>
      </div>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.display({
    id: "orders",
    header: "Pedidos",
    cell: (info) => info.row.original.orders.length,
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: (info) => (
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/dashboard/users/${info.row.original.id}`} />}>
        <EyeIcon className="size-4 mr-1" />
        Detalhes
      </Button>
    ),
  }),
])

interface UsersTableProps {
  data: User[]
}

export function UsersTable({ data }: UsersTableProps) {
  return (
    <EntityTable
      data={data}
      columns={columns}
      filterColumn="email"
      filterPlaceholder="Buscar por email..."
    />
  )
}
