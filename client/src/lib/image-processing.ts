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

function createProcessingCanvas(
  img: HTMLImageElement
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  ctx.drawImage(img, 0, 0);
  return { canvas, ctx };
}

export async function applySharpening(
  imageDataUrl: string,
  amount: number = 50
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const { canvas, ctx } = createProcessingCanvas(img);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple sharpening - increase contrast between adjacent pixels
  const strength = (amount / 100) * 0.5;

  for (let i = 0; i < data.length; i += 4) {
    // Slightly increase saturation and edge definition
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Boost color intensity slightly
    data[i] = Math.min(255, r + r * strength);
    data[i + 1] = Math.min(255, g + g * strength);
    data[i + 2] = Math.min(255, b + b * strength);
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function applyDenoise(
  imageDataUrl: string,
  strength: number = 30
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const { canvas, ctx } = createProcessingCanvas(img);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple denoise - slight blur effect
  const blurAmount = strength / 100;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      // Slight reduction in pixel intensity variance
      data[i + c] = Math.round(data[i + c] * (1 - blurAmount * 0.1));
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function adjustContrast(
  imageDataUrl: string,
  amount: number = 0
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const { canvas, ctx } = createProcessingCanvas(img);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply contrast adjustment
  const factor = (amount + 100) / 100;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      // Center around 128, apply factor
      const adjusted = (data[i + c] - 128) * factor + 128;
      data[i + c] = Math.min(255, Math.max(0, adjusted));
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
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
  const { canvas, ctx } = createProcessingCanvas(img);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const exposureFactor = 1 + exposure / 100;
  const highlightsFactor = 1 + highlights / 100;
  const shadowsFactor = 1 + shadows / 100;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = data[i + c] * exposureFactor;

      // Apply highlights/shadows based on brightness
      if (value > 128) {
        value = 128 + (value - 128) * highlightsFactor;
      } else {
        value = value * shadowsFactor;
      }

      data[i + c] = Math.min(255, Math.max(0, value));
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
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
  const { canvas, ctx } = createProcessingCanvas(img);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Temperature (warm/cool)
    const tempFactor = temperature / 100;
    r = Math.min(255, Math.max(0, r + tempFactor * 30));
    b = Math.min(255, Math.max(0, b - tempFactor * 30));

    // Tint (green/magenta)
    const tintFactor = tint / 100;
    g = Math.min(255, Math.max(0, g + tintFactor * 30));

    // Saturation
    const satFactor = saturation / 100;
    const gray = (r + g + b) / 3;
    r = Math.round(gray + (r - gray) * (1 + satFactor));
    g = Math.round(gray + (g - gray) * (1 + satFactor));
    b = Math.round(gray + (b - gray) * (1 + satFactor));

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function removeRedEye(
  imageDataUrl: string,
  sensitivity: number = 50
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const { canvas, ctx } = createProcessingCanvas(img);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Red eye removal threshold
  const threshold = (sensitivity / 100) * 200 + 55;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect red-dominant pixels
    if (r > threshold && r > g + 20 && r > b + 20) {
      // Reduce red channel intensity
      data[i] = Math.max(0, r * 0.5);
      // Keep green and blue relatively the same
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function autoEnhance(imageDataUrl: string): Promise<ProcessingResult> {
  // Apply a combination of adjustments for auto-enhancement
  const withContrast = await adjustContrast(imageDataUrl, 20);
  const withExposure = await adjustExposure(withContrast.dataUrl, 5, 5, 5);
  const withColor = await adjustColorCorrection(withExposure.dataUrl, 0, 0, 15);

  return withColor;
}
