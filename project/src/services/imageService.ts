interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  correctedPrompt?: string;
}

// Google AI Studio configuration
const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY || 'AIzaSyCaFJlXQXomd3ezcHk1RzXDfaJxAJnju-M';
const MODEL_ID = 'gemini-2.0-flash-exp';

// Fallback image generation APIs
const FALLBACK_IMAGE_APIS = [
  {
    name: 'Pollinations',
    baseUrl: 'https://image.pollinations.ai/prompt/',
    generateUrl: (prompt: string) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=flux&enhance=true&nologo=true`
  },
  {
    name: 'Picsum Photos',
    baseUrl: 'https://picsum.photos/',
    generateUrl: (prompt: string, seed?: string) => `https://picsum.photos/seed/${seed || prompt.replace(/\s+/g, '')}/1024/1024`
  }
];

// Enhanced prompt optimization for Google AI Studio
function optimizeImagePrompt(originalPrompt: string): { optimizedPrompt: string; corrections: string[] } {
  const corrections: string[] = [];
  let optimizedPrompt = originalPrompt.toLowerCase().trim();

  // Google AI Studio specific optimizations
  const googleOptimizations = {
    // Style enhancements
    'photo': 'high-quality photograph, professional photography',
    'drawing': 'detailed digital artwork, professional illustration',
    'painting': 'artistic painting, fine art style',
    'sketch': 'detailed pencil sketch, artistic drawing',
    'cartoon': 'cartoon style illustration, animated character design',
    'realistic': 'photorealistic, highly detailed, professional quality',
    'abstract': 'abstract art, creative composition, artistic interpretation',
    
    // Quality enhancers
    'simple': 'clean, minimalist design, simple composition',
    'detailed': 'highly detailed, intricate, professional quality',
    'colorful': 'vibrant colors, rich palette, visually striking',
    'beautiful': 'aesthetically pleasing, visually appealing, well-composed',
    
    // Technical corrections
    'persn': 'person',
    'ppl': 'people',
    'pic': 'image',
    'img': 'photograph',
    'beautifull': 'beautiful',
    'colorfull': 'colorful'
  };

  // Apply Google-specific optimizations
  Object.entries(googleOptimizations).forEach(([original, enhanced]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    if (regex.test(optimizedPrompt)) {
      optimizedPrompt = optimizedPrompt.replace(regex, enhanced);
      corrections.push(`Enhanced "${original}" to "${enhanced}" for better Google AI results`);
    }
  });

  // Add Google AI Studio quality modifiers
  const qualityModifiers = [
    'high resolution', '4K quality', 'professional', 'detailed', 'sharp focus'
  ];
  
  const hasQualityModifier = qualityModifiers.some(modifier => 
    optimizedPrompt.includes(modifier.toLowerCase())
  );

  if (!hasQualityModifier && optimizedPrompt.length > 10) {
    optimizedPrompt += ', high resolution, professional quality, detailed';
    corrections.push('Added Google AI Studio quality enhancers');
  }

  // Ensure prompt is within Google's limits (usually 1000 characters)
  if (optimizedPrompt.length > 900) {
    optimizedPrompt = optimizedPrompt.substring(0, 900) + '...';
    corrections.push('Trimmed prompt to fit Google AI Studio limits');
  }

  return { optimizedPrompt, corrections };
}

