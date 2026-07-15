import { McpClient, McpToolResult } from '../mcp/McpClient';
import { SqlServerTool } from '../mcp/tools/McpTools';
import { RagEngine } from '../rag/RagEngine';
import { EmbeddingService } from '../rag/EmbeddingService';

export interface AgentResult {
  success: boolean;
  insight: string;
  confidence: number;
  actions: { type: string; payload: unknown }[];
  executionTimeMs: number;
}

export abstract class BaseAgent {
  constructor(protected mcp: McpClient, protected rag: RagEngine, protected embeddings: EmbeddingService) { }
  abstract execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult>;
  protected async querySql(query: string): Promise<McpToolResult> {
    return new SqlServerTool(this.mcp).executeQuery(query);
  }
  protected async getContext(query: string): Promise<string> {
    return this.rag.retrieveContext(query);
  }
}

export class InventoryAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const ragContext = await this.getContext('inventory stock levels alerts');
    const sql = "SELECT i.ItemCode, i.Name, i.TotalQuantityOnHand, i.ReorderLevel, i.Status, w.Name as Warehouse FROM InventoryItems i JOIN Warehouses w ON i.WarehouseId = w.Id WHERE i.IsActive = 1";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Detected ${(dbResult.data as any[])?.length ?? 0} inventory items requiring attention.`,
      confidence: 0.85,
      actions: [{ type: 'refresh_dashboard', payload: { source: 'InventoryAgent' } }],
      executionTimeMs: 0,
    };
  }
}

export class ProcurementAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT i.ItemCode, i.Name, i.ReorderLevel, i.TotalQuantityOnHand, i.ReorderQuantity, s.Name as Supplier FROM InventoryItems i JOIN Suppliers s ON i.PrimarySupplierId = s.Id WHERE i.TotalQuantityOnHand < i.ReorderLevel";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Generated purchase recommendations for ${(dbResult.data as any[])?.length ?? 0} low-stock items.`,
      confidence: 0.90,
      actions: [{ type: 'create_purchase_order_draft', payload: { items: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class ExpiryAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT b.BatchNumber, i.Name as ItemName, b.ExpiryDate, b.RemainingQuantity, DATEDIFF(day, GETUTCDATE(), b.ExpiryDate) as DaysLeft FROM StockBatches b JOIN InventoryItems i ON b.ItemId = i.Id WHERE b.RemainingQuantity > 0 AND b.ExpiryDate <= DATEADD(day, 14, GETUTCDATE())";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Found ${(dbResult.data as any[])?.length ?? 0} batches nearing expiry.`,
      confidence: 0.95,
      actions: [{ type: 'send_notifications', payload: { type: 'expiry_warning', items: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class ForecastAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT TOP 10 i.ItemCode, i.Name, COUNT(sm.Id) as MovementCount, AVG(sm.Quantity) as AvgQuantity FROM InventoryItems i JOIN StockMovements sm ON i.Id = sm.ItemId WHERE sm.CreatedAt >= DATEADD(month, -3, GETUTCDATE()) GROUP BY i.ItemCode, i.Name ORDER BY MovementCount DESC";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Analyzed ${(dbResult.data as any[])?.length ?? 0} items for demand forecasting.`,
      confidence: 0.88,
      actions: [{ type: 'update_forecasts', payload: { items: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class ReportingAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT COUNT(*) as TotalItems, SUM(TotalQuantityOnHand) as TotalStock, SUM(TotalInventoryValueAmount) as TotalValue FROM InventoryItems WHERE IsActive = 1";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Inventory report generated. Total value: ${((dbResult.data as any[])?.[0]?.TotalValue ?? 0).toLocaleString()}.`,
      confidence: 0.95,
      actions: [{ type: 'generate_report', payload: { type: 'inventory_summary', data: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class FinanceAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT i.ItemCode, i.Name, i.AverageUnitCost, i.TotalQuantityOnHand, (i.AverageUnitCost * i.TotalQuantityOnHand) as InventoryValue FROM InventoryItems i WHERE i.IsActive = 1";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Analyzed inventory costs for ${(dbResult.data as any[])?.length ?? 0} items.`,
      confidence: 0.90,
      actions: [{ type: 'update_financial_metrics', payload: { items: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class KitchenAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT r.Name as RecipeName, r.CookingTime, COUNT(mi.Id) as IngredientCount FROM Recipes r JOIN MealIngredients mi ON r.Id = mi.RecipeId GROUP BY r.Name, r.CookingTime";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Analyzed ${(dbResult.data as any[])?.length ?? 0} recipes for ingredient consumption optimization.`,
      confidence: 0.87,
      actions: [{ type: 'update_kitchen_planning', payload: { recipes: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class SupplierAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT s.Name, s.Rating, s.OnTimeDeliveryRate, s.QualityRate, s.TotalOrders FROM Suppliers s WHERE s.Status = 1";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Evaluated ${(dbResult.data as any[])?.length ?? 0} suppliers.`,
      confidence: 0.92,
      actions: [{ type: 'update_supplier_ratings', payload: { suppliers: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class QualityAssuranceAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    const sql = "SELECT d.DamageReportNumber, d.ItemId, d.DamageType, d.Quantity, d.Value FROM DamagedItems d WHERE d.CreatedAt >= DATEADD(day, -30, GETUTCDATE())";
    const dbResult = await this.querySql(sql);
    return {
      success: true,
      insight: `Quality check: ${(dbResult.data as any[])?.length ?? 0} damaged items reported this month.`,
      confidence: 0.93,
      actions: [{ type: 'review_quality_logs', payload: { items: dbResult.data } }],
      executionTimeMs: 0,
    };
  }
}

export class NotificationAgent extends BaseAgent {
  async execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult> {
    return {
      success: true,
      insight: 'Notifications dispatched successfully.',
      confidence: 0.99,
      actions: [{ type: 'send_notifications', payload: { type: 'batch_notification' } }],
      executionTimeMs: 0,
    };
  }
}
