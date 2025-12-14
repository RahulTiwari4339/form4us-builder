import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  await dbConnect();

  const { formId, isActive } = req.body;

  if (!formId || typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      error: "formId and isActive (boolean) are required",
    });
  }

  const updatedForm = await Form.findOneAndUpdate(
    { formId },
    { isActive },
    { new: true }
  );

  if (!updatedForm) {
    return res.status(404).json({ success: false, error: "Form not found" });
  }

  return res.json({
    success: true,
    message: isActive ? "Form opened successfully" : "Form closed successfully",
    form: updatedForm,
  });
}
