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
