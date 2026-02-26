// @ts-nocheck
const chromeLauncher = require("chrome-launcher");

async function runLighthouse(url) {
  const lighthouse = (await import("lighthouse")).default;

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  const options = {
    logLevel: "error",
    output: "json",
    port: chrome.port,
    disableStorageReset: true, // important for Windows
  };

  const runnerResult = await lighthouse(url, options);

  const categories = runnerResult.lhr.categories;

  const result = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    seo: Math.round(categories.seo.score * 100),
    bestPractices: Math.round(categories["best-practices"].score * 100),
  };

  try {
    await chrome.kill();
  } catch (e) {
    console.log("Chrome cleanup skipped");
  }

  return result;
}

module.exports = { runLighthouse };
