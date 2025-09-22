import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, ArrowLeft, Crown } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { Sidebar } from './Sidebar';
import { LanguageToggle } from './LanguageToggle';
import { useChat } from '../hooks/useChat';
import { useSidebar } from '../hooks/useSidebar';
import { Language } from '../hooks/useLanguage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDailyMessageLimit } from '../hooks/useDailyMessageLimit';

interface ChatPageProps {
  language: Language;
  onBackToHome: () => void;
  onSubscribe: () => void;
}

export function ChatPage({ language, onBackToHome, onSubscribe }: ChatPageProps) {
  const [input, setInput] = useState('');
  const [isSubscribed] = useLocalStorage('meleji-subscribed', false);
  const { 
    messageCount, 
    remainingMessages, 
    isLimitReached, 
    incrementMessageCount, 
    getTimeUntilReset,
    dailyLimit 
  } = useDailyMessageLimit();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [conversations, setConversations] = useLocalStorage('meleji-conversations', []);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { messages, sendMessage, isLoading } = useChat(currentConversationId, conversations, setConversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keep focus on input
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !isLoading) {
        inputRef.current.focus();
      }
    };

    focusInput();

    const handleChatClick = () => {
      focusInput();
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('click', handleChatClick);
    }

    window.addEventListener('focus', focusInput);

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('click', handleChatClick);
      }
      window.removeEventListener('focus', focusInput);
    };
  }, [isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(scrollToBottom, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (conversations.length === 0) {
      const newConversation = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setConversations([newConversation]);
      setCurrentConversationId(newConversation.id);
    } else if (!currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId, setConversations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check message limit for free users
    if (!isSubscribed && isLimitReached) {
      return;
    }

    const message = input.trim();
    setInput('');
    
    // Increment message count for free users
    if (!isSubscribed) {
      incrementMessageCount();
    }
    
    await sendMessage(message);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const startNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    closeSidebar();
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
    closeSidebar();
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  const content = {
    en: {
      placeholder: "Type your message...",
      messagesLeft: `${remainingMessages} messages left`,
      limitReached: "You've reached your free message limit! Upgrade to continue chatting.",
      upgradeButton: "Upgrade Now",
      backToHome: "Back to Home"
    },
    ar: {
      placeholder: "اكتب رسالتك...",
      messagesLeft: `${remainingMessages} رسالة متبقية`,
      limitReached: "لقد وصلت إلى حد الرسائل المجانية! قم بالترقية للمتابعة.",
      upgradeButton: "ترقية الآن",
      backToHome: "العودة للرئيسية"
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <div className={`flex h-screen h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={startNewConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHome}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">M</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-base sm:text-lg">Meligy</h1>
                <p className="text-gray-400 text-xs sm:text-sm">AI Assistant</p>
              </div>
            </div>
          </div>
          
          {!isSubscribed && (
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className="text-gray-300">{currentContent.messagesLeft}</span>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-3 sm:p-4 overscroll-behavior-contain ${language === 'ar' ? 'rtl' : 'ltr'}`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {!hasMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">M</span>
                </div>
                <p className="text-lg mb-2">Ready to chat!</p>
                <p className="text-sm">Ask me anything - I'm here to help.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {isLimitReached && (
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-orange-400/30 text-center max-w-md">
                    <Crown className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-white text-sm mb-3">{currentContent.limitReached}</p>
                    <button
                      onClick={onSubscribe}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold"
                    >
                      {currentContent.upgradeButton}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-black/20 backdrop-blur-sm border-t border-white/10 flex-shrink-0 safe-area-inset-bottom">
          <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentContent.placeholder}
                className={`w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base resize-none ${language === 'ar' ? 'text-right font-arabic' : 'text-left'} ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading || isLimitReached}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isLimitReached}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-2xl transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}