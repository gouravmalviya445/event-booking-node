import z from "zod";

const eventCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  date: z.coerce.date(),
  price: z.number(),
  image: z.url().optional(),
  totalSeats: z.number(),
  status: z.enum(["active", "cancelled"]).default("active"),
  category: z.enum([
    "sport",
    "business",
    "tech",
    "music",
    "art",
    "health",
    "other"
  ]),
})

export {
  eventCreateSchema
}