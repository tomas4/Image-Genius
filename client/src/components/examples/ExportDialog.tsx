import { useState } from "react";
import { ExportDialog } from "../editor/ExportDialog";
import { Button } from "@/components/ui/button";

export default function ExportDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Export Dialog</Button>
      <ExportDialog
        open={open}
        onOpenChange={setOpen}
        dimensions={{ width: 1920, height: 1080 }}
        onExport={(options) => console.log("Export:", options)}
      />
    </div>
  );
}
