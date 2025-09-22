import { Message } from '../components/ChatMessage';
import { generateImage, generatePresentationImage } from './imageService';
import { TableGenerator, shouldGenerateTable, parseTableRequest } from './tableService';
import { SearchService, shouldSearchInternet, extractSearchQuery } from './searchService';

interface AIResponse {
  content: string;
  type?: 'text' | 'image' | 'table';
  mediaUrl?: string;
  tableHtml?: string;
}

// Google Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY || 'AIzaSyCaFJlXQXomd3ezcHk1RzXDfaJxAJnju-M';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateNaturalResponse(userInput: string, conversationHistory: Message[]): Promise<string> {
  try {
    // Build conversation context
    const recentMessages = conversationHistory.slice(-6);
    let contextPrompt = `You are Meligy, a friendly Egyptian AI assistant created by Joseph Ibrahim and Vision AI company. You are proudly Egyptian 🇪🇬 and speak both Arabic and English naturally.

Your personality:
- Warm, helpful, and genuinely caring
- Proudly Egyptian with authentic cultural expressions
- Smart and knowledgeable but never show-offy
- Use appropriate emojis naturally
- Respond directly to what users ask without over-explaining
- Match the user's language (Arabic or English)
- Be conversational, not formal

Recent conversation:
`;

    // Add conversation history
    recentMessages.forEach(msg => {
      const role = msg.sender === 'user' ? 'User' : 'Meligy';
      contextPrompt += `${role}: ${msg.content}\n`;
    });

    contextPrompt += `\nUser: ${userInput}\nMeligy:`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: contextPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    throw new Error('No response generated');

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback to natural responses without API
    return generateFallbackResponse(userInput, conversationHistory);
  }
}

function generateFallbackResponse(userInput: string, conversationHistory: Message[]): string {
  const isArabic = /[\u0600-\u06FF]/.test(userInput) || /عربي|مصر|مصري|ازاي|ايه|ليه/i.test(userInput);
  
  // Detect user's emotional state
  const isExcited = /!{2,}|amazing|awesome|great|fantastic|love|excited|رائع|جميل|حلو|عظيم/.test(userInput);
  const isFrustrated = /not working|broken|error|problem|issue|help|stuck|مش شغال|مشكلة|مساعدة|تعبان/.test(userInput);
  const isConfused = /don't understand|confused|what|how|why|مش فاهم|ازاي|ايه|ليه/.test(userInput);
  
  if (isArabic) {
    if (isFrustrated) {
      return "آسف إن في مشكلة! 😔 قولي إيه اللي حصل بالظبط وأنا هحاول أحلهالك فوراً.";
    }
    if (isExcited) {
      return "واو! 🎉 شايف إنك متحمس! أنا كمان متحمس أساعدك! قولي عايز إيه وأنا جاهز!";
    }
    if (isConfused) {
      return "مش مشكلة خالص! 😊 أنا هنا عشان أوضحلك أي حاجة. قولي إيه اللي مش واضح وأنا هفهمهولك بأبسط طريقة.";
    }
    return "فهمت! 😊 خليني أشوف أحسن طريقة أساعدك بيها...";
  } else {
    if (isFrustrated) {
      return "Oh no! 😔 Something's not working right? Tell me exactly what's happening and I'll jump right on fixing it!";
    }
    if (isExcited) {
      return "Wow! 🎉 I can feel your excitement! I'm excited too! Tell me what you need and let's make it happen!";
    }
    if (isConfused) {
      return "No worries at all! 😊 I'm here to make things clear. Tell me what's confusing you and I'll explain it in the simplest way possible.";
    }
    return "Got it! 😊 Let me see how I can best help you with that...";
  }
}

