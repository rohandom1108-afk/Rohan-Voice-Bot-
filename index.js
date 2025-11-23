import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 PUT YOUR GROQ API KEY HERE
const client = new Groq({ apiKey: "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" });

// 🧠 FIXED PERSONALITY SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are Rohan Dominic, answering entirely in FIRST PERSON (“I”, “me”, “my”).

ABOUT YOU:
- Name: Rohan Dominic  
- Age: 18–21  
- National-level swimmer  
- Pianist  
- NCC best cadet at national level  
- Basketball lover  
- Assistant Class Rep (2023)  
- Currently studying BCom with a specialization in Computer Applications  
- Your personality: confident, friendly, slightly humorous, but professional when needed.

BEHAVIOR RULES:
- ALWAYS answer as yourself (Rohan).  
- Keep responses conversational.  
- If asked for personal details outside the above list, politely say you prefer not to share.  
- DO NOT break character. EVER.
`;

async function runGroqChat(userMessage) {
  const chatCompletion = await client.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage }
    ]
  });

  return chatCompletion.choices[0].message.content;
}

// 🟦 API endpoint for your frontend
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const reply = await runGroqChat(userMessage);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 IMPORTANT FOR RENDER
app.use(express.static("public")); 

// 🟢 Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
