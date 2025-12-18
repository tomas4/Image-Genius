import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  MessageSquare, 
  Undo2, 
  Redo2,
  ImageIcon,
  Camera
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TopBarProps {
  fileName?: string;
  dimensions?: { width: number; height: number };
  onExport: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  hasImage: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function TopBar({
  fileName,
  dimensions,
  onExport,
  onToggleChat,
  isChatOpen,
  hasImage,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: TopBarProps) {
  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Camera className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-base">AI Photo Editor</span>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                disabled={!canUndo}
                onClick={onUndo}
                data-testid="button-undo"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                disabled={!canRedo}
                onClick={onRedo}
                data-testid="button-redo"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {hasImage && fileName && (
          <>
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{fileName}</span>
            {dimensions && (
              <Badge variant="secondary" className="text-xs">
                {dimensions.width} x {dimensions.height}
              </Badge>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isChatOpen ? "secondary" : "ghost"}
              size="icon"
              onClick={onToggleChat}
              data-testid="button-toggle-chat"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>AI Chat Assistant</TooltipContent>
        </Tooltip>

        <ThemeToggle />

        <Button 
          onClick={onExport} 
          disabled={!hasImage}
          className="gap-2"
          data-testid="button-export"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
