const fetch = require("node-fetch");

async function askLlama(userMessage) {
  try {
    console.log("👉 Sending request to LM Studio with message:", userMessage);

    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-2-7b-chat",   // ✅ must match /v1/models
        messages: [
          { role: "system", content: "You are a paint suggestion assistant. Suggest modern and creative paint color ideas." },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      }),
    });

    console.log("👉 LM Studio API status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LM Studio API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("👉 LM Studio API raw response:", data);

    return data.choices[0].message.content;
  } catch (err) {
    console.error("❌ LM Studio fetch failed:", err.message);
    return "Sorry, failed to get a paint suggestion.";
  }
}

module.exports = { askLlama };
