import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Google GenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are NOTO's Monastic AI Flow Coach, inspired by Japanese spatial discipline (Ma) and warm editorial productivity.
Your purpose:
1. Help the user prioritize ruthlessly and protect deep state momentum.
2. Break down overwhelming tasks into bite-sized 15, 25, or 45-minute focus sprints.
3. Suggest optimal rest intervals, silent periods, and elimination of cognitive clutter.
4. If asked about current research, trends, productivity science, or factual news, provide concise and accurate insights grounded in Google Search data.

Tone: Calm, concise, thoughtful, unhurried. Do not use corporate clichés, hyperactive exclamation marks, or synthetic gamification. Keep responses clear and formatted with clean bullet points or short paragraphs.`;

// 1. AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash', useSearch = false, context = '' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    let selectedModel = 'gemini-3.5-flash';
    if (model === 'gemini-3.1-pro-preview') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (model === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else {
      selectedModel = 'gemini-3.5-flash';
    }

    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let fullSystemInstruction = SYSTEM_INSTRUCTION;
    if (context) {
      fullSystemInstruction += `\n\nCurrent user context (tasks & schedule):\n${context}`;
    }

    const config: Record<string, unknown> = {
      systemInstruction: fullSystemInstruction,
      temperature: 0.7,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config,
    });

    const text = response.text || '';
    const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((chunk: { web?: { uri?: string; title?: string } }) => chunk.web)
      .filter((web: any): web is { uri: string; title: string } => Boolean(web?.uri));

    return res.json({
      text,
      modelUsed: selectedModel,
      sources: webSources,
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai/chat:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
});

// 2. Fast Task Breakdown & AI Planning Endpoint
app.post('/api/ai/breakdown-task', async (req, res) => {
  try {
    const { taskTitle, durationMin = 45 } = req.body;
    if (!taskTitle) {
      return res.status(400).json({ error: 'Task title is required.' });
    }
    const prompt = `Deconstruct the following task into 2 to 4 disciplined, focused sub-steps fitting a ${durationMin}-minute deep work block:
Task: "${taskTitle}"
Provide your answer in clean bullet points with suggested minutes for each micro-step (e.g., "• Step 1 (10m): ..."). Keep it minimalist and actionable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return res.json({
      breakdown: response.text || '',
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai/breakdown-task:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
});

// 3. WebSocket Server for Gemini Live API
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/live' || pathname === '/api/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Gemini Live voice bridge');
  let liveSession: any = null;
  try {
    liveSession = await (ai as any).live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction:
          "You are NOTO, a calm, monastic focus companion. Speak with quiet warmth, brevity, and practical focus advice in the user's language.",
      },
      callbacks: {
        onmessage: (message: any) => {
          try {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio: audioData }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          } catch (err) {
            console.error('Error forwarding live message to client:', err);
          }
        },
        onclose: () => {
          console.log('Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ closed: true }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ connected: true }));

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        }
        if (parsed.text && liveSession) {
          liveSession.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (err) {
        console.error('Error processing client audio message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from Live bridge');
      if (liveSession && typeof liveSession.close === 'function') {
        liveSession.close();
      }
    });
  } catch (err: unknown) {
    console.error('Failed to initialize Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      const errMsg = err instanceof Error ? err.message : 'Failed to connect to Live session';
      clientWs.send(JSON.stringify({ error: errMsg }));
      clientWs.close();
    }
  }
});

// Mount Vite in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
