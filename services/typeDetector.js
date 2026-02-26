//@ts-nocheck

function detectWebsiteType(data) {
  const text = (data.pageTextSample || "").toLowerCase();

  if (text.includes("add to cart") || text.includes("checkout")) {
    return "ecommerce";
  }

  if (text.includes("dashboard") || text.includes("login")) {
    return "saas";
  }

  if (data.formsCount > 2) {
    return "webapp";
  }

  if (
    text.includes("portfolio") ||
    text.includes("projects") ||
    text.includes("about me")
  ) {
    return "portfolio";
  }

  return "generic";
}

module.exports = { detectWebsiteType };
