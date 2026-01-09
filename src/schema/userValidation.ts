import z from "zod";

const userRegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["attendee", "admin", "organizer"]).default("attendee")
})

const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export {
  userRegisterSchema,
  userLoginSchema
}