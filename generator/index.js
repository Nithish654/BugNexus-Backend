// @ts-nocheck
const fs = require("fs");
const path = require("path");
const crawlWebsite = require("../crawler/crawler");
const buildPrompt = require("../ai/promptBuilder");
const generateQAReport = require("../ai/qaGenerator");

/**
 * Core function used by server.js
 */
async function generateFullQAReport(url, type = "generic") {
  if (!url) {
    throw new Error("URL is required");
  }

  console.log("🔎 Crawling:", url);

  const crawlData = await crawlWebsite(url);

  if (!crawlData) {
    throw new Error("Website crawling failed");
  }

  console.log("🤖 Generating AI QA Report via Groq...");

  const prompt = buildPrompt(crawlData, url, type);

  const aiReport = await generateQAReport(prompt);

  if (!aiReport || aiReport.length < 10) {
    throw new Error("AI returned empty report");
  }

  return aiReport;
}

/**
 * CLI mode support (optional)
 */
async function runCLI() {
  const url = process.argv[2];
  const type = process.argv[3] || "generic";

  if (!url) {
    console.log("❌ Please provide a URL");
    process.exit(1);
  }

  try {
    const report = await generateFullQAReport(url, type);

    const reportPath = path.join(__dirname, "..", "reports", "report.txt");

    fs.writeFileSync(reportPath, report, "utf-8");

    console.log("✅ Report successfully saved at:");
    console.log(reportPath);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Only run CLI if called directly
if (require.main === module) {
  runCLI();
}

module.exports = generateFullQAReport;
