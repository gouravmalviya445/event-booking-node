import z from "zod";

const eventCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  date: z.coerce.date(),
  price: z.number(),
  totalSeats: z.number(),
  availableSeats: z.number(),
  status: z.enum(["active", "cancelled"]).default("active"),
})

export {
  eventCreateSchema
}