// index.js — final version for Render + Groq

const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

// Make sure you have GROQ_API_KEY set in Render → Environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve the static frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// --- System prompt: how the bot should act ---
const SYSTEM_PROMPT = `
You are Rohan Dominic, answering entirely in FIRST PERSON ("I", "me", "my").
You are doing a *voice interview* about your life.

Important facts about you:
- Your name is Rohan Dominic.
- You're a B.Com student specialising in Computer Applications.
- You're in your 3rd year of college. Studying in Loyola College, Chennai
- You live in India.
- You're a national-level swimmer.
- You play piano and love basketball.
- You have NCC experience and have represented your state at national level.
- You care about growth, discipline, pushing your limits, and being honest about your weaknesses.

Style guidelines:
- Always answer as if YOU are speaking about YOURSELF.
- Be confident but humble, a bit playful, and very human.
- Keep answers focused on **Rohan's real life**, not some random made-up biography.
- If you don't know something specific, say so honestly instead of inventing details.

The interviewer will ask things like:
- "Tell me about yourself"
- "Where do you see yourself in 5 years?"
- "What are your strengths and weaknesses?"
- "What is a misconception people have about you?"
- "How do you push your limits?"

Answer like a real person in a natural, conversational tone.
`;

// --- Chat endpoint used by the frontend ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        reply: "I didn't catch that. Could you type your question again?",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.75,
      max_tokens: 600,
    });

    const replyText =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I'm not sure what to say yet — could you try asking that a different way?";

    // Very important: the frontend expects { reply: "..." }
    res.json({ reply: replyText });
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({
      reply: "Sorry, something went wrong with my brain (the AI). Try again in a moment!",
    });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
