import React from 'react';
import { X, MessageCircle, Trash2, Plus } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}: SidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.messages.length > 0) {
      const firstMessage = conversation.messages.find(m => m.sender === 'user');
      if (firstMessage) {
        return firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
      }
    }
    return 'New Chat';
  };

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-base sm:text-lg">Conversations</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <button
              onClick={onNewConversation}
              className="w-full mt-2 sm:mt-3 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No conversations yet</p>
                <p className="text-xs sm:text-sm">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conversation.id
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-xs sm:text-sm truncate">
                          {getConversationTitle(conversation)}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">
                          {formatDate(conversation.updatedAt)}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {conversation.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-medium">Meligy</p>
                <p className="text-gray-400 text-xs">Your AI Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}