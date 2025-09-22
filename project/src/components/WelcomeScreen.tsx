import React from 'react';
import { Brain, Search, MessageCircle, Lightbulb } from 'lucide-react';

interface WelcomeScreenProps {
  language: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ language }) => {
  const content = {
    en: {
      title: "Hello! I'm Meleji 👋",
      egyptianBranding: "The first Egyptian-born and developed intelligent virtual assistant",
      subtitle: "Your AI companion with 24/7 internet access that makes complex things simple",
      description: "I'm here to search the internet in real-time, help you think through problems, research topics, and organize ideas. I combine live information with logical thinking to give you clear, helpful answers.",
      features: [
        {
          icon: Brain,
          title: "Mind Map Mastery",
          description: "I organize your thoughts systematically - everything in its perfect place for maximum clarity and understanding."
        },
        {
          icon: Search,
          title: "24/7 Internet Search",
          description: "I continuously search Google's database and the internet to bring you the most current information with reliable sources. Real-time intelligence! 🌐"
        },
        {
          icon: MessageCircle,
          title: "Conversation Genius",
          description: "I adapt to your communication style while maintaining clear, logical thinking in every response."
        },
        {
          icon: Lightbulb,
          title: "Creative Problem Solver",
          description: "I combine creative thinking with solid logic to tackle your problems from multiple angles, including visual solutions."
        }
      ],
      placeholder: "Ask me anything - I'm ready to think it through with you!"
    },
    ar: {
      title: "مرحباً! أنا مليجي 👋",
      egyptianBranding: "أول مساعد ذكي افتراضي مولود ومطور في مصر",
      subtitle: "رفيقك الذكي مع وصول للإنترنت 24/7 الذي يبسط الأمور المعقدة",
      description: "أنا هنا للبحث في الإنترنت فورياً، ومساعدتك في التفكير في المشاكل وبحث المواضيع وتنظيم الأفكار. أجمع بين المعلومات الحية والتفكير المنطقي لأعطيك إجابات واضحة ومفيدة.",
      features: [
        {
          icon: Brain,
          title: "إتقان الخرائط الذهنية",
          description: "أنظم أفكارك بشكل منهجي - كل شيء في مكانه المثالي لتحقيق أقصى وضوح وفهم."
        },
        {
          icon: Search,
          title: "البحث في الإنترنت 24/7",
          description: "أبحث باستمرار في قاعدة بيانات جوجل والإنترنت لأحضر لك أحدث المعلومات مع مصادر موثوقة. ذكاء فوري! 🌐"
        },
        {
          icon: MessageCircle,
          title: "عبقري المحادثة",
          description: "أتكيف مع أسلوب تواصلك مع الحفاظ على التفكير المنطقي الواضح في كل إجابة."
        },
        {
          icon: Lightbulb,
          title: "حلال المشاكل الإبداعي",
          description: "أجمع بين التفكير الإبداعي والمنطق الصلب لمعالجة مشاكلك من زوايا متعددة، بما في ذلك الحلول المرئية."
        }
      ],
      placeholder: "اسألني أي شيء - أنا مستعد للتفكير معك!"
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <div className={`max-w-4xl mx-auto text-center space-y-8 ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Centered Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg border-2 border-white/20 flex items-center justify-center">
          <span className="text-white font-bold text-2xl sm:text-3xl">M</span>
        </div>
      </div>

      {/* Tool Name */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Meligy - AI Assistant
        </h1>
      </div>

      {/* Main Header */}
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          {currentContent.title}
        </h2>
        <p className="text-xl sm:text-2xl text-orange-300 font-semibold max-w-3xl mx-auto leading-relaxed">
          {currentContent.egyptianBranding}
        </p>
        <p className="text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
          {currentContent.subtitle}
        </p>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {currentContent.description}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-12">
        {currentContent.features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white text-left">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-left">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-12 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-400/30">
        <p className="text-lg sm:text-xl text-purple-200 mb-4">
          {currentContent.placeholder}
        </p>
        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
          <span>💡</span>
          <span>Try: "Create a mind map for project planning" or "Research the latest AI trends"</span>
        </div>
      </div>
    </div>
  );
};