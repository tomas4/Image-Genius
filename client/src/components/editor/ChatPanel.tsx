import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, User, X, MessageSquare, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  imageDataUrl?: string | null;
  isProcessing?: boolean;
  onEditingIntent?: (operation: string, prompt: string) => void;
}

export function ChatPanel({ 
  isOpen, 
  onClose, 
  onSendMessage, 
  imageDataUrl,
  isProcessing,
  onEditingIntent 
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI photo editing assistant. You can describe what changes you'd like to make to your image, or use the quick-action tools on the left. Try saying things like \"Make the colors more vibrant\" or \"Remove the background\".",
      timestamp: new Date(),
    },
  ]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    // Check for API key
    const settings = localStorage.getItem("photoEditorSettings");
    const apiKey = settings ? JSON.parse(settings).apiKey : "";

    if (!apiKey) {
      setApiKeyMissing(true);
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in Settings to use AI features.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    onSendMessage(userInput);

    // Check if message indicates an editing operation
    const message = userInput.toLowerCase();
    if (
      message.includes("remove") ||
      message.includes("delete") ||
      message.includes("erase")
    ) {
      onEditingIntent?.("remove-object", userInput);
    } else if (
      message.includes("background") ||
      message.includes("replace bg") ||
      message.includes("new background")
    ) {
      onEditingIntent?.("background", userInput);
    } else if (
      message.includes("enhance") ||
      message.includes("improve") ||
      message.includes("better")
    ) {
      onEditingIntent?.("enhance", userInput);
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand. I'm analyzing your image and preparing the edits. Advanced features like object removal and background changes will be processed using AI.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  }, [input, isProcessing, onSendMessage, onEditingIntent, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) return null;

  return (
    <div className="w-[360px] bg-sidebar border-l border-sidebar-border flex flex-col h-full">
      <div className="h-14 px-4 flex items-center justify-between gap-2 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-chat">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {apiKeyMissing && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive">
            Configure OpenAI API key in Settings for advanced features
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-card-border"
                  }`}
                >
                  {message.content}
                </div>
                <p className={`text-[11px] text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : ""}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-secondary">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-card-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you'd like to edit..."
            className="resize-none pr-12 min-h-[80px] max-h-[120px]"
            disabled={isProcessing}
            data-testid="input-chat-message"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
