// @ts-nocheck
const puppeteer = require("puppeteer");
const path = require("path");
const axios = require("axios");

async function runAutomation(url) {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

  const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  /* ===============================
     Extract Structured Data
  =============================== */
  const data = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a"))
      .map((a) => a.href)
      .filter((href) => href && href.startsWith("http"));

    const forms = document.querySelectorAll("form").length;
    const buttons = document.querySelectorAll("button").length;

    const pageText = document.body.innerText.toLowerCase();

    return {
      title: document.title,
      metaDescription:
        document.querySelector('meta[name="description"]')?.content || "",
      links,
      linkCount: links.length,
      formsCount: forms,
      buttonsCount: buttons,
      pageTextSample: pageText.slice(0, 3000),
    };
  });

  /* ===============================
     Broken Link Detection
  =============================== */
  const brokenLinks = [];
  const uniqueLinks = [...new Set(data.links)];

  for (const link of uniqueLinks) {
    try {
      const response = await axios.get(link, {
        timeout: 5000,
        validateStatus: () => true,
      });

      if (response.status >= 400) {
        brokenLinks.push({
          url: link,
          status: response.status,
        });
      }
    } catch (error) {
      brokenLinks.push({
        url: link,
        status: "Failed",
      });
    }
  }

  /* ===============================
     Screenshot Capture
  =============================== */
  const screenshotPath = path.join(
    __dirname,
    "..",
    "reports",
    "screenshot.png",
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  await browser.close();

  return {
    title: data.title,
    metaDescription: data.metaDescription,
    linkCount: data.linkCount,
    formsCount: data.formsCount,
    buttonsCount: data.buttonsCount,
    pageTextSample: data.pageTextSample,
    consoleErrors,
    brokenLinks,
  };
}

module.exports = { runAutomation };
