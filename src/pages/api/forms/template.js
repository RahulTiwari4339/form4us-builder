import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";

export default async function handler(req, res) {
  const { formId } = req.query;

  try {
    // Connect to MongoDB
    await dbConnect();


    // Find the form by formId (not MongoDB _id)
    const form = await Form.find({template:true});

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
