import * as mongoose from "mongoose";
import { Client } from "./Client";
import { User } from "./User";

export interface AuthorizationCode extends mongoose.Document {
  user?: mongoose.Schema.Types.ObjectId | {} | User;
  client: mongoose.Schema.Types.ObjectId | Client;
  authorizationCode: string;
  expiresAt: Date;
  scope: string;
  redirectUri: string;
}

const AuthorizationCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    authorizationCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    redirectUri: String,
    scope: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<AuthorizationCode>(
  "authorizationCodes",
  AuthorizationCodeSchema
);
