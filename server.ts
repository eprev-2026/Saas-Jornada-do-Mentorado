import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini (Proxy)
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Use a stable version
        systemInstruction: systemInstruction 
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Dedicated endpoint for Chat with history and structured output
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message, systemInstruction, responseSchema } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction 
      });

      const chat = model.startChat({
        history: history || [],
        generationConfig: {
          responseMimeType: responseSchema ? "application/json" : "text/plain",
          // responseSchema: responseSchema // Note: some SDK versions might have issues with raw schema passing here
        }
      });

      // If we use JSON mode, we append a reminder to the message
      const finalMessage = responseSchema 
        ? `${message}\n\nResponda estritamente em JSON de acordo com este schema: ${JSON.stringify(responseSchema)}`
        : message;

      const result = await chat.sendMessage(finalMessage);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate chat response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serving static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
