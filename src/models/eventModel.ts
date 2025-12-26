import mongoose, { Schema } from "mongoose";

type Category = "sport" | "business" | "tech" | "music" | "art" | "health" | "other";
type ObjId = Schema.Types.ObjectId;

interface IEvent {
  title: string;
  description?: string;
  location: string;
  date: Date;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: "active" | "cancelled";
  category: Category;
  image: string;
  organizer: ObjId;
  // startTime: string;
  // endTime: string;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    location: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },

    // TODO:
    // startTime: String,
    // endTime: String,

    category: {
      type: String,
      enum: ["sport", "business", "tech", "music", "art", "health", "other"],
      required: true
    },
    image: { type: String, required: true },

    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalSeats: {
      type: Number,
      required: true
    },
    availableSeats: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active"
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>("Event", eventSchema);
