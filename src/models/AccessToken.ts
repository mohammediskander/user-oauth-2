import * as mongoose from "mongoose";
import { Client } from "./Client";
import { User } from "./User";

export interface AccessToken extends mongoose.Document {
  user?: mongoose.Schema.Types.ObjectId | {} | User;
  client: mongoose.Schema.Types.ObjectId | Client;
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string | string[];
}

const AccessTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    accessTokenExpiresAt: Date,
    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokenExpiresAt: Date,
    scope: Array<String>() || String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AccessToken>("accessTokens", AccessTokenSchema);
