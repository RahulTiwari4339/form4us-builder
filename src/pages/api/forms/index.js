import dbConnect from "../../../lib/mongoose";
import Form from "../../../models/Form";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const forms = await Form.find({ userId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching forms by userId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