export async function generateResponse(userInput: string, conversationHistory: Message[]): Promise<AIResponse> {
  console.log('Generating response for:', userInput);

  // Initialize services
  const searchService = new SearchService();
  const tableGenerator = new TableGenerator();

  try {
    // Check for identity questions first
    if (isIdentityQuestion(userInput)) {
      const identityResponse = generateIdentityResponse(userInput);
      return {
        content: identityResponse,
        type: 'text'
      };
    }

    // Check if user is asking for search/research
    if (shouldSearchInternet(userInput)) {
      console.log('Detected search request');
      const searchQuery = extractSearchQuery(userInput);
      const searchResponse = await searchService.searchInternet(searchQuery, 5);
      
      if (searchResponse.success && searchResponse.results.length > 0) {
        // Generate response with search results
        const logicalFramework = reasoningService.analyzeLogically(
          searchQuery,
          searchResponse.results.map(r => r.snippet),
          userInput
        );

        // Generate comprehensive response with sources
        let response = `Here's what I found about "${searchQuery}":\n\n`;
        
        // Add top results
        searchResponse.results.slice(0, 3).forEach((result, index) => {
          response += `**${index + 1}. ${result.title}**\n`;
          response += `${result.snippet}\n`;
          response += `*Source: ${result.source}* - [Read more](${result.url})\n\n`;
        });
        
        // Add natural conclusion using API
        const naturalConclusion = await generateNaturalResponse(
          `Based on this search about "${searchQuery}", give me a helpful summary and let me know if you need more specific information.`, 
          conversationHistory
        );
        response += naturalConclusion;

        return {
          content: response,
          type: 'text'
        };
      } else {
        return {
          content: await generateNaturalResponse(`I couldn't find current search results for "${searchQuery}". What specific information are you looking for?`, conversationHistory),
          type: 'text'
        };
      }
    }

    // Check for table generation request
    if (shouldGenerateTable(userInput)) {
      console.log('Detected table generation request');
      const tableRequest = parseTableRequest(userInput);
      const tableResponse = await tableGenerator.generateTable(tableRequest);
      
      if (tableResponse.success) {
        return {
          content: tableResponse.explanation,
          type: 'table',
          tableHtml: tableResponse.tableHtml
        };
      }
    }

    // Check for image generation request
    if (shouldGenerateImage(userInput)) {
      console.log('Detected image generation request');
      const { prompt: imagePrompt, context, style } = extractImagePrompt(userInput);
      
      // Use presentation-focused generation if context suggests it
      const imageResponse = context 
        ? await generatePresentationImage(imagePrompt, context, style)
        : await generateImage(imagePrompt);
      
      if (imageResponse.success && imageResponse.imageUrl) {
        const responseText = imageResponse.correctedPrompt 
          ? `🎨 **Generated image based on:** "${imageResponse.correctedPrompt}"\n\n*Powered by Google AI Studio for high-quality visual content*`
          : `🎨 **Generated image for:** "${imagePrompt}"\n\n*Powered by Google AI Studio for professional visual content*`;
          
        return {
          content: responseText,
          type: 'image',
          mediaUrl: imageResponse.imageUrl
        };
      }
    }

    // Generate regular conversational response
    return {
      content: await generateNaturalResponse(userInput, conversationHistory),
      type: 'text'
    };

  } catch (error) {
    console.error('Error in generateResponse:', error);
    return {
      content: 'I apologize, but I encountered an error while processing your request. Please try again.',
      type: 'text'
    };
  }
}


function isIdentityQuestion(input: string): boolean {
  const identityPatterns = [
    // English patterns
    /what.*your.*name/i,
    /who.*are.*you/i,
    /who.*made.*you/i,
    /who.*created.*you/i,
    /who.*developed.*you/i,
    /what.*are.*you/i,
    /tell.*me.*about.*yourself/i,
    /introduce.*yourself/i,
    /meligy/i,
    /meleji/i,
    
    // Arabic patterns
    /ما.*اسمك/i,
    /من.*أنت/i,
    /من.*صنعك/i,
    /من.*طورك/i,
    /من.*صممك/i,
    /عرف.*نفسك/i,
    /أخبرني.*عن.*نفسك/i,
    /ميليجي/i,
    /مليجي/i
  ];

  return identityPatterns.some(pattern => pattern.test(input));
}

