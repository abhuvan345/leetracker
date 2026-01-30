import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    userId: {
      type: String,
      default: "default-user", // For future user authentication
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for uniqueness
progressSchema.index({ questionId: 1, userId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
