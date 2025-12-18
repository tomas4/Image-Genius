import { z } from "zod";

// Image processing request schema
export const imageProcessingRequestSchema = z.object({
  imageBase64: z.string().min(1),
  tool: z.enum([
    "sharpen",
    "denoise",
    "contrast",
    "exposure",
    "colorCorrection",
    "redEye",
    "enhance",
  ]),
  settings: z.record(z.number()),
});

export type ImageProcessingRequest = z.infer<typeof imageProcessingRequestSchema>;

// Chat message schema
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// AI processing request schema
export const aiProcessingRequestSchema = z.object({
  imageBase64: z.string().min(1),
  prompt: z.string().min(1),
  operation: z.enum(["removeObject", "changeBackground", "enhance"]),
});

export type AIProcessingRequest = z.infer<typeof aiProcessingRequestSchema>;
