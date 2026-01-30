import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    frequency: {
      type: Number,
      default: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
      default: "",
    },
    topics: [
      {
        type: String,
      },
    ],
    company: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for uniqueness
questionSchema.index({ title: 1, company: 1 }, { unique: true });

const Question = mongoose.model("Question", questionSchema);

export default Question;
