// @ts-nocheck
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const generateFullQAReport = require("./generator/index");

const app = express();

/* ==============================
   CORS (Allow all for now)
============================== */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

/* ==============================
   Ensure reports folder exists
============================== */
const reportsDir = path.join(__dirname, "reports");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
  console.log("📁 Reports folder created");
}

/* ==============================
   Health Check
============================== */
app.get("/", (req, res) => {
  res.send("🚀 AI QA Agent Backend is Running");
});

/* ==============================
   MAIN API
============================== */
app.post("/generate", async (req, res) => {
  try {
    const { url, type } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    console.log("🌐 Incoming Request:");
    console.log("URL:", url);
    console.log("Type:", type || "generic");

    // 🔥 Generate report
    const report = await generateFullQAReport(url, type || "generic");

    // Save report safely
    const reportPath = path.join(reportsDir, "report.txt");
    fs.writeFileSync(reportPath, report, "utf-8");

    console.log("✅ QA Report Generated Successfully");

    res.json({
      success: true,
      message: "QA Report Generated Successfully",
      report,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);

    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

/* ==============================
   Start Server
============================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI QA Agent running on port ${PORT}`);
});
