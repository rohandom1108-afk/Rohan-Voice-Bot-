// index.js - Rohan's Voice Bot server

const path = require("path");
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

// ---- CONFIG ----
const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const PORT = process.env.PORT || 10000;

// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());

// serve files from /public (index.html, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// ---- CHAT ENDPOINT ----
app.post("/api/chat", async (req, res) => {
  const userMessage =
    req.body.userMessage || "Introduce yourself as Rohan Dominic.";

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are Rohan Dominic answering interview questions about his life, superpower, growth areas, misconceptions, and how he pushes his limits. Answer like him: professional, honest, with a tiny bit of humour, 3–5 sentences.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I’m blanking out for a second, please ask me again. 🙈";

    res.json({ reply });
  } catch (err) {
    console.error("Groq API error:", err);
    res.json({
      reply:
        "Oops, my AI brain glitched for a moment. Please try asking the question again in a bit.",
    });
  }
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
