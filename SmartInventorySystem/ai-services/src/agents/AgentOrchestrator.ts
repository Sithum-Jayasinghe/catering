import { McpClient } from '../../src/mcp/McpClient';
import { RagEngine } from '../rag/RagEngine';
import { EmbeddingService } from '../rag/EmbeddingService';
import { BaseAgent, InventoryAgent, ProcurementAgent, SupplierAgent, ExpiryAgent, ForecastAgent, ReportingAgent, FinanceAgent, KitchenAgent, QualityAssuranceAgent, NotificationAgent } from './BaseAgents';
import { OcrService } from '../ocr/OcrService';

export interface AgentResult {
  success: boolean;
  insight: string;
  confidence: number;
  actions: { type: string; payload: unknown }[];
}

export interface AgentContext {
  userId: string;
  warehouseId?: string;
  filters?: Record<string, unknown>;
}

export class AgentOrchestrator {
  private mcp: McpClient;
  private rag: RagEngine;
  private embeddings: EmbeddingService;
  private agents: Map<string, BaseAgent>;
  public ocrService: OcrService;

  constructor() {
    this.mcp = new McpClient();
    this.rag = new RagEngine();
    this.embeddings = new EmbeddingService();
    this.agents = new Map<string, BaseAgent>();
    this.ocrService = new OcrService(this.mcp);
    this.registerAgents();
  }

  private registerAgents() {
    this.agents.set('InventoryAgent', new InventoryAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('ProcurementAgent', new ProcurementAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('SupplierAgent', new SupplierAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('ExpiryAgent', new ExpiryAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('ForecastAgent', new ForecastAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('ReportingAgent', new ReportingAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('FinanceAgent', new FinanceAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('KitchenAgent', new KitchenAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('QualityAssuranceAgent', new QualityAssuranceAgent(this.mcp, this.rag, this.embeddings));
    this.agents.set('NotificationAgent', new NotificationAgent(this.mcp, this.rag, this.embeddings));
  }

  async runAgent(agentType: string, prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const agent = this.agents.get(agentType);
    if (!agent) return { success: false, insight: 'Agent not found', confidence: 0, actions: [] };
    return agent.execute(prompt, context);
  }

  async runAllAgents(): Promise<Record<string, { success: boolean; insight: string; confidence: number }>> {
    const results: Record<string, { success: boolean; insight: string; confidence: number }> = {};
    for (const [name, agent] of this.agents) {
      const result = await agent.execute('Run scheduled check', { userId: 'system' });
      results[name] = { success: result.success, insight: result.insight, confidence: result.confidence };
    }
    return results;
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}