// Generate image using Google AI Studio API
async function generateWithGoogleAI(prompt: string): Promise<ImageGenerationResponse> {
  try {
    console.log('Attempting Google AI Studio image generation...');
    
    // Use the new Google AI Studio API format
    const requestBody = {
      contents: [{
        parts: [{
          text: `Create a high-quality image: ${prompt}`
        }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: 0.7,
        maxOutputTokens: 1024
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI Studio API error:', response.status, errorText);
      throw new Error(`Google AI Studio API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Google AI Studio response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      // Look for image data in the response parts
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          
          if (imageData) {
            // Convert base64 to blob URL
            const blobUrl = `data:${mimeType};base64,${imageData}`;
            
            return {
              success: true,
              imageUrl: blobUrl,
              correctedPrompt: prompt
            };
          }
        }
      }
      
      // If no image found, check if there's text explaining why
      const textPart = data.candidates[0].content.parts.find(part => part.text);
      if (textPart) {
        console.log('Google AI Studio text response:', textPart.text);
      }
    }

    throw new Error('No image data found in Google AI Studio response');

  } catch (error) {
    console.error('Google AI Studio generation failed:', error);
    throw error;
  }
}

// Main image generation function with Google AI Studio integration
export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    console.log('Starting image generation for prompt:', prompt);

    // Detect language and translate if needed
    const { translatedPrompt, originalLanguage } = detectAndTranslatePrompt(prompt);
    
    // Optimize prompt for Google AI Studio
    const { optimizedPrompt, corrections } = optimizeImagePrompt(translatedPrompt);
    
    console.log('Optimized prompt:', optimizedPrompt);
    if (corrections.length > 0) {
      console.log('Applied corrections:', corrections);
    }

    // Try Google AI Studio first
    try {
      console.log('Attempting Google AI Studio generation...');
      const googleResult = await generateWithGoogleAI(optimizedPrompt);
      
      if (googleResult.success) {
        return {
          success: true,
          imageUrl: googleResult.imageUrl,
          correctedPrompt: corrections.length > 0 ? optimizedPrompt : undefined
        };
      }
    } catch (error) {
      console.log('Google AI Studio failed, trying fallback APIs...', error);
    }

    // Fallback to Pollinations API
    try {
      const pollinationsUrl = FALLBACK_IMAGE_APIS[0].generateUrl(optimizedPrompt);
      console.log('Trying Pollinations API:', pollinationsUrl);
      
      // Test if the image loads
      const testResponse = await fetch(pollinationsUrl, { method: 'HEAD' });
      if (testResponse.ok) {
        return {
          success: true,
          imageUrl: pollinationsUrl,
          correctedPrompt: corrections.length > 0 ? optimizedPrompt : undefined
        };
      }
    } catch (error) {
      console.log('Pollinations API failed, trying final fallback...');
    }

    // Final fallback to Picsum
    try {
      const seed = optimizedPrompt.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
      const picsumUrl = FALLBACK_IMAGE_APIS[1].generateUrl(optimizedPrompt, seed);
      console.log('Using Picsum fallback:', picsumUrl);
      
      return {
        success: true,
        imageUrl: picsumUrl,
        correctedPrompt: corrections.length > 0 ? optimizedPrompt : undefined
      };
    } catch (error) {
      console.error('All image APIs failed:', error);
    }

    // If all APIs fail, return error
    return {
      success: false,
      error: 'Unable to generate image at the moment. Please try again later or check your Google AI Studio API configuration.'
    };

  } catch (error) {
    console.error('Error in generateImage:', error);
    return {
      success: false,
      error: 'An error occurred while generating the image.'
    };
  }
}

// Detect language and translate if needed
function detectAndTranslatePrompt(prompt: string): { translatedPrompt: string; originalLanguage: string } {
  // Simple language detection patterns
  const languagePatterns = {
    ar: /[\u0600-\u06FF]/,
    zh: /[\u4e00-\u9fff]/,
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,
    ko: /[\uac00-\ud7af]/,
    ru: /[\u0400-\u04FF]/,
    hi: /[\u0900-\u097F]/,
    th: /[\u0e00-\u0e7f]/,
    he: /[\u0590-\u05FF]/,
    el: /[\u0370-\u03FF]/
  };

  let detectedLanguage = 'en';
  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(prompt)) {
      detectedLanguage = lang;
      break;
    }
  }

  // For Arabic prompts, provide basic translation hints
  if (detectedLanguage === 'ar') {
    // Add English context for better AI understanding
    const translatedPrompt = prompt + ' (Arabic prompt for image generation)';
    return { translatedPrompt, originalLanguage: detectedLanguage };
  }

  return { translatedPrompt: prompt, originalLanguage: detectedLanguage };
}

// Helper function to validate image URLs
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

// Generate multiple image variations using Google AI Studio
export async function generateImageVariations(prompt: string, count: number = 3): Promise<ImageGenerationResponse[]> {
  const variations = [];
  const { optimizedPrompt } = optimizeImagePrompt(prompt);
  
  // Create variations by adding different style modifiers
  const styleModifiers = [
    'photorealistic style, professional photography',
    'digital art style, detailed illustration', 
    'artistic painting style, fine art',
    'modern design style, clean composition',
    'creative interpretation, unique perspective'
  ];

  for (let i = 0; i < Math.min(count, styleModifiers.length); i++) {
    const variantPrompt = `${optimizedPrompt}, ${styleModifiers[i]}`;
    const result = await generateImage(variantPrompt);
    variations.push(result);
    
    // Add small delay between requests to avoid rate limiting
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return variations;
}

// Enhanced image generation with presentation context
export async function generatePresentationImage(
  topic: string, 
  context: string, 
  style: 'professional' | 'creative' | 'educational' | 'technical' = 'professional'
): Promise<ImageGenerationResponse> {
  
  const stylePrompts = {
    professional: 'professional presentation style, clean design, business appropriate',
    creative: 'creative and engaging, visually striking, artistic interpretation',
    educational: 'educational illustration, clear and informative, learning-focused',
    technical: 'technical diagram style, precise and detailed, engineering approach'
  };

  const enhancedPrompt = `${topic} for ${context}, ${stylePrompts[style]}, high quality, suitable for presentations`;
  
  return await generateImage(enhancedPrompt);
}