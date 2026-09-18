import { DemoEngine, resolveAtmosphere, resolveAtmosphereProfile, calculatePoemStats } from './demoEngine.js';

export class AIService {
  static async generatePoem(params) {
    const {
      theme = 'Love',
      mood = 'Romantic',
      emotion = 'Wonder',
      style = 'Free Verse',
      structure = 'Quatrains',
      length = 'Medium',
      language = 'English',
      tone = 'Lyrical',
      perspective = 'First person',
      rhyme = 'Free',
      imagery = 'Natural and cosmic',
      difficulty = 'Accessible',
      audience = 'General',
      customInstructions = ''
    } = params;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // If Gemini key is available, call Gemini API
    if (geminiKey) {
      try {
        const systemPrompt = `You are an elite, deeply sensitive poet and literary scholar in POETICA studio.
Generate an original, emotionally profound poem according to the user parameters.
Return ONLY valid JSON matching this schema:
{
  "title": "Poem Title",
  "content": "Line 1\\nLine 2\\n\\nLine 3\\nLine 4",
  "language": "${language}",
  "theme": "${theme}",
  "mood": "${mood}",
  "emotion": "${emotion}",
  "style": "${style}",
  "structure": "Structural description",
  "tone": "${tone}",
  "perspective": "${perspective}",
  "atmosphere": "one of: sakura, rain, mountain, ocean, forest, night, autumn, winter, spring, sunrise, minimal",
  "explanation": {
    "simpleMeaning": "Clear, accessible meaning of the poem",
    "themeInterpretation": "How the theme is unpacked (use 'This poem can be interpreted as...')",
    "emotionalInterpretation": "The emotional landscape and resonance",
    "imagery": "Prominent sensory imagery explained",
    "metaphors": "Core metaphors unpacked",
    "symbols": "Key symbolic elements"
  },
  "translation": "English translation if poem is in another language, otherwise note that original is English",
  "vocabulary": [
    { "word": "word or phrase in poem", "meaning": "definition and poetic nuance" }
  ],
  "tags": ["tag1", "tag2"]
}

Important Instructions:
- Write strictly in the selected language: ${language}.
- Ensure natural phrasing, high lyrical grace, and semantic depth.
- Follow the requested poetry style (${style}) and length (${length}).
- Do NOT output markdown code fences or conversational text. Output pure JSON only.`;

        const userPrompt = `Theme: ${theme}
Mood: ${mood}
Emotion: ${emotion}
Style: ${style}
Length: ${length}
Language: ${language}
Tone: ${tone}
Perspective: ${perspective}
Rhyme: ${rhyme}
Imagery: ${imagery}
Difficulty: ${difficulty}
Audience: ${audience}
Custom Notes: ${customInstructions || 'None'}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.8,
              responseMimeType: 'application/json'
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const atmosphere = parsed.atmosphere || resolveAtmosphere(theme, mood, parsed.content);
            const atmosphereProfile = resolveAtmosphereProfile(atmosphere, theme, mood);
            const stats = calculatePoemStats(parsed.content, mood, emotion);
            const dna = {
              emotion: emotion.toUpperCase(),
              mood: mood.toUpperCase(),
              theme: theme.toUpperCase(),
              energy: (mood === 'Energetic' || mood === 'Joyful') ? 'RADIANT' : 'GENTLE & SERENE',
              tone: tone.toUpperCase(),
              atmosphere: atmosphere.toUpperCase()
            };

            return {
              ...parsed,
              atmosphere,
              atmosphereProfile,
              stats,
              dna,
              journey: [{ action: 'Created', timestamp: new Date().toISOString(), detail: `Composed via Gemini in ${language}` }],
              versions: [{ version: 1, title: parsed.title, content: parsed.content, timestamp: new Date().toISOString(), action: 'Original Generation' }],
              isDemo: false,
              provider: 'gemini'
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, gracefully falling back to Intelligent Demo Engine:', err.message);
      }
    }

    // If OpenAI key is available, call OpenAI API
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are POETICA studio's master poet. Return JSON only with fields: title, content, language, theme, mood, emotion, style, structure, tone, perspective, atmosphere (one of: sakura, rain, mountain, ocean, forest, night, autumn, winter, spring, sunrise, minimal), explanation (simpleMeaning, themeInterpretation, emotionalInterpretation, imagery, metaphors, symbols), translation, vocabulary ([{word, meaning}]), tags.`
              },
              {
                role: 'user',
                content: `Theme: ${theme}, Mood: ${mood}, Emotion: ${emotion}, Style: ${style}, Length: ${length}, Language: ${language}, Tone: ${tone}, Perspective: ${perspective}, Custom: ${customInstructions}`
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.8
          })
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          const atmosphere = parsed.atmosphere || resolveAtmosphere(theme, mood, parsed.content);
          const atmosphereProfile = resolveAtmosphereProfile(atmosphere, theme, mood);
          const stats = calculatePoemStats(parsed.content, mood, emotion);
          const dna = {
            emotion: emotion.toUpperCase(),
            mood: mood.toUpperCase(),
            theme: theme.toUpperCase(),
            energy: (mood === 'Energetic' || mood === 'Joyful') ? 'RADIANT' : 'GENTLE & SERENE',
            tone: tone.toUpperCase(),
            atmosphere: atmosphere.toUpperCase()
          };

          return {
            ...parsed,
            atmosphere,
            atmosphereProfile,
            stats,
            dna,
            journey: [{ action: 'Created', timestamp: new Date().toISOString(), detail: `Composed via OpenAI in ${language}` }],
            versions: [{ version: 1, title: parsed.title, content: parsed.content, timestamp: new Date().toISOString(), action: 'Original Generation' }],
            isDemo: false,
            provider: 'openai'
          };
        }
      } catch (err) {
        console.warn('OpenAI API call failed, gracefully falling back to Intelligent Demo Engine:', err.message);
      }
    }

    // Default: Intelligent Demo Fallback Engine
    return DemoEngine.generatePoem(params);
  }

  static async remixPoem(originalPoem, remixType) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `You are POETICA studio's poetry editor.
Remix the following poem with instruction: "${remixType}".
Original Poem:
Title: ${originalPoem.title}
Language: ${originalPoem.language}
Content:
${originalPoem.content}

Return JSON with:
{
  "title": "Updated Title",
  "content": "New remixed lines",
  "atmosphere": "one of: sakura, rain, mountain, ocean, forest, night, autumn, winter, spring, sunrise, minimal",
  "notes": "Brief explanation of how the remix transformed the piece"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw);
            const atmosphere = parsed.atmosphere || originalPoem.atmosphere;
            const atmosphereProfile = resolveAtmosphereProfile(atmosphere, originalPoem.theme, originalPoem.mood);
            const stats = calculatePoemStats(parsed.content, originalPoem.mood, originalPoem.emotion);

            const existingVersions = Array.isArray(originalPoem.versions) ? originalPoem.versions : [];
            const newVersion = {
              version: existingVersions.length + 1,
              title: parsed.title,
              content: parsed.content,
              timestamp: new Date().toISOString(),
              action: `Remix: ${remixType}`
            };

            const existingJourney = Array.isArray(originalPoem.journey) ? originalPoem.journey : [];
            const newJourneyEntry = {
              action: 'Remixed',
              timestamp: new Date().toISOString(),
              detail: remixType
            };

            return {
              ...originalPoem,
              title: parsed.title || originalPoem.title,
              content: parsed.content || originalPoem.content,
              atmosphere,
              atmosphereProfile,
              stats,
              versions: [...existingVersions, newVersion],
              journey: [...existingJourney, newJourneyEntry],
              isDemo: false,
              remixedWith: remixType
            };
          }
        }
      } catch (err) {
        console.warn('Gemini remix failed, falling back to DemoEngine:', err.message);
      }
    }

    return DemoEngine.remixPoem(originalPoem, remixType);
  }

  static async translatePoem(originalPoem, targetLanguage) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `Translate this poem into ${targetLanguage}.
