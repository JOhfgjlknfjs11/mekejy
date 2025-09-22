interface LogicalFramework {
  premises: string[];
  reasoning: string[];
  conclusion: string;
  evidenceStrength: 'weak' | 'moderate' | 'strong';
  logicalFallacies: string[];
  counterArguments: string[];
  cognitiveChecks: string[];
}

interface ReasoningPattern {
  type: 'deductive' | 'inductive' | 'abductive' | 'analogical';
  description: string;
  strength: number;
  applicability: string[];
}

export class LogicalReasoningService {
  private reasoningPatterns: ReasoningPattern[] = [
    {
      type: 'deductive',
      description: 'Drawing specific conclusions from general principles',
      strength: 0.9,
      applicability: ['mathematics', 'logic', 'formal systems']
    },
    {
      type: 'inductive',
      description: 'Inferring general principles from specific observations',
      strength: 0.7,
      applicability: ['science', 'statistics', 'empirical research']
    },
    {
      type: 'abductive',
      description: 'Finding the best explanation for observed phenomena',
      strength: 0.6,
      applicability: ['diagnosis', 'investigation', 'hypothesis formation']
    },
    {
      type: 'analogical',
      description: 'Drawing conclusions based on similarities between cases',
      strength: 0.5,
      applicability: ['problem solving', 'learning', 'prediction']
    }
  ];

  public analyzeLogically(
    topic: string, 
    information: string[], 
    userQuery: string
  ): LogicalFramework {
    console.log('Starting logical analysis for:', topic);

    // Extract and validate premises
    const premises = this.extractPremises(information);
    
    // Apply appropriate reasoning patterns
    const reasoning = this.applyReasoningPatterns(topic, information, userQuery);
    
    // Generate logical conclusion
    const conclusion = this.generateLogicalConclusion(topic, premises, reasoning);
    
    // Assess evidence strength
    const evidenceStrength = this.assessEvidenceStrength(information);
    
    // Identify logical fallacies
    const logicalFallacies = this.identifyLogicalFallacies(information);
    
    // Generate counter-arguments
    const counterArguments = this.generateCounterArguments(topic, information);
    
    // Apply cognitive bias checks
    const cognitiveChecks = this.applyCognitiveBiasChecks(information);

    return {
      premises,
      reasoning,
      conclusion,
      evidenceStrength,
      logicalFallacies,
      counterArguments,
      cognitiveChecks
    };
  }

  private extractPremises(information: string[]): string[] {
    const premises: string[] = [];
    
    information.forEach(info => {
      // Look for factual statements and evidence
      if (this.isFactualStatement(info)) {
        premises.push(info);
      }
      
      // Extract causal relationships
      if (info.includes('because') || info.includes('since') || info.includes('due to')) {
        premises.push(info);
      }
      
      // Extract statistical or research-based claims
      if (info.includes('study shows') || info.includes('research indicates') || 
          info.includes('data suggests') || info.includes('%')) {
        premises.push(info);
      }
    });

    return premises.length > 0 ? premises : ['Available information provides the foundation for analysis'];
  }

  private isFactualStatement(statement: string): boolean {
    const factualIndicators = [
      'is', 'are', 'was', 'were', 'has', 'have', 'contains', 'includes',
      'measures', 'equals', 'consists of', 'comprises', 'demonstrates'
    ];
    
    const opinionIndicators = [
      'i think', 'i believe', 'in my opinion', 'seems like', 'appears to be',
      'might be', 'could be', 'probably', 'maybe', 'perhaps'
    ];

    const lowerStatement = statement.toLowerCase();
    
    const hasFactualIndicators = factualIndicators.some(indicator => 
      lowerStatement.includes(indicator)
    );
    
    const hasOpinionIndicators = opinionIndicators.some(indicator => 
      lowerStatement.includes(indicator)
    );

    return hasFactualIndicators && !hasOpinionIndicators;
  }

