import * as mongoose from "mongoose";

export interface Address extends mongoose.Document {
  buildingNumber: number;
  streetName?: string;
  districtName?: string;
  cityName: string;
  zipCode: number;
  additionalNumber?: number;
  unitNumber?: number;
}

const AddressSchema = new mongoose.Schema<mongoose.Document<Address>>(
  {
    buildingNumber: {
      type: Number,
    },
    streetName: {
      type: String,
    },
    districtName: {
      type: String,
    },
    cityName: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    additionalNumber: {
      type: Number,
    },
    unitNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Address>("addresses", AddressSchema);
