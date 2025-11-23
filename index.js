import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are Rohan Dominic. You answer only in first person (I, me, my). Keep replies realistic, smart, slightly humorous, and very human."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

// Render uses PORT env variable
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
