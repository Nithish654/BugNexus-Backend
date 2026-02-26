// @ts-nocheck

function generateExecutiveSummary({
  detectedType,
  overallScore,
  riskLevel,
  summary,
}) {
  const totalIssues = summary.High + summary.Medium + summary.Low;

  return {
    websiteType: detectedType,
    overallScore,
    riskLevel,
    totalIssues,
    issueBreakdown: summary,
    auditDate: new Date().toISOString(),
  };
}

module.exports = { generateExecutiveSummary };
