export interface RAGIngestResult {
  totalChunks: number;
  indexed: boolean;
  documentId: string;
  errors: string[];
}

export class RagEngine {
  private documents = new Map<string, { text: string; embeddings: number[] }[]>();
  private documentMetadata = new Map<string, { title: string; category: string; indexedAt: Date }>();

  async ingestDocument(documentId: string, text: string, metadata: { title: string; category: string }): Promise<RAGIngestResult> {
    const chunks = this.chunkText(text, 1000, 200);
    const errors: string[] = [];

    this.documents.set(documentId, chunks.map(chunk => ({ text: chunk, embeddings: [] })));
    this.documentMetadata.set(documentId, { title: metadata.title, category: metadata.category, indexedAt: new Date() });

    return { totalChunks: chunks.length, indexed: true, documentId, errors };
  }

  async search(query: string, topK = 5): Promise<{ documentId: string; text: string; score: number }[]> {
    const results: { documentId: string; text: string; score: number }[] = [];
    for (const [documentId, chunks] of this.documents.entries()) {
      for (const chunk of chunks) {
        const score = this.calculateSimilarity(query.toLowerCase(), chunk.text.toLowerCase());
        if (score > 0.1) results.push({ documentId, text: chunk.text, score });
      }
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  async retrieveContext(query: string, category?: string): Promise<string> {
    const results = await this.search(query, 3);
    if (category) {
      const filtered = results.filter(r => {
        const meta = this.documentMetadata.get(r.documentId);
        return meta?.category === category;
      });
      return filtered.map(r => r.text).join('\n\n') || 'No relevant context found.';
    }
    return results.map(r => r.text).join('\n\n') || 'No relevant context found.';
  }

  private chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start = end - overlap;
    }
    return chunks;
  }

  private calculateSimilarity(a: string, b: string): number {
    const wordsA = new Set(a.split(/\s+/));
    const wordsB = new Set(b.split(/\s+/));
    let intersection = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) intersection++;
    }
    return intersection / Math.min(wordsA.size || 1, wordsB.size || 1);
  }
}
