export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  updatedAt: Date;
}

export class KnowledgeBase {
  private documents: Map<string, KnowledgeDocument> = new Map();

  constructor() {
    this.loadDefaultDocuments();
  }

  addDocument(doc: Omit<KnowledgeDocument, 'id' | 'updatedAt'> & { id?: string; updatedAt?: Date }): KnowledgeDocument {
    const id = doc.id || `kb-${Date.now()}`;
    const document: KnowledgeDocument = { ...doc, id, updatedAt: new Date() };
    this.documents.set(id, document);
    return document;
  }

  getDocument(id: string): KnowledgeDocument | undefined {
    return this.documents.get(id);
  }

  search(query: string, category?: string, limit = 5): KnowledgeDocument[] {
    const results: { doc: KnowledgeDocument; score: number }[] = [];
    const queryLower = query.toLowerCase();
    const queryTerms = new Set(queryLower.split(/\s+/));

    for (const doc of this.documents.values()) {
      if (category && doc.category !== category) continue;
      const contentLower = doc.content.toLowerCase();
      let score = 0;
      for (const term of queryTerms) {
        if (contentLower.includes(term)) score += 0.15;
      }
      for (const tag of doc.tags) {
        if (queryLower.includes(tag.toLowerCase())) score += 0.3;
      }
      if (score > 0.1) results.push({ doc, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => r.doc);
  }

  getAllCategories(): string[] {
    return Array.from(new Set(Array.from(this.documents.values()).map(d => d.category)));
  }

  private loadDefaultDocuments() {
    const defaults: Omit<KnowledgeDocument, 'id' | 'updatedAt'>[] = [
      { title: 'Food Safety SOP', category: 'Quality', content: 'All incoming perishable goods must be checked for temperature compliance. Chilled items: 0°C to 4°C. Frozen items: -18°C or below. Items with visible damage or packaging defects must be rejected.', tags: ['food safety', 'temperature', 'inspection', 'SOP'] },
      { title: 'Inventory Policy', category: 'Policy', content: 'Minimum stock levels are set at 2 weeks of average consumption. Maximum stock levels are set at 4 weeks of average consumption. Cycle counting is performed monthly for A-grade items and quarterly for B-grade items.', tags: ['inventory', 'policy', 'stock levels', 'reorder'] },
      { title: 'Goods Receiving Procedure', category: 'Procedure', content: '1. Verify PO against delivery note. 2. Inspect goods for quality and quantity. 3. Record batch/serial numbers. 4. Check temperature logs for cold chain. 5. Create GRN within 1 hour of receipt.', tags: ['grn', 'receiving', 'procurement', 'inspection'] },
      { title: 'Waste Management Policy', category: 'Policy', content: 'Food waste is recorded at point of disposal. Wasted items above Rs. 5,000 require manager approval. Organic waste is segregated for composting. Expired items are disposed of following HACCP guidelines.', tags: ['waste', 'food safety', 'disposal', 'HACCP'] },
      { title: 'Kitchen Production Planning', category: 'Procedure', content: 'Ingredients must be picked from inventory based on production plan. Kitchens should use FIFO method. Ingredient consumption is deducted from inventory in real-time. Variance reporting is done at end of each production day.', tags: ['kitchen', 'production', 'planning', 'FIFO', 'consumption'] },
    ];
    for (const doc of defaults) this.addDocument(doc);
  }
}
