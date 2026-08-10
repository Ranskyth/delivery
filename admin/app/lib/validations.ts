import { z } from "zod"

export const restaurantSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  imageUrl: z.string().url("URL da imagem inválida"),
  deliveryFee: z.coerce.number().min(0, "Taxa de entrega deve ser >= 0"),
  deliveryTimeMinutes: z.coerce.number().int().positive("Tempo de entrega deve ser > 0"),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  imageUrl: z.string().url("URL da imagem inválida"),
})

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrl: z.string().url("URL da imagem inválida"),
  price: z.coerce.number().positive("Preço deve ser > 0"),
  discountPercentage: z.coerce.number().min(0).max(100).optional().default(0),
  restaurantId: z.string().min(1, "Restaurante é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
})

export const orderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELED", "PREPARING", "DELIVERING", "COMPLETED"]),
})

export type RestaurantInput = z.infer<typeof restaurantSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type ProductInput = z.infer<typeof productSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
