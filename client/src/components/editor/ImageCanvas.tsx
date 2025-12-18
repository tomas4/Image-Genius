import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Maximize, Move, RotateCcw, ArrowLeftRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageCanvasProps {
  imageSrc: string | null;
  isProcessing?: boolean;
  showComparison?: boolean;
  onToggleComparison?: () => void;
}

export function ImageCanvas({ 
  imageSrc, 
  isProcessing = false,
  showComparison = false,
  onToggleComparison
}: ImageCanvasProps) {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleFit = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
    }
  }, [isPanning]);

  const zoomPresets = [25, 50, 100, 200];

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative"
        style={{
          backgroundImage: imageSrc ? 'linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)' : undefined,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
        onMouseDown={handleMouseDown}
        data-testid="canvas-container"
      >
        {imageSrc ? (
          <div className="relative" style={{ transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)` }}>
            {showComparison ? (
              <div className="relative">
                <img
                  src={imageSrc}
                  alt="Original"
                  className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                  style={{ filter: 'grayscale(30%) brightness(0.9)' }}
                  data-testid="img-original"
                />
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${comparisonPosition}%` }}
                >
                  <img
                    src={imageSrc}
                    alt="Edited"
                    className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                    data-testid="img-edited"
                  />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                  style={{ left: `${comparisonPosition}%`, transform: 'translateX(-50%)' }}
                  data-testid="comparison-slider"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full p-1">
                    <ArrowLeftRight className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparisonPosition}
                  onChange={(e) => setComparisonPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  data-testid="input-comparison-range"
                />
              </div>
            ) : (
              <img
                src={imageSrc}
                alt="Current edit"
                className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                draggable={false}
                data-testid="img-current"
              />
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
              <Maximize className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">No image loaded</p>
            <p className="text-sm">Upload an image to start editing</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center" data-testid="processing-overlay">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-md p-2 border border-card-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={handleZoomOut} data-testid="button-zoom-out">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-1">
          {zoomPresets.map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant={zoom === preset ? "secondary" : "ghost"}
              onClick={() => setZoom(preset)}
              className="text-xs px-2"
              data-testid={`button-zoom-${preset}`}
            >
              {preset}%
            </Button>
          ))}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={handleZoomIn} data-testid="button-zoom-in">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={isPanning ? "secondary" : "ghost"} 
              onClick={() => setIsPanning(!isPanning)}
              data-testid="button-pan"
            >
              <Move className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pan Tool</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={handleFit} data-testid="button-fit">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset View</TooltipContent>
        </Tooltip>

        {imageSrc && onToggleComparison && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant={showComparison ? "secondary" : "ghost"} 
                  onClick={onToggleComparison}
                  data-testid="button-toggle-comparison"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Before/After Comparison</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}
