// @ts-nocheck
const lighthouse = require("lighthouse");
const puppeteer = require("puppeteer");

async function runLighthouse(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const wsEndpoint = browser.wsEndpoint();
  const port = new URL(wsEndpoint).port;

  const runnerResult = await lighthouse(url, {
    port,
    output: "json",
    logLevel: "error",
    disableStorageReset: true,
  });

  const categories = runnerResult.lhr.categories;

  const result = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    seo: Math.round(categories.seo.score * 100),
    bestPractices: Math.round(categories["best-practices"].score * 100),
  };

  await browser.close();

  return result;
}

module.exports = { runLighthouse };
