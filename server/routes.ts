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

      // Check for API key in request or environment
      const apiKey = req.headers["x-api-key"] as string;

      if (!apiKey) {
        return res
          .status(401)
          .json({ error: "API key required for AI operations" });
      }

      // Todo: implement actual AI processing with OpenAI or local models
      res.status(501).json({
        error: "AI processing not yet implemented",
        operation: validated.operation,
        note: "This will be connected to OpenAI API or local models",
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Chat endpoint for natural language image editing commands
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, imageContext } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message required" });
      }

      // Todo: parse message to determine editing operation
      // This will integrate with OpenAI to understand user intent

      res.json({
        success: true,
        message: "Chat message received",
        suggestedOperation: null,
        note: "Chat integration not yet implemented",
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
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
