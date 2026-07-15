import { AgentOrchestrator, AgentResult, AgentContext } from '../agents/AgentOrchestrator';
import { ChatbotService } from '../chatbot/ChatbotService';
import { McpClient } from '../mcp/McpClient';
import { VoiceCallSession, VoiceMessage, VoiceReceptionistConfig, VoiceAction, PhoneTransfer } from './VoiceTypes';

const DEFAULT_CONFIG: VoiceReceptionistConfig = {
  sttProvider: 'openai',
  ttsProvider: 'openai',
  defaultVoice: 'alloy',
  language: 'en-US',
  transferThreshold: 0.6,
  maxTurns: 20,
};

const VOICE_PROMPTS: Record<string, string> = {
  greeting: "Thank you for calling SriLankan Catering Inventory. How can I help you today?",
  low_stock: "I've checked our inventory and found several items that are running low on stock. Would you like me to list them?",
  expiry: "There are some items nearing their expiry date. Should I provide the details?",
  order_status: "Let me check the status of your orders for you.",
  transfer: "I'll connect you to a human agent who can assist you further. Please hold.",
  confirmation: "I've completed that request. Is there anything else I can help you with?",
  fallback: "I'm not quite sure I understood that. Could you please repeat or rephrase?",
  goodbye: "Thank you for calling. Have a great day!",
};

export class VoiceReceptionist {
  private sessions: Map<string, VoiceCallSession> = new Map();
  private mcp: McpClient;
  private orchestrator: AgentOrchestrator;
  private chatbot: ChatbotService;
  private config: VoiceReceptionistConfig;

