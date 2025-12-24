import mongoose from "mongoose";

const QuizScoreSchema = new mongoose.Schema(
  {
    total: Number,
    correct: Number,
    percentage: Number,
  },
  { _id: false }
);

const FormResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
      index: true,
    },

    formTitle: {
      type: String,
      required: true,
    },

    responses: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // 🔥 QUIZ META (OPTIONAL)
    quizScore: {
      type: QuizScoreSchema,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FormResponse ||
  mongoose.model("FormResponse", FormResponseSchema);
