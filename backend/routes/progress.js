import express from "express";
import Progress from "../models/Progress.js";
import Question from "../models/Question.js";

const router = express.Router();

// Toggle question completion status
router.post("/toggle/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = "default-user"; // For future user authentication

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Find or create progress record
    let progress = await Progress.findOne({ questionId, userId });

    if (progress) {
      // Toggle completion status
      progress.completed = !progress.completed;
      progress.completedAt = progress.completed ? new Date() : null;
      await progress.save();
    } else {
      // Create new progress record
      progress = await Progress.create({
        questionId,
        userId,
        completed: true,
        completedAt: new Date(),
      });
    }

    res.json({
      questionId,
      completed: progress.completed,
      completedAt: progress.completedAt,
    });
  } catch (error) {
    console.error("Toggle progress error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get daily progress (for streak calendar)
router.get("/daily", async (req, res) => {
  try {
    const userId = "default-user";

    const progressRecords = await Progress.find({
      userId,
      completed: true,
      completedAt: { $exists: true },
    }).populate("questionId");

    // Group by date
    const dailyMap = new Map();

    progressRecords.forEach((p) => {
      if (p.completedAt) {
        const date = p.completedAt.toISOString().split("T")[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            count: 0,
            questions: [],
          });
        }
        const dayData = dailyMap.get(date);
        dayData.count++;
        dayData.questions.push(p.questionId._id.toString());
      }
    });

    const dailyProgress = Array.from(dailyMap.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );

    res.json(dailyProgress);
  } catch (error) {
    console.error("Get daily progress error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get overall stats
router.get("/stats", async (req, res) => {
  try {
    const userId = "default-user";

    const totalQuestions = await Question.countDocuments();
    const completedCount = await Progress.countDocuments({
      userId,
      completed: true,
    });

    // Get current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const nextDay = new Date(checkDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await Progress.countDocuments({
        userId,
        completed: true,
        completedAt: {
          $gte: checkDate,
          $lt: nextDay,
        },
      });

      if (count > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({
      totalQuestions,
      completedQuestions: completedCount,
      currentStreak: streak,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
