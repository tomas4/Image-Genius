import { useState } from "react";
import { ToolsSidebar } from "../editor/ToolsSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ToolsSidebarExample() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="h-[600px]">
        <ToolsSidebar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          onUpload={() => console.log("Upload clicked")}
          hasImage={true}
        />
      </div>
    </TooltipProvider>
  );
}
