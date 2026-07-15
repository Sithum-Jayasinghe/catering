import { McpClient, McpToolResult } from '../McpClient';

export class SqlServerTool {
  constructor(private mcp: McpClient) {}

  async executeQuery(query: string): Promise<McpToolResult> {
    return this.mcp.callTool('sql_query', { query }, 'sql-server');
  }

  async getInventorySummary(): Promise<McpToolResult> {
    const query = `SELECT CategoryName, COUNT(*), SUM(QuantityOnHand), SUM(TotalValue) FROM v_InventorySummary GROUP BY CategoryName`;
    return this.executeQuery(query);
  }

  async getLowStockItems(): Promise<McpToolResult> {
    const query = `SELECT * FROM InventoryItems WHERE Status IN ('LowStock','OutOfStock') AND IsActive = 1`;
    return this.executeQuery(query);
  }

  async getExpiringItems(daysBefore: number): Promise<McpToolResult> {
    const query = `SELECT * FROM StockBatches WHERE ExpiryDate <= DATEADD(day, @days, GETUTCDATE()) AND RemainingQuantity > 0`;
    return this.executeQuery(query);
  }
}

export class SharePointTool {
  constructor(private mcp: McpClient) {}

  async searchDocuments(query: string, library: string = 'InventoryDocuments'): Promise<McpToolResult> {
    return this.mcp.callTool('sharepoint_query', { query, library }, 'sharepoint');
  }

  async getDocumentById(documentId: string): Promise<McpToolResult> {
    return this.mcp.callTool('sharepoint_query', { documentId }, 'sharepoint');
  }
}

export class EmailTool {
  constructor(private mcp: McpClient) {}

  async sendEmail(to: string, subject: string, body: string): Promise<McpToolResult> {
    return this.mcp.callTool('email_send', { to, subject, body }, 'email');
  }

  async sendLowStockAlert(items: unknown[]): Promise<McpToolResult> {
    return this.sendEmail('procurement@airline.com', 'Low Stock Alert', JSON.stringify(items));
  }
}
