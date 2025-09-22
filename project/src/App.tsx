import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { useLanguage } from './hooks/useLanguage';
import { useLocalStorage } from './hooks/useLocalStorage';

type AppView = 'home' | 'chat' | 'subscribe';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const { language, toggleLanguage } = useLanguage();
  const [isSubscribed] = useLocalStorage('meleji-subscribed', false);
  const [chatLanguage, setChatLanguage] = useState<Language>('en');

  const handleTryFree = () => {
    setChatLanguage(language);
    setCurrentView('chat');
  };

  const handleSubscribe = () => {
    setChatLanguage(language);
    setCurrentView('subscribe');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'subscribe') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'ar' ? 'الاشتراك المدفوع' : 'Premium Subscription'}
          </h2>
          <p className="text-gray-300 mb-6">
            {language === 'ar' 
              ? 'ميزة الاشتراك المدفوع ستكون متاحة قريباً. شكراً لاهتمامك!'
              : 'Premium subscription feature coming soon. Thank you for your interest!'
            }
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'chat') {
    return (
      <ChatPage
        language={chatLanguage}
        onBackToHome={handleBackToHome}
        onSubscribe={handleSubscribe}
      />
    );
  }

  return (
    <HomePage
      language={language}
      onToggleLanguage={toggleLanguage}
      onTryFree={handleTryFree}
      onSubscribe={handleSubscribe}
    />
  );
}

export default App;