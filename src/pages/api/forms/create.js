// pages/api/forms/create.js
import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "POST": {
      const { title} = req.body;
      try {
        const formId = `form-${nanoid(8)}`;
        const form = await Form.create({
          formId,
          title
        });

        return res.status(201).json({ success: true, formId });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Server error" });
      }
    }

    case "PATCH": {
      const { formId, userId, title, description, steps, buttonText , status, backgroundImage, pagebg, textColor, buttonColor, buttonTextColor  } = req.body;

      if (!formId) {
        return res.status(400).json({ success: false, error: "formId is required for update" });
      }

      try {
        const updatedForm = await Form.findOneAndUpdate(
          { formId },
          { userId, title, description, steps, buttonText , status , backgroundImage, pagebg, textColor, buttonColor, buttonTextColor },
          { new: true }
        );

        if (!updatedForm) {
          return res.status(404).json({ success: false, error: "Form not found" });
        }

        return res.status(200).json({ success: true, form: updatedForm });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Server error" });
      }
    }

    default:
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
