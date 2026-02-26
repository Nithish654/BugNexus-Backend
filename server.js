// @ts-nocheck
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const generateFullQAReport = require("./generator/index");
const { runAutomation } = require("./services/automationEngine");
const { detectWebsiteType } = require("./services/typeDetector");
const { runLighthouse } = require("./services/lighthouseService");
const { generateIssues } = require("./services/issueEngine");
const {
  generateExecutiveSummary,
} = require("./services/executiveSummaryEngine");
const { generateDashboardData } = require("./services/dashboardEngine");
const { parseReportIntoSections } = require("./services/reportParser");

const app = express();

/* ==============================
   CORS
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
  res.send(
    "🚀 BugNexus AI Backend Running (Automation + Lighthouse + Issue Engine + Health Score Enabled)",
  );
});

/* ==============================
   MAIN API
============================== */
app.post("/generate", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    console.log("🌐 Incoming Request:", url);

    /* ==============================
       STEP 1: Puppeteer Automation
    ============================== */
    console.log("🤖 Launching Puppeteer...");
    const automationData = await runAutomation(url);
    console.log("✅ Automation Completed");

    /* ==============================
       STEP 2: Detect Website Type
    ============================== */
    const detectedType = detectWebsiteType(automationData);
    console.log("🧠 Detected Website Type:", detectedType);

    /* ==============================
       STEP 3: Lighthouse Audit
    ============================== */
    console.log("⚡ Running Lighthouse Audit...");
    const lighthouseScores = await runLighthouse(url);
    console.log("✅ Lighthouse Completed");

    /* ==============================
       STEP 4: Issue + Scoring Engine
    ============================== */
    const issueResult = generateIssues({
      automationData,
      lighthouseScores,
    });

    const executiveSummary = generateExecutiveSummary({
      detectedType,
      overallScore: issueResult.overallScore,
      riskLevel: issueResult.riskLevel,
      summary: issueResult.summary,
    });

    const dashboardData = generateDashboardData({
      overallScore: issueResult.overallScore,
      riskLevel: issueResult.riskLevel,
      summary: issueResult.summary,
      lighthouseScores,
    });

    console.log("📋 Issues Generated:", issueResult.issues.length);
    console.log("🏥 Overall Score:", issueResult.overallScore);
    console.log("🚨 Risk Level:", issueResult.riskLevel);

    /* ==============================
       STEP 5: Generate AI QA Report
    ============================== */
    const report = await generateFullQAReport(url, detectedType, {
      ...automationData,
      lighthouseScores,
      ...issueResult,
      executiveSummary,
    });

    /* ==============================
       Save Report
    ============================== */
    const reportPath = path.join(reportsDir, "report.txt");
    fs.writeFileSync(reportPath, report, "utf-8");

    console.log("✅ QA Report Generated");

    /* ==============================
       Parse Report Sections
    ============================== */
    const reportSections = parseReportIntoSections(report);

    /* ==============================
       FINAL RESPONSE
    ============================== */
    res.json({
      success: true,
      message: "QA Report Generated Successfully",
      detectedType,

      executiveSummary,
      dashboard: dashboardData,

      automationData,
      lighthouseScores,

      issues: issueResult.issues,
      summary: issueResult.summary,
      overallScore: issueResult.overallScore,
      riskLevel: issueResult.riskLevel,

      report,
      reportSections,
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
  console.log(`🚀 BugNexus AI running on port ${PORT}`);
});