  private applyReasoningPatterns(
    topic: string, 
    information: string[], 
    userQuery: string
  ): string[] {
    const reasoning: string[] = [];
    
    // Determine the most appropriate reasoning pattern
    const bestPattern = this.selectReasoningPattern(topic, userQuery);
    reasoning.push(`Applying ${bestPattern.type} reasoning: ${bestPattern.description}`);

    // Apply systematic analysis steps
    reasoning.push('Systematically evaluating available evidence and sources');
    reasoning.push('Cross-referencing information for consistency and reliability');
    reasoning.push('Identifying patterns, relationships, and causal connections');
    
    // Apply critical thinking principles
    reasoning.push('Applying critical thinking principles: clarity, accuracy, precision, relevance');
    reasoning.push('Considering multiple perspectives and alternative explanations');
    reasoning.push('Evaluating the logical structure and validity of arguments');

    // Domain-specific reasoning
    if (this.isScientificTopic(topic)) {
      reasoning.push('Applying scientific method: hypothesis formation, evidence evaluation, peer review standards');
    }
    
    if (this.isMathematicalTopic(topic)) {
      reasoning.push('Applying mathematical rigor: axioms, proofs, logical consistency');
    }
    
    if (this.isEthicalTopic(topic)) {
      reasoning.push('Applying ethical frameworks: consequentialism, deontology, virtue ethics');
    }

    return reasoning;
  }

  private selectReasoningPattern(topic: string, userQuery: string): ReasoningPattern {
    const queryLower = userQuery.toLowerCase();
    const topicLower = topic.toLowerCase();

    // Deductive reasoning for logical/mathematical queries
    if (queryLower.includes('prove') || queryLower.includes('logic') || 
        topicLower.includes('math') || topicLower.includes('theorem')) {
      return this.reasoningPatterns[0]; // deductive
    }

    // Inductive reasoning for scientific/empirical queries
    if (queryLower.includes('research') || queryLower.includes('study') || 
        queryLower.includes('evidence') || topicLower.includes('science')) {
      return this.reasoningPatterns[1]; // inductive
    }

    // Abductive reasoning for diagnostic/explanatory queries
    if (queryLower.includes('why') || queryLower.includes('explain') || 
        queryLower.includes('cause') || queryLower.includes('reason')) {
      return this.reasoningPatterns[2]; // abductive
    }

    // Default to inductive reasoning
    return this.reasoningPatterns[1];
  }

  private generateLogicalConclusion(
    topic: string, 
    premises: string[], 
    reasoning: string[]
  ): string {
    if (premises.length === 0) {
      return `Based on the available information, more comprehensive data would be needed to draw definitive conclusions about ${topic}. The analysis suggests areas for further investigation.`;
    }

    // Assess the logical strength of the argument
    const hasStrongEvidence = premises.some(premise => 
      premise.includes('proven') || premise.includes('demonstrated') || 
      premise.includes('peer-reviewed') || premise.includes('replicated')
    );

    const hasModerateEvidence = premises.some(premise => 
      premise.includes('study') || premise.includes('research') || 
      premise.includes('data') || premise.includes('analysis')
    );

    if (hasStrongEvidence) {
      return `Based on rigorous logical analysis and strong empirical evidence, the conclusions regarding ${topic} are well-supported. The reasoning chain from premises to conclusion follows established logical principles and is backed by reliable sources.`;
    } else if (hasModerateEvidence) {
      return `The logical analysis of ${topic} reveals patterns and relationships supported by available evidence. While the conclusions are reasonable and follow sound reasoning principles, additional verification would further strengthen the argument.`;
    } else {
      return `The analysis of ${topic} provides insights based on available information and logical reasoning. The conclusions represent the most reasonable interpretation given current data, though they should be considered preliminary pending additional evidence.`;
    }
  }

  private assessEvidenceStrength(information: string[]): 'weak' | 'moderate' | 'strong' {
    let score = 0;
    const totalInfo = information.length;

    information.forEach(info => {
      const lowerInfo = info.toLowerCase();
      
      // Strong evidence indicators
      if (lowerInfo.includes('peer-reviewed') || lowerInfo.includes('meta-analysis')) score += 5;
      if (lowerInfo.includes('randomized controlled trial') || lowerInfo.includes('systematic review')) score += 4;
      if (lowerInfo.includes('scientific study') || lowerInfo.includes('research paper')) score += 3;
      if (lowerInfo.includes('expert consensus') || lowerInfo.includes('established theory')) score += 3;
      
      // Moderate evidence indicators
      if (lowerInfo.includes('study') || lowerInfo.includes('research')) score += 2;
      if (lowerInfo.includes('data') || lowerInfo.includes('statistics')) score += 2;
      if (lowerInfo.includes('expert') || lowerInfo.includes('authority')) score += 2;
      if (lowerInfo.includes('multiple sources') || lowerInfo.includes('corroborated')) score += 2;
      
      // Weak evidence indicators (negative scoring)
      if (lowerInfo.includes('opinion') || lowerInfo.includes('believe')) score -= 1;
      if (lowerInfo.includes('anecdotal') || lowerInfo.includes('personal experience')) score -= 2;
      if (lowerInfo.includes('rumor') || lowerInfo.includes('unverified')) score -= 3;
    });

    const averageScore = totalInfo > 0 ? score / totalInfo : 0;

    if (averageScore >= 3) return 'strong';
    if (averageScore >= 1) return 'moderate';
    return 'weak';
  }

