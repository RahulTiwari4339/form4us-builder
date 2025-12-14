import User from "@/models/User";
import dbConnect from "../../../lib/mongoose";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { firstName, lastName, email, password } = req.body;

  await dbConnect();

 

 const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }


   const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const name = `${firstName} ${lastName}`;

  const user = new User({name, email, password: hashedPassword });
  await user.save();

  

  return res.status(200).json({ message: 'User registered successfully' });
}
