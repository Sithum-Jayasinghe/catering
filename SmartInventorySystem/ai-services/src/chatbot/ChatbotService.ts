import { AgentOrchestrator, AgentResult } from '../agents/AgentOrchestrator';
import { ChatMessage, ChatResponse, ChatbotConversation } from './ChatbotTypes';
import { SemanticSearch } from '../semantic/SemanticSearch';

export class ChatbotService {
  private conversations: Map<string, ChatbotConversation> = new Map();
  private orchestrator: AgentOrchestrator;
  private semanticSearch: SemanticSearch;

  constructor(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
    this.semanticSearch = new SemanticSearch();
  }

  async processMessage(message: string, conversationId?: string, userId: string = 'guest', agentType?: string): Promise<ChatResponse> {
    const convId = conversationId || `conv-${Date.now()}`;
    let conversation = this.conversations.get(convId);
    if (!conversation) {
      conversation = { conversationId: convId, userId, messages: [], startedAt: new Date(), lastMessageAt: new Date() };
      this.conversations.set(convId, conversation);
    }
    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() });
    conversation.lastMessageAt = new Date();

    const routerResult = this.assistantRouter(message);
    const agentResult: AgentResult = await this.orchestrator.runAgent(routerResult.agent, message, { userId });
    const responseText = this.buildResponseMessage(agentResult, message);
    conversation.messages.push({ role: 'assistant', content: responseText, timestamp: new Date(), metadata: { agent: routerResult.agent, confidence: agentResult.confidence } });

    return {
      message: responseText,
      suggestions: this.generateSuggestions(message),
      actions: agentResult.actions.map(a => ({ type: a.type, label: a.type.replace(/_/g, ' '), url: `/${a.type}` })),
      metadata: { agent: routerResult.agent, confidence: agentResult.confidence },
    };
  }

  getConversation(conversationId: string): ChatbotConversation | undefined {
    return this.conversations.get(conversationId);
  }

  assistantRouter(message: string): { agent: string; confidence: number } {
    const lower = message.toLowerCase();
    if (/(purchase|order|procurement|vendor|supplier|buy|reorder)/i.test(lower)) return { agent: 'ProcurementAgent', confidence: 0.9 };
    if (/(expir|spoilage|waste|days left|expiring|near expiry)/i.test(lower)) return { agent: 'ExpiryAgent', confidence: 0.9 };
    if (/(stock|inventory|quantity|available|how much|on hand)/i.test(lower)) return { agent: 'InventoryAgent', confidence: 0.9 };
    if (/(forecast|demand|predict|future|projection)/i.test(lower)) return { agent: 'ForecastAgent', confidence: 0.85 };
    if (/(report|analytics|summary|chart)/i.test(lower)) return { agent: 'ReportingAgent', confidence: 0.85 };
    if (/(recipe|meal|kitchen|cook|ingredient|consumption)/i.test(lower)) return { agent: 'KitchenAgent', confidence: 0.85 };
    return { agent: 'InventoryAgent', confidence: 0.5 };
  }

  private buildResponseMessage(result: AgentResult, originalMessage: string): string {
    const prefix = result.success ? 'Based on my analysis: ' : 'I encountered an issue: ';
    let response = `${prefix}${result.insight}`;
    if (result.actions?.length > 0) {
      response += `\n\nRecommended actions (${result.actions.length}):\n`;
      result.actions.forEach(action => {
        response += `• ${action.type.replace(/_/g, ' ')}: ${JSON.stringify(action.payload).slice(0, 100)}...\n`;
      });
    }
    return response;
  }

  private generateSuggestions(message: string): string[] {
    const lower = message.toLowerCase();
    if (lower.includes('expir')) return ['Show all expiring items', 'Generate expiry warning report', 'List expired items'];
    if (lower.includes('order') || lower.includes('purchase')) return ['Create purchase request', 'Show pending purchase orders', 'View supplier performance'];
    if (lower.includes('stock') || lower.includes('inventory')) return ['Show all low stock items', 'View inventory summary', 'Check warehouse capacity'];
    return ['Show dashboard', 'View recent stock movements', 'Generate inventory report'];
  }
}