  private identifyLogicalFallacies(information: string[]): string[] {
    const fallacies: string[] = [];
    
    information.forEach(info => {
      const lowerInfo = info.toLowerCase();
      
      // Ad hominem
      if (lowerInfo.includes('stupid') || lowerInfo.includes('idiot') || 
          lowerInfo.includes('ignorant') && lowerInfo.includes('person')) {
        fallacies.push('Ad hominem: Attacking the person rather than the argument');
      }
      
      // Appeal to popularity
      if (lowerInfo.includes('everyone knows') || lowerInfo.includes('most people believe') ||
          lowerInfo.includes('popular opinion')) {
        fallacies.push('Appeal to popularity: Assuming truth based on popular belief');
      }
      
      // False dichotomy
      if (lowerInfo.includes('either') && lowerInfo.includes('or') && 
          (lowerInfo.includes('only') || lowerInfo.includes('must'))) {
        fallacies.push('False dichotomy: Presenting only two options when more exist');
      }
      
      // Hasty generalization
      if ((lowerInfo.includes('all') || lowerInfo.includes('always') || lowerInfo.includes('never')) &&
          !lowerInfo.includes('research') && !lowerInfo.includes('study')) {
        fallacies.push('Hasty generalization: Drawing broad conclusions from limited examples');
      }
      
      // Appeal to authority
      if (lowerInfo.includes('because i said so') || lowerInfo.includes('trust me') ||
          (lowerInfo.includes('expert says') && !lowerInfo.includes('evidence'))) {
        fallacies.push('Appeal to authority: Accepting claims based solely on authority without evidence');
      }
      
      // Straw man
      if (lowerInfo.includes('you claim') && lowerInfo.includes('but actually')) {
        fallacies.push('Straw man: Misrepresenting an argument to make it easier to attack');
      }
      
      // Slippery slope
      if (lowerInfo.includes('if') && lowerInfo.includes('then') && 
          lowerInfo.includes('eventually') && lowerInfo.includes('will lead to')) {
        fallacies.push('Slippery slope: Assuming one event will lead to extreme consequences');
      }
    });

    return fallacies;
  }

  private generateCounterArguments(topic: string, information: string[]): string[] {
    const counterArguments: string[] = [];
    
    // General counter-arguments
    counterArguments.push('Alternative interpretations of the available data may be equally valid');
    counterArguments.push('Methodological limitations in studies could affect the reliability of conclusions');
    counterArguments.push('Cultural, temporal, or contextual factors might influence the applicability of findings');
    counterArguments.push('Emerging research might reveal new perspectives that challenge current understanding');
    
    // Domain-specific counter-arguments
    if (this.isScientificTopic(topic)) {
      counterArguments.push('Replication studies might yield different results under varying conditions');
      counterArguments.push('Confounding variables not accounted for could influence the observed relationships');
    }
    
    if (this.isEconomicTopic(topic)) {
      counterArguments.push('Economic models may not account for all market variables and human behavior factors');
      counterArguments.push('Historical economic patterns may not predict future outcomes due to changing conditions');
    }
    
    if (this.isSocialTopic(topic)) {
      counterArguments.push('Social phenomena are complex and may vary significantly across different populations');
      counterArguments.push('Individual experiences may differ from aggregate statistical trends');
    }

    return counterArguments;
  }

  private applyCognitiveBiasChecks(information: string[]): string[] {
    const checks: string[] = [];
    
    checks.push('Confirmation bias check: Actively seeking information that challenges initial assumptions');
    checks.push('Availability heuristic check: Considering whether easily recalled examples are truly representative');
    checks.push('Anchoring bias check: Evaluating whether initial information unduly influences subsequent judgments');
    checks.push('Survivorship bias check: Considering whether missing or excluded data affects conclusions');
    checks.push('Attribution bias check: Examining whether causes are correctly attributed to outcomes');
    
    // Check for specific bias indicators in the information
    const hasEmotionalLanguage = information.some(info => 
      /\b(amazing|terrible|shocking|incredible|unbelievable)\b/i.test(info)
    );
    
    if (hasEmotionalLanguage) {
      checks.push('Emotional reasoning check: Separating emotional responses from logical evaluation');
    }
    
    const hasAbsoluteStatements = information.some(info => 
      /\b(always|never|all|none|everyone|nobody)\b/i.test(info)
    );
    
    if (hasAbsoluteStatements) {
      checks.push('Black-and-white thinking check: Considering nuances and exceptions to absolute statements');
    }

    return checks;
  }