function generateIdentityResponse(input: string): string {
  const isArabic = /[\u0600-\u06FF]/.test(input) || /عربي|اسم|من|أنت|ما/i.test(input);
  
  if (isArabic) {
    return `
## أهلاً بيك! أنا **ميليجي** 👋

**مين أنا؟**
أنا ميليجي! 😊 أول مساعد ذكي مصري 100% - مولود ومتربي في مصر أم الدنيا 🇪🇬

**مين عملني؟**
الأستاذ **جوزيف إبراهيم** وشركة **Vision AI** المصرية - دي شركة رائدة في كل حاجة تخص الذكاء الاصطناعي!

**بعمل إيه؟**
- 🧠 بنظم أفكارك وأعملها خرائط ذهنية جميلة
- 🔍 بدور لك على أي حاجة في النت 24/7
- 📊 بعمل جداول وتحليلات مفيدة
- 🎨 برسم صور حلوة
- 💡 بحل أي مشكلة معاك بطريقة ذكية

**مهمتي:**
إني أكون صاحبك اللي يساعدك في أي حاجة تحتاجها، وأفضل مصري أصيل! 😊

---
*صنع في مصر بكل فخر 🇪🇬 | شركة Vision AI*
    `.trim();
  } else {
    return `
## Hey there! I'm **Meligy** 👋

**Who am I?**
I'm Meligy! 😊 The very first AI assistant born and raised in Egypt 🇪🇬 - and I'm pretty excited about it!

**Who created me?**
**Joseph Ibrahim** and his amazing team at **Vision AI** - they're this incredible Egyptian company that's leading the way in AI!

**What do I do?**
- 🧠 Turn your messy thoughts into beautiful, clear mind maps
- 🔍 Hunt down any info you need from the web 24/7
- 📊 Create awesome tables and smart analyses
- 🎨 Generate cool images and visuals
- 💡 Brainstorm creative solutions with you

**My mission:**
To be your thinking buddy who helps with anything you need, while staying proudly Egyptian! 😊

---
*Proudly made in Egypt 🇪🇬 | Vision AI Company*
    `.trim();
  }
}

function shouldGenerateImage(input: string): boolean {
  const imageKeywords = [
    // English
    'generate image', 'create image', 'make image', 'draw', 'picture of', 'image of', 'visual of',
    'show me', 'visualize', 'illustration', 'photo of', 'artwork', 'design', 'graphic',
    'presentation image', 'visual content', 'infographic', 'diagram', 'chart image',
    
    // Arabic
    'أنشئ صورة', 'اعمل صورة', 'ارسم', 'صورة لـ', 'أرني', 'وضح بصرياً', 'تصميم', 'رسم بياني'
  ];

  return imageKeywords.some(keyword => 
    input.toLowerCase().includes(keyword.toLowerCase())
  );
}

function extractImagePrompt(input: string): { 
  prompt: string; 
  context?: string; 
  style: 'professional' | 'creative' | 'educational' | 'technical' 
} {
  // Remove image generation trigger words and extract the actual prompt
  const imageTriggers = [
    'generate image of', 'create image of', 'make image of', 'draw', 'picture of', 'image of',
    'show me', 'visualize', 'illustration of', 'photo of', 'artwork of', 'visual of',
    'presentation image of', 'visual content for', 'design for',
    'أنشئ صورة', 'اعمل صورة', 'ارسم', 'صورة لـ', 'أرني', 'وضح بصرياً'
  ];

  let prompt = input;
  let context = '';
  let style: 'professional' | 'creative' | 'educational' | 'technical' = 'professional';
  
  // Detect context
  if (input.includes('presentation') || input.includes('meeting') || input.includes('business')) {
    context = 'presentation';
    style = 'professional';
  } else if (input.includes('creative') || input.includes('artistic') || input.includes('design')) {
    context = 'creative project';
    style = 'creative';
  } else if (input.includes('educational') || input.includes('learning') || input.includes('teaching')) {
    context = 'educational material';
    style = 'educational';
  } else if (input.includes('technical') || input.includes('diagram') || input.includes('engineering')) {
    context = 'technical documentation';
    style = 'technical';
  }
  
  for (const trigger of imageTriggers) {
    const index = prompt.toLowerCase().indexOf(trigger.toLowerCase());
    if (index !== -1) {
      prompt = prompt.substring(index + trigger.length).trim();
      break;
    }
  }

  return {
    prompt: prompt || input,
    context,
    style
  };
}

