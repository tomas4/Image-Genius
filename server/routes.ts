import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { imageProcessingRequestSchema, aiProcessingRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Client-side image processing (runs on client, this is for reference)
  app.post("/api/process-image", (req, res) => {
    try {
      const validated = imageProcessingRequestSchema.parse(req.body);

      // Return instructions for client-side processing
      res.json({
        success: true,
        message: "Use client-side processing for this operation",
        tool: validated.tool,
        settings: validated.settings,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // AI-powered image editing (requires API key)
  app.post("/api/process-ai", async (req, res) => {
    try {
      const validated = aiProcessingRequestSchema.parse(req.body);
      const apiKey = req.headers["x-api-key"] as string || process.env.OPENAI_API_KEY;

      if (validated.modelType === "openai") {
        if (!apiKey) {
          return res.status(401).json({ error: "OpenAI API key required" });
        }
        
        const { callOpenAIImageEdit } = await import("./image-processor");
        const processedImage = await callOpenAIImageEdit({
          imageBase64: validated.imageBase64,
          prompt: validated.operation,
        }, apiKey);

        return res.json({ success: true, image: processedImage });
      } else {
        // Local model processing
        const { processWithLocalModel } = await import("./image-processor");
        const processedImage = await processWithLocalModel(
          validated.imageBase64,
          "models/" + validated.modelType,
          validated.modelType || "default"
        );

        return res.json({ success: true, image: processedImage });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // Chat endpoint for natural language image editing commands
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, imageContext, apiKey: userApiKey } = req.body;
      const apiKey = userApiKey || process.env.OPENAI_API_KEY;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message required" });
      }

      if (!apiKey) {
        return res.status(401).json({ error: "API key required for chat" });
      }

      const { OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey });

      const content: any[] = [{ type: "text", text: message }];
      if (imageContext) {
        content.push({
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageContext}` }
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [{ role: "user", content }],
        max_tokens: 500,
      });

      const reply = response.choices[0].message.content;

      res.json({
        success: true,
        message: reply,
        suggestedOperation: null, // Intent extraction could be added here
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  // Get processing capabilities
  app.get("/api/capabilities", (req, res) => {
    res.json({
      clientSide: [
        "sharpen",
        "denoise",
        "contrast",
        "exposure",
        "colorCorrection",
        "redEye",
        "enhance",
      ],
      aiPowered: ["removeObject", "changeBackground"],
      localModels: ["GFPGAN", "Real-ESRGAN", "REMBG", "ONNX"],
    });
  });

  return httpServer;
}
