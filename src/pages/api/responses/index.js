import dbConnect from "@/lib/mongoose";
import FormResponse from "@/models/FormResponse";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { formId, responses, formTitle } = req.body;
      console.log("formId:", formId, "responses:", responses);

      if (!formId || !responses) {
        return res.status(400).json({ success: false, message: "Missing formId or responses" });
      }

      const newResponse = await FormResponse.create({ formId, responses ,formTitle});
      return res.status(201).json({ success: true, data: newResponse });
    } catch (error) {
      console.error("Error saving form response:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      const formResponses = await FormResponse.find({
        formId: req.query.formId,
      });
      return res.status(200).json({ success: true, data: formResponses });
    } catch (error) {
      console.error("Error fetching form responses:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  
  
  else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
