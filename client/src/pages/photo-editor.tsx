import { useState, useCallback } from "react";
import { TopBar } from "@/components/editor/TopBar";
import { ToolsSidebar } from "@/components/editor/ToolsSidebar";
import { ImageCanvas } from "@/components/editor/ImageCanvas";
import { ChatPanel } from "@/components/editor/ChatPanel";
import { ExportDialog, ExportOptions } from "@/components/editor/ExportDialog";
import { ToolSettings } from "@/components/editor/ToolSettings";
import { UploadZone } from "@/components/editor/UploadZone";
import { SettingsDialog } from "@/components/editor/SettingsDialog";
import { useToast } from "@/hooks/use-toast";

interface ImageState {
  file: File | null;
  dataUrl: string | null;
  dimensions: { width: number; height: number } | null;
}

export default function PhotoEditor() {
  const { toast } = useToast();
  const [image, setImage] = useState<ImageState>({
    file: null,
    dataUrl: null,
    dimensions: null,
  });
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleImageUpload = useCallback((file: File, dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setImage({
        file,
        dataUrl,
        dimensions: { width: img.width, height: img.height },
      });
      setHistory([dataUrl]);
      setHistoryIndex(0);
      toast({
        title: "Image loaded",
        description: `${file.name} (${img.width}x${img.height})`,
      });
    };
    img.src = dataUrl;
  }, [toast]);

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedTool(toolId);
    console.log("Tool selected:", toolId);
  }, []);

  const handleToolApply = useCallback((settings: Record<string, number>) => {
    setIsProcessing(true);
    console.log("Applying tool:", selectedTool, settings);
    
    // todo: remove mock functionality - simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedTool(null);
      toast({
        title: "Effect applied",
        description: `${selectedTool} has been applied to your image.`,
      });
    }, 1500);
  }, [selectedTool, toast]);

  const handleToolCancel = useCallback(() => {
    setSelectedTool(null);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    console.log("Chat message:", message);
    setIsProcessing(true);
    
    // todo: remove mock functionality
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  }, []);

  const handleExport = useCallback((options: ExportOptions) => {
    console.log("Export with options:", options);
    toast({
      title: "Export started",
      description: `Saving as ${options.filename}.${options.format}`,
    });
    
    // todo: remove mock functionality - actual download would happen here
    if (image.dataUrl) {
      const link = document.createElement('a');
      link.download = `${options.filename}.${options.format}`;
      link.href = image.dataUrl;
      link.click();
    }
  }, [image.dataUrl, toast]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setImage(prev => ({
        ...prev,
        dataUrl: history[historyIndex - 1],
      }));
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setImage(prev => ({
        ...prev,
        dataUrl: history[historyIndex + 1],
      }));
    }
  }, [history, historyIndex]);

  const triggerUpload = useCallback(() => {
    const input = document.getElementById('main-file-upload') as HTMLInputElement;
    input?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          handleImageUpload(file, event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [handleImageUpload]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <input
        id="main-file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        data-testid="input-main-file-upload"
      />
      
      <TopBar
        fileName={image.file?.name}
        dimensions={image.dimensions || undefined}
        onExport={() => setExportDialogOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleSettings={() => setSettingsDialogOpen(true)}
        isChatOpen={isChatOpen}
        hasImage={!!image.dataUrl}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div className="flex-1 flex overflow-hidden">
        <ToolsSidebar
          selectedTool={selectedTool}
          onToolSelect={handleToolSelect}
          onUpload={triggerUpload}
          hasImage={!!image.dataUrl}
        />

        <div className="flex-1 flex flex-col relative">
          {image.dataUrl ? (
            <ImageCanvas
              imageSrc={image.dataUrl}
              isProcessing={isProcessing}
              showComparison={showComparison}
              onToggleComparison={() => setShowComparison(!showComparison)}
            />
          ) : (
            <UploadZone onImageUpload={handleImageUpload} />
          )}

          {selectedTool && image.dataUrl && (
            <ToolSettings
              tool={selectedTool}
              onApply={handleToolApply}
              onCancel={handleToolCancel}
              isProcessing={isProcessing}
            />
          )}
        </div>

        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        dimensions={image.dimensions || undefined}
        onExport={handleExport}
      />

      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        onSave={(settings) => {
          console.log("Settings saved:", settings);
          toast({
            title: "Settings saved",
            description: "Your configuration has been saved.",
          });
        }}
      />
    </div>
  );
}
