import React from 'react';
import { Brain, Search, MessageCircle, Lightbulb, Image, Table, Zap, Shield, Globe, Users } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { Language } from '../hooks/useLanguage';

interface HomePageProps {
  language: Language;
  onToggleLanguage: () => void;
  onTryFree: () => void;
  onSubscribe: () => void;
}

export function HomePage({ language, onToggleLanguage, onTryFree, onSubscribe }: HomePageProps) {
  const content = {
    en: {
      hero: {
        title: "Meet Meleji",
        subtitle: "The first Egyptian-born AI assistant",
        description: "Your intelligent companion that combines logical reasoning with creative problem-solving to help you think through complex challenges.",
        tryFree: "Try Free (25 messages/day)",
        subscribe: "Get Unlimited Access"
      },
      features: {
        title: "Practical Features That Make a Difference",
        subtitle: "Discover what makes Meleji your ideal thinking partner",
        list: [
          {
            icon: Brain,
            title: "Mind Map Organization",
            description: "Transform chaotic thoughts into clear, structured mind maps. Perfect for project planning, studying, and organizing complex information.",
            practical: "Great for: Meeting notes, research organization, creative brainstorming"
          },
          {
            icon: Search,
            title: "Deep Research Assistant",
            description: "Go beyond surface-level searches. I analyze multiple sources, fact-check information, and provide comprehensive research summaries.",
            practical: "Great for: Academic research, market analysis, fact verification"
          },
          {
            icon: Table,
            title: "Smart Data Tables",
            description: "Convert messy information into clean, organized tables with scientific methodology and logical structure.",
            practical: "Great for: Comparison charts, data analysis, structured presentations"
          },
          {
            icon: Image,
            title: "Visual Content Creation",
            description: "Generate high-quality images and visual content using Google AI Studio to support your ideas and presentations.",
            practical: "Great for: Professional presentations, social media content, educational materials, creative projects"
          },
          {
            icon: Lightbulb,
            title: "Creative Problem Solving",
            description: "Approach challenges from multiple angles using both analytical thinking and creative methodologies.",
            practical: "Great for: Business challenges, personal decisions, innovation projects"
          },
          {
            icon: MessageCircle,
            title: "Adaptive Communication",
            description: "I learn your communication style and adapt my responses to match your preferences while maintaining clarity.",
            practical: "Great for: Professional communication, learning assistance, casual conversations"
          }
        ]
      },
      capabilities: {
        title: "What Can Meleji Actually Do?",
        examples: [
          {
            category: "Research & Analysis",
            items: [
              "Create comprehensive research summaries on any topic",
              "Fact-check information from multiple sources",
              "Generate comparison tables and analysis charts",
              "Organize complex information into mind maps"
            ]
          },
          {
            category: "Creative & Visual",
            items: [
              "Generate high-quality images using Google AI Studio",
              "Create professional visual content for presentations",
              "Design structured layouts and formats",
              "Produce custom graphics and illustrations",
              "Generate infographics and visual aids"
            ]
          },
          {
            category: "Productivity & Organization",
            items: [
              "Transform meeting notes into actionable items",
              "Create project timelines and planning documents",
              "Organize thoughts into logical frameworks",
              "Generate structured reports and summaries"
            ]
          },
          {
            category: "Learning & Education",
            items: [
              "Explain complex concepts in simple terms",
              "Create study guides and learning materials",
              "Generate practice questions and exercises",
              "Provide step-by-step problem-solving guidance"
            ]
          }
        ]
      },
      pricing: {
        title: "Simple, Fair Pricing",
        free: {
          title: "Free Plan",
          price: "Free Forever",
          features: [
            "25 messages per day",
            "All core AI features",
            "Mind mapping tools",
            "Basic research assistance",
            "Image generation with Google AI Studio",
            "Table creation"
          ],
          button: "Start Free"
        },
        premium: {
          title: "Premium Plan",
          price: "Coming Soon",
          features: [
            "Unlimited messages",
            "Priority response speed",
            "Advanced research tools",
            "Export capabilities",
            "Custom templates",
            "Priority support"
          ],
          button: "Get Notified"
        }
      },
      cta: {
        title: "Ready to Think Smarter?",
        description: "Join thousands of users who are already using Meleji to organize their thoughts and solve complex problems.",
        button: "Start Your Free Trial"
      }
    },
    ar: {
      hero: {
        title: "تعرف على ميليجي",
        subtitle: "أول مساعد ذكي مولود في مصر",
        description: "رفيقك الذكي الذي يجمع بين التفكير المنطقي وحل المشاكل الإبداعي لمساعدتك في التفكير في التحديات المعقدة.",
        tryFree: "جرب مجاناً (25 رسالة/يوم)",
        subscribe: "احصل على وصول غير محدود"
      },
      features: {
        title: "ميزات عملية تحدث فرقاً حقيقياً",
        subtitle: "اكتشف ما يجعل ميليجي شريك التفكير المثالي",
        list: [
          {
            icon: Brain,
            title: "تنظيم الخرائط الذهنية",
            description: "حول الأفكار المشتتة إلى خرائط ذهنية واضحة ومنظمة. مثالي لتخطيط المشاريع والدراسة وتنظيم المعلومات المعقدة.",
            practical: "مثالي لـ: ملاحظات الاجتماعات، تنظيم البحوث، العصف الذهني الإبداعي"
          },
          {
            icon: Search,
            title: "مساعد البحث العميق",
            description: "تجاوز البحث السطحي. أحلل مصادر متعددة وأتحقق من المعلومات وأقدم ملخصات بحثية شاملة.",
            practical: "مثالي لـ: البحث الأكاديمي، تحليل السوق، التحقق من الحقائق"
          },
          {
            icon: Table,
            title: "جداول البيانات الذكية",
            description: "حول المعلومات المشتتة إلى جداول منظمة ونظيفة بمنهجية علمية وهيكل منطقي.",
            practical: "مثالي لـ: جداول المقارنة، تحليل البيانات، العروض التقديمية المنظمة"
          },
          {
            icon: Image,
            title: "إنشاء المحتوى المرئي",
            description: "أنتج صوراً ومحتوى مرئي ذي صلة لدعم أفكارك وعروضك التقديمية.",
            practical: "مثالي لـ: العروض التقديمية، وسائل التواصل الاجتماعي، المشاريع الإبداعية"
          },
          {
            icon: Lightbulb,
            title: "حل المشاكل الإبداعي",
            description: "أتعامل مع التحديات من زوايا متعددة باستخدام التفكير التحليلي والمنهجيات الإبداعية.",
            practical: "مثالي لـ: تحديات الأعمال، القرارات الشخصية، مشاريع الابتكار"
          },
          {
            icon: MessageCircle,
            title: "التواصل التكيفي",
            description: "أتعلم أسلوب تواصلك وأكيف إجاباتي لتناسب تفضيلاتك مع الحفاظ على الوضوح.",
            practical: "مثالي لـ: التواصل المهني، المساعدة في التعلم، المحادثات العادية"
          }
        ]
      },
      capabilities: {
        title: "ما الذي يمكن لمليجي فعله حقاً؟",
        examples: [
          {
            category: "البحث والبحوث الفورية",
            items: [
              "البحث في قاعدة بيانات جوجل للحصول على أحدث المعلومات 24/7",
              "تقديم ملخصات شاملة مع استشهادات المصادر",
              "التحقق المتقاطع من مصادر متعددة للدقة",
              "تتبع الأخبار العاجلة والتحديثات الفورية"
            ]
          },
          {
            category: "البحث والتحليل",
            items: [
              "تحليل المواضيع المعقدة بالتفكير المنطقي",
              "التحقق من المعلومات ضد مصادر موثوقة",
              "إنتاج جداول المقارنة ومخططات التحليل",
              "تنظيم المعلومات المعقدة في خرائط ذهنية"
            ]
          },
          {
            category: "الإبداع والمرئيات",
            items: [
              "إنتاج صور ذات صلة لمشاريعك",
              "إنشاء محتوى مرئي للعروض التقديمية",
              "تصميم تخطيطات وتنسيقات منظمة",
              "العصف الذهني لحلول إبداعية للمشاكل"
            ]
          },
          {
            category: "الإنتاجية والتنظيم",
            items: [
              "تحويل ملاحظات الاجتماعات إلى عناصر قابلة للتنفيذ",
              "إنشاء جداول زمنية ووثائق تخطيط المشاريع",
              "تنظيم الأفكار في أطر منطقية",
              "إنتاج تقارير وملخصات منظمة"
            ]
          },
          {
            category: "التعلم والتعليم",
            items: [
              "شرح المفاهيم المعقدة بمصطلحات بسيطة",
              "إنشاء أدلة دراسية ومواد تعليمية",
              "إنتاج أسئلة وتمارين للممارسة",
              "تقديم إرشادات خطوة بخطوة لحل المشاكل"
            ]
          }
        ]
      },
      pricing: {
        title: "أسعار بسيطة وعادلة",
        free: {
          title: "الخطة المجانية",
          price: "مجاني للأبد",
          features: [
            "25 رسالة يومياً",
            "جميع ميزات الذكاء الاصطناعي الأساسية",
            "أدوات الخرائط الذهنية",
            "مساعدة البحث الأساسية",
            "إنتاج الصور بـ Google AI Studio",
            "إنشاء الجداول"
          ],
          button: "ابدأ مجاناً"
        },
        premium: {
          title: "الخطة المميزة",
          price: "قريباً",
          features: [
            "رسائل غير محدودة",
            "سرعة استجابة أولوية",
            "أدوات بحث متقدمة",
            "إمكانيات التصدير",
            "قوالب مخصصة",
            "دعم أولوية"
          ],
          button: "احصل على إشعار"
        }
      },
      cta: {
        title: "مستعد للوصول للذكاء الفوري؟",
        description: "انضم لآلاف المستخدمين الذين يستخدمون مليجي بالفعل للوصول لمعلومات محدثة وحل المشاكل المعقدة.",
        button: "ابدأ تجربتك المجانية"
      }
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Language Toggle */}
      <LanguageToggle language={language} onToggle={onToggleLanguage} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-2xl border-4 border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-3xl sm:text-4xl">M</span>
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {currentContent.hero.title}
              </h1>
              <p className="text-xl sm:text-2xl text-orange-300 font-semibold max-w-3xl mx-auto">
                {currentContent.hero.subtitle}
              </p>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {currentContent.hero.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={onTryFree}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {currentContent.hero.tryFree}
              </button>
              <button
                onClick={onSubscribe}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {currentContent.hero.subscribe}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {currentContent.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.features.list.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/20 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-400/30">
                    <p className="text-purple-200 text-sm font-medium">
                      {feature.practical}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {currentContent.capabilities.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {currentContent.capabilities.examples.map((category, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></div>
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {currentContent.pricing.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentContent.pricing.free.title}
                </h3>
                <p className="text-3xl font-bold text-purple-300">
                  {currentContent.pricing.free.price}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {currentContent.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onTryFree}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {currentContent.pricing.free.button}
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 relative">
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {language === 'ar' ? 'قريباً' : 'Coming Soon'}
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentContent.pricing.premium.title}
                </h3>
                <p className="text-3xl font-bold text-orange-300">
                  {currentContent.pricing.premium.price}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {currentContent.pricing.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onSubscribe}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {currentContent.pricing.premium.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-purple-400/30">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {currentContent.cta.title}
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {currentContent.cta.description}
            </p>
            <button
              onClick={onTryFree}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              {currentContent.cta.button}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/30 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-white font-semibold">Meligy</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>© 2025 Meligy by Vision AI. Made in Egypt 🇪🇬</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}