// models/Form.js
import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  key: { type: String, },
  type: { type: String,  },
  label: { type: String, },
  icon: { type: String },
  color: { type: String },
  settings: { type: mongoose.Schema.Types.Mixed },
});

const FormSchema = new mongoose.Schema({
  formId: { type: String, unique: true, required: true, index: true },
  userId:{ type: mongoose.Schema.Types.ObjectId,ref: "User"},
  pagebg: { type: String },
  title: { type: String },
  description: String,
  buttonText: String,
  steps: [StepSchema],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "draft" },
  backgroundImage: { type: String, default: "" },
  template: { type: Boolean, default: false },
  textColor: { type: String, default: "#000000" },
  buttonColor: { type: String, default: "#ff4d4f" },
 buttonTextColor: { type: String, default: "#ffffff" },
 isActive: { type: Boolean, default: true },
});

export default mongoose.models.Form || mongoose.model("Form", FormSchema);
