"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  restaurantSchema,
  categorySchema,
  productSchema,
  orderStatusSchema,
  type RestaurantInput,
  type CategoryInput,
  type ProductInput,
  type OrderStatusInput,
} from "./validations";

export type ActionState = {
  success: boolean
  errors: Record<string, string[]>
}

// Restaurant Actions
export async function getRestaurants() {
  return db.restaurant.findMany({
    include: {
      categories: true,
      products: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getRestaurantById(id: string) {
  return db.restaurant.findUnique({
    where: { id },
    include: {
      categories: true,
      products: true,
    },
  });
}

export async function createRestaurant(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const values = {
    name: formData.get("name") as string,
    imageUrl: formData.get("imageUrl") as string,
    deliveryFee: formData.get("deliveryFee") as string,
    deliveryTimeMinutes: formData.get("deliveryTimeMinutes") as string,
  };

  const result = restaurantSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.restaurant.create({ data: result.data });
  revalidatePath("/dashboard/restaurants");
  return { success: true, errors: {} };
}

export async function updateRestaurant(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const values = {
    name: formData.get("name") as string,
    imageUrl: formData.get("imageUrl") as string,
    deliveryFee: formData.get("deliveryFee") as string,
    deliveryTimeMinutes: formData.get("deliveryTimeMinutes") as string,
  };

  const result = restaurantSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.restaurant.update({ where: { id }, data: result.data });
  revalidatePath("/dashboard/restaurants");
  revalidatePath(`/dashboard/restaurants/${id}`);
  return { success: true, errors: {} };
}

export async function deleteRestaurant(id: string) {
  await db.restaurant.delete({ where: { id } });
  revalidatePath("/dashboard/restaurants");
}

// Category Actions
export async function getCategories() {
  return db.category.findMany({
    include: {
      products: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const values = {
    name: formData.get("name") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const result = categorySchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.category.create({ data: result.data });
  revalidatePath("/dashboard/categories");
  return { success: true, errors: {} };
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const values = {
    name: formData.get("name") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const result = categorySchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.category.update({ where: { id }, data: result.data });
  revalidatePath("/dashboard/categories");
  revalidatePath(`/dashboard/categories/${id}`);
  return { success: true, errors: {} };
}

export async function deleteCategory(id: string) {
  await db.category.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
}

// Product Actions
export async function getProducts() {
  return db.product.findMany({
    include: {
      restaurant: true,
      category: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      restaurant: true,
      category: true,
    },
  });
}

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const values = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    price: formData.get("price") as string,
    discountPercentage: formData.get("discountPercentage") as string,
    restaurantId: formData.get("restaurantId") as string,
    categoryId: formData.get("categoryId") as string,
  };

  const result = productSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.product.create({ data: result.data });
  revalidatePath("/dashboard/products");
  return { success: true, errors: {} };
}

export async function updateProduct(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const values = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    price: formData.get("price") as string,
    discountPercentage: formData.get("discountPercentage") as string,
    restaurantId: formData.get("restaurantId") as string,
    categoryId: formData.get("categoryId") as string,
  };

  const result = productSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.product.update({ where: { id }, data: result.data });
  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}`);
  return { success: true, errors: {} };
}

export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } });
  revalidatePath("/dashboard/products");
}

// Order Actions
export async function getOrders() {
  return db.order.findMany({
    include: {
      user: true,
      restaurant: true,
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      user: true,
      restaurant: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("orderId") as string;
  const values = { status: formData.get("status") as string };

  const result = orderStatusSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.order.update({
    where: { id },
    data: { status: result.data.status },
  });
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  return { success: true, errors: {} };
}

// User Actions
export async function getUsers() {
  return db.user.findMany({
    include: {
      orders: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      orders: true,
      favoriteRestaurants: true,
    },
  });
}

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  revalidatePath("/dashboard/users");
}

// Dashboard Stats
export async function getDashboardStats() {
  const [restaurantCount, productCount, orderCount, userCount, categoryCount] =
    await Promise.all([
      db.restaurant.count(),
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.category.count(),
    ]);

  return {
    restaurantCount,
    productCount,
    orderCount,
    userCount,
    categoryCount,
  };
}
