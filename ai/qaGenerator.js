// @ts-nocheck
const callGroqAPI = require("./groqClient");

async function generateQAReport(prompt) {
  try {
    const report = await callGroqAPI(prompt);
    return report;
  } catch (error) {
    console.error("❌ QA Generator Error:");
    console.error(error.message);
    return "AI report generation failed. Please check Groq configuration.";
  }
}

module.exports = generateQAReport;
