const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { askLlama } = require("./lmstudioClient");

const app = express();

// ✅ Enable CORS for all origins (quick fix)
app.use(cors());

// ✅ Parse JSON
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  try {
    const reply = await askLlama(req.body.message);
    res.json({ reply });
  } catch (error) {
    console.error("LM Studio Error:", error);
    res.status(500).json({ error: "Failed to get response from LM Studio" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
