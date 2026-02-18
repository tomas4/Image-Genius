// Gemini AI client for image editing and chat
import { ChatMessage } from "@shared/schema";

export interface AIEditRequest {
  imageBase64: string;
  prompt: string;
  operation: "removeObject" | "changeBackground" | "enhance";
}

export async function callAIEdit(
  request: AIEditRequest
): Promise<string> {
  try {
    const response = await fetch("/api/process-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: request.imageBase64,
        prompt: request.prompt,
        operation: request.operation,
        modelType: "openai" // Backend will map this to Gemini now
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error("AI API call failed:", error);
    throw error;
  }
}

export async function chatWithAI(
  messages: ChatMessage[],
  imageBase64: string | null
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages[messages.length - 1].content,
        imageContext: imageBase64
      }),
    });

    if (!response.ok) {
      throw new Error(`AI chat failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("AI chat failed:", error);
    throw error;
  }
}

export function extractEditingIntent(message: string): {
  operation: string;
  prompt: string;
} | null {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes("remove") ||
    lowerMsg.includes("delete") ||
    lowerMsg.includes("erase")
  ) {
    return { operation: "removeObject", prompt: message };
  }

  if (
    lowerMsg.includes("background") ||
    lowerMsg.includes("replace bg") ||
    lowerMsg.includes("new background")
  ) {
    return { operation: "changeBackground", prompt: message };
  }

  if (
    lowerMsg.includes("enhance") ||
    lowerMsg.includes("improve") ||
    lowerMsg.includes("better")
  ) {
    return { operation: "enhance", prompt: message };
  }

  return null;
}
