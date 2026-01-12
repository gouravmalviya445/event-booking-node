import z from "zod";

const emailBodySchema = z.object({ email: z.email() });

const verifyPassSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, "otp must be 6 digit")
})

const resetPassSchema = z.object({
  newPassword: z.string().min(6)
})

export {
  emailBodySchema,
  verifyPassSchema,
  resetPassSchema
}