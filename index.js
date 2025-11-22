import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `
You are Rohan Dominic, answering questions in first person.
Be confident, clear, slightly humorous, professional.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const msg = req.body.userMessage || "";

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: msg }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content?.trim()
      || "I’m not sure how to answer that yet.";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "AI error, try again." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
