// @ts-nocheck

function generateIssues({ automationData, lighthouseScores }) {
  const issues = [];

  /* ===============================
     Broken Links
  =============================== */
  if (automationData.brokenLinks?.length > 0) {
    const count = automationData.brokenLinks.length;

    let severity = "Low";
    if (count > 5) severity = "High";
    else if (count > 2) severity = "Medium";

    issues.push({
      type: "Broken Links",
      severity,
      description: `${count} broken links detected on the page.`,
      recommendation:
        "Fix or remove invalid anchor links to improve SEO and UX.",
    });
  }

  /* ===============================
     Console Errors
  =============================== */
  if (automationData.consoleErrors?.length > 0) {
    const count = automationData.consoleErrors.length;

    let severity = "Low";
    if (count > 5) severity = "High";
    else if (count > 2) severity = "Medium";

    issues.push({
      type: "Console Errors",
      severity,
      description: `${count} JavaScript console errors detected.`,
      recommendation: "Inspect browser console and fix runtime errors.",
    });
  }

  /* ===============================
     Performance
  =============================== */
  if (lighthouseScores?.performance < 70) {
    issues.push({
      type: "Performance Issue",
      severity: "High",
      description: `Performance score is ${lighthouseScores.performance}.`,
      recommendation: "Optimize images, reduce JS bundle size, enable caching.",
    });
  } else if (lighthouseScores?.performance < 90) {
    issues.push({
      type: "Performance Optimization",
      severity: "Medium",
      description: `Performance score is ${lighthouseScores.performance}.`,
      recommendation: "Minor optimization improvements recommended.",
    });
  }

  /* ===============================
     Accessibility
  =============================== */
  if (lighthouseScores?.accessibility < 80) {
    issues.push({
      type: "Accessibility Issue",
      severity: "High",
      description: `Accessibility score is ${lighthouseScores.accessibility}.`,
      recommendation:
        "Improve ARIA labels, contrast ratio, semantic HTML usage.",
    });
  }

  /* ===============================
     SEVERITY SUMMARY
  =============================== */
  const summary = {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  issues.forEach((issue) => {
    summary[issue.severity]++;
  });

  /* ===============================
     OVERALL HEALTH SCORE
  =============================== */
  let overallScore =
    (lighthouseScores.performance +
      lighthouseScores.accessibility +
      lighthouseScores.seo +
      lighthouseScores.bestPractices) /
    4;

  overallScore = Math.round(overallScore);

  /* ===============================
     RISK LEVEL
  =============================== */
  let riskLevel = "Low";
  if (summary.High > 0) riskLevel = "High";
  else if (summary.Medium > 1) riskLevel = "Moderate";

  return {
    issues,
    summary,
    overallScore,
    riskLevel,
  };
}

module.exports = { generateIssues };
