import { McpClient } from '../mcp/McpClient';

export class OcrService {
  constructor(private mcp: McpClient) {}

  async extractDocumentData(base64Data: string, documentType: 'invoice' | 'grn' | 'po' | 'delivery_note'): Promise<OcrResult> {
    try {
      const configuration = OcrService.CONFIGURATIONS[documentType];
      const toolResult = await this.mcp.callTool(
        'ocr_extract',
        { imageData: base64Data, configuration },
        'ocr'
      );
      const extracted = toolResult.data as OcrResult['data'];

      return {
        success: toolResult.success,
        data: extracted,
        error: toolResult.error,
        confidence: extracted?.confidence || 0,
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', confidence: 0 };
    }
  }

  async extractInvoiceData(base64Data: string): Promise<OcrResult> {
    return this.extractDocumentData(base64Data, 'invoice');
  }

  async extractDeliveryNote(base64Data: string): Promise<OcrResult> {
    return this.extractDocumentData(base64Data, 'delivery_note');
  }

  async extractGrnData(base64Data: string): Promise<OcrResult> {
    return this.extractDocumentData(base64Data, 'grn');
  }

  private static CONFIGURATIONS: Record<string, Record<string, unknown>> = {
    invoice: {
      fields: ['invoice_number', 'invoice_date', 'supplier_name', 'total_amount', 'vat_amount', 'line_items'],
      dateFormat: 'YYYY-MM-DD',
    },
    grn: {
      fields: ['grn_number', 'po_number', 'delivery_date', 'received_by', 'quantities', 'batch_numbers'],
      dateFormat: 'YYYY-MM-DD',
    },
    po: {
      fields: ['po_number', 'order_date', 'supplier', 'items', 'total'],
      dateFormat: 'YYYY-MM-DD',
    },
    delivery_note: {
      fields: ['delivery_note_number', 'vehicle_number', 'driver_name', 'items'],
    },
  };
}

export interface OcrResult {
  success: boolean;
  data?: {
    invoice_number?: string;
    invoice_date?: string;
    supplier_name?: string;
    total_amount?: number;
    vat_amount?: number;
    line_items?: Array<{ item_code: string; description: string; quantity: number; unit_price: number }>;
    grn_number?: string;
    po_number?: string;
    delivery_date?: string;
    received_by?: string;
    quantities?: Array<{ item_code: string; quantity: number; batch_number?: string }>;
    batch_numbers?: string[];
    items?: Array<{ item_code: string; description: string; quantity: number }>;
    delivery_note_number?: string;
    vehicle_number?: string;
    driver_name?: string;
    confidence: number;
  };
  error?: string;
  confidence: number;
}
