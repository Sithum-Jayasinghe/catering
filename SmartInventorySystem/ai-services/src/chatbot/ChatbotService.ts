import { AgentOrchestrator, AgentResult } from '../agents/AgentOrchestrator.js';
import { ChatMessage, ChatResponse, ChatbotConversation } from './ChatbotTypes.js';
import { getOllamaClient, OllamaChatMessage } from '../llm/OllamaClient.js';
import { buildSystemPrompt } from '../llm/SystemPrompts.js';

// ─── Intent routing table — order matters (most specific first) ────────────
const ROUTING_TABLE: Array<{
  pattern: RegExp;
  agent: string;
  confidence: number;
  description: string;
}> = [
  // Expiry / food safety (before quality so "expir" wins)
  {
    pattern: /expir|spoil|waste|days.?left|near.?expiry|going.?off|shelf.?life/i,
    agent: 'ExpiryAgent',
    confidence: 0.95,
    description: 'expiry and food-safety monitoring',
  },
  // Quality assurance
  {
    pattern: /quality|damage|defect|food.?safety|compliance|inspect|qa\b/i,
    agent: 'QualityAssuranceAgent',
    confidence: 0.92,
    description: 'quality assurance and food-safety compliance',
  },
  // Procurement / purchasing
  {
    pattern: /purchas|order|procur|vendor|buy|reorder|po\b|purchase.?order/i,
    agent: 'ProcurementAgent',
    confidence: 0.92,
    description: 'procurement and purchase-order management',
  },
  // Supplier performance
  {
    pattern: /supplier|vendor.?rating|on.?time|delivery.?rate|supplier.?perf/i,
    agent: 'SupplierAgent',
    confidence: 0.90,
    description: 'supplier performance and relationship management',
  },
  // Kitchen / recipes
  {
    pattern: /kitchen|recipe|meal|cook|ingredient|consumption|dish|menu/i,
    agent: 'KitchenAgent',
    confidence: 0.88,
    description: 'kitchen operations and ingredient consumption',
  },
  // Forecast / demand
  {
    pattern: /forecast|demand|predict|future|projection|trend|ml|ai.?predict/i,
    agent: 'ForecastAgent',
    confidence: 0.87,
    description: 'demand forecasting and trend analysis',
  },
  // Finance / cost
  {
    pattern: /cost|financ|value|valuation|spend|budget|price|money|lkr|rupee/i,
    agent: 'FinanceAgent',
    confidence: 0.90,
    description: 'inventory cost and financial analysis',
  },
  // Reports / analytics
  {
    pattern: /report|analytic|summary|chart|metric|kpi|dashboard.?data/i,
    agent: 'ReportingAgent',
    confidence: 0.88,
    description: 'business reporting and analytics',
  },
  // Notifications / alerts
  {
    pattern: /notif|alert|remind|message|unread|bell|alarm/i,
    agent: 'NotificationAgent',
    confidence: 0.90,
    description: 'notifications and system alerts',
  },
  // Inventory (broad — keep last so specifics win above)
  {
    pattern: /stock|inventory|quantity|available|how.?much|on.?hand|level|item/i,
    agent: 'InventoryAgent',
    confidence: 0.88,
    description: 'inventory stock-level monitoring',
  },
];

const SUGGESTIONS: Record<string, string[]> = {
  InventoryAgent:        ['Show all low-stock items', 'View inventory by warehouse', 'Check out-of-stock items'],
  ProcurementAgent:      ['Create purchase order draft', 'Show pending purchase orders', 'View supplier lead times'],
  SupplierAgent:         ['View supplier ratings', 'Show on-time delivery performance', 'Find top-rated suppliers'],
  ExpiryAgent:           ['Show expiring items this week', 'List expired batches', 'Generate expiry warning report'],
  KitchenAgent:          ['Show ingredient consumption', 'View high-cost recipes', 'List top-consumed items'],
  ForecastAgent:         ['Show demand trends', 'Predict next month stock needs', 'View fast-moving items'],
  ReportingAgent:        ['Generate inventory report', 'Show stock movement summary', 'Export financial report'],
  FinanceAgent:          ['View total inventory value', 'Show highest-value items', 'Analyse procurement spend'],
  QualityAssuranceAgent: ['Show damaged items', 'List untracked perishables', 'Generate QA compliance report'],
  NotificationAgent:     ['Show unread alerts', 'View all system notifications', 'Check low-stock alerts'],
};

