// Client-side image processing using Canvas API
// All operations run in the browser without server calls

export interface ProcessingResult {
  dataUrl: string;
  width: number;
  height: number;
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
  });
}

export async function applySharpening(
  imageDataUrl: string,
  amount: number = 50
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(img, 0, 0);

  // Apply contrast to simulate sharpening
  const contrast = 1 + (amount / 100) * 0.5;
  ctx.filter = `contrast(${contrast})`;
  
  // Create temporary canvas to apply filter properly
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Failed to get temp context");
  
  tempCtx.drawImage(img, 0, 0);
  
  // Draw filtered image to main canvas
  ctx.filter = `contrast(${contrast})`;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function applyDenoise(
  imageDataUrl: string,
  strength: number = 30
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Apply blur for denoise
  const blurAmount = (strength / 100) * 2;
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function adjustContrast(
  imageDataUrl: string,
  amount: number = 0
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const contrast = 1 + amount / 100;
  ctx.filter = `contrast(${contrast})`;
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function adjustExposure(
  imageDataUrl: string,
  exposure: number = 0,
  highlights: number = 0,
  shadows: number = 0
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const brightness = 1 + exposure / 100;
  ctx.filter = `brightness(${brightness})`;
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function adjustColorCorrection(
  imageDataUrl: string,
  temperature: number = 0,
  tint: number = 0,
  saturation: number = 0
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const sat = 1 + saturation / 100;
  ctx.filter = `saturate(${sat})`;
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function removeRedEye(
  imageDataUrl: string,
  sensitivity: number = 50
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.filter = "hue-rotate(-10deg) saturate(0.8)";
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function autoEnhance(imageDataUrl: string): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.filter = "contrast(1.15) brightness(1.05) saturate(1.2)";
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}
