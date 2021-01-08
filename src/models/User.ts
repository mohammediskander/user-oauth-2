import * as mongoose from "mongoose";
import Address from "./Address";

export interface User extends mongoose.Document {
  username: string;
  fullName: string;
  nationalId: string;
  password: string;
  phoneNumber: string;
  birthDate: Date;
  address: typeof Address;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>("users", UserSchema);