  constructor(orchestrator: AgentOrchestrator, config: Partial<VoiceReceptionistConfig> = {}) {
    this.orchestrator = orchestrator;
    this.mcp = new McpClient();
    this.chatbot = new ChatbotService(orchestrator);
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async startSession(callerPhone?: string, callerName?: string): Promise<VoiceCallSession> {
    const sessionId = `voice-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const session: VoiceCallSession = {
      sessionId,
      callerPhone,
      callerName,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      messages: [
        {
          role: 'system',
          content: VOICE_PROMPTS.greeting,
          timestamp: new Date(),
          metadata: { synthesisVoice: this.config.defaultVoice },
        },
      ],
      context: { turnCount: 0, intent: 'greeting' },
      status: 'active',
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async processVoiceInput(sessionId: string, audioBuffer: Buffer): Promise<VoiceMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const transcript = await this.transcribeAudio(audioBuffer);
    const userMessage: VoiceMessage = {
      role: 'user',
      content: transcript.text,
      timestamp: new Date(),
      metadata: { transcriptionConfidence: transcript.confidence },
    };
    session.messages.push(userMessage);
    session.lastActivityAt = new Date();

    const response = await this.generateResponse(session, transcript.text);
    const audioUrl = await this.synthesizeSpeech(response.message);

    const assistantMessage: VoiceMessage = {
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      audioUrl,
      metadata: {
        synthesisVoice: this.config.defaultVoice,
        agentUsed: response.metadata?.agent,
        durationMs: Date.now() - session.lastActivityAt.getTime(),
      },
    };
    session.messages.push(assistantMessage);
    session.lastActivityAt = new Date();
    session.context.turnCount = (session.context.turnCount as number) + 1;

    return assistantMessage;
  }

  async processTextInput(sessionId: string, text: string): Promise<VoiceMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const userMessage: VoiceMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    session.messages.push(userMessage);
    session.lastActivityAt = new Date();

    const response = await this.generateResponse(session, text);
    const audioUrl = await this.synthesizeSpeech(response.message);

    const assistantMessage: VoiceMessage = {
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      audioUrl,
      metadata: {
        synthesisVoice: this.config.defaultVoice,
        agentUsed: response.metadata?.agent,
        durationMs: Date.now() - session.lastActivityAt.getTime(),
      },
    };
    session.messages.push(assistantMessage);
    session.lastActivityAt = new Date();
    session.context.turnCount = (session.context.turnCount as number) + 1;

    return assistantMessage;
  }

  async transferCall(sessionId: string, transfer: PhoneTransfer): Promise<VoiceMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.status = 'transferred';
    const message: VoiceMessage = {
      role: 'assistant',
      content: `${VOICE_PROMPTS.transfer} Connecting you to ${transfer.department}.`,
      timestamp: new Date(),
      metadata: { agentUsed: 'VoiceReceptionist' },
    };
    session.messages.push(message);
    return message;
  }

  completeSession(sessionId: string): VoiceCallSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    session.status = 'completed';
    session.lastActivityAt = new Date();
    session.messages.push({
      role: 'system',
      content: VOICE_PROMPTS.goodbye,
      timestamp: new Date(),
      metadata: { synthesisVoice: this.config.defaultVoice },
    });
    return session;
  }

  getSession(sessionId: string): VoiceCallSession | undefined {
    return this.sessions.get(sessionId);
  }

  getActiveSessions(): VoiceCallSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  private async transcribeAudio(audioBuffer: Buffer): Promise<{ text: string; confidence: number }> {
    try {
      if (this.config.sttProvider === 'openai') {
        const openai = (await import('openai')).default;
        const client = new openai({ apiKey: process.env.OPENAI_API_KEY });
        const response = await client.audio.transcriptions.create({
          file: audioBuffer as any,
          model: 'whisper-1',
          language: this.config.language?.split('-')[0],
        });
        return { text: response.text, confidence: 0.9 };
      }
      return { text: '', confidence: 0 };
    } catch {
      return { text: '', confidence: 0 };
    }
  }

  private async synthesizeSpeech(text: string): Promise<string> {
    try {
      if (this.config.ttsProvider === 'openai') {
        const openai = (await import('openai')).default;
        const client = new openai({ apiKey: process.env.OPENAI_API_KEY });
        const response = await client.audio.speech.create({
          model: 'tts-1',
          voice: this.config.defaultVoice || 'alloy',
          input: text,
        });
        const buffer = Buffer.from(await response.arrayBuffer());
        return `data:audio/mp3;base64,${buffer.toString('base64')}`;
      }
      return '';
    } catch {
      return '';
    }
  }

  private async generateResponse(session: VoiceCallSession, userText: string): Promise<{ message: string; actions: VoiceAction[]; metadata?: { agent?: string; confidence?: number } }> {
    const turnCount = session.context.turnCount as number;
    if (turnCount >= (this.config.maxTurns || 20)) {
      return { message: VOICE_PROMPTS.goodbye, actions: [], metadata: { agent: 'VoiceReceptionist' } };
    }

    const routerResult = this.detectVoiceIntent(userText);
    const agentResult: AgentResult = await this.orchestrator.runAgent(routerResult.agent, userText, {
      userId: session.callerPhone || session.sessionId,
      warehouseId: (session.context.warehouseId as string) || undefined,
    });

    const message = this.buildVoiceResponse(agentResult, routerResult.intent);
    const actions = this.extractActions(agentResult, routerResult.intent);

    if (agentResult.confidence < (this.config.transferThreshold || 0.6)) {
      return {
        message: `${message} ${VOICE_PROMPTS.transfer}`,
        actions: [...actions, { type: 'transfer_call', label: 'Transfer to human', payload: { department: 'inventory_manager' } }],
        metadata: { agent: routerResult.agent, confidence: agentResult.confidence },
      };
    }

    session.context.intent = routerResult.intent;
    return { message, actions, metadata: { agent: routerResult.agent, confidence: agentResult.confidence } };
  }

  private detectVoiceIntent(text: string): { agent: string; intent: string; confidence: number } {
    const lower = text.toLowerCase();
    if (/(order|purchase|procurement|vendor|supplier|buy|reorder|po)/i.test(lower)) return { agent: 'ProcurementAgent', intent: 'procurement', confidence: 0.9 };
    if (/(expir|spoilage|waste|days left|expiring|near expiry|old stock)/i.test(lower)) return { agent: 'ExpiryAgent', intent: 'expiry', confidence: 0.9 };
    if (/(stock|inventory|quantity|available|how much|on hand|levels)/i.test(lower)) return { agent: 'InventoryAgent', intent: 'inventory', confidence: 0.9 };
    if (/(forecast|demand|predict|future|projection|trend)/i.test(lower)) return { agent: 'ForecastAgent', intent: 'forecast', confidence: 0.85 };
    if (/(report|analytics|summary|chart|daily|weekly|monthly)/i.test(lower)) return { agent: 'ReportingAgent', intent: 'reporting', confidence: 0.85 };
    if (/(recipe|meal|kitchen|cook|ingredient|consumption|menu)/i.test(lower)) return { agent: 'KitchenAgent', intent: 'kitchen', confidence: 0.85 };
    if (/(damage|quality|faulty|defect|broken|return)/i.test(lower)) return { agent: 'QualityAssuranceAgent', intent: 'quality', confidence: 0.85 };
    if (/(transfer|human|agent|person|speak to|talk to)/i.test(lower)) return { agent: 'NotificationAgent', intent: 'transfer', confidence: 0.95 };
    if (/(hello|hi|hey|good morning|good afternoon)/i.test(lower)) return { agent: 'InventoryAgent', intent: 'greeting', confidence: 0.8 };
    if (/(thank|thanks|bye|goodbye|that's all)/i.test(lower)) return { agent: 'NotificationAgent', intent: 'goodbye', confidence: 0.9 };
    return { agent: 'InventoryAgent', intent: 'unknown', confidence: 0.4 };
  }

  private buildVoiceResponse(result: AgentResult, intent: string): string {
    if (!result.success) return "I'm sorry, I encountered an issue processing your request. Let me try again.";

    let response = result.insight;
    if (intent === 'greeting') response = `Hello! ${VOICE_PROMPTS.greeting}`;
    if (intent === 'goodbye') response = VOICE_PROMPTS.goodbye;
    if (intent === 'procurement' && result.actions.length > 0) response = `${VOICE_PROMPTS.low_stock} I found ${result.insight}`;
    if (intent === 'expiry' && result.actions.length > 0) response = `${VOICE_PROMPTS.expiry} ${result.insight}`;
    if (intent === 'transfer') response = VOICE_PROMPTS.transfer;

    return response;
  }

  private extractActions(result: AgentResult, intent: string): VoiceAction[] {
    const actions: VoiceAction[] = [];
    for (const action of result.actions) {
      const voiceAction: VoiceAction = {
        type: action.type,
        label: action.type.replace(/_/g, ' '),
        payload: action.payload as Record<string, unknown>,
      };
      if (intent === 'procurement') voiceAction.voicePrompt = 'Would you like me to create a purchase order?';
      if (intent === 'expiry') voiceAction.voicePrompt = 'Would you like me to send notifications about these items?';
      actions.push(voiceAction);
    }
    return actions;
  }
}
