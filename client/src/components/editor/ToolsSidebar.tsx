import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Contrast,
  Sun,
  Eye,
  Eraser,
  Image,
  Wand2,
  Zap,
  Focus,
  Palette,
  Upload,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Tool {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  isAI?: boolean;
}

const tools: Tool[] = [
  { id: "sharpen", label: "Sharpen", icon: Focus, category: "Enhance" },
  { id: "denoise", label: "Denoise", icon: Sparkles, category: "Enhance" },
  { id: "red-eye", label: "Remove Red Eye", icon: Eye, category: "Repair" },
  { id: "remove-object", label: "Remove Object", icon: Eraser, category: "Repair", isAI: true },
  { id: "contrast", label: "Contrast", icon: Contrast, category: "Adjust" },
  { id: "exposure", label: "Exposure", icon: Sun, category: "Adjust" },
  { id: "background", label: "Change Background", icon: Image, category: "Transform", isAI: true },
  { id: "enhance", label: "Auto Enhance", icon: Wand2, category: "Transform", isAI: true },
  { id: "color-correct", label: "Color Correction", icon: Palette, category: "Adjust" },
];

interface ToolsSidebarProps {
  selectedTool: string | null;
  onToolSelect: (toolId: string) => void;
  onUpload: () => void;
  hasImage: boolean;
}

export function ToolsSidebar({ selectedTool, onToolSelect, onUpload, hasImage }: ToolsSidebarProps) {
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Button 
          onClick={onUpload} 
          className="w-full gap-2"
          data-testid="button-upload"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {categories.map((category, idx) => (
            <div key={category} className="mb-4">
              <div className="px-2 py-1 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </span>
              </div>
              <div className="space-y-1">
                {tools
                  .filter(t => t.category === category)
                  .map((tool) => (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === tool.id ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3 h-11"
                          onClick={() => onToolSelect(tool.id)}
                          disabled={!hasImage}
                          data-testid={`button-tool-${tool.id}`}
                        >
                          <tool.icon className="w-4 h-4" />
                          <span className="flex-1 text-left text-sm">{tool.label}</span>
                          {tool.isAI && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              AI
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {tool.label}
                        {tool.isAI && " (AI-powered)"}
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>
              {idx < categories.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
          <Zap className="w-3 h-3" />
          <span>AI features require API connection</span>
        </div>
      </div>
    </div>
  );
}
