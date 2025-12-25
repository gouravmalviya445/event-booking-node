import z from "zod";

const userRegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin", "organizer"]).default("user")
})

export {
  userRegisterSchema
}