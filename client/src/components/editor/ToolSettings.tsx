import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Check, X, RotateCcw, Sparkles } from "lucide-react";

interface ToolSettingsProps {
  tool: string | null;
  onApply: (settings: Record<string, number>) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const toolConfigs: Record<string, { label: string; settings: { id: string; label: string; min: number; max: number; default: number }[] }> = {
  sharpen: {
    label: "Sharpen",
    settings: [
      { id: "amount", label: "Amount", min: 0, max: 100, default: 50 },
      { id: "radius", label: "Radius", min: 0, max: 10, default: 1 },
    ],
  },
  denoise: {
    label: "Denoise",
    settings: [
      { id: "strength", label: "Strength", min: 0, max: 100, default: 30 },
      { id: "detail", label: "Preserve Detail", min: 0, max: 100, default: 70 },
    ],
  },
  "red-eye": {
    label: "Remove Red Eye",
    settings: [
      { id: "sensitivity", label: "Sensitivity", min: 0, max: 100, default: 50 },
    ],
  },
  "remove-object": {
    label: "Remove Object",
    settings: [],
  },
  contrast: {
    label: "Contrast",
    settings: [
      { id: "contrast", label: "Contrast", min: -100, max: 100, default: 0 },
    ],
  },
  exposure: {
    label: "Exposure",
    settings: [
      { id: "exposure", label: "Exposure", min: -100, max: 100, default: 0 },
      { id: "highlights", label: "Highlights", min: -100, max: 100, default: 0 },
      { id: "shadows", label: "Shadows", min: -100, max: 100, default: 0 },
    ],
  },
  background: {
    label: "Change Background",
    settings: [],
  },
  enhance: {
    label: "Auto Enhance",
    settings: [
      { id: "intensity", label: "Intensity", min: 0, max: 100, default: 50 },
    ],
  },
  "color-correct": {
    label: "Color Correction",
    settings: [
      { id: "temperature", label: "Temperature", min: -100, max: 100, default: 0 },
      { id: "tint", label: "Tint", min: -100, max: 100, default: 0 },
      { id: "saturation", label: "Saturation", min: -100, max: 100, default: 0 },
    ],
  },
};

export function ToolSettings({ tool, onApply, onCancel, isProcessing }: ToolSettingsProps) {
  const config = tool ? toolConfigs[tool] : null;
  const [values, setValues] = useState<Record<string, number>>(() => {
    if (!config) return {};
    return config.settings.reduce((acc, s) => ({ ...acc, [s.id]: s.default }), {});
  });

  if (!tool || !config) return null;

  const handleReset = () => {
    setValues(config.settings.reduce((acc, s) => ({ ...acc, [s.id]: s.default }), {}));
  };

  const isAITool = tool === "remove-object" || tool === "background";

  return (
    <Card className="absolute bottom-20 left-1/2 -translate-x-1/2 p-4 min-w-[320px] max-w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{config.label}</span>
          {isAITool && (
            <Sparkles className="w-4 h-4 text-primary" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={handleReset} data-testid="button-reset-settings">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isAITool ? (
        <div className="text-sm text-muted-foreground text-center py-4">
          {tool === "remove-object" 
            ? "Click on the object you want to remove, or describe it in the chat."
            : "Describe the new background you want in the chat, or choose from presets."}
        </div>
      ) : (
        <div className="space-y-4">
          {config.settings.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{setting.label}</Label>
                <span className="text-xs text-muted-foreground">{values[setting.id]}</span>
              </div>
              <Slider
                value={[values[setting.id]]}
                onValueChange={([v]) => setValues(prev => ({ ...prev, [setting.id]: v }))}
                min={setting.min}
                max={setting.max}
                step={1}
                data-testid={`slider-${setting.id}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isProcessing} data-testid="button-cancel-tool">
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={() => onApply(values)} disabled={isProcessing} data-testid="button-apply-tool">
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              Apply
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
