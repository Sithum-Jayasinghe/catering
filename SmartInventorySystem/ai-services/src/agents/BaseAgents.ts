import { query } from '../db/SqlDb.js';
import { getOllamaClient, OllamaClient } from '../llm/OllamaClient.js';
import { buildSystemPrompt, formatDataContext } from '../llm/SystemPrompts.js';

export interface AgentResult {
  agentName: string;
  success: boolean;
  insight: string;
  confidence: number;
  data: Record<string, unknown>[];
  actions: { type: string; payload: unknown }[];
  executionTimeMs: number;
}

export abstract class BaseAgent {
  abstract readonly name: string;

  protected llm: OllamaClient;

  constructor() {
    this.llm = getOllamaClient();
  }

  abstract execute(prompt: string, context: Record<string, unknown>): Promise<AgentResult>;

  protected async sql<T = Record<string, unknown>>(queryStr: string): Promise<T[]> {
    return query<T>(queryStr);
  }

  protected elapsed(start: number): number {
    return Date.now() - start;
  }

  /**
   * Ask the local Ollama/Llama 3.2 model to generate an insight
   * based on the agent's domain knowledge + retrieved database data.
   * Falls back to a template string if Ollama is unreachable.
   */
  protected async generateInsight(
    userPrompt: string,
    data: Record<string, unknown>[],
    fallbackInsight: string,
    additionalContext?: string,
  ): Promise<string> {
    try {
      const systemPrompt = buildSystemPrompt(this.name);
      const dataContext = formatDataContext(this.name, data, additionalContext);

      const fullPrompt = `User question: "${userPrompt}"

${dataContext}

Based on the data above, provide a concise, actionable analysis. Be specific with numbers.`;

      const response = await this.llm.ask(fullPrompt, systemPrompt, {
        temperature: 0.3,
        num_predict: 512,
      });

      return response || fallbackInsight;
    } catch (err) {
      console.warn(`[${this.name}] Ollama unavailable, using template fallback:`, err instanceof Error ? err.message : err);
      return fallbackInsight;
    }
  }
}

// ─────────────────────────────────────────────
// 1. INVENTORY AGENT — stock level monitoring
// ─────────────────────────────────────────────
export class InventoryAgent extends BaseAgent {
  readonly name = 'InventoryAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();
    const items = await this.sql<{
      ItemCode: string; Name: string; TotalQuantityOnHand: number;
      ReorderLevel: number; Status: string;
    }>(`
      SELECT TOP 50
        i.ItemCode, i.Name,
        CAST(i.TotalQuantityOnHand AS FLOAT) AS TotalQuantityOnHand,
        CAST(i.ReorderLevel AS FLOAT)        AS ReorderLevel,
        CAST(i.Status AS NVARCHAR(50))       AS Status
      FROM InventoryItems i
      WHERE i.IsActive = 1 AND i.IsDeleted = 0
      ORDER BY i.TotalQuantityOnHand ASC
    `);

    const lowStock   = items.filter(i => i.TotalQuantityOnHand <= i.ReorderLevel);
    const outOfStock = items.filter(i => i.TotalQuantityOnHand === 0);

