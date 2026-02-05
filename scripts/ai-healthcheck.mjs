import dotenv from 'dotenv';

// Load environment variables from .env.local first, then fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ Google AI API key is missing. Set GOOGLE_API_KEY or GEMINI_API_KEY in .env.local.');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function main() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Failed to list models: [${res.status} ${res.statusText}]`);
      console.error(text);
      process.exit(1);
    }
    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models : [];
    if (!models.length) {
      console.warn('⚠️ No models returned. Check your API key and project access.');
    }

    const rows = models.map(m => ({
      model: m.name,
      displayName: m.displayName || '',
      generateContent: Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'),
      embedContent: Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('embedContent'),
    }));

    console.log('\n✅ Available Generative Language models (top 15):');
    console.table(rows.slice(0, 15));

    const flash = rows.find(r => r.model.includes('gemini-1.5-flash'));
    const pro = rows.find(r => r.model.includes('gemini-1.5-pro'));
    if (flash?.generateContent) {
      console.log('\nℹ️ Suggested GENKIT_MODEL: googleai/gemini-1.5-flash-latest');
    } else if (pro?.generateContent) {
      console.log('\nℹ️ Suggested GENKIT_MODEL: googleai/gemini-1.5-pro-latest');
    } else {
      console.log('\nℹ️ No gemini-1.5-* generateContent-capable model found. Review your API key scopes.');
    }
  } catch (e) {
    console.error('❌ Error during health check:', e);
    process.exit(1);
  }
}

main();
