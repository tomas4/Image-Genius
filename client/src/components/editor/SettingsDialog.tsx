import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Key, 
  Database, 
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

interface Settings {
  apiKey: string;
  apiProvider: "openai" | "local";
  localModelPath: string;
  localModelType: string;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: Settings) => void;
}

export function SettingsDialog({ open, onOpenChange, onSave }: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    apiProvider: "openai",
    localModelPath: "",
    localModelType: "general",
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("photoEditorSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem("photoEditorSettings", JSON.stringify(settings));
    onSave(settings);
    setHasChanges(false);
    onOpenChange(false);
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const isConfigured = settings.apiKey || settings.localModelPath;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <DialogTitle>Settings</DialogTitle>
          </div>
          <DialogDescription>
            Configure API keys and local model settings for image editing
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              AI Services
            </TabsTrigger>
            <TabsTrigger value="local" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Local Models
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="rounded-md bg-muted p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                AI features are powered by Google Gemini via Replit AI Integrations. No API key is required as long as you have Replit credits.
              </p>
            </div>

            <div className="space-y-2 opacity-50 cursor-not-allowed">
              <Label htmlFor="api-key">Gemini API Key (Optional)</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={settings.apiKey}
                  onChange={(e) => handleChange("apiKey", e.target.value)}
                  placeholder="Managed by Replit"
                  className="pr-10"
                  disabled
                  data-testid="input-api-key"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled
                  data-testid="button-toggle-api-visibility"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                Replit AI Integration Active
              </div>
            </div>

            <Separator />

            <div className="rounded-md bg-card p-3 border border-card-border">
              <p className="text-sm font-medium mb-2">Supported Features with API</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Intelligent object removal</li>
                <li>AI-powered background changes</li>
                <li>Smart auto-enhancement</li>
                <li>Context-aware inpainting</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="local" className="space-y-4 mt-4">
            <div className="rounded-md bg-muted p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Use open-source models for local image processing. No internet required.</p>
                <p className="text-xs">Examples: GFPGAN (face restoration), Real-ESRGAN (upscaling), REMBG (background removal)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-type">Model Type</Label>
              <select
                id="model-type"
                value={settings.localModelType}
                onChange={(e) => handleChange("localModelType", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                data-testid="select-model-type"
              >
                <option value="general">General Purpose (TensorFlow.js)</option>
                <option value="gfpgan">Face Restoration (GFPGAN)</option>
                <option value="realesrgan">Upscaling (Real-ESRGAN)</option>
                <option value="rembg">Background Removal (REMBG)</option>
                <option value="onnx">ONNX Runtime Model</option>
                <option value="custom">Custom Model</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-path">Local Model Path or URL</Label>
              <Textarea
                id="model-path"
                value={settings.localModelPath}
                onChange={(e) => handleChange("localModelPath", e.target.value)}
                placeholder="E.g., /models/model.onnx or file:///C:/Users/YourName/models/model.bin"
                className="min-h-[80px] resize-none"
                data-testid="input-model-path"
              />
              <p className="text-xs text-muted-foreground">
                For local files: use file:// protocol or full path. Models run in-browser when possible.
              </p>
            </div>

            {settings.localModelPath && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                Local model path configured
              </div>
            )}

            <Separator />

            <div className="rounded-md bg-card p-3 border border-card-border">
              <p className="text-sm font-medium mb-2">Available Open-Source Models</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">GFPGAN</p>
                  <p>Face restoration and enhancement</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Real-ESRGAN</p>
                  <p>4x upscaling without quality loss</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">REMBG</p>
                  <p>Background removal (ONNX Runtime)</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConfigured && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Configured
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-settings-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges && !isConfigured}
              className="gap-2"
              data-testid="button-settings-save"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
