// @ts-nocheck
const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

async function crawlWebsite(url) {
  try {
    console.log(`Crawling: ${url}`);

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const { data } = await axios.get(url, {
      httpsAgent: agent,
    });

    const $ = cheerio.load(data);

    const pageData = {
      title: $("title").text(),
      headings: [],
      links: [],
      buttons: [],
      forms: [],
    };

    $("h1, h2, h3").each((i, el) => {
      pageData.headings.push($(el).text().trim());
    });

    $("a").each((i, el) => {
      const link = $(el).attr("href");
      if (link) pageData.links.push(link);
    });

    $("button").each((i, el) => {
      pageData.buttons.push($(el).text().trim());
    });

    $("form").each((i, el) => {
      pageData.forms.push($(el).attr("action") || "No action defined");
    });

    return pageData;
  } catch (error) {
    console.error("Error crawling:", error.message);
    return null;
  }
}

module.exports = crawlWebsite;
