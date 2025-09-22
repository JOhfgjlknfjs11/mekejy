interface TableGenerationRequest {
  topic: string;
  columns: string[];
  rows: string[];
  data?: string[][];
  style?: 'scientific' | 'business' | 'educational' | 'comparison';
  mindMapStructure?: boolean;
}

interface TableGenerationResponse {
  success: boolean;
  tableHtml: string;
  explanation: string;
  summary: string;
  mindMapPrinciples: string[];
  error?: string;
}

interface MindMapNode {
  id: string;
  label: string;
  children: MindMapNode[];
  level: number;
  category: string;
}

export class TableGenerator {
  private mindMapPrinciples = {
    hierarchy: 'Information organized from general to specific',
    categorization: 'Related concepts grouped together',
    visualization: 'Clear visual structure with proper spacing',
    connection: 'Logical relationships between elements',
    clarity: 'Simple, clear presentation of complex information',
    memory: 'Structure aids retention and understanding'
  };

  public async generateTable(request: TableGenerationRequest): Promise<TableGenerationResponse> {
    try {
      // Analyze the request and apply mind mapping principles
      const mindMapStructure = this.createMindMapStructure(request);
      const organizedData = this.organizeDataByMindMap(request, mindMapStructure);
      const tableHtml = this.generateTableHtml(organizedData, request.style || 'scientific');
      const explanation = this.generateDetailedExplanation(request, mindMapStructure);
      const summary = this.generateSummary(request, organizedData);
      const appliedPrinciples = this.getAppliedPrinciples(request);

      return {
        success: true,
        tableHtml,
        explanation,
        summary,
        mindMapPrinciples: appliedPrinciples,
      };
    } catch (error) {
      return {
        success: false,
        tableHtml: '',
        explanation: '',
        summary: '',
        mindMapPrinciples: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private createMindMapStructure(request: TableGenerationRequest): MindMapNode {
    const rootNode: MindMapNode = {
      id: 'root',
      label: request.topic,
      children: [],
      level: 0,
      category: 'main'
    };

    // Create hierarchical structure based on columns
    request.columns.forEach((column, index) => {
      const columnNode: MindMapNode = {
        id: `col_${index}`,
        label: column,
        children: [],
        level: 1,
        category: 'column'
      };

      // Add row data as children if available
      if (request.rows) {
        request.rows.forEach((row, rowIndex) => {
          const rowNode: MindMapNode = {
            id: `row_${rowIndex}_col_${index}`,
            label: request.data?.[rowIndex]?.[index] || row,
            children: [],
            level: 2,
            category: 'data'
          };
          columnNode.children.push(rowNode);
        });
      }

      rootNode.children.push(columnNode);
    });

    return rootNode;
  }

  private organizeDataByMindMap(request: TableGenerationRequest, mindMap: MindMapNode): any {
    return {
      title: request.topic,
      headers: request.columns,
      rows: request.rows || [],
      data: request.data || [],
      structure: mindMap,
      categories: this.extractCategories(mindMap)
    };
  }

  private extractCategories(node: MindMapNode): string[] {
    const categories = new Set<string>();
    
    const traverse = (currentNode: MindMapNode) => {
      categories.add(currentNode.category);
      currentNode.children.forEach(child => traverse(child));
    };
    
    traverse(node);
    return Array.from(categories);
  }

  private generateTableHtml(data: any, style: string): string {
    const styleClasses = this.getStyleClasses(style);
    
    let html = `
      <div class="${styleClasses.container}">
        <div class="${styleClasses.header}">
          <h3 class="${styleClasses.title}">${data.title}</h3>
        </div>
        <div class="${styleClasses.tableWrapper}">
          <table class="${styleClasses.table}">
            <thead class="${styleClasses.thead}">
              <tr class="${styleClasses.headerRow}">
    `;

    // Generate headers
    data.headers.forEach((header: string) => {
      html += `<th class="${styleClasses.th}">${header}</th>`;
    });

    html += `
              </tr>
            </thead>
            <tbody class="${styleClasses.tbody}">
    `;

    // Generate rows
    if (data.data && data.data.length > 0) {
      data.data.forEach((row: string[], index: number) => {
        html += `<tr class="${styleClasses.tr} ${index % 2 === 0 ? styleClasses.evenRow : styleClasses.oddRow}">`;
        row.forEach((cell: string) => {
          html += `<td class="${styleClasses.td}">${cell}</td>`;
        });
        html += '</tr>';
      });
    } else if (data.rows && data.rows.length > 0) {
      data.rows.forEach((row: string, index: number) => {
        html += `<tr class="${styleClasses.tr} ${index % 2 === 0 ? styleClasses.evenRow : styleClasses.oddRow}">`;
        html += `<td class="${styleClasses.td}" colspan="${data.headers.length}">${row}</td>`;
        html += '</tr>';
      });
    }

    html += `
            </tbody>
          </table>
        </div>
        <div class="${styleClasses.footer}">
          <p class="${styleClasses.footerText}">Generated using mind mapping principles for optimal organization</p>
        </div>
      </div>
    `;

    return html;
  }

  private getStyleClasses(style: string): Record<string, string> {
    const baseClasses = {
      container: 'bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 my-4',
      header: 'mb-4 text-center',
      title: 'text-xl font-bold text-white mb-2',
      tableWrapper: 'overflow-x-auto',
      table: 'w-full border-collapse',
      thead: 'bg-white/20',
      headerRow: 'border-b-2 border-white/30',
      th: 'px-4 py-3 text-left font-semibold text-white border-r border-white/20 last:border-r-0',
      tbody: 'bg-white/5',
      tr: 'border-b border-white/10 hover:bg-white/10 transition-colors',
      td: 'px-4 py-3 text-white border-r border-white/10 last:border-r-0',
      evenRow: 'bg-white/5',
      oddRow: 'bg-transparent',
      footer: 'mt-4 text-center',
      footerText: 'text-xs text-gray-400'
    };

    const styleVariations = {
      scientific: {
        ...baseClasses,
        container: baseClasses.container + ' border-blue-500/30',
        title: baseClasses.title + ' text-blue-300',
        th: baseClasses.th + ' bg-blue-500/20'
      },
      business: {
        ...baseClasses,
        container: baseClasses.container + ' border-green-500/30',
        title: baseClasses.title + ' text-green-300',
        th: baseClasses.th + ' bg-green-500/20'
      },
      educational: {
        ...baseClasses,
        container: baseClasses.container + ' border-purple-500/30',
        title: baseClasses.title + ' text-purple-300',
        th: baseClasses.th + ' bg-purple-500/20'
      },
      comparison: {
        ...baseClasses,
        container: baseClasses.container + ' border-orange-500/30',
        title: baseClasses.title + ' text-orange-300',
        th: baseClasses.th + ' bg-orange-500/20'
      }
    };

    return styleVariations[style as keyof typeof styleVariations] || baseClasses;
  }

  private generateDetailedExplanation(request: TableGenerationRequest, mindMap: MindMapNode): string {
    return `
## Detailed Table Analysis & Mind Mapping Application

### 🧠 **Mind Mapping Principles Applied:**

**1. Hierarchical Organization**
- **Root Level**: "${request.topic}" serves as the central concept
- **Branch Level**: Columns represent main categories branching from the central topic
- **Leaf Level**: Individual data points form the detailed information nodes

**2. Categorization & Grouping**
- Information is systematically grouped by columns (${request.columns.join(', ')})
- Related data points are clustered together for cognitive efficiency
- Visual separation enhances pattern recognition

**3. Visual Structure & Clarity**
- Clean, organized layout reduces cognitive load
- Consistent spacing and alignment aid visual processing
- Color coding and styling provide immediate context cues

**4. Logical Flow & Connections**
- Information flows from general (headers) to specific (data)
- Relationships between elements are clearly defined
- Sequential organization follows natural reading patterns

### 📊 **Table Structure Analysis:**

**Headers**: ${request.columns.length} main categories
**Data Organization**: ${request.rows ? request.rows.length : 'Dynamic'} information clusters
**Cognitive Load**: Optimized for human information processing
**Accessibility**: Structured for easy scanning and comprehension

### 🎯 **Scientific Methodology:**

This table applies cognitive science principles:
- **Chunking**: Information grouped in digestible segments
- **Pattern Recognition**: Consistent structure aids memory formation
- **Visual Hierarchy**: Clear importance levels guide attention
- **Spatial Organization**: Logical positioning enhances understanding

The design follows established research in information architecture and human-computer interaction, ensuring optimal usability and comprehension.
    `.trim();
  }

  private generateSummary(request: TableGenerationRequest, data: any): string {
    return `
## 📋 **Table Summary**

**Topic**: ${request.topic}
**Structure**: ${request.columns.length} columns × ${data.rows?.length || 'variable'} rows
**Organization**: Hierarchical mind map structure
**Style**: Scientific presentation with cognitive optimization
**Principles**: Applied 6 core mind mapping principles for maximum clarity and retention

**Key Features**: Visual hierarchy, logical grouping, enhanced readability, and scientific organization methodology.
    `.trim();
  }

  private getAppliedPrinciples(request: TableGenerationRequest): string[] {
    return [
      'Hierarchical Information Structure',
      'Categorical Data Grouping',
      'Visual Clarity & Organization',
      'Logical Flow & Connections',
      'Cognitive Load Optimization',
      'Memory-Friendly Design'
    ];
  }
}

// Helper function to detect table generation requests
export function shouldGenerateTable(text: string): boolean {
  const tableKeywords = [
    // English
    'create a table', 'make a table', 'generate a table', 'design a table',
    'table for', 'organize in table', 'tabular format', 'create chart',
    
    // Arabic
    'أنشئ جدول', 'اعمل جدول', 'صمم جدول', 'جدول لـ',
    
    // Spanish
    'crear una tabla', 'hacer una tabla', 'generar una tabla', 'diseñar una tabla',
    
    // French
    'créer un tableau', 'faire un tableau', 'générer un tableau', 'concevoir un tableau',
    
    // German
    'erstelle eine tabelle', 'mache eine tabelle', 'generiere eine tabelle', 'entwerfe eine tabelle',
    
    // Other languages
    'создать таблицу', '创建表格', 'テーブルを作成', '테이블 만들기'
  ];

  return tableKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Helper function to parse table request
export function parseTableRequest(text: string): TableGenerationRequest {
  const topic = extractTopic(text);
  const columns = extractColumns(text);
  const rows = extractRows(text);
  const style = extractStyle(text);

  return {
    topic: topic || 'Data Table',
    columns: columns.length > 0 ? columns : ['Item', 'Description', 'Value'],
    rows: rows,
    style: style as any || 'scientific',
    mindMapStructure: true
  };
}

function extractTopic(text: string): string {
  const topicPatterns = [
    /table (?:for|about|of) ([^,.\n]+)/i,
    /create.*table.*for ([^,.\n]+)/i,
    /([^,.\n]+) table/i
  ];

  for (const pattern of topicPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return 'Information Table';
}

function extractColumns(text: string): string[] {
  const columnPatterns = [
    /columns?:?\s*([^.\n]+)/i,
    /headers?:?\s*([^.\n]+)/i,
    /with columns?\s*([^.\n]+)/i
  ];

  for (const pattern of columnPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].split(/[,;|]/).map(col => col.trim()).filter(col => col.length > 0);
    }
  }

  return [];
}

function extractRows(text: string): string[] {
  const rowPatterns = [
    /rows?:?\s*([^.\n]+)/i,
    /data:?\s*([^.\n]+)/i,
    /items?:?\s*([^.\n]+)/i
  ];

  for (const pattern of rowPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].split(/[,;|]/).map(row => row.trim()).filter(row => row.length > 0);
    }
  }

  return [];
}

function extractStyle(text: string): string {
  if (/scientific|research|academic/i.test(text)) return 'scientific';
  if (/business|corporate|professional/i.test(text)) return 'business';
  if (/educational|learning|teaching/i.test(text)) return 'educational';
  if (/comparison|compare|versus/i.test(text)) return 'comparison';
  
  return 'scientific';
}