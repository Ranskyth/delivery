"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StoreIcon, UtensilsIcon, ShoppingCartIcon, UsersIcon, LayoutGridIcon } from "lucide-react"

interface DashboardStats {
  restaurantCount: number
  productCount: number
  orderCount: number
  userCount: number
  categoryCount: number
}

const cards = [
  {
    key: "restaurantCount" as const,
    label: "Restaurantes",
    href: "/dashboard/restaurants",
    icon: StoreIcon,
  },
  {
    key: "productCount" as const,
    label: "Produtos",
    href: "/dashboard/products",
    icon: UtensilsIcon,
  },
  {
    key: "orderCount" as const,
    label: "Pedidos",
    href: "/dashboard/orders",
    icon: ShoppingCartIcon,
  },
  {
    key: "userCount" as const,
    label: "Usuários",
    href: "/dashboard/users",
    icon: UsersIcon,
  },
  {
    key: "categoryCount" as const,
    label: "Categorias",
    href: "/dashboard/categories",
    icon: LayoutGridIcon,
  },
]

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (

          <Card key={card.key} className="@container/card transition-shadow hover:shadow-md">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats[card.key]}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <card.icon />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.label}
              </div>

            </CardFooter>
          </Card>
     
      ))}
    </div>
  )
}
