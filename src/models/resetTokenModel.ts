import mongoose from "mongoose";
import crypto from "crypto";

interface IResetToken {
  userId: mongoose.Schema.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;

  compare: (token: string) => boolean;
}

const resetTokenSchema = new mongoose.Schema<IResetToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tokenHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// TTL index on expiresAt
resetTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

resetTokenSchema.methods.compare = async function (token: string) {
  return this.tokenHash === token;
}

export const ResetToken = mongoose.model<IResetToken>("ResetToken", resetTokenSchema);