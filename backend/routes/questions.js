import express from "express";
import multer from "multer";
import Question from "../models/Question.js";
import Progress from "../models/Progress.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CSV Parser function
const parseCSV = (content) => {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const difficultyIndex = headers.findIndex((h) => h.includes("difficulty"));
  const titleIndex = headers.findIndex((h) => h.includes("title"));
  const frequencyIndex = headers.findIndex((h) => h.includes("frequency"));
  const acceptanceIndex = headers.findIndex((h) => h.includes("acceptance"));
  const linkIndex = headers.findIndex((h) => h.includes("link"));
  const topicsIndex = headers.findIndex((h) => h.includes("topic"));

  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    const difficulty = parseDifficulty(values[difficultyIndex] || "Medium");
    const title = values[titleIndex]?.trim() || `Question ${i}`;
    const frequency = parseFloat(values[frequencyIndex]) || 0;
    const acceptanceRate =
      parseFloat(values[acceptanceIndex]?.replace("%", "")) || 0;
    const link = values[linkIndex]?.trim() || "";
    const topics = parseTopics(values[topicsIndex] || "");

    questions.push({
      difficulty,
      title,
      frequency,
      acceptanceRate,
      link,
      topics,
    });
  }

  return questions;
};

const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

const parseDifficulty = (value) => {
  const lower = value.toLowerCase().trim();
  if (lower.includes("easy")) return "Easy";
  if (lower.includes("hard")) return "Hard";
  return "Medium";
};

const parseTopics = (value) => {
  if (!value) return [];
  return value
    .replace(/[\[\]"]/g, "")
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

// Upload CSV and add questions for a company
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: "Company name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const csvContent = req.file.buffer.toString("utf-8");
    const parsedQuestions = parseCSV(csvContent);

    if (parsedQuestions.length === 0) {
      return res.status(400).json({ error: "No valid questions found in CSV" });
    }

    // Add company to each question
    const questionsWithCompany = parsedQuestions.map((q) => ({
      ...q,
      company,
    }));

    // Insert questions (skip duplicates)
    const insertResults = await Promise.allSettled(
      questionsWithCompany.map((q) => Question.create(q)),
    );

    const successful = insertResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const failed = insertResults.length - successful;

    res.json({
      message: "Questions uploaded successfully",
      total: parsedQuestions.length,
      inserted: successful,
      skipped: failed,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    // Get progress for all questions
    const progress = await Progress.find({ userId: "default-user" });
    const progressMap = new Map(
      progress.map((p) => [p.questionId.toString(), p.completed]),
    );

    // Add completed status to questions
    const questionsWithProgress = questions.map((q) => ({
      id: q._id.toString(),
      title: q.title,
      difficulty: q.difficulty,
      frequency: q.frequency,
      acceptanceRate: q.acceptanceRate,
      link: q.link,
      topics: q.topics,
      company: q.company,
      completed: progressMap.get(q._id.toString()) || false,
    }));

    res.json(questionsWithProgress);
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get questions by company
router.get("/company/:companyName", async (req, res) => {
  try {
    const { companyName } = req.params;
    const questions = await Question.find({ company: companyName }).sort({
      createdAt: -1,
    });

    // Get progress for all questions
    const questionIds = questions.map((q) => q._id);
    const progress = await Progress.find({
      questionId: { $in: questionIds },
      userId: "default-user",
    });
    const progressMap = new Map(
      progress.map((p) => [p.questionId.toString(), p.completed]),
    );

    // Add completed status to questions
    const questionsWithProgress = questions.map((q) => ({
      id: q._id.toString(),
      title: q.title,
      difficulty: q.difficulty,
      frequency: q.frequency,
      acceptanceRate: q.acceptanceRate,
      link: q.link,
      topics: q.topics,
      company: q.company,
      completed: progressMap.get(q._id.toString()) || false,
    }));

    res.json(questionsWithProgress);
  } catch (error) {
    console.error("Get company questions error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all companies with stats
router.get("/companies/all", async (req, res) => {
  try {
    const companies = await Question.aggregate([
      {
        $group: {
          _id: "$company",
          totalQuestions: { $sum: 1 },
          easyCount: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0] },
          },
          mediumCount: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0] },
          },
          hardCount: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { totalQuestions: -1 },
      },
    ]);

    // Get completed count for each company
    const companiesWithProgress = await Promise.all(
      companies.map(async (company) => {
        const questions = await Question.find({ company: company._id });
        const questionIds = questions.map((q) => q._id);
        const completedCount = await Progress.countDocuments({
          questionId: { $in: questionIds },
          userId: "default-user",
          completed: true,
        });

        return {
          name: company._id,
          totalQuestions: company.totalQuestions,
          completedQuestions: completedCount,
          easyCount: company.easyCount,
          mediumCount: company.mediumCount,
          hardCount: company.hardCount,
        };
      }),
    );

    res.json(companiesWithProgress);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete all questions for a company
router.delete("/company/:companyName", async (req, res) => {
  try {
    const { companyName } = req.params;
    const result = await Question.deleteMany({ company: companyName });
    res.json({
      message: `Deleted ${result.deletedCount} questions for ${companyName}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete company questions error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
