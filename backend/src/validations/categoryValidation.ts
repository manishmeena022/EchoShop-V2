import { z } from "zod";

const categoryZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be at least 3 characters long")
    .max(150, "Name is too long"),
  slug: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type CategoryZod = z.infer<typeof categoryZodSchema>;
