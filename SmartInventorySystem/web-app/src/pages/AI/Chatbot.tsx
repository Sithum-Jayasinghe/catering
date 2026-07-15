import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatWithAI, useRecommendations } from '@/hooks/useApi';
import type { ChatMessage } from '@/types';
import { format } from 'date-fns';

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI inventory assistant. I can help you with inventory queries, stock levels, reorder suggestions, and more. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatWithAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput('');

    try {
      const response = await chatMutation.mutateAsync({ message: query });
      const aiMessage: ChatMessage = {
        _id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data?.response || 'I processed your query. Is there anything else you need help with?',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        _id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        _id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI inventory assistant. How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const suggestedQuestions = [
    'What items are running low on stock?',
    'Which items are expiring soon?',
    'Show me pending purchase orders',
    'What is the total inventory value?',
    'Which supplier has the best rating?',
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            AI Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask me anything about your inventory
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearChat}>
          Clear Chat
        </Button>
      </Box>

      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: '16px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  {message.role === 'assistant' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <BotIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'block',
                        opacity: 0.7,
                        fontSize: '0.65rem',
                      }}
                    >
                      {format(new Date(message.timestamp), 'MMM dd, hh:mm a')}
                    </Typography>
                  </Paper>
                  {message.role === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      <UserIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          {chatMutation.isPending && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 5 }}>
              <LinearProgress sx={{ width: 40 }} />
              <Typography variant="caption" color="text.secondary">
                AI is thinking...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          {messages.length === 1 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {suggestedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  size="small"
                  variant="outlined"
                  onClick={() => setInput(question)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about inventory, stock levels, suppliers..."
              fullWidth
              multiline
              maxRows={4}
              disabled={chatMutation.isPending}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
