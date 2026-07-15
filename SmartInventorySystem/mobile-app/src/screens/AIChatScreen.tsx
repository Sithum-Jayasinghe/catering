import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Title, TextInput, Button, Surface, IconButton, ActivityIndicator, Chip } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AIChatMessage from '../components/AIChatMessage';
import { ChatMessage, AIInsight } from '../types';
import { APP_CONSTANTS } from '../utils/constants';

export default function AIChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Inventory Assistant. I can help you with inventory insights, forecasting, anomaly detection, and operational guidance. What would you like to know?',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts] = useState([
    'Show low stock items',
    'Forecast demand for next month',
    'Any inventory anomalies?',
    'Generate restock recommendations',
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

    const responses: Record<string, string> = {
      'show low stock items': 'I found 34 items with low stock levels. The top 5 items requiring immediate attention are:\n\n1. Stainless Steel Sheets (Warehouse B) - 120 units remaining (reorder: 200)\n2. USB-C Cables (Warehouse A) - 85 units remaining (reorder: 300)\n3. Cotton Fabric Rolls (Warehouse A) - 45 units remaining (reorder: 100)\n4. Hydraulic O-Rings (Warehouse C) - 20 units remaining (reorder: 50)\n5. Packaging Labels (Warehouse A) - 8 units remaining (reorder: 500)\n\nWould you like me to generate a full low stock report or initiate restock orders?',
      'forecast demand for next month': 'Based on historical sales data, seasonal patterns, and current market trends, here is my demand forecast for next month:\n\n📈 High Demand Items:\n- Electronics accessories (+24% demand expected)\n- Safety equipment (+18% demand expected)\n\n📉 Lower Demand Items:\n- Seasonal items (-15% demand expected)\n\n💡 Recommendations:\n1. Increase Electronics safety stock by 25%\n2. Pre-position raw materials for Manufacturing\n3. Review slow-moving items for potential clearance\n\nWould you like me to generate a detailed forecast report?',
      'any inventory anomalies?': 'I\'ve analyzed recent inventory movements and detected 3 anomalies:\n\n⚠️ Anomaly 1: Unusual spike in item SKU-002-RAW (Stainless Steel)\n- Expected: 200 units/month\n- Actual: 450 units in last 7 days (225% above normal)\n- Possible cause: Data entry error or legitimate bulk order\n\n⚠️ Anomaly 2: Missing movement records\n- 12 items in Warehouse C have no recent movement logs\n- Recommendation: Verify manual entries\n\n⚠️ Anomaly 3: Price variance detected\n- Copper Wire Rolls unit price changed by 12% without approval\n\nWould you like me to Investigate these anomalies further?',
      'generate restock recommendations': 'Based on current stock levels, reorder thresholds, and demand forecasts, here are my recommendations:\n\n🔴 Urgent (Restock Today):\n- Packaging Boxes: Order 5,000 units\n- Cotton Fabric: Order 500 rolls\n- Safety Helmets: Order 200 units\n\n🟡 Moderate (Restock This Week):\n- Steel Sheets: Order 300 units\n- Hydraulic Valves: Order 30 units\n- Label Rolls: Order 1,000 units\n\nEstimated Budget Impact: $45,600\nPotential Savings: $3,200 (bulk discounts)\n\nWould you like me to generate purchase orders for these items?',
    };

    let responseText = 'I understand your query. Let me analyze the available data and provide you with insights. In the full implementation, this would connect to your inventory management system to provide real-time analysis and recommendations.';

    const lowerInput = inputText.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key.split(' ').slice(0, 3).join(' ')) || lowerInput.includes(key)) {
        responseText = value;
        break;
      }
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleRetry = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      setInputText(lastUserMessage.content);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiIconContainer}>
            <MaterialIcons name="smart-toy" size={24} color="#ffffff" />
          </View>
          <View>
            <Title style={styles.headerTitle}>AI Assistant</Title>
            <Text style={styles.headerSubtitle}>Powered by Machine Learning</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <AIChatMessage
            key={message.id}
            message={message}
            onRetry={message.role === 'assistant' ? () => handleRetry(message.id) : undefined}
          />
        ))}

        {loading && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={APP_CONSTANTS.THEME.PRIMARY} />
              <Text style={styles.typingText}>AI is thinking...</Text>
            </View>
          </View>
        )}

        {messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try asking about:</Text>
            <View style={styles.suggestionsGrid}>
              {suggestedPrompts.map((prompt, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onPress={() => handleSuggestedPrompt(prompt)}
                  style={styles.suggestionChip}
                  textStyle={{ fontSize: 12 }}
                  icon="lightbulb-outline"
                >
                  {prompt}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Ask about inventory..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          style={styles.input}
          right={<TextInput.Icon icon="send" onPress={handleSend} />}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    gap: 8,
    alignSelf: 'flex-start',
    marginLeft: 52,
  },
  typingText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionChip: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  input: {
    backgroundColor: '#f8fafc',
    maxHeight: 100,
  },
});