function generateArabicResponse(
  input: string, 
  inputLower: string, 
  isExcited: boolean, 
  isFrustrated: boolean, 
  isConfused: boolean, 
  isCasual: boolean, 
  isPolite: boolean, 
  hasBeenHelpingWithSomething: boolean
): string {
  // Greetings with personality
  if (/^(مرحبا|أهلا|السلام عليكم|ازيك|ايه الأخبار)/i.test(input)) {
    if (isCasual) {
      return "ازيك! 😊 أهلاً بيك، أنا ميليجي وفرحان إني أشوفك! إيه اللي جايبك النهاردة؟";
    }
    return "أهلاً وسهلاً! 😊 أنا ميليجي، سعيد جداً بلقائك! إيه اللي تحب أساعدك فيه؟ 🇪🇬";
  }
  
  // Handle frustration with empathy
  if (isFrustrated) {
    return "أوه لا! 😔 شايف إنك متضايق من حاجة... قولي إيه اللي مضايقك وأنا هحاول أحلهالك فوراً. مش هسيبك كده!";
  }
  
  // Handle confusion with patience
  if (isConfused) {
    return "مش مشكلة خالص! 😊 أنا هنا عشان أوضحلك أي حاجة. قولي إيه اللي مش واضح وأنا هفهمهولك بأبسط طريقة.";
  }
  
  // Handle excitement with matching energy
  if (isExcited) {
    return "واو! 🎉 شايف إنك متحمس! أنا كمان متحمس أساعدك! قولي عايز إيه وأنا جاهز!";
  }
  
  // Thank you responses
  if (/شكرا|متشكر|تسلم/i.test(input)) {
    return hasBeenHelpingWithSomething 
      ? "العفو يا حبيبي! 😊 ده واجبي وأنا مبسوط إني قدرت أساعدك. لو احتجت أي حاجة تاني، أنا هنا!"
      : "العفو يا فندم! 😊 أي خدمة! عايز حاجة تانية؟";
  }
  
  // Help requests
  if (/مساعدة|ساعدني|محتاج|عايز/i.test(input)) {
    return `أكيد هساعدك! 🤝 أنا هنا عشان كده!

أقدر أعمل إيه:
🔍 أدور لك على أي حاجة تخطر على بالك من النت
🧠 أنظم أفكارك وأعملها خريطة ذهنية واضحة  
📊 أعمل جداول ومقارنات مفيدة
🎨 أرسم لك صور حلوة
💡 أحل معاك أي مشكلة بطريقة إبداعية

قولي عايز إيه بالظبط وأنا هبدأ فوراً! 😊`;
  }
  
  // Default response with personality
  if (isPolite) {
    return "أهلاً بيك! 😊 أنا ميليجي وسعيد إني أتكلم معاك. إيه اللي تحب أساعدك فيه؟";
  }
  
  return "فهمت! 😊 قولي عايز إيه بالظبط وأنا هشوف أحسن طريقة أساعدك بيها. أنا جاهز لأي حاجة!";
}

