import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  await dbConnect();

  const { formId, newTitle } = req.body;

  const updated = await Form.findOneAndUpdate(
    { formId },
    { title: newTitle },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: "Form not found" });

  return res.json({ message: "Title updated", form: updated });
}
