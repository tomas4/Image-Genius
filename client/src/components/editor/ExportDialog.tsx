import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Download, FileImage } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dimensions?: { width: number; height: number };
  onExport: (options: ExportOptions) => void;
}

export interface ExportOptions {
  format: "png" | "jpeg" | "webp";
  quality: number;
  filename: string;
}

export function ExportDialog({ open, onOpenChange, dimensions, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);
  const [filename, setFilename] = useState("edited-image");

  const handleExport = () => {
    onExport({ format, quality, filename });
    onOpenChange(false);
  };

  const estimatedSize = dimensions 
    ? Math.round((dimensions.width * dimensions.height * (format === "png" ? 4 : quality / 25)) / 1024)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Export Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Filename</Label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              data-testid="input-export-filename"
            />
          </div>

          <div className="space-y-3">
            <Label>Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as "png" | "jpeg" | "webp")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="png" id="png" data-testid="radio-format-png" />
                <Label htmlFor="png" className="font-normal cursor-pointer">PNG</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="jpeg" id="jpeg" data-testid="radio-format-jpeg" />
                <Label htmlFor="jpeg" className="font-normal cursor-pointer">JPEG</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="webp" id="webp" data-testid="radio-format-webp" />
                <Label htmlFor="webp" className="font-normal cursor-pointer">WebP</Label>
              </div>
            </RadioGroup>
          </div>

          {format !== "png" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-sm text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
                min={10}
                max={100}
                step={5}
                data-testid="slider-quality"
              />
            </div>
          )}

          {dimensions && (
            <div className="rounded-md bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dimensions</span>
                <span>{dimensions.width} x {dimensions.height} px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Size</span>
                <span>~{estimatedSize > 1024 ? `${(estimatedSize / 1024).toFixed(1)} MB` : `${estimatedSize} KB`}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-export-cancel">
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2" data-testid="button-export-confirm">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
