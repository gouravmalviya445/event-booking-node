import z from "zod";

const createPaymentOrderSchema = z.object({
  eventId: z.string(),
  amount: z.number(),
  currency: z.string().default("INR"),
  totalTickets: z.number(),
})

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
})

export {
  createPaymentOrderSchema,
  verifyPaymentSchema
}