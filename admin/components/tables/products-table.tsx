"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EntityTable, features } from "@/components/entity-table"

interface Product {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  discountPercentage: number
  restaurantId: string
  categoryId: string
  restaurant: { name: string }
  category: { name: string }
}

const columnHelper = createColumnHelper<typeof features, Product>()

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => (
      <div className="flex items-center gap-3">
        <img
          src={info.row.original.imageUrl}
          alt={info.row.original.name}
          className="h-10 w-10 rounded object-cover"
        />
        <span className="font-medium">{info.row.original.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Preço",
    cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
  }),
  columnHelper.accessor("discountPercentage", {
    header: "Desconto",
    cell: (info) =>
      info.getValue() > 0 ? (
        <Badge variant="default">{info.getValue()}%</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
  }),
  columnHelper.accessor("restaurant", {
    header: "Restaurante",
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor("category", {
    header: "Categoria",
    cell: (info) => info.getValue().name,
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: (info) => (
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/dashboard/products/${info.row.original.id}`} />}>
        <PencilIcon className="size-4 mr-1" />
        Editar
      </Button>
    ),
  }),
])

interface ProductsTableProps {
  data: Product[]
}

export function ProductsTable({ data }: ProductsTableProps) {
  return (
    <EntityTable
      data={data}
      columns={columns}
      filterColumn="name"
      filterPlaceholder="Buscar produto..."
    />
  )
}