    const fallback = `Monitoring ${items.length} active items. ${lowStock.length} items at or below reorder level, ${outOfStock.length} completely out of stock.`;
    const insight = await this.generateInsight(
      prompt,
      items as unknown as Record<string, unknown>[],
      fallback,
      `Low stock count: ${lowStock.length}, Out of stock: ${outOfStock.length}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.95,
      data: items as unknown as Record<string, unknown>[],
      actions: [
        { type: 'refresh_dashboard',      payload: { totalItems: items.length } },
        { type: 'flag_low_stock',         payload: { count: lowStock.length, items: lowStock.map(i => i.ItemCode) } },
        { type: 'flag_out_of_stock',      payload: { count: outOfStock.length } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 2. PROCUREMENT AGENT — PO recommendations
// ─────────────────────────────────────────────
export class ProcurementAgent extends BaseAgent {
  readonly name = 'ProcurementAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const reorderItems = await this.sql<{
      ItemCode: string; Name: string; TotalQuantityOnHand: number;
      ReorderLevel: number; ReorderQuantity: number; SupplierName: string;
    }>(`
      SELECT
        i.ItemCode, i.Name,
        CAST(i.TotalQuantityOnHand AS FLOAT) AS TotalQuantityOnHand,
        CAST(i.ReorderLevel       AS FLOAT)  AS ReorderLevel,
        CAST(i.ReorderQuantity    AS FLOAT)  AS ReorderQuantity,
        s.Name                               AS SupplierName
      FROM InventoryItems i
      LEFT JOIN Suppliers  s ON s.Id = i.PrimarySupplierId
      WHERE i.IsActive = 1
        AND i.IsDeleted = 0
        AND i.TotalQuantityOnHand <= i.ReorderLevel
    `);

    const pendingPOs = await this.sql<{ Status: string; Count: number }>(`
      SELECT CAST(Status AS NVARCHAR(50)) AS Status, COUNT(*) AS Count
      FROM PurchaseOrders
      WHERE IsDeleted = 0
      GROUP BY Status
    `);

    const totalPending = pendingPOs.reduce((s, r) => s + Number(r.Count), 0);
    const outOfStockCount = reorderItems.filter(i => i.TotalQuantityOnHand === 0).length;

    const fallback = `${reorderItems.length} items need restocking. ${totalPending} purchase orders currently in the system. Immediate POs recommended for ${outOfStockCount} out-of-stock items.`;
    const insight = await this.generateInsight(
      prompt,
      reorderItems as unknown as Record<string, unknown>[],
      fallback,
      `Pending PO count: ${totalPending}, Out-of-stock items needing POs: ${outOfStockCount}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.92,
      data: reorderItems as unknown as Record<string, unknown>[],
      actions: [
        { type: 'create_purchase_order_draft', payload: { items: reorderItems } },
        { type: 'notify_procurement_team',     payload: { urgent: outOfStockCount } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 3. SUPPLIER AGENT — performance evaluation
// ─────────────────────────────────────────────
export class SupplierAgent extends BaseAgent {
  readonly name = 'SupplierAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const suppliers = await this.sql<{
      Name: string; Rating: number; OnTimeDeliveryRate: number;
      QualityRate: number; TotalOrders: number; Status: number;
    }>(`
      SELECT
        s.Name,
        CAST(s.Rating              AS FLOAT) AS Rating,
        CAST(s.OnTimeDeliveryRate  AS FLOAT) AS OnTimeDeliveryRate,
        CAST(s.QualityRate         AS FLOAT) AS QualityRate,
        CAST(s.TotalOrders         AS FLOAT) AS TotalOrders,
        s.Status
      FROM Suppliers s
      WHERE s.IsDeleted = 0
    `);

    const active    = suppliers.filter(s => s.Status === 1);
    const highPerf  = active.filter(s => (s.OnTimeDeliveryRate ?? 0) >= 90);
    const lowPerf   = active.filter(s => (s.OnTimeDeliveryRate ?? 0) < 70);

    const fallback = `Evaluated ${active.length} active suppliers. ${highPerf.length} performing above 90% on-time delivery, ${lowPerf.length} below 70% — consider alternative sourcing.`;
    const insight = await this.generateInsight(
      prompt,
      suppliers as unknown as Record<string, unknown>[],
      fallback,
      `Active: ${active.length}, High performers (≥90%): ${highPerf.length}, Low performers (<70%): ${lowPerf.length}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.90,
      data: suppliers as unknown as Record<string, unknown>[],
      actions: [
        { type: 'update_supplier_ratings',      payload: { evaluated: active.length } },
        { type: 'flag_underperforming_suppliers', payload: { suppliers: lowPerf.map(s => s.Name) } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 4. EXPIRY AGENT — expiry detection & alerts
// ─────────────────────────────────────────────
export class ExpiryAgent extends BaseAgent {
  readonly name = 'ExpiryAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const expiring = await this.sql<{
      BatchNumber: string; ItemName: string; ExpiryDate: string;
      RemainingQuantity: number; DaysLeft: number;
    }>(`
      SELECT
        b.BatchNumber,
        i.Name                                          AS ItemName,
        CONVERT(NVARCHAR(20), b.ExpiryDate, 23)         AS ExpiryDate,
        CAST(b.RemainingQuantity AS FLOAT)               AS RemainingQuantity,
        DATEDIFF(day, GETUTCDATE(), b.ExpiryDate)        AS DaysLeft
      FROM StockBatches    b
      JOIN InventoryItems  i ON i.Id = b.ItemId
      WHERE b.RemainingQuantity > 0
        AND b.ExpiryDate <= DATEADD(day, 14, GETUTCDATE())
        AND b.IsDeleted = 0
      ORDER BY b.ExpiryDate ASC
    `);

    const expired  = expiring.filter(e => e.DaysLeft <= 0);
    const critical = expiring.filter(e => e.DaysLeft > 0 && e.DaysLeft <= 3);
    const warning  = expiring.filter(e => e.DaysLeft > 3 && e.DaysLeft <= 14);

    const fallback = `Expiry scan complete: ${expired.length} expired batches (immediate disposal required), ${critical.length} batches expiring within 3 days, ${warning.length} batches expiring within 14 days.`;
    const insight = await this.generateInsight(
      prompt,
      expiring as unknown as Record<string, unknown>[],
      fallback,
      `Expired: ${expired.length}, Critical (≤3 days): ${critical.length}, Warning (4-14 days): ${warning.length}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.97,
      data: expiring as unknown as Record<string, unknown>[],
      actions: [
        { type: 'send_expiry_alerts',         payload: { expired: expired.length, critical: critical.length } },
        { type: 'flag_expired_for_disposal',  payload: { batches: expired.map(e => e.BatchNumber) } },
        { type: 'notify_kitchen_team',        payload: { useSoon: warning.map(e => e.ItemName) } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 5. KITCHEN AGENT — ingredient consumption
// ─────────────────────────────────────────────
export class KitchenAgent extends BaseAgent {
  readonly name = 'KitchenAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const meals = await this.sql<{
      MealName: string; IngredientCount: number; TotalCost: number;
    }>(`
      SELECT
        m.Name                               AS MealName,
        COUNT(mi.Id)                         AS IngredientCount,
        CAST(SUM(
          mi.Quantity * i.AverageUnitCost
        ) AS FLOAT)                          AS TotalCost
      FROM Meals        m
      JOIN MealIngredients mi ON mi.MealId = m.Id
      JOIN InventoryItems  i  ON i.Id = mi.ItemId
      WHERE m.IsDeleted = 0
      GROUP BY m.Name
      ORDER BY TotalCost DESC
    `);

    const recentIssues = await this.sql<{
      ItemName: string; TotalIssued: number; IssueCount: number;
    }>(`
      SELECT TOP 10
        i.Name                                 AS ItemName,
        CAST(SUM(gl.IssuedQuantity) AS FLOAT)  AS TotalIssued,
        COUNT(gl.Id)                           AS IssueCount
      FROM GoodsIssueLines gl
      JOIN InventoryItems  i ON i.Id = gl.ItemId
      JOIN GoodsIssues     g ON g.Id = gl.GoodsIssueId
      WHERE g.CreatedAt >= DATEADD(day, -30, GETUTCDATE())
        AND g.IsDeleted = 0
      GROUP BY i.Name
      ORDER BY TotalIssued DESC
    `);

    const fallback = `Kitchen analysis: ${meals.length} meal recipes tracked. Top consumed items in the last 30 days: ${recentIssues.slice(0, 3).map(r => r.ItemName).join(', ') || 'no data yet'}.`;
    const insight = await this.generateInsight(
      prompt,
      [...meals, ...recentIssues] as unknown as Record<string, unknown>[],
      fallback,
      `Total meal recipes: ${meals.length}, Top consumed items last 30 days: ${recentIssues.length}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.88,
      data: [...meals, ...recentIssues] as unknown as Record<string, unknown>[],
      actions: [
        { type: 'update_kitchen_planning',    payload: { meals: meals.length } },
        { type: 'flag_high_consumption_items', payload: { items: recentIssues.slice(0, 5).map(r => r.ItemName) } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 6. FORECAST AGENT — demand prediction
// ─────────────────────────────────────────────
export class ForecastAgent extends BaseAgent {
  readonly name = 'ForecastAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const movements = await this.sql<{
      ItemCode: string; ItemName: string;
      MovementsLast30: number; AvgQtyPerMove: number; TrendPct: number;
    }>(`
      SELECT TOP 15
        i.ItemCode,
        i.Name                                   AS ItemName,
        COUNT(sm.Id)                             AS MovementsLast30,
        CAST(AVG(sm.Quantity) AS FLOAT)          AS AvgQtyPerMove,
        CAST(
          (COUNT(sm.Id) * 1.0 /
           NULLIF((
             SELECT COUNT(*) FROM StockMovements sm2
             WHERE sm2.ItemId = i.Id
               AND sm2.CreatedAt BETWEEN DATEADD(day,-60,GETUTCDATE())
                                     AND DATEADD(day,-30,GETUTCDATE())
           ), 0) - 1) * 100 AS FLOAT
        )                                        AS TrendPct
      FROM InventoryItems  i
      JOIN StockMovements  sm ON sm.ItemId = i.Id
      WHERE sm.CreatedAt >= DATEADD(day, -30, GETUTCDATE())
        AND i.IsActive   = 1
        AND i.IsDeleted  = 0
      GROUP BY i.ItemCode, i.Id, i.Name
      ORDER BY MovementsLast30 DESC
    `);

    const trending = movements.filter(m => (m.TrendPct ?? 0) > 20);

    const fallback = `Demand forecast based on last 30 days: ${movements.length} items analysed. ${trending.length} items showing >20% upward trend — consider proactive restocking.`;
    const insight = await this.generateInsight(
      prompt,
      movements as unknown as Record<string, unknown>[],
      fallback,
      `Items analysed: ${movements.length}, Trending up (>20%): ${trending.length}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.85,
      data: movements as unknown as Record<string, unknown>[],
      actions: [
        { type: 'update_forecasts',          payload: { itemsAnalysed: movements.length } },
        { type: 'recommend_proactive_restock', payload: { trending: trending.map(m => m.ItemCode) } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 7. REPORTING AGENT — business report gen
// ─────────────────────────────────────────────
export class ReportingAgent extends BaseAgent {
  readonly name = 'ReportingAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const summary = await this.sql<{
      TotalItems: number; TotalStock: number; TotalValue: number; LowStockCount: number;
    }>(`
      SELECT
        COUNT(*)                                    AS TotalItems,
        CAST(SUM(TotalQuantityOnHand) AS FLOAT)     AS TotalStock,
        CAST(SUM(TotalInventoryValueAmount) AS FLOAT) AS TotalValue,
        SUM(CASE WHEN TotalQuantityOnHand <= ReorderLevel THEN 1 ELSE 0 END) AS LowStockCount
      FROM InventoryItems
      WHERE IsActive = 1 AND IsDeleted = 0
    `);

    const movementSummary = await this.sql<{
      MovementType: string; Count: number; TotalQty: number;
    }>(`
      SELECT
        CAST(MovementType AS NVARCHAR(50))  AS MovementType,
        COUNT(*)                            AS Count,
        CAST(SUM(Quantity) AS FLOAT)        AS TotalQty
      FROM StockMovements
      WHERE CreatedAt >= DATEADD(day, -30, GETUTCDATE())
        AND IsDeleted = 0
      GROUP BY MovementType
    `);

    const row = summary[0] ?? { TotalItems: 0, TotalStock: 0, TotalValue: 0, LowStockCount: 0 };

    const fallback = `Inventory report: ${row.TotalItems} items | Total stock: ${Number(row.TotalStock).toLocaleString()} units | Total value: LKR ${Number(row.TotalValue).toLocaleString()} | ${row.LowStockCount} items below reorder level.`;
    const insight = await this.generateInsight(
      prompt,
      [row as unknown as Record<string, unknown>, ...movementSummary as unknown as Record<string, unknown>[]],
      fallback,
      `Movement types in last 30 days: ${movementSummary.map(m => `${m.MovementType}: ${m.Count} moves`).join(', ')}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.97,
      data: [row as unknown as Record<string, unknown>, ...movementSummary as unknown as Record<string, unknown>[]],
      actions: [
        { type: 'generate_inventory_report', payload: { totalValue: row.TotalValue, totalItems: row.TotalItems } },
        { type: 'generate_movement_report',  payload: { period: '30 days', movements: movementSummary } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 8. FINANCE AGENT — inventory cost analysis
// ─────────────────────────────────────────────
export class FinanceAgent extends BaseAgent {
  readonly name = 'FinanceAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const costAnalysis = await this.sql<{
      ItemCode: string; Name: string; AverageCost: number;
      StockQty: number; InventoryValue: number;
    }>(`
      SELECT TOP 20
        i.ItemCode,
        i.Name,
        CAST(i.AverageUnitCost       AS FLOAT)                       AS AverageCost,
        CAST(i.TotalQuantityOnHand   AS FLOAT)                       AS StockQty,
        CAST(i.TotalInventoryValueAmount AS FLOAT)                   AS InventoryValue
      FROM InventoryItems i
      WHERE i.IsActive  = 1
        AND i.IsDeleted = 0
      ORDER BY i.TotalInventoryValueAmount DESC
    `);

    const totalValue = costAnalysis.reduce((s, r) => s + Number(r.InventoryValue), 0);

    const poSpend = await this.sql<{ TotalSpend: number; POCount: number }>(`
      SELECT
        CAST(SUM(TotalAmount) AS FLOAT) AS TotalSpend,
        COUNT(*)                        AS POCount
      FROM PurchaseOrders
      WHERE CreatedAt >= DATEADD(day, -30, GETUTCDATE())
        AND IsDeleted  = 0
    `);

    const spend = poSpend[0] ?? { TotalSpend: 0, POCount: 0 };

    const fallback = `Financial analysis: Top 20 items hold LKR ${totalValue.toLocaleString()} in inventory value. Purchase spend in last 30 days: LKR ${Number(spend.TotalSpend).toLocaleString()} across ${spend.POCount} purchase orders.`;
    const insight = await this.generateInsight(
      prompt,
      costAnalysis as unknown as Record<string, unknown>[],
      fallback,
      `Total inventory value (top 20): LKR ${totalValue.toLocaleString()}, PO spend last 30 days: LKR ${Number(spend.TotalSpend).toLocaleString()} across ${spend.POCount} POs`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.93,
      data: costAnalysis as unknown as Record<string, unknown>[],
      actions: [
        { type: 'update_financial_metrics', payload: { totalValue, spend: spend.TotalSpend } },
        { type: 'generate_cost_report',     payload: { period: '30 days' } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 9. QUALITY ASSURANCE AGENT — food safety
// ─────────────────────────────────────────────
export class QualityAssuranceAgent extends BaseAgent {
  readonly name = 'QualityAssuranceAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    // Expired batches still in stock = quality risk
    const expiredInStock = await this.sql<{
      BatchNumber: string; ItemName: string; ExpiryDate: string; RemainingQty: number;
    }>(`
      SELECT
        b.BatchNumber,
        i.Name                                    AS ItemName,
        CONVERT(NVARCHAR(20), b.ExpiryDate, 23)   AS ExpiryDate,
        CAST(b.RemainingQuantity AS FLOAT)         AS RemainingQty
      FROM StockBatches   b
      JOIN InventoryItems i ON i.Id = b.ItemId
      WHERE b.ExpiryDate < GETUTCDATE()
        AND b.RemainingQuantity > 0
        AND b.IsDeleted = 0
    `);

    // Perishable items with no batch tracking
    const untracked = await this.sql<{ ItemCode: string; Name: string }>(`
      SELECT i.ItemCode, i.Name
      FROM InventoryItems i
      WHERE i.IsPerishable = 1
        AND i.IsBatchTracked = 0
        AND i.IsActive = 1
        AND i.IsDeleted = 0
    `);

    const fallback = `QA scan: ${expiredInStock.length} expired batches still in stock (disposal required immediately). ${untracked.length} perishable items without batch tracking — food safety risk.`;
    const insight = await this.generateInsight(
      prompt,
      [...expiredInStock, ...untracked] as unknown as Record<string, unknown>[],
      fallback,
      `Expired batches in stock: ${expiredInStock.length}, Untracked perishables: ${untracked.length}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.96,
      data: [...expiredInStock, ...untracked] as unknown as Record<string, unknown>[],
      actions: [
        { type: 'flag_expired_stock',       payload: { count: expiredInStock.length, batches: expiredInStock.map(e => e.BatchNumber) } },
        { type: 'flag_untracked_perishables', payload: { count: untracked.length, items: untracked.map(u => u.ItemCode) } },
        { type: 'generate_qa_report',       payload: { timestamp: new Date().toISOString() } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}

// ─────────────────────────────────────────────
// 10. NOTIFICATION AGENT — alerts & reminders
// ─────────────────────────────────────────────
export class NotificationAgent extends BaseAgent {
  readonly name = 'NotificationAgent';

  async execute(prompt: string, _ctx: Record<string, unknown>): Promise<AgentResult> {
    const start = Date.now();

    const notifications = await this.sql<{
      Id: string; Title: string; Message: string;
      Type: string; IsRead: boolean; CreatedAt: string;
    }>(`
      SELECT TOP 20
        CAST(n.Id       AS NVARCHAR(36))   AS Id,
        n.Title,
        n.Message,
        CAST(n.Type     AS NVARCHAR(50))   AS Type,
        n.IsRead,
        CONVERT(NVARCHAR(20), n.CreatedAt, 23) AS CreatedAt
      FROM Notifications n
      WHERE n.IsDeleted = 0
      ORDER BY n.CreatedAt DESC
    `);

    const unread = notifications.filter(n => !n.IsRead);

    // Also build new pending alerts from live data
    const pendingAlerts: { type: string; message: string }[] = [];

    const lowStockCount = await this.sql<{ cnt: number }>(`
      SELECT COUNT(*) AS cnt FROM InventoryItems
      WHERE TotalQuantityOnHand <= ReorderLevel AND IsActive = 1 AND IsDeleted = 0
    `);
    if ((lowStockCount[0]?.cnt ?? 0) > 0) {
      pendingAlerts.push({ type: 'LOW_STOCK', message: `${lowStockCount[0].cnt} items at or below reorder level` });
    }

    const expiringCount = await this.sql<{ cnt: number }>(`
      SELECT COUNT(*) AS cnt FROM StockBatches
      WHERE ExpiryDate <= DATEADD(day, 7, GETUTCDATE())
        AND RemainingQuantity > 0 AND IsDeleted = 0
    `);
    if ((expiringCount[0]?.cnt ?? 0) > 0) {
      pendingAlerts.push({ type: 'EXPIRY', message: `${expiringCount[0].cnt} batches expiring within 7 days` });
    }

    const fallback = `Notification centre: ${unread.length} unread notifications. ${pendingAlerts.length} live alerts triggered: ${pendingAlerts.map(a => a.message).join('; ') || 'none'}.`;
    const insight = await this.generateInsight(
      prompt,
      notifications as unknown as Record<string, unknown>[],
      fallback,
      `Unread: ${unread.length}, Live alerts: ${pendingAlerts.map(a => `${a.type}: ${a.message}`).join('; ')}`,
    );

    return {
      agentName: this.name,
      success: true,
      insight,
      confidence: 0.99,
      data: notifications as unknown as Record<string, unknown>[],
      actions: [
        { type: 'dispatch_unread_notifications', payload: { count: unread.length } },
        { type: 'dispatch_live_alerts',          payload: { alerts: pendingAlerts } },
      ],
      executionTimeMs: this.elapsed(start),
    };
  }
}
