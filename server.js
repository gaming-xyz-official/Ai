require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route (optional but useful)
app.get("/", (req, res) => {
    res.send("✅ AI Chatbot Server is Running");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();

        console.log("API RESPONSE:", data);

        let reply = "⚠️ No response";

        if (data.choices && data.choices.length > 0) {
            reply = data.choices[0].message.content;
        } else if (data.error) {
            reply = "❌ " + data.error.message;
        }

        res.json({ reply });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.json({
            reply: "❌ Server error"
        });
    }
});

// 🔥 IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});