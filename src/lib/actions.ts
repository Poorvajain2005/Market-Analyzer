'use server';

import { generateMarketAnalysisReport } from '@/ai/flows/generate-market-analysis-report';
import type { MarketAnalysisOutput } from '@/ai/flows/generate-market-analysis-report';

// Simple in-memory cache (resets on server restart)
const analysisCache = new Map<string, MarketAnalysisOutput>();

export async function analyzeIdea(ideaText: string): Promise<{
  success: boolean;
  data?: MarketAnalysisOutput;
  error?: string;
}> {
  try {
    if (!ideaText || ideaText.trim().length < 15) {
      return {
        success: false,
        error: 'Please provide a more detailed idea (at least 15 characters).',
      };
    }

    // Check cache first to avoid API calls
    const cacheKey = ideaText.trim().toLowerCase();
    if (analysisCache.has(cacheKey)) {
      console.log('✅ Returning cached analysis - no API call made');
      return {
        success: true,
        data: analysisCache.get(cacheKey)!,
      };
    }

    const data = await generateMarketAnalysisReport({ ideaText });
    
    // Store in cache for future requests
    analysisCache.set(cacheKey, data);
    console.log('✅ Analysis complete and cached');
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('❌ Error analyzing idea:', error);
    
    // Handle rate limit errors specifically
    if (error instanceof Error) {
      const errorMsg = error.message;
      
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
        return {
          success: false,
          error: '⚠️ API quota exceeded. Please:\n1. Wait 30+ minutes\n2. Get a new API key at https://aistudio.google.com/app/apikey\n3. Consider upgrading your plan',
        };
      }
      
      if (errorMsg.includes('API key')) {
        return {
          success: false,
          error: '🔑 Invalid API key. Please update your .env.local file with a valid key and restart the server.',
        };
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.',
    };
  }
}
