export interface McpConnectionConfig {
  name: string;
  url: string;
  apiKey?: string;
  apiSecret?: string;
  headers?: Record<string, string>;
  timeoutSeconds?: number;
}

export interface McpToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  executionTimeMs: number;
}

export class McpClient {
  private connections: Map<string, McpConnectionConfig> = new Map();

  registerConnection(config: McpConnectionConfig) {
    this.connections.set(config.name, config);
  }

  async callTool(toolName: string, parameters: Record<string, unknown>, connectionName: string): Promise<McpToolResult> {
    const startTime = Date.now();
    try {
      const connection = this.connections.get(connectionName);
      if (!connection) return { success: false, error: `Connection ${connectionName} not found`, executionTimeMs: 0 };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...connection.headers,
      };
      if (connection.apiKey) headers['Authorization'] = `Bearer ${connection.apiKey}`;

      const response = await fetch(`${connection.url}/tools/${toolName}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(parameters),
        signal: AbortSignal.timeout(connection.timeoutSeconds || 30_000),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data.result ?? data,
        error: data.error,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', executionTimeMs: Date.now() - startTime };
    }
  }

  listTools(connectionName: string): string[] {
    return ['sql_query', 'document_search', 'email_send', 'sharepoint_query', 'teams_message', 'barcode_scan', 'qr_code_scan', 'file_storage', 'external_api_call', 'report_generation'];
  }
}
