#!/usr/bin/env bash
# Setup local dev scaffolding & push a feature branch safely.
# Run from the repo root: ./setup-local-dev.sh

set -euo pipefail

BRANCH="feature/local-dev-scripts"

# Ensure we're in a git repo and can reach origin
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Not inside a Git repository. cd into your cloned repo and run again."
  exit 1
fi

# Check for uncommitted changes (optional safety)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "⚠️ You have uncommitted changes. Commit or stash them first."
  exit 1
fi

echo "⏳ Fetching origin and creating branch $BRANCH..."
git fetch origin
# Create branch from current default branch (usually main)
DEFAULT_BASE="$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')"
git checkout -b "$BRANCH" "origin/$DEFAULT_BASE"

# --- Create directories
mkdir -p backend/src frontend

# --- Root package.json (runs backend + frontend)
cat > package.json <<'JSON'
{
  "name": "image-genius-root",
  "private": true,
  "scripts": {
    "dev": "concurrently -n BACKEND,FRONTEND -c \"blue,green\" \"npm:dev:backend\" \"npm:dev:frontend\"",
    "dev:backend": "npm --prefix backend run dev",
    "dev:frontend": "npm --prefix frontend run dev",
    "build": "npm --prefix backend run build && npm --prefix frontend run build"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
JSON

# --- Backend package.json
cat > backend/package.json <<'JSON'
{
  "name": "image-genius-backend",
  "type": "module",
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "openai": "^4.73.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.30",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}
JSON

# --- Backend tsconfig.json
cat > backend/tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
JSON

# --- Backend server.ts (OpenAI vision endpoint + local stub)
cat > backend/src/server.ts <<'TS'
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VisionReq = z.object({
  prompt: z.string().min(1),
  imageBase64: z.string().min(1)
});

app.post('/api/vision/analyze', async (req, res) => {
  const parsed = VisionReq.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { prompt, imageBase64 } = parsed.data;

  try {
    const base64 = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const response = await client.responses.create({
      model: 'gpt-4.1-mini', // choose any vision-capable model available to your account
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_data: base64 }
          ]
        }
      ]
      // max_output_tokens: 400,
    });

    const text = (response as any).output_text ?? JSON.stringify(response, null, 2);
    res.json({ result: text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Vision analysis failed' });
  }
});

app.post('/api/vision/local', async (_req, res) => {
  res.json({ ok: true, message: 'Local model endpoint stub' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
TS

# --- Frontend Vite proxy
cat > frontend/vite.config.ts <<'TS'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
TS

# --- Replit config: Run button -> npm run dev
cat > .replit <<'TOML'
run = ["npm", "run", "dev"]

[env]
OPENAI_API_KEY = ""
TOML

# --- Gitignore: env & node_modules
touch .gitignore
grep -q "^backend/.env$" .gitignore || echo "backend/.env" >> .gitignore
grep -q "^node_modules$" .gitignore || echo "node_modules" >> .gitignore

# --- Commit & push
git add .
git commit -m "feat(dev): local dev scripts + Express vision endpoint + Replit run config"
git push -u origin "$BRANCH"

echo
echo "✅ Pushed $BRANCH to origin."
echo "Open a PR: https://github.com/tomas4/Image-Genius/compare/$BRANCH?expand=1"
echo
echo "Next:"
echo "1) npm install"
echo "2) npm --prefix backend install"
echo "3) npm --prefix frontend install"
echo "4) echo 'OPENAI_API_KEY=sk-...' > backend/.env"
echo "5) npm run dev  # frontend:5173, backend:5000"
