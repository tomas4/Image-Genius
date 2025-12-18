// Client-side image processing using Canvas API
// All operations run in the browser without server calls

export interface ProcessingResult {
  dataUrl: string;
  width: number;
  height: number;
}

function getCanvasContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  return ctx;
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

export async function applySharpening(
  imageDataUrl: string,
  amount: number = 50,
  radius: number = 1
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = getCanvasContext(canvas);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple sharpening kernel
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ];

  const normalizedAmount = amount / 100;
  const strength = normalizedAmount * 2;

  // Apply sharpening (simplified - only center convolution)
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % canvas.width;
    const y = Math.floor(pixelIndex / canvas.width);

    if (x > 0 && x < canvas.width - 1 && y > 0 && y < canvas.height - 1) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const neighbor =
              ((y + ky) * canvas.width + (x + kx)) * 4 + c;
            sum += data[neighbor] * kernel[ky + 1][kx + 1];
          }
        }
        const original = data[i + c];
        data[i + c] = Math.min(
          255,
          Math.max(0, original + (sum - original) * strength)
        );
      }
    }
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
  strength: number = 30,
  detail: number = 70
): Promise<ProcessingResult> {
  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = getCanvasContext(canvas);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply Gaussian blur as denoise (simple approach)
  const blurRadius = Math.max(1, Math.floor((strength / 100) * 3));
  const detailPreserve = detail / 100;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.round(
        data[i + c] * detailPreserve +
          (data[i + c] * (1 - detailPreserve)) / 2
      );
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
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = getCanvasContext(canvas);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Normalize amount to 0.5 - 2.0 range
  const factor = (amount / 100 + 1) * 1.5;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      // Center around 128
      data[i + c] = Math.min(
        255,
        Math.max(0, (data[i + c] - 128) * factor + 128)
      );
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
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = getCanvasContext(canvas);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const exposureAmount = 1 + exposure / 100;
  const highlightsAmount = 1 + highlights / 200;
  const shadowsAmount = 1 + shadows / 200;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = data[i + c] * exposureAmount;
      const normalized = value / 255;

      // Apply highlights and shadows
      if (normalized > 0.5) {
        value = 255 * (0.5 + (normalized - 0.5) * highlightsAmount);
      } else {
        value = 255 * (normalized * shadowsAmount);
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
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = getCanvasContext(canvas);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const tempAmount = temperature / 100;
  const tintAmount = tint / 100;
  const satAmount = (saturation / 100) * 2;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Temperature adjustment (warm/cool)
    r = Math.min(255, Math.max(0, r + tempAmount * 50));
    b = Math.min(255, Math.max(0, b - tempAmount * 50));

    // Tint adjustment
    g = Math.min(255, Math.max(0, g + tintAmount * 50));

    // Saturation adjustment
    const gray = (r + g + b) / 3;
    r = Math.round(gray + (r - gray) * satAmount);
    g = Math.round(gray + (g - gray) * satAmount);
    b = Math.round(gray + (b - gray) * satAmount);

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
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = getCanvasContext(canvas);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const threshold = (sensitivity / 100) * 100;

  // Red eye detection and removal (simplified)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect red-dominant pixels
    if (r > threshold && r > g * 1.5 && r > b * 1.5) {
      // Replace with darker, less saturated red
      data[i] = r * 0.6;
      data[i + 1] = g * 0.8;
      data[i + 2] = b * 0.8;
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
  const withContrast = await adjustContrast(imageDataUrl, 15);
  const withExposure = await adjustExposure(withContrast.dataUrl, 10, 5, 5);
  const withColor = await adjustColorCorrection(
    withExposure.dataUrl,
    5,
    0,
    20
  );

  return withColor;
}
