import axios, { AxiosInstance } from 'axios';

// ── Types ────────────────────────────────────────────────────────────────────

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  context?: number[];       // conversation context token window
  stream?: boolean;
  options?: OllamaModelOptions;
  format?: 'json';          // request JSON-formatted output
}

export interface OllamaModelOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  num_predict?: number;     // max tokens to generate
  repeat_penalty?: number;
  seed?: number;
  stop?: string[];
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: OllamaModelOptions;
  format?: 'json';
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaModelInfo {
  name: string;
  modified_at: string;
  size: number;
}

// ── Client ───────────────────────────────────────────────────────────────────

export class OllamaClient {
  private client: AxiosInstance;
  private model: string;
  private defaultOptions: OllamaModelOptions;

  constructor(
    baseUrl: string = process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: string = process.env.OLLAMA_MODEL || 'llama3.2',
  ) {
    this.model = model;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 120_000,  // LLM inference can be slow on CPU
      headers: { 'Content-Type': 'application/json' },
    });
    this.defaultOptions = {
      temperature: 0.3,          // keep responses factual
      top_p: 0.9,
      num_predict: 1024,
      repeat_penalty: 1.1,
    };
  }

  // ── Health ─────────────────────────────────────────────────────────────────

  async isAvailable(): Promise<boolean> {
    try {
      const res = await this.client.get('/', { timeout: 3_000 });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<OllamaModelInfo[]> {
    try {
      const res = await this.client.get('/api/tags');
      return (res.data.models ?? []) as OllamaModelInfo[];
    } catch (err) {
      console.error('[OllamaClient] Failed to list models:', err instanceof Error ? err.message : err);
      return [];
    }
  }

  async isModelLoaded(): Promise<boolean> {
    const models = await this.listModels();
    return models.some(m => m.name.startsWith(this.model));
  }

  // ── Generate (single prompt) ───────────────────────────────────────────────

  async generate(
    prompt: string,
    systemPrompt?: string,
    options?: Partial<OllamaModelOptions>,
    format?: 'json',
  ): Promise<OllamaGenerateResponse> {
    const body: OllamaGenerateRequest = {
      model: this.model,
      prompt,
      system: systemPrompt,
      stream: false,
      options: { ...this.defaultOptions, ...options },
      ...(format ? { format } : {}),
    };

    try {
      const res = await this.client.post<OllamaGenerateResponse>('/api/generate', body);
      return res.data;
    } catch (err) {
      console.error('[OllamaClient] generate error:', err instanceof Error ? err.message : err);
      throw new Error(`Ollama generate failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ── Chat (multi-turn conversation) ─────────────────────────────────────────

  async chat(
    messages: OllamaChatMessage[],
    options?: Partial<OllamaModelOptions>,
    format?: 'json',
  ): Promise<OllamaChatResponse> {
    const body: OllamaChatRequest = {
      model: this.model,
      messages,
      stream: false,
      options: { ...this.defaultOptions, ...options },
      ...(format ? { format } : {}),
    };

    try {
      const res = await this.client.post<OllamaChatResponse>('/api/chat', body);
      return res.data;
    } catch (err) {
      console.error('[OllamaClient] chat error:', err instanceof Error ? err.message : err);
      throw new Error(`Ollama chat failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ── Convenience: single-shot question with a system prompt ─────────────────

  async ask(question: string, systemPrompt: string, options?: Partial<OllamaModelOptions>): Promise<string> {
    const res = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      options,
    );
    return res.message.content.trim();
  }

  // ── Convenience: JSON-structured output ────────────────────────────────────

  async askJson<T = Record<string, unknown>>(
    question: string,
    systemPrompt: string,
    options?: Partial<OllamaModelOptions>,
  ): Promise<T> {
    const res = await this.chat(
      [
        { role: 'system', content: systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown, no code fences.' },
        { role: 'user', content: question },
      ],
      { ...options, temperature: 0.1 },  // lower temp for structured output
      'json',
    );

    const raw = res.message.content.trim();
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Try to extract JSON from the response if it has surrounding text
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]) as T;
      throw new Error(`Failed to parse JSON from Ollama response: ${raw.slice(0, 200)}`);
    }
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  getModel(): string {
    return this.model;
  }

  setModel(model: string): void {
    this.model = model;
  }
}

// ── Singleton ────────────────────────────────────────────────────────────────

let _instance: OllamaClient | null = null;

export function getOllamaClient(): OllamaClient {
  if (!_instance) {
    _instance = new OllamaClient();
  }
  return _instance;
}
