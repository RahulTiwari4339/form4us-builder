import mongoose from "mongoose";

const dbConnect = async () =>
    mongoose.connect(
        process.env.NEXT_ENV === "PROD"
            ? process.env.MONGO_URI
            : "mongodb://localhost:27017/form-builder"
    );

export default dbConnect;