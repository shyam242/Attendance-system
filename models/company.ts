import mongoose, { Schema, models } from "mongoose";

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    processType: { type: String, required: true },
    processDate: { type: String, required: true },
  },
  { timestamps: true }
);

const Company = models.Company || mongoose.model("Company", companySchema);
export default Company;