Do NOT translate word-for-word. Maintain poetic cadence, emotional nuance, metaphors, and evocative imagery.
Poem:
"${originalPoem.content}"

Return JSON:
{
  "original": "${originalPoem.content}",
  "originalLanguage": "${originalPoem.language}",
  "targetLanguage": "${targetLanguage}",
  "translatedTitle": "Poetic title in ${targetLanguage}",
  "translatedContent": "Poetic translated verses in ${targetLanguage}",
  "poeticNotes": "Explanation of cultural and poetic adaptations made"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) return JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Gemini translation failed, falling back to DemoEngine:', err.message);
      }
    }

    return DemoEngine.translatePoem(originalPoem, targetLanguage);
  }

  static async explainPoem(poem) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `Analyze this poem thoroughly:
Title: ${poem.title}
Language: ${poem.language}
Content:
${poem.content}

Return JSON:
{
  "simpleMeaning": "Accessible summary",
  "themeInterpretation": "Thematic analysis using gentle language like 'This poem can be interpreted as...'",
  "emotionalInterpretation": "Emotional analysis",
  "imagery": "Sensory landscape",
  "metaphors": "Core metaphors explained",
  "symbols": "Symbols explained",
  "culturalNotes": "Any cultural context notes",
  "englishTranslation": "English translation if poem was in another language"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) return JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Gemini explain failed, falling back to DemoEngine:', err.message);
      }
    }

    return poem.explanation || {
      simpleMeaning: `A delicate verse exploring ${poem.theme || 'emotion'} through thoughtful stillness.`,
      themeInterpretation: `This poem can be interpreted as an exploration of human vulnerability and peace.`,
      emotionalInterpretation: `The piece carries a reflective, tranquil presence.`,
      imagery: `Light, wind, time, and gentle shadows.`,
      metaphors: `Natural shifts serving as mirrors for inner life.`,
      symbols: `The road (journey), the dusk (closure and rest).`
    };
  }

  static async generateTitles(poem) {
    return DemoEngine.generateTitles(poem);
  }

  static async analyzeLine(line, mode) {
    return DemoEngine.analyzeLine(line, mode);
  }

  static async completeThought(seed) {
    return DemoEngine.completeThought(seed);
  }

  static async assistPoem(action, targetText, context = '') {
    return DemoEngine.assistPoem(action, targetText, context);
  }

  static async generatePrompt(params) {
    return DemoEngine.generatePrompt(params);
  }
}
