import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, TextInput, Button, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { ChatMessage } from '../types';
import { APP_CONSTANTS } from '../utils/constants';

interface AIChatMessageProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
}

export default function AIChatMessage({ message, onRetry }: AIChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <Avatar.Icon
          size={36}
          icon="robot"
          style={[styles.avatar, { backgroundColor: APP_CONSTANTS.THEME.SECONDARY }]}
        />
      )}
      
      <Surface style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        !isUser && {
          backgroundColor: APP_CONSTANTS.THEME.PRIMARY + '10',
          borderColor: APP_CONSTANTS.THEME.PRIMARY + '30',
        },
      ]}>
        <Text style={[
          styles.content,
          isUser ? styles.userText : styles.assistantText,
        ]}>
          {message.content}
        </Text>
        {!isUser && onRetry && (
          <View style={styles.retryContainer}>
            <IconButton
              icon="refresh"
              size={16}
              onPress={() => onRetry(message.id)}
              style={styles.retryButton}
            />
          </View>
        )}
      </Surface>

      {isUser && (
        <Avatar.Icon
          size={36}
          icon="account"
          style={[styles.avatar, { backgroundColor: APP_CONSTANTS.THEME.SUCCESS }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY,
    borderColor: APP_CONSTANTS.THEME.PRIMARY,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#0f172a',
  },
  retryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  retryButton: {
    margin: 0,
    padding: 0,
  },
});
