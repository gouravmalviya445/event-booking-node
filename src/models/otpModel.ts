import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IOtp {
  identifier: string; // can be email or phone
  otpHash: string;
  purpose: "RESET_PASSWORD" | "VERIFY_EMAIL";
  attempts: number;
  maxAttempts: number;
  used: boolean;
  expiresAt: Date;
  createdAt: Date;

  compare(otp: string): Promise<boolean>  
}

const otpSchema: Schema<IOtp> = new Schema<IOtp>({
  identifier: {
    type: String,
    trim: true,
    required: true,
  },

  otpHash: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    enum: ["RESET_PASSWORD", "VERIFY_EMAIL"],
    required: true,
  },

  attempts: {
    type: Number,
    default: 0,
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  
  used: {
    type: Boolean,
    default: false,
  },

  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    index: true,
    default: Date.now
  }
})

// TTL(time-to-live) index automatically remove expired documents from the collection
// automatically delete otp record if it is expired
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: (5 * 60), } // 1 hour
);

otpSchema.index({
  identifier: 1, 
  createdAt: -1
})

otpSchema.pre("save", async function () {
  if (this.isModified("otpHash")) {
    this.otpHash = await bcrypt.hash(this.otpHash, 10);
  }
});

// compare otp
otpSchema.methods.compare = async function (otp: string) {
  return await bcrypt.compare(otp, this.otpHash)
}

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);