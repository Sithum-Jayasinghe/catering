export interface LangGraphState {
  messages: { role: string; content: string }[];
  context: Record<string, unknown>;
  currentStep: string;
  toolsUsed: string[];
}

export interface LangGraphNode {
  name: string;
  execute: (state: LangGraphState) => Promise<LangGraphState>;
  next?: string | ((state: LangGraphState) => string);
}

export interface LangGraphEdge {
  from: string;
  to: string | ((state: LangGraphState) => string);
  condition?: (state: LangGraphState) => boolean;
}

export class LangGraphOrchestrator {
  private nodes = new Map<string, LangGraphNode>();
  private edges: LangGraphEdge[] = [];

  registerNode(node: LangGraphNode) {
    this.nodes.set(node.name, node);
  }

  addEdge(edge: LangGraphEdge) {
    this.edges.push(edge);
  }

  async run(initialState: LangGraphState): Promise<LangGraphState> {
    let state = initialState;
    let currentNode = state.currentStep;
    const maxSteps = 20;

    for (let step = 0; step < maxSteps; step++) {
      const node = this.nodes.get(currentNode);
      if (!node) break;
      state = await node.execute(state);
      const next = typeof node.next === 'function' ? node.next(state) : node.next;
      const edge = this.edges.find(e => e.from === currentNode);
      const target = edge?.condition?.(state) ? typeof edge.to === 'function' ? edge.to(state) : edge.to : next;
      if (!target) break;
      currentNode = target;
      state.currentStep = currentNode;
    }
    return state;
  }
}
