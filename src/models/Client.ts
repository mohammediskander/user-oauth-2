import * as mongoose from "mongoose";

export interface Client extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grants: string[];
}

const ClientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    clientId: {
      type: String,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    redirectUris: {
      type: Array,
      required: true,
    },
    grants: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Client>("clients", ClientSchema);
