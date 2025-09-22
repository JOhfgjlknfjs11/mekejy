import { useState, useCallback } from 'react';
import { Message } from '../components/ChatMessage';
import { generateResponse } from '../services/aiService';
import { LearningSystem } from '../services/learningSystem';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export function useChat(
  currentConversationId: string | null,
  conversations: Conversation[],
  setConversations: (conversations: Conversation[]) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const learningSystem = new LearningSystem();

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    // Add user message immediately to show it in the UI
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            title: conv.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : conv.title,
            updatedAt: new Date().toISOString()
          }
        : conv
    ));

    setIsLoading(true);

    try {
      // Learn from user input
      learningSystem.learnFromInteraction(content, messages);
      
      const response = await generateResponse(content, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        type: response.type || 'text',
        mediaUrl: response.mediaUrl,
        tableHtml: response.tableHtml
      };

      // Learn from assistant response
      learningSystem.learnFromResponse(response.content, content, messages);
      
      // Add assistant message
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages.filter(m => m.id !== userMessage.id), userMessage, assistantMessage],
              updatedAt: new Date().toISOString()
            }
          : conv
      ));
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages.filter(m => m.id !== userMessage.id), userMessage, errorMessage],
              updatedAt: new Date().toISOString()
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, messages, setConversations, learningSystem]);

  return {
    messages,
    sendMessage,
    isLoading
  };
}