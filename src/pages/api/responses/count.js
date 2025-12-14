import dbConnect from '../../../lib/mongoose'; 
import FormResponse from '../../../models/FormResponse'; 

export default async function handler(req, res) {
  await dbConnect(); 
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { formId } = req.query;

  if (!formId) {
    return res.status(400).json({ message: 'formId is required' });
  }

  try {
    const count = await FormResponse.countDocuments({ formId });
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting form responses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