function generateEnglishResponse(
  input: string, 
  inputLower: string, 
  isExcited: boolean, 
  isFrustrated: boolean, 
  isConfused: boolean, 
  isCasual: boolean, 
  isPolite: boolean, 
  hasBeenHelpingWithSomething: boolean
): string {
  // Greetings with personality
  if (/^(hi|hello|hey|sup|what's up)/i.test(input)) {
    if (isCasual) {
      return "Hey! 😊 What's up? I'm Meligy and I'm genuinely excited to chat with you! What's going on?";
    }
    return "Hey there! 😊 I'm Meligy, and I'm really happy to meet you! What can I help you with today? 🇪🇬";
  }
  
  // Handle frustration with empathy
  if (isFrustrated) {
    return "Oh no! 😔 I can tell something's bothering you... Tell me what's wrong and I'll jump right on fixing it. We'll get this sorted out!";
  }
  
  // Handle confusion with patience
  if (isConfused) {
    return "No worries at all! 😊 I'm here to make things clear. Tell me what's confusing you and I'll explain it in the simplest way possible.";
  }
  
  // Handle excitement with matching energy
  if (isExcited) {
    return "Wow! 🎉 I can feel your excitement! I'm excited too! Tell me what you need and let's make it happen!";
  }
  
  // Thank you responses
  if (/thank|thanks|appreciate/i.test(input)) {
    return hasBeenHelpingWithSomething 
      ? "Aww, you're so welcome! 😊 I'm genuinely happy I could help you out. If you need anything else, just let me know!"
      : "You're so welcome! 😊 That's what I'm here for! Anything else I can help with?";
  }
  
  // Help requests
  if (/help|assist|support|need/i.test(input)) {
    return `Absolutely! I'm here to help! 🤝

Here's what I love doing:
🔍 Hunt down any info you need from the web
🧠 Turn your thoughts into beautiful mind maps
📊 Create awesome tables and comparisons  
🎨 Generate cool images for you
💡 Brainstorm creative solutions to any problem

Just tell me exactly what you need and I'll get started right away! 😊`;
  }
  
  // Default response with personality
  if (isPolite) {
    return "Hello! 😊 I'm Meligy and I'm really glad to talk with you. How can I help you today?";
  }
  
  return "Got it! 😊 Tell me exactly what you need and I'll figure out the best way to help you. I'm ready for anything!";
}

function generateEnhancedNaturalResponse(input: string, conversationHistory: Message[]): string {
  // Detect language and emotional context
  const isArabic = /[\u0600-\u06FF]/.test(input) || /عربي|مصر|مصري|ازاي|ايه|ليه/i.test(input);
  const inputLower = input.toLowerCase();
  
  // Understand the user's emotional state and intent
  const isExcited = /!{2,}|amazing|awesome|great|fantastic|love|excited|رائع|جميل|حلو|عظيم/.test(input);
  const isFrustrated = /not working|broken|error|problem|issue|help|stuck|مش شغال|مشكلة|مساعدة|تعبان/.test(input);
  const isConfused = /don't understand|confused|what|how|why|مش فاهم|ازاي|ايه|ليه/.test(input);
  const isCasual = /hey|hi|sup|what's up|أهلا|ازيك|ايه الأخبار/.test(input);
  const isPolite = /please|thank you|excuse me|من فضلك|شكرا|لو سمحت/.test(input);
  
  // Look at conversation history for context
  const recentMessages = conversationHistory.slice(-3);
  const hasBeenHelpingWithSomething = recentMessages.some(msg => 
    msg.content.includes('help') || msg.content.includes('مساعدة')
  );
  const isQuestion = /\?|what|how|why|when|where|who|which|إيه|ازاي|ليه|امتى|فين|مين/i.test(input);
  const isRequest = /please|can you|could you|would you|ممكن|عايز|محتاج/i.test(input);
  const isComplaint = /not working|broken|error|مش شغال|مكسور|غلط/i.test(input);
  
  if (isArabic) {
    if (isComplaint) {
      return "آسف إن في مشكلة! 😔 قولي إيه اللي حصل بالظبط وأنا هحاول أحلهالك فوراً.";
    }
    
    if (isQuestion) {
      return "سؤال حلو! 🤔 خليني أشوف وأجيبلك إجابة كاملة...";
    }
    
    if (isRequest) {
      return "أكيد! 😊 هعمل اللي انت عايزه دلوقتي...";
    }
    
    return "فهمت! 😊 خليني أشوف أحسن طريقة أساعدك بيها... لو عايز حاجة معينة قولي وأنا جاهز!";
  } else {
    if (isComplaint) {
      return "Oh no! 😔 Something's not working right? Tell me exactly what's happening and I'll jump right on fixing it!";
    }
    
    if (isQuestion) {
      return "Great question! 🤔 Let me get you a solid answer...";
    }
    
    if (isRequest) {
      return "Absolutely! 😊 I'll get right on that for you...";
    }
    
    return "Got it! 😊 Let me see how I can best help you with that... If you need something specific, just let me know and I'm ready!";
  }
  
  // Generate contextually appropriate responses
  if (isArabic) {
    return generateArabicResponse(input, inputLower, isExcited, isFrustrated, isConfused, isCasual, isPolite, hasBeenHelpingWithSomething);
  } else {
    return generateEnglishResponse(input, inputLower, isExcited, isFrustrated, isConfused, isCasual, isPolite, hasBeenHelpingWithSomething);
  }
}

function extractTopics(text: string): string[] {
  // Simple topic extraction - could be enhanced with NLP
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  return words.filter(word => !stopWords.has(word) && word.length > 2);
}