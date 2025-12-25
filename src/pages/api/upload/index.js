import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false, // IMPORTANT
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const blob = await put(
      `uploads/${Date.now()}.jpg`,
      req,
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return res.status(200).json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
