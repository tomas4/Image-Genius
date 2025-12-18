import { useState } from "react";
import { ImageCanvas } from "../editor/ImageCanvas";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ImageCanvasExample() {
  const [showComparison, setShowComparison] = useState(false);

  // todo: remove mock functionality
  const mockImageSrc = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop";

  return (
    <TooltipProvider>
      <div className="h-[500px] flex bg-background">
        <ImageCanvas
          imageSrc={mockImageSrc}
          showComparison={showComparison}
          onToggleComparison={() => setShowComparison(!showComparison)}
        />
      </div>
    </TooltipProvider>
  );
}
