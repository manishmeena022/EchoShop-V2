import { z } from "zod";

const productZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be at least 3 characters long")
    .max(150, "Name is too long"),
  slug: z.string(),
  description: z
    .string()
    .min(3, "Description should be at least 3 characters long")
    .max(150, "Description is too long"),
  longDescription: z
    .string()
    .min(3, "Description should be at least 3 characters long"),
  price: z.number().positive(),
  discountPrice: z.number().positive().nullable().optional(),
  stock: z.number().nonnegative(),
  sku: z.string(),
  category: z.array(z.string()),
  brand: z.string().optional(),
  images: z.array(z.string()),
  specification: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
  reviews: z.array(z.string()),
  averageRating: z.number().nonnegative().optional(),
  totalRating: z.number().positive().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.string().optional(),
    })
    .optional(),
  dimensions: z.object({
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    length: z.number().positive().optional(),
  }),
  tags: z.array(z.string().optional()),
  relatedProducts: z.array(z.string()),
});

export type productZod = z.infer<typeof productZodSchema>;
