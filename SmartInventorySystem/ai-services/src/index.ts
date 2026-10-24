import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { AgentOrchestrator } from './agents/AgentOrchestrator.js';
import { ChatbotService } from './chatbot/ChatbotService.js';
import { SemanticSearch } from './semantic/SemanticSearch.js';
import { getOllamaClient } from './llm/OllamaClient.js';

const app = express();
const PORT = process.env.AI_SERVICE_PORT || 8001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const orchestrator = new AgentOrchestrator();
const chatbot      = new ChatbotService(orchestrator);
const semantic     = new SemanticSearch();

// ── Health ────────────────────────────────────────────────────────────────
app.get('/health', async (_req: Request, res: Response) => {
  const ollama = getOllamaClient();
  const ollamaStatus = await ollama.isAvailable();
  let modelLoaded = false;
  if (ollamaStatus) {
    modelLoaded = await ollama.isModelLoaded();
  }

  res.json({
    status: 'ok',
    service: 'ai-gateway',
    agents: orchestrator.getAvailableAgents(),
    llm: {
      provider: 'ollama',
      model: ollama.getModel(),
      available: ollamaStatus,
      modelLoaded,
    },
    timestamp: new Date().toISOString(),
  });
});

// ── LLM Status ────────────────────────────────────────────────────────────
app.get('/api/ai/llm/status', async (_req: Request, res: Response) => {
  try {
    const ollama = getOllamaClient();
    const available = await ollama.isAvailable();
    const models = available ? await ollama.listModels() : [];
    const modelLoaded = models.some(m => m.name.startsWith(ollama.getModel()));

    res.json({
      provider: 'ollama',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: ollama.getModel(),
      available,
      modelLoaded,
      availableModels: models.map(m => ({
        name: m.name,
        size: `${(m.size / 1e9).toFixed(1)} GB`,
        modified: m.modified_at,
      })),
    });
  } catch (err) {
    res.status(500).json({
      provider: 'ollama',
      available: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

// ── Chat ──────────────────────────────────────────────────────────────────
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationId, userId, agentType } = req.body as {
      message?: string; conversationId?: string; userId?: string; agentType?: string;
    };
    if (!message) return res.status(400).json({ error: 'message is required' }) as unknown as void;
    const response = await chatbot.processMessage(message, conversationId, userId, agentType);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
});

// ── Run a single agent ────────────────────────────────────────────────────
app.post('/api/ai/agents/run', async (req: Request, res: Response) => {
  try {
    const { agentType, prompt = 'Run analysis', context = {} } = req.body as {
      agentType?: string; prompt?: string; context?: Record<string, unknown>;
    };
    if (!agentType) return res.status(400).json({ error: 'agentType is required' }) as unknown as void;
    const result = await orchestrator.runAgent(agentType, prompt, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
});

// ── Run ALL agents concurrently ───────────────────────────────────────────
app.post('/api/ai/agents/run-all', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body as {
      prompt?: string; context?: Record<string, unknown>;
    };
    const results = await orchestrator.runAllAgents(prompt, context);
    const summary = {
      total:   results.length,
      passed:  results.filter(r => r.success).length,
      failed:  results.filter(r => !r.success).length,
      results,
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
});

// ── List available agents ─────────────────────────────────────────────────
app.get('/api/ai/agents', (_req: Request, res: Response) => {
  res.json({ agents: orchestrator.getAvailableAgents() });
});

// ── Semantic search ───────────────────────────────────────────────────────
app.post('/api/ai/search/semantic', async (req: Request, res: Response) => {
  try {
    const { query, limit = 10 } = req.body as { query?: string; limit?: number };
    if (!query) return res.status(400).json({ error: 'query is required' }) as unknown as void;
    const results = await semantic.search(query, limit);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
});

// ── Direct LLM chat (bypass agents) ──────────────────────────────────────
app.post('/api/ai/llm/chat', async (req: Request, res: Response) => {
  try {
    const { message, systemPrompt } = req.body as {
      message?: string; systemPrompt?: string;
    };
    if (!message) return res.status(400).json({ error: 'message is required' }) as unknown as void;

    const ollama = getOllamaClient();
    const available = await ollama.isAvailable();
    if (!available) {
      return res.status(503).json({
        error: 'Ollama is not available. Ensure Ollama is running locally.',
        hint: 'Run: ollama serve && ollama pull llama3.2',
      }) as unknown as void;
    }

    const defaultSystem = `You are a helpful AI assistant for SriLankan Catering's Smart Inventory Management System. You help with inventory queries, food safety, procurement, and kitchen operations. Be concise and actionable. All monetary values are in LKR.`;
    const response = await ollama.ask(message, systemPrompt || defaultSystem);
    res.json({ message: response, model: ollama.getModel(), provider: 'ollama-local' });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 AI Service running on port ${PORT}`);
  console.log(`📋 Agents available: ${orchestrator.getAvailableAgents().join(', ')}`);

  // Check Ollama status at startup
  const ollama = getOllamaClient();
  const available = await ollama.isAvailable();
  if (available) {
    const modelLoaded = await ollama.isModelLoaded();
    console.log(`🤖 Ollama: connected (model: ${ollama.getModel()}, loaded: ${modelLoaded})`);
    if (!modelLoaded) {
      console.log(`⚠️  Model "${ollama.getModel()}" not found. Run: ollama pull ${ollama.getModel()}`);
    }
  } else {
    console.log('⚠️  Ollama: not available — using template fallback responses');
    console.log('   To enable LLM: install Ollama from https://ollama.com, then run:');
    console.log(`   ollama serve`);
    console.log(`   ollama pull ${ollama.getModel()}`);
  }
  console.log('');
});
