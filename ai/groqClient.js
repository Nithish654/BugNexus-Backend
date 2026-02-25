// @ts-nocheck
const axios = require("axios");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroqAPI(prompt) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      },
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error("Invalid Groq response structure");
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Groq API Error:");
    console.error(error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    throw new Error("AI report generation failed via Groq.");
  }
}

module.exports = callGroqAPI;
