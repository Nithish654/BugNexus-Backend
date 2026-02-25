// @ts-nocheck

function buildPrompt(crawlData, url, type = "generic") {
  return `
You are a Senior Automation QA Engineer with 8+ years experience.

Your task is to generate a PROFESSIONAL, REALISTIC, structured QA Report.

Website Type: ${type}
Website URL: ${url}

==========================
CRAWLED DATA
==========================

TITLE:
${crawlData.title || "N/A"}

HEADINGS:
${crawlData.headings?.join(", ") || "N/A"}

LINKS:
${crawlData.links?.slice(0, 20).join(", ") || "N/A"}

BUTTONS:
${crawlData.buttons?.join(", ") || "N/A"}

FORMS:
${crawlData.forms?.join(", ") || "N/A"}

==========================
INSTRUCTIONS
==========================

Generate a detailed QA Report with:

1. Functional Test Cases (based ONLY on available elements)
2. UI/UX Test Cases
3. Playwright Automation Plan
4. Security Testing Checklist
5. Performance Testing Strategy
6. Advanced Automation Strategy (like Senior QA Architect)

Rules:
- DO NOT assume login if not present
- DO NOT create fake features
- Use structured formatting
- Be technical and professional

Return clean formatted text only.
`;
}

module.exports = buildPrompt;
