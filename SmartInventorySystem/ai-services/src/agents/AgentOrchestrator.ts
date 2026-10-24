import {
  BaseAgent, AgentResult,
  InventoryAgent, ProcurementAgent, SupplierAgent, ExpiryAgent,
  ForecastAgent, ReportingAgent, FinanceAgent, KitchenAgent,
  QualityAssuranceAgent, NotificationAgent,
} from './BaseAgents.js';

export type { AgentResult };

export interface AgentRunAllResult {
  agentName: string;
  success: boolean;
  insight: string;
  confidence: number;
  executionTimeMs: number;
  actionsCount: number;
  dataCount: number;
  error?: string;
}

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent>;

  constructor() {
    this.agents = new Map<string, BaseAgent>();
    this.registerAgents();
  }

  private registerAgents(): void {
    const all: BaseAgent[] = [
      new InventoryAgent(),
      new ProcurementAgent(),
      new SupplierAgent(),
      new ExpiryAgent(),
      new KitchenAgent(),
      new ForecastAgent(),
      new ReportingAgent(),
      new FinanceAgent(),
      new QualityAssuranceAgent(),
      new NotificationAgent(),
    ];
    for (const agent of all) {
      this.agents.set(agent.name, agent);
    }
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }

  async runAgent(
    agentType: string,
    prompt: string,
    context: Record<string, unknown> = {},
  ): Promise<AgentResult> {
    const agent = this.agents.get(agentType);
    if (!agent) {
      return {
        agentName: agentType,
        success: false,
        insight: `Agent "${agentType}" not found. Available: ${this.getAvailableAgents().join(', ')}`,
        confidence: 0,
        data: [],
        actions: [],
        executionTimeMs: 0,
      };
    }
    try {
      return await agent.execute(prompt, context);
    } catch (err) {
      return {
        agentName: agentType,
        success: false,
        insight: `Agent "${agentType}" failed: ${err instanceof Error ? err.message : String(err)}`,
        confidence: 0,
        data: [],
        actions: [],
        executionTimeMs: 0,
      };
    }
  }

  async runAllAgents(
    prompt = 'Run scheduled check',
    context: Record<string, unknown> = { userId: 'system' },
  ): Promise<AgentRunAllResult[]> {
    const results: AgentRunAllResult[] = [];

    // Run all agents concurrently for speed
    const settled = await Promise.allSettled(
      Array.from(this.agents.entries()).map(async ([name, agent]) => {
        try {
          const r = await agent.execute(prompt, context);
          return {
            agentName: name,
            success: r.success,
            insight: r.insight,
            confidence: r.confidence,
            executionTimeMs: r.executionTimeMs,
            actionsCount: r.actions.length,
            dataCount: r.data.length,
          } as AgentRunAllResult;
        } catch (err) {
          return {
            agentName: name,
            success: false,
            insight: '',
            confidence: 0,
            executionTimeMs: 0,
            actionsCount: 0,
            dataCount: 0,
            error: err instanceof Error ? err.message : String(err),
          } as AgentRunAllResult;
        }
      }),
    );

    for (const s of settled) {
      results.push(s.status === 'fulfilled' ? s.value : {
        agentName: 'unknown',
        success: false,
        insight: '',
        confidence: 0,
        executionTimeMs: 0,
        actionsCount: 0,
        dataCount: 0,
        error: s.reason instanceof Error ? s.reason.message : String(s.reason),
      });
    }

    return results;
  }
}