// ─── LLM-powered intent classification prompt ──────────────────────────────
const INTENT_CLASSIFICATION_PROMPT = `You are an intent classifier for an inventory management system chatbot.
Given a user message, classify it into EXACTLY ONE of these agent types:
- InventoryAgent: stock levels, quantities, items in storage
- ProcurementAgent: purchasing, orders, buying, restocking
- SupplierAgent: supplier performance, vendor ratings, delivery rates
- ExpiryAgent: expiry dates, food waste, spoilage, shelf life
- KitchenAgent: recipes, meals, cooking, ingredients, consumption
- ForecastAgent: demand prediction, trends, future needs
- ReportingAgent: reports, analytics, summaries, KPIs
- FinanceAgent: costs, spending, budget, financial value
- QualityAssuranceAgent: quality, food safety, compliance, inspections
- NotificationAgent: alerts, notifications, reminders

Respond with ONLY valid JSON in this exact format:
{"agent": "<AgentName>", "confidence": <0.0-1.0>}`;

export class ChatbotService {
  private conversations = new Map<string, ChatbotConversation>();
  private orchestrator: AgentOrchestrator;
  private ollamaAvailable: boolean | null = null;

  constructor(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
    // Check Ollama availability in the background
    this.checkOllamaStatus();
  }

  private async checkOllamaStatus(): Promise<void> {
    try {
      const client = getOllamaClient();
      this.ollamaAvailable = await client.isAvailable();
      if (this.ollamaAvailable) {
        const modelLoaded = await client.isModelLoaded();
        console.log(`[ChatbotService] Ollama is available. Model "${client.getModel()}" loaded: ${modelLoaded}`);
      } else {
        console.warn('[ChatbotService] Ollama is NOT available. Using regex routing + template responses.');
      }
    } catch {
      this.ollamaAvailable = false;
      console.warn('[ChatbotService] Could not reach Ollama. Falling back to regex routing.');
    }
  }

  // ── Public: process a chat message ──────────────────────────────────────
  async processMessage(
    message: string,
    conversationId?: string,
    userId = 'guest',
    agentTypeOverride?: string,
  ): Promise<ChatResponse> {
    const convId = conversationId ?? `conv-${Date.now()}`;

    // Maintain conversation history
    let conv = this.conversations.get(convId);
    if (!conv) {
      conv = { conversationId: convId, userId, messages: [], startedAt: new Date(), lastMessageAt: new Date() };
      this.conversations.set(convId, conv);
    }
    conv.messages.push({ role: 'user', content: message, timestamp: new Date() });
    conv.lastMessageAt = new Date();

    // Route to agent (LLM-based if Ollama is available, otherwise regex)
    const routed = agentTypeOverride
      ? { agent: agentTypeOverride, confidence: 1.0, description: 'manual override' }
      : await this.routeWithLLM(message);

    const result: AgentResult = await this.orchestrator.runAgent(routed.agent, message, { userId });

    // Build the response — the insight is already LLM-generated by the agent
    const responseText = await this.buildResponseWithLLM(result, routed, message, conv);

    conv.messages.push({
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
      metadata: { agent: routed.agent, confidence: result.confidence },
    });

    return {
      message: responseText,
      suggestions: SUGGESTIONS[routed.agent] ?? [],
      actions: result.actions.map(a => ({
        type:  a.type,
        label: a.type.replace(/_/g, ' '),
        url:   `/${a.type.replace(/_/g, '-')}`,
      })),
      metadata: {
        agent:       routed.agent,
        confidence:  result.confidence,
        dataCount:   result.data.length,
        executionMs: result.executionTimeMs,
        llmPowered:  this.ollamaAvailable ?? false,
      },
    };
  }

  getConversation(conversationId: string): ChatbotConversation | undefined {
    return this.conversations.get(conversationId);
  }

