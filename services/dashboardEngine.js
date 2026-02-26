// @ts-nocheck

function generateDashboardData({
  overallScore,
  riskLevel,
  summary,
  lighthouseScores,
}) {
  /* ==============================
     HEALTH GRADE
  ============================== */
  let grade = "D";

  if (overallScore >= 90) grade = "A";
  else if (overallScore >= 80) grade = "B";
  else if (overallScore >= 70) grade = "C";

  /* ==============================
     RISK COLOR
  ============================== */
  const riskColorMap = {
    High: "red",
    Moderate: "orange",
    Low: "green",
  };

  /* ==============================
     SCORE CLASSIFICATION
  ============================== */
  function classifyScore(score) {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Average";
    return "Poor";
  }

  /* ==============================
     BUILD DASHBOARD STRUCTURE
  ============================== */
  return {
    healthGrade: grade,
    overallScore,
    scoreLabel: classifyScore(overallScore),
    riskLevel,
    riskColor: riskColorMap[riskLevel] || "gray",

    issueSummary: summary,

    performanceMetrics: {
      performance: {
        score: lighthouseScores.performance,
        label: classifyScore(lighthouseScores.performance),
      },
      accessibility: {
        score: lighthouseScores.accessibility,
        label: classifyScore(lighthouseScores.accessibility),
      },
      seo: {
        score: lighthouseScores.seo,
        label: classifyScore(lighthouseScores.seo),
      },
      bestPractices: {
        score: lighthouseScores.bestPractices,
        label: classifyScore(lighthouseScores.bestPractices),
      },
    },
  };
}

module.exports = { generateDashboardData };
