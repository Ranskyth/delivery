"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntityTable, features } from "@/components/entity-table"

interface Restaurant {
  id: string
  name: string
  imageUrl: string
  deliveryFee: number
  deliveryTimeMinutes: number
  products: unknown[]
  categories: unknown[]
}

const columnHelper = createColumnHelper<typeof features, Restaurant>()

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => (
      <div className="flex items-center gap-3">
        <img
          src={info.row.original.imageUrl}
          alt={info.row.original.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-medium">{info.row.original.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("deliveryFee", {
    header: "Taxa de Entrega",
    cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
  }),
  columnHelper.accessor("deliveryTimeMinutes", {
    header: "Tempo de Entrega",
    cell: (info) => `${info.getValue()} min`,
  }),
  columnHelper.display({
    id: "products",
    header: "Produtos",
    cell: (info) => info.row.original.products.length,
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: (info) => (
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/dashboard/restaurants/${info.row.original.id}`} />}>
        <PencilIcon className="size-4 mr-1" />
        Editar
      </Button>
    ),
  }),
])

interface RestaurantsTableProps {
  data: Restaurant[]
}

export function RestaurantsTable({ data }: RestaurantsTableProps) {
  return (
    <EntityTable
      data={data}
      columns={columns}
      filterColumn="name"
      filterPlaceholder="Buscar restaurante..."
    />
  )
}
