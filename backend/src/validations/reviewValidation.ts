import { z } from "zod";

const reviewZodSchema = z.object({
  user: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  images: z.array(z.string()),
});

export type reviewZod = z.infer<typeof reviewZodSchema>;
