import React from 'react';
import { User, Bot, Image as ImageIcon, Video, Table } from 'lucide-react';

function formatMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    
    // Code blocks
    .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraph if not already wrapped
    .replace(/^(?!<[h|l|d])(.+)/, '<p class="mb-3">$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p class="mb-3"><\/p>/g, '');
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  type?: 'text' | 'image' | 'video' | 'table';
  mediaUrl?: string;
  tableHtml?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  console.log('Rendering message:', { id: message.id, sender: message.sender, content: message.content.slice(0, 50) });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 w-full`}>
      <div className={`flex items-start max-w-[85%] sm:max-w-[75%] ${
        isUser 
          ? 'flex-row-reverse space-x-reverse space-x-2 sm:space-x-3' 
          : 'space-x-2 sm:space-x-3'
      }`}>
        {/* Avatar */}
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
            : 'bg-gradient-to-br from-orange-400 to-orange-600'
        }`}>
          {isUser ? (
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">M</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 break-words ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border border-blue-400/20' 
            : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
        }`}>
          {message.type === 'table' && message.tableHtml ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs sm:text-sm opacity-80">
                <Table className="w-4 h-4" />
                <span>Generated Table</span>
              </div>
              <div 
                className="table-container overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: message.tableHtml }}
              />
              {message.content && (
                <div className="text-xs sm:text-sm mt-3 prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
                </div>
              )}
            </div>
          ) : message.type === 'image' && message.mediaUrl ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm opacity-80">
                <ImageIcon className="w-4 h-4" />
                <span>Generated Image</span>
              </div>
              <img 
                src={message.mediaUrl} 
                alt="Generated content" 
                className="rounded-lg max-w-full h-auto w-full shadow-lg border border-white/20"
                onError={(e) => {
                  console.error('Image failed to load:', message.mediaUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', message.mediaUrl);
                }}
              />
              {message.content && (
                <p className="text-xs sm:text-sm mt-2">{message.content}</p>
              )}
            </div>
          ) : message.type === 'video' && message.mediaUrl ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm opacity-80">
                <Video className="w-4 h-4" />
                <span>Generated Video</span>
              </div>
              <video 
                src={message.mediaUrl} 
                controls 
                className="rounded-lg max-w-full h-auto w-full"
              />
              {message.content && (
                <p className="text-xs sm:text-sm mt-2">{message.content}</p>
              )}
            </div>
          ) : (
            <div 
              className="text-sm sm:text-base leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
            />
          )}
          
          <div className={`text-xs mt-1 sm:mt-2 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
