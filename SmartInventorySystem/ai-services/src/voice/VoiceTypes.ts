export interface VoiceCallSession {
  sessionId: string;
  callerPhone?: string;
  callerName?: string;
  purpose?: string;
  startedAt: Date;
  lastActivityAt: Date;
  messages: VoiceMessage[];
  context: Record<string, unknown>;
  status: 'active' | 'transferred' | 'completed' | 'failed';
}

export interface VoiceMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  metadata?: {
    transcriptionConfidence?: number;
    synthesisVoice?: string;
    agentUsed?: string;
    durationMs?: number;
  };
}

export interface VoiceReceptionistConfig {
  sttProvider: 'openai' | 'whisper' | 'google';
  ttsProvider: 'openai' | 'elevenlabs' | 'google';
  defaultVoice?: string;
  language?: string;
  transferThreshold?: number;
  maxTurns?: number;
}

export interface VoiceAction {
  type: string;
  label: string;
  payload?: Record<string, unknown>;
  voicePrompt?: string;
}

export interface PhoneTransfer {
  department: string;
  phoneNumber: string;
  reason: string;
}
