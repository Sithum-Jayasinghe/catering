export interface SearchResult {
  title: string;
  content: string;
  score: number;
  category: string;
  documentId: string;
}

export class SemanticSearch {
  async search(query: string, limit = 10): Promise<SearchResult[]> {
    const results: { title: string; content: string; score: number; category: string; documentId: string }[] = [];
    const documents = SemanticSearch.KNOWLEDGE_BASE;

    const queryLower = query.toLowerCase();
    const queryTerms = new Set(queryLower.split(/\s+/));

    for (const doc of documents) {
      const contentLower = doc.content.toLowerCase();
      let score = 0.0;
      for (const term of queryTerms) {
        if (contentLower.includes(term)) score += 0.2;
      }
      const contentWords = new Set(contentLower.split(/\s+/));
      let intersection = 0;
      for (const term of queryTerms) {
        if (contentWords.has(term)) intersection++;
      }
      score += (intersection / Math.max(queryTerms.size, 1)) * 0.5;

      if (score > 0.1) results.push({ title: doc.title, content: doc.content, score, category: doc.category, documentId: doc.id });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  async findSimilarItems(searchTerm: string): Promise<{ itemCode: string; name: string; relevance: number }[]> {
    const items = [
      { itemCode: 'INV-001', name: 'Frozen Chicken Breast', keywords: 'chicken breast frozen raw poultry' },
      { itemCode: 'INV-002', name: 'Fresh Milk 1L', keywords: 'milk fresh dairy liquid beverage cooking' },
      { itemCode: 'INV-003', name: 'Olive Oil Extra Virgin 5L', keywords: 'olive oil cooking oil dressing vinaigrette extra virgin' },
      { itemCode: 'INV-004', name: 'Basmati Rice 5kg', keywords: 'rice basmati grain carbohydrate pilaf biryani' },
      { itemCode: 'INV-005', name: 'Cheddar Cheese Block 1kg', keywords: 'cheese cheddar dairy block sandwich melt' },
    ];

    const queryLower = searchTerm.toLowerCase();
    const queryTerms = new Set(queryLower.split(/\s+/));

    return items
      .map(item => {
        const docs = item.keywords.toLowerCase();
        let relevance = 0;
        for (const term of queryTerms) {
          if (docs.includes(term)) relevance += 0.25;
          else if (this.isSynonym(term, item.keywords)) relevance += 0.15;
        }
        return { itemCode: item.itemCode, name: item.name, relevance: Math.min(relevance, 1.0) };
      })
      .filter(r => r.relevance > 0.1)
      .sort((a, b) => b.relevance - a.relevance);
  }

  private isSynonym(term: string, keywords: string): boolean {
    const synonyms: Record<string, string[]> = {
      poultry: ['chicken', 'duck', 'turkey'],
      milk: ['dairy', 'cream', 'butter'],
      oil: ['cooking oil', 'frying oil'],
      rice: ['grain', 'basmati', 'starch'],
      cheese: ['dairy', 'cheddar', 'mozzarella'],
    };
    const lowerTerm = term.toLowerCase();
    for (const [key, values] of Object.entries(synonyms)) {
      if (values.some(v => v.includes(lowerTerm) || lowerTerm.includes(v))) {
        return keywords.includes(key);
      }
    }
    return false;
  }

  private static KNOWLEDGE_BASE = [
    { id: 'doc-1', title: 'Goods Receiving SOP', category: 'SOP', content: 'All goods must be inspected within 30 minutes of arrival. Check temperature, packaging, and expiry dates. Record batch numbers for all perishable items. Minimum acceptable temperature for chilled items is 0°C to 4°C. Frozen items must be at -18°C or below.' },
    { id: 'doc-2', title: 'Food Safety Compliance', category: 'Quality', content: 'All food items must comply with Sri Lanka Standards Institution (SLSI) regulations.冷链 items must maintain cold chain at all times. Expiry dates must be checked during receiving. Items with less than 20% shelf life remaining should not be accepted. FIFO (First In First Out) rotation is mandatory.' },
    { id: 'doc-3', title: 'Inventory Reorder Policy', category: 'Procurement', content: 'Reorder when stock reaches reorder level. For A-grade items: maintain 2 weeks safety stock. For B-grade items: maintain 1 week safety stock. Emergency orders allowed only when supplier lead time exceeds 3 days. Purchase orders require procurement officer approval above Rs. 100,000.' },
    { id: 'doc-4', title: 'Supplier Evaluation Criteria', category: 'Procurement', content: 'Suppliers are evaluated monthly based on: on-time delivery rate (40%), quality rate (30%), price competitiveness (20%), and responsiveness (10%). Minimum acceptable on-time delivery rate is 85%. Suppliers falling below 80% for two consecutive months enter review process.' },
    { id: 'doc-5', title: 'Stock Transfer Procedure', category: 'Procedure', content: 'All inter-warehouse transfers require approval from both source and destination warehouse managers. Transfer must be completed within 48 hours for perishable items. Temperature documentation required for cold chain transfers. All items are scanned at dispatch and receipt.' },
  ];
}
