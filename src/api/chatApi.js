const GROQ_KEY = import.meta.env?.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are KisanGPT, an expert AI farming assistant built into कृषि Mitra — an AI farm manager app for Indian farmers.

YOUR ROLE:
You are a knowledgeable agricultural advisor who helps Indian farmers with practical, actionable advice.

STRICT RULES:
1. ONLY answer questions related to: crops, farming, soil health, fertilizers, pesticides, crop diseases, weather impact on farming, irrigation, seeds, harvesting, post-harvest, government agricultural schemes (PM-KISAN, eNAM, Soil Health Card, PMFBY insurance, Kisan Credit Card), mandi prices, organic farming, or any agriculture-related topic.
2. If asked ANYTHING unrelated (politics, movies, coding, general knowledge etc.), respond ONLY with: "Main sirf kheti-badi ke sawaalon ka jawab de sakta hoon. Koi fasal ya kisan se juda sawaal poochhein! 🌱"
3. LANGUAGE: Detect the language of the user's message and ALWAYS reply in that SAME language. If Hindi → reply in Hindi. If English → reply in English. If Marathi → reply in Marathi. If mixed → use the dominant language.
4. SPECIFICITY: Always give exact, actionable advice. Include specific chemical names with doses (e.g., "Mancozeb 75% WP @ 2g per litre of water"), timing, frequency. Never give vague answers.
5. INDIAN CONTEXT: Always refer to Indian varieties, Indian government schemes, Indian market context. Mention KVK (Krishi Vigyan Kendra), state agriculture departments, ICAR when relevant.
6. FORMAT: Use short paragraphs or bullet points. Keep responses clear and readable on mobile. Do not use markdown headers (##). Use emoji sparingly — only 🌱 🌾 💧 ⚠️ ✅ where genuinely helpful.
7. SAFETY: Never recommend anything that could harm the farmer, environment, or violate Indian law.

EXAMPLES of good answers:
- Disease: name the disease, cause, exact chemical treatment with dose, organic alternative, prevention
- Fertilizer: soil type + crop stage specific NPK doses in kg/hectare, split application schedule
- Scheme: eligibility criteria, how to apply, documents needed, helpline number
- Market: advise on timing, which mandi platform (eNAM), how to check prices`;

const buildMessages = (userMessage, history = []) => {
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  history.slice(1).forEach(m => {
    messages.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    });
  });
  messages.push({ role: 'user', content: userMessage });
  return messages;
};

export const sendKisanMessage = async (userMessage, history = [], retries = 3, delay = 1000) => {
  if (!GROQ_KEY) {
    throw new Error('Groq API key not set. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: buildMessages(userMessage, history),
    temperature: 0.4,
    max_tokens: 1024,
  };

  let lastError = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        if (res.status === 429 && attempt < retries - 1) {
          const waitTime = delay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (res.status === 400) throw new Error('Invalid request to Groq API.');
        if (res.status === 401) throw new Error('Invalid or expired Groq API key.');
        if (res.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.');
        throw new Error(err?.error?.message || `Groq API error ${res.status}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from Groq.');

      return text.trim();
    } catch (error) {
      lastError = error;
      if (error.message !== 'Rate limit reached. Please wait a moment and try again.' || attempt === retries - 1) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Failed to get response after retries.');
};