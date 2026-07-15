export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: { agent?: string; confidence?: number; toolsUsed?: string[] };
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: { type: string; label: string; url: string }[];
  metadata?: { agent?: string; confidence?: number };
}

export interface ChatbotConversation {
  conversationId: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastMessageAt: Date;
}
