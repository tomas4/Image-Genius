// OpenAI API client for advanced image editing features
import { ChatMessage } from "@shared/schema";

export interface OpenAIEditRequest {
  imageBase64: string;
  prompt: string;
  operation: "removeObject" | "changeBackground" | "enhance";
}

export async function callOpenAIEdit(
  request: OpenAIEditRequest,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${request.imageBase64}`,
                },
              },
              {
                type: "text",
                text: request.prompt,
              },
            ],
          },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
}

export async function chatWithAI(
  messages: ChatMessage[],
  imageBase64: string | null,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const content = [
      ...messages.slice(-5).map((msg) => ({
        type: "text" as const,
        text: `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
      })),
      ...(imageBase64
        ? [
            {
              type: "image_url" as const,
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ]
        : []),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content,
          },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI chat failed:", error);
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
