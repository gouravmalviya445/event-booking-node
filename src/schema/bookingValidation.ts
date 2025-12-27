import z from "zod";

const bookingCreateSchema = z.object({
  eventId: z.string(),
})

export {
  bookingCreateSchema 
}