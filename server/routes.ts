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

      if (validated.modelType === "openai" || validated.modelType === "default") {
        const { callGeminiImageAnalysis } = await import("./image-processor");
        const processedImage = await callGeminiImageAnalysis({
          imageBase64: validated.imageBase64,
          prompt: validated.operation,
        });

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
      const { message, imageContext } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message required" });
      }

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.REPLIT_AI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const parts: any[] = [{ text: message }];
      if (imageContext) {
        parts.push({
          inlineData: {
            data: imageContext,
            mimeType: "image/jpeg"
          }
        });
      }

      const result = await model.generateContent(parts);
      const reply = result.response.text();

      res.json({
        success: true,
        message: reply,
        suggestedOperation: null,
      });
    } catch (error: any) {
      console.error("Gemini chat error:", error);
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
