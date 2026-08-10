"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { EyeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EntityTable, features } from "@/components/entity-table"

interface Order {
  id: string
  userId: string
  restaurantId: string
  deliveryFee: number
  deliveryTimeMinutes: number
  subtotalPrice: number
  totalPrice: number
  totalDiscounts: number
  createdAt: Date
  status: string
  user: { name: string | null; email: string | null }
  restaurant: { name: string }
  products: { product: { name: string; price: number; imageUrl: string }; quantity: number }[]
}

const columnHelper = createColumnHelper<typeof features, Order>()

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  DELIVERING: "Em Entrega",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  PREPARING: "secondary",
  DELIVERING: "outline",
  COMPLETED: "default",
  CANCELED: "destructive",
}

const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue().slice(0, 8)}...</span>
    ),
  }),
  columnHelper.accessor("user", {
    header: "Cliente",
    cell: (info) => info.getValue().name || info.getValue().email,
  }),
  columnHelper.accessor("restaurant", {
    header: "Restaurante",
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor("totalPrice", {
    header: "Total",
    cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge variant={statusVariant[info.getValue()] || "default"}>
        {statusLabels[info.getValue()]}
      </Badge>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Data",
    cell: (info) => new Date(info.getValue()).toLocaleDateString("pt-BR"),
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: (info) => (
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/dashboard/orders/${info.row.original.id}`} />}>
        <EyeIcon className="size-4 mr-1" />
        Detalhes
      </Button>
    ),
  }),
])

interface OrdersTableProps {
  data: Order[]
}

export function OrdersTable({ data }: OrdersTableProps) {
  return (
    <EntityTable
      data={data}
      columns={columns}
      filterColumn="user"
      filterPlaceholder="Buscar por cliente..."
    />
  )
}
