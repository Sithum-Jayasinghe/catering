import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AgentOrchestrator } from './agents/AgentOrchestrator';
import { ChatbotService } from './chatbot/ChatbotService';
import { SemanticSearch } from './semantic/SemanticSearch';
import { VoiceReceptionist } from './voice/VoiceReceptionist';

const app = express();
const PORT = process.env.AI_SERVICE_PORT || 8001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const orchestrator = new AgentOrchestrator();
const chatbot = new ChatbotService(orchestrator);
const semanticSearch = new SemanticSearch();
const voiceReceptionist = new VoiceReceptionist(orchestrator);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-gateway', timestamp: new Date().toISOString() });
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationId, userId, agentType } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const response = await chatbot.processMessage(message, conversationId, userId, agentType);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/agents/run', async (req, res) => {
  try {
    const { agentType, prompt, context, userId } = req.body;
    const result = await orchestrator.runAgent(agentType, prompt, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/search/semantic', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    const results = await semanticSearch.search(query, limit);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/ocr/extract', async (req, res) => {
  try {
    const { file, documentType } = req.body;
    const result = await orchestrator.ocrService.extractDocumentData(file.data, documentType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/voice/session/start', async (req, res) => {
  try {
    const { callerPhone, callerName } = req.body;
    const session = await voiceReceptionist.startSession(callerPhone, callerName);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/voice/session/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { text, audio } = req.body;
    let response;
    if (audio) {
      response = await voiceReceptionist.processVoiceInput(sessionId, Buffer.from(audio, 'base64'));
    } else if (text) {
      response = await voiceReceptionist.processTextInput(sessionId, text);
    } else {
      return res.status(400).json({ error: 'Either text or audio is required' });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/voice/session/:sessionId/transfer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { department, phoneNumber, reason } = req.body;
    const response = await voiceReceptionist.transferCall(sessionId, { department, phoneNumber, reason });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.post('/api/ai/voice/session/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = voiceReceptionist.completeSession(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.get('/api/ai/voice/sessions', async (req, res) => {
  try {
    const sessions = voiceReceptionist.getActiveSessions();
    res.json({ sessions, count: sessions.length });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
