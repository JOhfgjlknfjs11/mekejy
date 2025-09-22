interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore: number;
}

interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  query: string;
  totalResults: number;
  searchTime: number;
  error?: string;
}

interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchResult[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
}

interface LogicalAnalysis {
  premises: string[];
  reasoning: string[];
  conclusion: string;
  evidenceStrength: 'weak' | 'moderate' | 'strong';
  logicalFallacies: string[];
  counterArguments: string[];
}

export class SearchService {
  private readonly searchAPIs = [
    {
      name: 'Google Custom Search',
      baseUrl: 'https://www.googleapis.com/customsearch/v1',
      searchUrl: (query: string) => {
        // Note: In production, you would use environment variables for API keys
        const apiKey = 'YOUR_GOOGLE_API_KEY'; // This would be from environment variables
        const searchEngineId = 'YOUR_SEARCH_ENGINE_ID'; // This would be from environment variables
        return `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;
      }
    },
    {
      name: 'DuckDuckGo Instant Answer',
      baseUrl: 'https://api.duckduckgo.com/',
      searchUrl: (query: string) => `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    },
    {
      name: 'Wikipedia API',
      baseUrl: 'https://en.wikipedia.org/api/rest_v1/',
      searchUrl: (query: string) => `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    }
  ];

  public async searchInternet(query: string, maxResults: number = 5): Promise<SearchResponse> {
    const startTime = Date.now();
    
    try {
      console.log('Starting internet search for:', query);
      
      // Try multiple search approaches
      const results = await Promise.allSettled([
        this.searchGoogle(query),
        this.searchDuckDuckGo(query),
        this.searchWikipedia(query),
        this.searchOpenSources(query)
      ]);

      const allResults: SearchResult[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          allResults.push(...result.value);
        }
      });

      // Remove duplicates and rank by relevance
      const uniqueResults = this.removeDuplicates(allResults);
      const rankedResults = this.rankByRelevance(uniqueResults, query);
      const topResults = rankedResults.slice(0, maxResults);

      const searchTime = Date.now() - startTime;

      return {
        success: true,
        results: topResults,
        query,
        totalResults: topResults.length,
        searchTime
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        results: [],
        query,
        totalResults: 0,
        searchTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown search error'
      };
    }
  }

  private async searchGoogle(query: string): Promise<SearchResult[]> {
    try {
      // Note: This is a placeholder for Google Custom Search API integration
      // In production, you would need to:
      // 1. Get a Google Custom Search API key
      // 2. Create a Custom Search Engine
      // 3. Store credentials in environment variables
      
      console.log('Google Search API integration would be implemented here');
      
      // For now, return enhanced DuckDuckGo results as fallback
      return await this.searchDuckDuckGoEnhanced(query);
      
    } catch (error) {
      console.error('Google search error:', error);
      return [];
    }
  }

  private async searchDuckDuckGoEnhanced(query: string): Promise<SearchResult[]> {
    try {
      const url = this.searchAPIs[1].searchUrl(query);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      const results: SearchResult[] = [];

      // Process instant answer with enhanced formatting
      if (data.Abstract && data.Abstract.length > 0) {
        results.push({
          title: data.Heading || 'Comprehensive Overview',
          url: data.AbstractURL || 'https://duckduckgo.com',
          snippet: this.enhanceSnippet(data.Abstract),
          source: 'DuckDuckGo Knowledge',
          relevanceScore: 0.95
        });
      }

      // Process definition if available
      if (data.Definition && data.Definition.length > 0) {
        results.push({
          title: 'Definition',
          url: data.DefinitionURL || 'https://duckduckgo.com',
          snippet: this.enhanceSnippet(data.Definition),
          source: 'Dictionary',
          relevanceScore: 0.9
        });
      }

      // Process related topics with better formatting
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 4).forEach((topic: any, index: number) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: this.extractTitle(topic.Text) || `Related Topic ${index + 1}`,
              url: topic.FirstURL,
              snippet: this.enhanceSnippet(topic.Text),
              source: 'Related Information',
              relevanceScore: 0.7 - (index * 0.1)
            });
          }
        });
      }

      // Process answer if available
      if (data.Answer && data.Answer.length > 0) {
        results.push({
          title: 'Direct Answer',
          url: data.AnswerURL || 'https://duckduckgo.com',
          snippet: this.enhanceSnippet(data.Answer),
          source: 'Quick Answer',
          relevanceScore: 0.85
        });
      }

      return results;
    } catch (error) {
      console.error('Enhanced DuckDuckGo search error:', error);
      return [];
    }
  }

  private enhanceSnippet(text: string): string {
    // Clean and enhance snippet text
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200) + (text.length > 200 ? '...' : '');
  }

  private extractTitle(text: string): string {
    // Extract title from text (usually before the first dash or period)
    const match = text.match(/^([^-\.]+)/);
    return match ? match[1].trim() : text.slice(0, 50);
  }

  private async searchDuckDuckGo(query: string): Promise<SearchResult[]> {
    try {
      const url = this.searchAPIs[0].searchUrl(query);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      const results: SearchResult[] = [];

      // Process instant answer
      if (data.Abstract && data.Abstract.length > 0) {
        results.push({
          title: data.Heading || 'DuckDuckGo Instant Answer',
          url: data.AbstractURL || 'https://duckduckgo.com',
          snippet: data.Abstract,
          source: 'DuckDuckGo',
          relevanceScore: 0.9
        });
      }

      // Process related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || 'Related Topic',
              url: topic.FirstURL,
              snippet: topic.Text,
              source: 'DuckDuckGo',
              relevanceScore: 0.7
            });
          }
        });
      }

      return results;
    } catch (error) {
      console.error('DuckDuckGo search error:', error);
      return [];
    }
  }

  private async searchWikipedia(query: string): Promise<SearchResult[]> {
    try {
      // First, search for the page
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        throw new Error(`Wikipedia search error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const results: SearchResult[] = [];

      if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
        // Get the top 2 results
        const topPages = searchData.query.search.slice(0, 2);
        
        for (const page of topPages) {
          try {
            // Get page summary
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`;
            const summaryResponse = await fetch(summaryUrl);
            
            if (summaryResponse.ok) {
              const summaryData = await summaryResponse.json();
              
              results.push({
                title: summaryData.title || page.title,
                url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
                snippet: summaryData.extract || page.snippet || 'Wikipedia article',
                source: 'Wikipedia',
                relevanceScore: 0.8
              });
            }
          } catch (error) {
            console.error('Error fetching Wikipedia summary:', error);
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  private async searchOpenSources(query: string): Promise<SearchResult[]> {
    // This would integrate with other open APIs like:
    // - arXiv for scientific papers
    // - GitHub for code repositories
    // - Stack Overflow for technical questions
    // For now, we'll return curated results based on query type
    
    const results: SearchResult[] = [];
    
    // Detect query type and provide relevant sources
    if (this.isScientificQuery(query)) {
      results.push({
        title: 'Scientific Research Resources',
        url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(query),
        snippet: 'Access peer-reviewed scientific literature and research papers',
        source: 'Google Scholar',
        relevanceScore: 0.85
      });
    }

    if (this.isTechnicalQuery(query)) {
      results.push({
        title: 'Technical Documentation and Solutions',
        url: 'https://stackoverflow.com/search?q=' + encodeURIComponent(query),
        snippet: 'Community-driven technical solutions and programming help',
        source: 'Stack Overflow',
        relevanceScore: 0.8
      });
    }

    if (this.isNewsQuery(query)) {
      results.push({
        title: 'Latest News and Updates',
        url: 'https://news.google.com/search?q=' + encodeURIComponent(query),
        snippet: 'Current news articles and recent developments',
        source: 'Google News',
        relevanceScore: 0.75
      });
    }

    return results;
  }

  private isScientificQuery(query: string): boolean {
    const scientificKeywords = [
      'research', 'study', 'experiment', 'theory', 'hypothesis', 'analysis',
      'scientific', 'medicine', 'biology', 'chemistry', 'physics', 'mathematics',
      'climate', 'environment', 'health', 'disease', 'treatment'
    ];
    
    return scientificKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private isTechnicalQuery(query: string): boolean {
    const technicalKeywords = [
      'programming', 'code', 'software', 'development', 'algorithm',
      'javascript', 'python', 'react', 'api', 'database', 'server',
      'error', 'bug', 'debug', 'function', 'method', 'class'
    ];
    
    return technicalKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private isNewsQuery(query: string): boolean {
    const newsKeywords = [
      'news', 'latest', 'recent', 'current', 'today', 'breaking',
      'update', 'announcement', 'event', 'happening', 'politics',
      'economy', 'world', 'international'
    ];
    
    return newsKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = result.url.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private rankByRelevance(results: SearchResult[], query: string): SearchResult[] {
    const queryWords = query.toLowerCase().split(/\s+/);
    
    return results
      .map(result => {
        let score = result.relevanceScore;
        
        // Boost score based on title relevance
        const titleWords = result.title.toLowerCase().split(/\s+/);
        const titleMatches = queryWords.filter(word => 
          titleWords.some(titleWord => titleWord.includes(word))
        ).length;
        score += (titleMatches / queryWords.length) * 0.3;
        
        // Boost score based on snippet relevance
        const snippetMatches = queryWords.filter(word => 
          result.snippet.toLowerCase().includes(word)
        ).length;
        score += (snippetMatches / queryWords.length) * 0.2;
        
        return { ...result, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public analyzeLogically(topic: string, information: string[]): LogicalAnalysis {
    // Extract premises from the information
    const premises = information.filter(info => 
      info.includes('because') || info.includes('since') || info.includes('given that')
    );

    // Identify reasoning patterns
    const reasoning = [
      'Analyzing available evidence and sources',
      'Applying logical deduction and inductive reasoning',
      'Cross-referencing multiple reliable sources',
      'Evaluating argument strength and validity'
    ];

    // Generate conclusion based on evidence
    const conclusion = this.generateLogicalConclusion(topic, information);

    // Assess evidence strength
    const evidenceStrength = this.assessEvidenceStrength(information);

    // Check for logical fallacies
    const logicalFallacies = this.identifyLogicalFallacies(information);

    // Generate counter-arguments
    const counterArguments = this.generateCounterArguments(topic, information);

    return {
      premises,
      reasoning,
      conclusion,
      evidenceStrength,
      logicalFallacies,
      counterArguments
    };
  }

  private generateLogicalConclusion(topic: string, information: string[]): string {
    if (information.length === 0) {
      return `Based on available information, more research is needed to draw definitive conclusions about ${topic}.`;
    }

    const hasStrongEvidence = information.some(info => 
      info.includes('proven') || info.includes('demonstrated') || info.includes('confirmed')
    );

    if (hasStrongEvidence) {
      return `Based on the available evidence, there is strong support for the claims regarding ${topic}.`;
    } else {
      return `The available information suggests trends and patterns related to ${topic}, though further verification would strengthen these findings.`;
    }
  }

  private assessEvidenceStrength(information: string[]): 'weak' | 'moderate' | 'strong' {
    let score = 0;
    
    information.forEach(info => {
      if (info.includes('peer-reviewed') || info.includes('scientific study')) score += 3;
      if (info.includes('research') || info.includes('data')) score += 2;
      if (info.includes('expert') || info.includes('authority')) score += 2;
      if (info.includes('multiple sources')) score += 2;
      if (info.includes('opinion') || info.includes('believe')) score -= 1;
    });

    if (score >= 6) return 'strong';
    if (score >= 3) return 'moderate';
    return 'weak';
  }

  private identifyLogicalFallacies(information: string[]): string[] {
    const fallacies: string[] = [];
    
    information.forEach(info => {
      const lowerInfo = info.toLowerCase();
      
      if (lowerInfo.includes('everyone knows') || lowerInfo.includes('obviously')) {
        fallacies.push('Appeal to common belief');
      }
      if (lowerInfo.includes('always') || lowerInfo.includes('never')) {
        fallacies.push('False dichotomy or overgeneralization');
      }
      if (lowerInfo.includes('because i said so') || lowerInfo.includes('trust me')) {
        fallacies.push('Appeal to authority without credentials');
      }
    });

    return fallacies;
  }

  private generateCounterArguments(topic: string, information: string[]): string[] {
    return [
      'Alternative interpretations of the data may exist',
      'Additional research might reveal different perspectives',
      'Context and situational factors could influence outcomes',
      'Methodological limitations might affect conclusions'
    ];
  }

  public formatLogicalResponse(
    framework: LogicalFramework,
    searchResults: any[],
    originalQuery: string
  ): string {
    let response = '';

    // Add main answer first
    response += framework.conclusion + '\n\n';

    // Add key information if premises exist
    if (framework.premises.length > 0) {
      response += '**Key Points:**\n';
      framework.premises.slice(0, 3).forEach((premise, index) => {
        response += `• ${premise}\n`;
      });
      response += '\n';
    }

    return response;
  }
}

// Helper functions for detecting search needs
export function shouldSearchInternet(text: string): boolean {
  const searchKeywords = [
    // English
    'search for', 'look up', 'find information', 'research', 'what is', 'tell me about',
    'latest news', 'current', 'recent', 'update on', 'information about',
    
    // Arabic
    'ابحث عن', 'ابحث لي', 'معلومات عن', 'ما هو', 'أخبرني عن', 'آخر الأخبار',
    
    // Spanish
    'buscar', 'busca información', 'qué es', 'dime sobre', 'últimas noticias',
    
    // French
    'rechercher', 'chercher des informations', 'qu\'est-ce que', 'dis-moi sur', 'dernières nouvelles',
    
    // German
    'suchen nach', 'informationen finden', 'was ist', 'erzähl mir über', 'neueste nachrichten',
    
    // Other patterns
    'how does', 'why does', 'when did', 'where is', 'who is', 'which'
  ];

  return searchKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

export function extractSearchQuery(text: string): string {
  // Remove search trigger words and extract the actual query
  const searchTriggers = [
    'search for', 'look up', 'find information about', 'research', 'tell me about',
    'what is', 'who is', 'where is', 'when did', 'how does', 'why does',
    'ابحث عن', 'معلومات عن', 'ما هو', 'أخبرني عن',
    'buscar', 'qué es', 'dime sobre',
    'rechercher', 'qu\'est-ce que', 'dis-moi sur',
    'suchen nach', 'was ist', 'erzähl mir über'
  ];

  let query = text;
  
  for (const trigger of searchTriggers) {
    const index = query.toLowerCase().indexOf(trigger.toLowerCase());
    if (index !== -1) {
      query = query.substring(index + trigger.length).trim();
      break;
    }
  }

  // Clean up the query
  query = query.replace(/[?!.]+$/, '').trim();
  
  return query || text;
}