// @ts-nocheck

function parseReportIntoSections(reportText) {
  if (!reportText) return {};

  const sections = {
    executiveSummary: "",
    performanceAnalysis: "",
    accessibilityReview: "",
    seoReview: "",
    issueBreakdown: "",
    riskAssessment: "",
    finalRecommendations: "",
  };

  const splitBySection = (title) => {
    const regex = new RegExp(`${title}[\\s\\S]*?(?=\\n[A-Z]{1,4}\\. |$)`, "i");
    const match = reportText.match(regex);
    return match ? match[0].trim() : "";
  };

  sections.executiveSummary = splitBySection("I\\. EXECUTIVE SUMMARY");
  sections.performanceAnalysis = splitBySection("II\\. PERFORMANCE ANALYSIS");
  sections.accessibilityReview = splitBySection("III\\. ACCESSIBILITY REVIEW");
  sections.seoReview = splitBySection("IV\\. SEO");
  sections.issueBreakdown = splitBySection("V\\. ISSUE BREAKDOWN");
  sections.riskAssessment = splitBySection("VI\\. RISK ASSESSMENT");
  sections.finalRecommendations = splitBySection(
    "VII\\. FINAL RECOMMENDATIONS",
  );

  return sections;
}

module.exports = { parseReportIntoSections };
