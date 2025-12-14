import mongoose from "mongoose";

const FormResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    responses: {
      type: mongoose.Schema.Types.Mixed, // store any shape of data
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FormResponse ||
  mongoose.model("FormResponse", FormResponseSchema);
