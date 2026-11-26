import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(1),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().url(),
  storageGb: z.coerce.number().int().positive(),
  color: z.string().min(1),
  featured: z.coerce.boolean().optional(),
  display: z.string().optional(),
  chip: z.string().optional(),
  camera: z.string().optional(),
  battery: z.string().optional(),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  postalCode: z.string().min(3),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
});

export const cartQuantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(99),
});
