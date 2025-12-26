import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../env";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";

  comparePassword(password: string): Promise<boolean>;
  createAccessToken(): string;
  toJSON(): IUser;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "organizer"],
      default: "user"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email
    },
    ENV.jwtSecret,
    { expiresIn: ENV.jwtExpiry } as jwt.SignOptions
  )
}

userSchema.methods.toJSON = function () {
  const user = (this as mongoose.Document).toObject();
  user.password = undefined;
  return user;
}

const User = mongoose.model<IUser>("User", userSchema);
export { User };
