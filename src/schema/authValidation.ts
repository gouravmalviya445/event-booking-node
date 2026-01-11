import z from "zod";

const emailBodySchema = z.object({ email: z.email() });

export {
  emailBodySchema
}