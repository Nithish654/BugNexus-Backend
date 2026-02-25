// @ts-nocheck
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const generateFullQAReport = require("./generator/index");

const app = express();

// Enable CORS for frontend
// Enable CORS for frontend (ALLOW ALL LOCAL DEV)
app.use(
  cors({
    origin: true, // allow all origins in development
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 AI QA Agent Backend is Running");
});

/**
 * MAIN API
 * POST /generate
 */
app.post("/generate", async (req, res) => {
  try {
    const { url, type } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required",
      });
    }

    console.log("🌐 Incoming Request:");
    console.log("URL:", url);
    console.log("Type:", type || "generic");

    // 🔥 Generate report via Groq
    const report = await generateFullQAReport(url, type || "generic");

    // Save report
    const reportPath = path.join(__dirname, "reports", "report.txt");
    fs.writeFileSync(reportPath, report, "utf-8");

    console.log("✅ QA Report Generated Successfully");

    res.json({
      success: true,
      message: "QA Report Generated Successfully",
      report,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

// Render compatible port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI QA Agent running on port ${PORT}`);
});
