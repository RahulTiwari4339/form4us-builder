import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";

export default async function handler(req, res) {
    console

  const { formId } = req.body;

  if (!formId) {
    return res.status(400).json({ error: "formId is required" });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Delete the form by formId
    const result = await Form.deleteOne({ formId: formId }).exec();

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
