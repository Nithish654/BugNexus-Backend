// @ts-nocheck
const fs = require("fs");
const path = require("path");

// ✅ FIXED PATH — using the strict deterministic prompt
const buildPrompt = require("../services/promptBuilder");

// Groq generator (leave this as is)
const generateQAReport = require("../ai/qaGenerator");

/**
 * Core function used by server.js
 */
async function generateFullQAReport(
  url,
  type = "generic",
  structuredData = {},
) {
  if (!url) {
    throw new Error("URL is required");
  }

  if (!structuredData || Object.keys(structuredData).length === 0) {
    throw new Error("Structured data missing");
  }

  console.log("🤖 Generating AI QA Report via Groq (Deterministic Mode)...");

  // ✅ Build STRICT deterministic prompt
  const prompt = buildPrompt(structuredData, url, type);

  const aiReport = await generateQAReport(prompt);

  if (!aiReport || aiReport.length < 20) {
    throw new Error("AI returned invalid report");
  }

  return aiReport;
}

/**
 * CLI mode support
 */
async function runCLI() {
  const { runAutomation } = require("../services/automationEngine");
  const { runLighthouse } = require("../services/lighthouseService");
  const { generateIssues } = require("../services/issueEngine");
  const {
    generateExecutiveSummary,
  } = require("../services/executiveSummaryEngine");

  const url = process.argv[2];
  const type = process.argv[3] || "generic";

  if (!url) {
    console.log("❌ Please provide a URL");
    process.exit(1);
  }

  try {
    console.log("🤖 Running Automation Pipeline...");

    const automationData = await runAutomation(url);
    const lighthouseScores = await runLighthouse(url);
    const issues = generateIssues({
      automationData,
      lighthouseScores,
    });

    const executiveSummary = generateExecutiveSummary({
      issues,
      lighthouseScores,
      type,
    });

    const structuredData = {
      ...automationData,
      lighthouseScores,
      issues,
      executiveSummary,
    };

    const report = await generateFullQAReport(url, type, structuredData);

    const reportPath = path.join(__dirname, "..", "reports", "report.txt");

    fs.writeFileSync(reportPath, report, "utf-8");

    console.log("✅ Report successfully saved at:");
    console.log(reportPath);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

if (require.main === module) {
  runCLI();
}

module.exports = generateFullQAReport;
