import { Message } from '../components/ChatMessage';

interface UserPattern {
  keywords: string[];
  responses: string[];
  frequency: number;
  lastUsed: string;
  context: string[];
}

interface LearningData {
  userPatterns: Record<string, UserPattern>;
  conversationHistory: Message[];
  preferences: {
    language: string;
    responseStyle: 'formal' | 'casual' | 'technical';
    topics: Record<string, number>;
  };
  personalInfo: Record<string, string>;
  lastUpdated: string;
}

export class LearningSystem {
  private storageKey = 'meleji-learning-data';
  private learningData: LearningData;

  constructor() {
    this.learningData = this.loadLearningData();
  }

  private loadLearningData(): LearningData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading learning data:', error);
    }

    return {
      userPatterns: {},
      conversationHistory: [],
      preferences: {
        language: 'en',
        responseStyle: 'casual',
        topics: {}
      },
      personalInfo: {},
      lastUpdated: new Date().toISOString()
    };
  }

  private saveLearningData(): void {
    try {
      this.learningData.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.learningData));
    } catch (error) {
      console.error('Error saving learning data:', error);
    }
  }

  public learnFromInteraction(userInput: string, conversationHistory: Message[]): void {
    // Extract keywords and patterns
    const keywords = this.extractKeywords(userInput);
    const language = this.detectLanguage(userInput);
    const topics = this.extractTopics(userInput);
    
    // Update language preference
    if (language !== this.learningData.preferences.language) {
      this.learningData.preferences.language = language;
    }

    // Update topic interests
    topics.forEach(topic => {
      this.learningData.preferences.topics[topic] = 
        (this.learningData.preferences.topics[topic] || 0) + 1;
    });

    // Learn user patterns
    const patternKey = keywords.slice(0, 3).join('-').toLowerCase();
    if (patternKey) {
      if (!this.learningData.userPatterns[patternKey]) {
        this.learningData.userPatterns[patternKey] = {
          keywords,
          responses: [],
          frequency: 0,
          lastUsed: new Date().toISOString(),
          context: []
        };
      }

      this.learningData.userPatterns[patternKey].frequency += 1;
      this.learningData.userPatterns[patternKey].lastUsed = new Date().toISOString();
      
      // Add context from recent conversation
      const recentContext = conversationHistory.slice(-2).map(msg => msg.content);
      this.learningData.userPatterns[patternKey].context = 
        [...new Set([...this.learningData.userPatterns[patternKey].context, ...recentContext])].slice(-5);
    }

    // Extract personal information
    this.extractPersonalInfo(userInput);

    // Determine response style preference
    this.updateResponseStylePreference(userInput);

    this.saveLearningData();
  }

  public learnFromResponse(response: string, userInput: string, conversationHistory: Message[]): void {
    const keywords = this.extractKeywords(userInput);
    const patternKey = keywords.slice(0, 3).join('-').toLowerCase();
    
    if (patternKey && this.learningData.userPatterns[patternKey]) {
      // Store successful responses for pattern matching
      this.learningData.userPatterns[patternKey].responses.push(response);
      
      // Keep only the most recent 3 responses per pattern
      if (this.learningData.userPatterns[patternKey].responses.length > 3) {
        this.learningData.userPatterns[patternKey].responses = 
          this.learningData.userPatterns[patternKey].responses.slice(-3);
      }
    }

    this.saveLearningData();
  }

  public getPersonalizedContext(): string {
    const { preferences, personalInfo } = this.learningData;
    
    let context = `User preferences: Language: ${preferences.language}, Style: ${preferences.responseStyle}. `;
    
    // Add top interests
    const topTopics = Object.entries(preferences.topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
    
    if (topTopics.length > 0) {
      context += `Interested in: ${topTopics.join(', ')}. `;
    }

    // Add personal info if available
    const personalContext = Object.entries(personalInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    if (personalContext) {
      context += `Personal info: ${personalContext}. `;
    }

    return context;
  }

  public getSimilarPatterns(userInput: string): UserPattern[] {
    const keywords = this.extractKeywords(userInput);
    const patterns = Object.values(this.learningData.userPatterns);
    
    return patterns
      .filter(pattern => {
        const commonKeywords = pattern.keywords.filter(k => 
          keywords.some(uk => uk.toLowerCase().includes(k.toLowerCase()) || 
                             k.toLowerCase().includes(uk.toLowerCase()))
        );
        return commonKeywords.length > 0;
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);
  }

  private extractKeywords(text: string): string[] {
    // Remove common stop words and extract meaningful keywords
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords
  }

  private detectLanguage(text: string): string {
    // Simple language detection based on character patterns
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u0400-\u04FF]/.test(text)) return 'ru';
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    
    // European language detection based on common words
    if (/\b(el|la|los|las|un|una|y|o|pero|con|en|de|para|por|que|como|muy|más|también|sí|no)\b/i.test(text)) return 'es';
    if (/\b(le|la|les|un|une|et|ou|mais|avec|dans|de|pour|par|que|comme|très|plus|aussi|oui|non)\b/i.test(text)) return 'fr';
    if (/\b(der|die|das|ein|eine|und|oder|aber|mit|in|von|für|durch|dass|wie|sehr|mehr|auch|ja|nein)\b/i.test(text)) return 'de';
    if (/\b(il|la|gli|le|un|una|e|o|ma|con|in|di|per|da|che|come|molto|più|anche|sì|no)\b/i.test(text)) return 'it';
    if (/\b(o|a|os|as|um|uma|e|ou|mas|com|em|de|para|por|que|como|muito|mais|também|sim|não)\b/i.test(text)) return 'pt';
    
    return 'en'; // Default to English
  }

  private extractTopics(text: string): string[] {
    const topicKeywords = {
      technology: ['computer', 'software', 'programming', 'code', 'tech', 'ai', 'machine learning', 'data'],
      science: ['research', 'study', 'experiment', 'theory', 'hypothesis', 'analysis', 'scientific'],
      health: ['health', 'medical', 'doctor', 'medicine', 'fitness', 'exercise', 'nutrition'],
      education: ['learn', 'study', 'school', 'university', 'course', 'education', 'teaching'],
      business: ['work', 'job', 'career', 'business', 'company', 'management', 'finance'],
      entertainment: ['movie', 'music', 'game', 'book', 'art', 'entertainment', 'fun'],
      travel: ['travel', 'trip', 'vacation', 'country', 'city', 'culture', 'tourism'],
      food: ['food', 'cooking', 'recipe', 'restaurant', 'cuisine', 'meal', 'eat']
    };

    const topics: string[] = [];
    const lowerText = text.toLowerCase();

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  private extractPersonalInfo(text: string): void {
    // Extract name patterns
    const nameMatch = text.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z]+)/i);
    if (nameMatch) {
      this.learningData.personalInfo.name = nameMatch[1];
    }

    // Extract age patterns
    const ageMatch = text.match(/(?:i'm|i am|my age is)\s+(\d+)(?:\s+years?\s+old)?/i);
    if (ageMatch) {
      this.learningData.personalInfo.age = ageMatch[1];
    }

    // Extract location patterns
    const locationMatch = text.match(/(?:i live in|i'm from|from)\s+([a-zA-Z\s]+)/i);
    if (locationMatch) {
      this.learningData.personalInfo.location = locationMatch[1].trim();
    }

    // Extract profession patterns
    const professionMatch = text.match(/(?:i work as|i'm a|i am a|my job is)\s+([a-zA-Z\s]+)/i);
    if (professionMatch) {
      this.learningData.personalInfo.profession = professionMatch[1].trim();
    }
  }

  private updateResponseStylePreference(text: string): void {
    // Detect formal language patterns
    const formalIndicators = ['please', 'thank you', 'could you', 'would you', 'may i', 'excuse me'];
    const casualIndicators = ['hey', 'hi', 'yeah', 'ok', 'cool', 'awesome', 'lol'];
    const technicalIndicators = ['algorithm', 'function', 'variable', 'parameter', 'implementation', 'optimization'];

    const lowerText = text.toLowerCase();
    
    let formalScore = formalIndicators.filter(indicator => lowerText.includes(indicator)).length;
    let casualScore = casualIndicators.filter(indicator => lowerText.includes(indicator)).length;
    let technicalScore = technicalIndicators.filter(indicator => lowerText.includes(indicator)).length;

    if (technicalScore > Math.max(formalScore, casualScore)) {
      this.learningData.preferences.responseStyle = 'technical';
    } else if (formalScore > casualScore) {
      this.learningData.preferences.responseStyle = 'formal';
    } else if (casualScore > 0) {
      this.learningData.preferences.responseStyle = 'casual';
    }
  }

  public getLearningStats(): {
    totalPatterns: number;
    totalInteractions: number;
    topTopics: Array<[string, number]>;
    preferredLanguage: string;
    responseStyle: string;
  } {
    const patterns = Object.values(this.learningData.userPatterns);
    const totalInteractions = patterns.reduce((sum, pattern) => sum + pattern.frequency, 0);
    const topTopics = Object.entries(this.learningData.preferences.topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalPatterns: patterns.length,
      totalInteractions,
      topTopics,
      preferredLanguage: this.learningData.preferences.language,
      responseStyle: this.learningData.preferences.responseStyle
    };
  }

  public clearLearningData(): void {
    localStorage.removeItem(this.storageKey);
    this.learningData = {
      userPatterns: {},
      conversationHistory: [],
      preferences: {
        language: 'en',
        responseStyle: 'casual',
        topics: {}
      },
      personalInfo: {},
      lastUpdated: new Date().toISOString()
    };
  }
}