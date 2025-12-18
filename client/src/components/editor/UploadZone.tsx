import { useCallback, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onImageUpload: (file: File, dataUrl: string) => void;
}

export function UploadZone({ onImageUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      console.log("Invalid file type");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onImageUpload(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div
      className={`flex-1 flex items-center justify-center p-8 transition-colors ${
        isDragging ? "bg-primary/5" : ""
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      data-testid="upload-zone"
    >
      <div
        className={`text-center max-w-md p-8 rounded-lg border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          {isDragging ? (
            <Upload className="w-8 h-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {isDragging ? "Drop your image here" : "Upload an image to start"}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          Drag and drop an image, or click to browse. Supports PNG, JPEG, WebP, and more.
        </p>

        <div className="flex flex-col items-center gap-3">
          <label htmlFor="file-upload">
            <Button asChild className="cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            data-testid="input-file-upload"
          />
          
          <p className="text-xs text-muted-foreground">
            Maximum file size: 50MB
          </p>
        </div>
      </div>
    </div>
  );
}
