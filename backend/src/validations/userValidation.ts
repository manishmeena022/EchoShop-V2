import { z } from "zod";

// Zod schema for validation
const nameSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is too short")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is too short")
    .max(50, "Last name is too long")
    .optional(),
});

const emailSchema = z
  .string()
  .email("Invalid email address")
  .transform((val) => val.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain letters and numbers"
  );

const roleSchema = z.enum(["admin", "customer", "vendor"]).default("customer");

const profileSchema = z.object({
  age: z.number().min(0).max(120).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  photo: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zip: z
        .string()
        .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format")
        .optional(),
    })
    .optional(),
});

const cartItemSchema = z.object({
  productId: z.string(), // Assume ObjectId is stored as a string
  quantity: z.number().min(1),
  addedAt: z.date().default(() => new Date()),
});

const orderSchema = z.object({
  orderId: z.string(),
  orderDate: z.date(),
  totalAmount: z.number(),
  status: z
    .enum(["pending", "shipped", "delivered", "cancelled", "returned"])
    .default("pending"),
});

const userZodSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
  profile: profileSchema.optional(),
  wishlist: z.array(z.string()).optional(),
  cart: z.array(cartItemSchema).optional(),
  orders: z.array(orderSchema).optional(),
});

export default userZodSchema;

// Infer the TypeScript type from the Zod schema
export type UserZod = z.infer<typeof userZodSchema>;