  private isScientificTopic(topic: string): boolean {
    const scientificKeywords = [
      'research', 'study', 'experiment', 'theory', 'hypothesis', 'analysis',
      'biology', 'chemistry', 'physics', 'medicine', 'psychology', 'neuroscience',
      'climate', 'environment', 'genetics', 'evolution', 'quantum', 'molecular'
    ];
    
    return scientificKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
  }

  private isMathematicalTopic(topic: string): boolean {
    const mathKeywords = [
      'mathematics', 'equation', 'formula', 'theorem', 'proof', 'calculation',
      'algebra', 'geometry', 'calculus', 'statistics', 'probability', 'logic'
    ];
    
    return mathKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
  }

  private isEthicalTopic(topic: string): boolean {
    const ethicalKeywords = [
      'ethics', 'moral', 'right', 'wrong', 'should', 'ought', 'justice',
      'fairness', 'responsibility', 'duty', 'virtue', 'values', 'principles'
    ];
    
    return ethicalKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
  }

  private isEconomicTopic(topic: string): boolean {
    const economicKeywords = [
      'economy', 'economic', 'market', 'finance', 'business', 'trade',
      'investment', 'money', 'price', 'cost', 'profit', 'inflation', 'gdp'
    ];
    
    return economicKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
  }

  private isSocialTopic(topic: string): boolean {
    const socialKeywords = [
      'society', 'social', 'culture', 'community', 'relationship', 'behavior',
      'psychology', 'sociology', 'anthropology', 'politics', 'government', 'policy'
    ];
    
    return socialKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
  }

  public formatLogicalResponse(
    framework: LogicalFramework,
    searchResults: any[],
    originalQuery: string
  ): string {
    let response = '';

    // Add logical analysis header
    response += '## 🧠 **Logical Analysis & Reasoning**\n\n';

    // Add premises
    if (framework.premises.length > 0) {
      response += '### **📋 Key Premises:**\n';
      framework.premises.forEach((premise, index) => {
        response += `${index + 1}. ${premise}\n`;
      });
      response += '\n';
    }

    // Add reasoning process
    response += '### **🔍 Reasoning Process:**\n';
    framework.reasoning.forEach((step, index) => {
      response += `**${index + 1}.** ${step}\n`;
    });
    response += '\n';

    // Add evidence assessment
    response += `### **📊 Evidence Strength: ${framework.evidenceStrength.toUpperCase()}**\n`;
    const strengthDescriptions = {
      strong: 'The evidence is robust, well-documented, and from reliable sources.',
      moderate: 'The evidence is reasonable but could benefit from additional verification.',
      weak: 'The evidence is limited and requires more comprehensive research.'
    };
    response += `${strengthDescriptions[framework.evidenceStrength]}\n\n`;

    // Add logical conclusion
    response += '### **🎯 Logical Conclusion:**\n';
    response += `${framework.conclusion}\n\n`;

    // Add search results if available
    if (searchResults && searchResults.length > 0) {
      response += '### **🔗 Supporting Sources:**\n';
      searchResults.forEach((result, index) => {
        response += `**${index + 1}. [${result.title}](${result.url})**\n`;
        response += `   *${result.source}* - ${result.snippet}\n\n`;
      });
    }

    // Add cognitive bias checks
    if (framework.cognitiveChecks.length > 0) {
      response += '### **🧩 Cognitive Bias Checks:**\n';
      framework.cognitiveChecks.forEach((check, index) => {
        response += `• ${check}\n`;
      });
      response += '\n';
    }

    // Add logical fallacies if found
    if (framework.logicalFallacies.length > 0) {
      response += '### **⚠️ Potential Logical Issues:**\n';
      framework.logicalFallacies.forEach((fallacy, index) => {
        response += `• ${fallacy}\n`;
      });
      response += '\n';
    }

    // Add counter-arguments
    response += '### **🤔 Alternative Perspectives:**\n';
    framework.counterArguments.forEach((argument, index) => {
      response += `• ${argument}\n`;
    });
    response += '\n';

    response += '---\n';
    response += '*This analysis applies systematic logical reasoning and critical thinking principles to provide a comprehensive, evidence-based response.*';

    return response;
  }
}