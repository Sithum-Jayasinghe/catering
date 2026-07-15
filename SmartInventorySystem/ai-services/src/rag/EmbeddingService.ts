export interface EmbeddingResponse {
  embedding: number[];
  model: string;
}

export class EmbeddingService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
  }

  async generate(text: string): Promise<EmbeddingResponse> {
    if (!this.apiKey) {
      return { embedding: this.simpleHashEmbedding(text), model: 'local' };
    }
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify({ input: text, model: this.model }),
      });
      const data = await response.json();
      return { embedding: data.data[0].embedding, model: data.model };
    } catch {
      return { embedding: this.simpleHashEmbedding(text), model: 'local-fallback' };
    }
  }

  async generateBatch(texts: string[]): Promise<EmbeddingResponse[]> {
    return Promise.all(texts.map(t => this.generate(t)));
  }

  private simpleHashEmbedding(text: string): number[] {
    const embedding = new Array(384).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const hash = this.hashString(words[i]);
      for (let j = 0; j < 32; j++) {
        embedding[(j + i) % 384] += ((hash >> j) & 1) ? 0.1 : -0.1;
      }
    }
    return embedding;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
