
import { nanoid } from "nanoid";
import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  await dbConnect();

  const { formId } = req.body;

  const original = await Form.findOne({ formId });

  if (!original) return res.status(404).json({ error: "Form not found" });

  
  const duplicateData = original.toObject();
  delete duplicateData._id;
  duplicateData.formId =  `form-${nanoid(8)}`;
  duplicateData.title = original.title + " (Copy)";

  const newForm = await Form.create(duplicateData);

  return res.json({ message: "Form duplicated", form: newForm });
}