  // ── LLM-powered intent routing ─────────────────────────────────────────
  private async routeWithLLM(message: string): Promise<{ agent: string; confidence: number; description: string }> {
    // Always try regex first (fast path)
    const regexResult = this.route(message);

    // If regex is highly confident, use it directly
    if (regexResult.confidence >= 0.92) {
      return regexResult;
    }

    // Try LLM classification if Ollama is available
    if (this.ollamaAvailable) {
      try {
        const client = getOllamaClient();
        const llmResult = await client.askJson<{ agent: string; confidence: number }>(
          `Classify this user message: "${message}"`,
          INTENT_CLASSIFICATION_PROMPT,
          { temperature: 0.1, num_predict: 64 },
        );

        if (llmResult.agent && SUGGESTIONS[llmResult.agent]) {
          const desc = ROUTING_TABLE.find(r => r.agent === llmResult.agent)?.description ?? 'LLM classified';
          return {
            agent: llmResult.agent,
            confidence: Math.max(llmResult.confidence ?? 0.85, regexResult.confidence),
            description: desc,
          };
        }
      } catch (err) {
        console.warn('[ChatbotService] LLM intent classification failed, using regex:', err instanceof Error ? err.message : err);
      }
    }

    return regexResult;
  }

  // ── Regex intent routing (fallback) ────────────────────────────────────
  route(message: string): { agent: string; confidence: number; description: string } {
    for (const rule of ROUTING_TABLE) {
      if (rule.pattern.test(message)) {
        return { agent: rule.agent, confidence: rule.confidence, description: rule.description };
      }
    }
    // Default — general inventory question
    return { agent: 'InventoryAgent', confidence: 0.5, description: 'general inventory query' };
  }

  // ── LLM-powered response builder ──────────────────────────────────────
  private async buildResponseWithLLM(
    result: AgentResult,
    routed: { agent: string; confidence: number; description: string },
    originalMessage: string,
    conv: ChatbotConversation,
  ): Promise<string> {
    // If agent failed, return error message
    if (!result.success) {
      return `⚠️ The ${routed.agent} encountered an issue: ${result.insight}\n\nPlease try again or contact support.`;
    }

    // If Ollama is available, enhance the agent's insight with conversational context
    if (this.ollamaAvailable) {
      try {
        const client = getOllamaClient();

        // Build conversation history for multi-turn context
        const recentMessages: OllamaChatMessage[] = conv.messages
          .slice(-6) // Last 3 exchanges
          .map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));

        const systemPrompt = buildSystemPrompt(routed.agent) + `

You are responding in a chat conversation. The ${routed.agent} has already analysed the database and produced this insight:

--- AGENT ANALYSIS ---
${result.insight}
--- END ANALYSIS ---

Data points retrieved: ${result.data.length}
Recommended actions: ${result.actions.map(a => a.type.replace(/_/g, ' ')).join(', ')}
Execution time: ${result.executionTimeMs}ms

Your job is to:
1. Present the agent's analysis in a friendly, conversational tone
2. Make the data easy to understand
3. Highlight the most important findings
4. Suggest concrete next steps
5. Keep the response concise (under 250 words)

Do NOT add fictional data. Only reference the analysis provided above.`;

        const messages: OllamaChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...recentMessages,
        ];

        const response = await client.chat(messages, { temperature: 0.4, num_predict: 512 });
        if (response.message.content.trim()) {
          return response.message.content.trim();
        }
      } catch (err) {
        console.warn('[ChatbotService] LLM response building failed, using template:', err instanceof Error ? err.message : err);
      }
    }

    // Fallback to template-based response
    return this.buildTemplateResponse(result, routed);
  }

  // ── Template response builder (fallback) ──────────────────────────────
  private buildTemplateResponse(
    result: AgentResult,
    routed: { agent: string; confidence: number; description: string },
  ): string {
    if (!result.success) {
      return `⚠️ The ${routed.agent} encountered an issue: ${result.insight}\n\nPlease try again or contact support.`;
    }

    const lines: string[] = [];

    // Header
    lines.push(`**${routed.agent}** (${routed.description})`);
    lines.push('');

    // Core insight
    lines.push(result.insight);

    // Data count context
    if (result.data.length > 0) {
      lines.push(`\n📊 ${result.data.length} records retrieved from the database.`);
    }

    // Actions summary
    if (result.actions.length > 0) {
      lines.push(`\n🔧 ${result.actions.length} recommended action${result.actions.length > 1 ? 's' : ''}:`);
      for (const action of result.actions) {
        const payloadStr = JSON.stringify(action.payload);
        const preview = payloadStr.length > 80 ? payloadStr.slice(0, 80) + '…' : payloadStr;
        lines.push(`  • ${action.type.replace(/_/g, ' ')}: ${preview}`);
      }
    }

    // Timing
    lines.push(`\n⏱️ Completed in ${result.executionTimeMs}ms`);

    return lines.join('\n');
  }
}
