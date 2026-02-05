import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Do not throw here; allow app to start even if key is missing or quota is 0.

// Build plugins array conditionally so we can still run with offline fallback.
const plugins: any[] = [];
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (apiKey) {
  plugins.push(
    googleAI({
      apiKey,
    })
  );
}
// Helpful startup warning so it's obvious when AI is disabled
else {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️ Google AI is not configured. Set GOOGLE_API_KEY or GEMINI_API_KEY in .env.local to enable AI-generated reports.'
  );
}

export const ai = genkit({
  plugins,
  // Prefer the stable alias; some API versions return 404 for bare model IDs
  model: process.env.GENKIT_MODEL || 'googleai/gemini-1.5-flash-latest',
});

// Export flag so flows can enforce AI-only mode when desired
export const isGoogleAIEnabled = Boolean(apiKey);
