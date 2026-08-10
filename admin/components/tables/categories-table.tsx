"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntityTable, features } from "@/components/entity-table"

interface Category {
  id: string
  name: string
  imageUrl: string
  createdAt: Date
  products: unknown[]
}

const columnHelper = createColumnHelper<typeof features, Category>()

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
  columnHelper.display({
    id: "products",
    header: "Produtos",
    cell: (info) => info.row.original.products.length,
  }),
  columnHelper.accessor("createdAt", {
    header: "Criado em",
    cell: (info) => new Date(info.getValue()).toLocaleDateString("pt-BR"),
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: (info) => (
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/dashboard/categories/${info.row.original.id}`} />}>
        <PencilIcon className="size-4 mr-1" />
        Editar
      </Button>
    ),
  }),
])

interface CategoriesTableProps {
  data: Category[]
}

export function CategoriesTable({ data }: CategoriesTableProps) {
  return (
    <EntityTable
      data={data}
      columns={columns}
      filterColumn="name"
      filterPlaceholder="Buscar categoria..."
    />
  )
}
