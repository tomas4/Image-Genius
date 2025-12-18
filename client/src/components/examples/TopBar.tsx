import { useState } from "react";
import { TopBar } from "../editor/TopBar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function TopBarExample() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <TooltipProvider>
      <TopBar
        fileName="mountain-landscape.jpg"
        dimensions={{ width: 1920, height: 1080 }}
        onExport={() => console.log("Export clicked")}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleSettings={() => console.log("Settings clicked")}
        isChatOpen={isChatOpen}
        hasImage={true}
        canUndo={true}
        canRedo={false}
        onUndo={() => console.log("Undo")}
        onRedo={() => console.log("Redo")}
      />
    </TooltipProvider>
  );
}
