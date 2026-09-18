/**
 * POETICA — Intelligent Fallback Demo Generation Engine
 * Generates poetic, multilingual, structured poetry when external AI APIs are not configured or reach limits.
 */

// Atmosphere mapping helper
export function resolveAtmosphere(theme = '', mood = '', content = '') {
  const text = `${theme} ${mood} ${content}`.toLowerCase();
  if (text.includes('sakura') || text.includes('cherry') || text.includes('blossom') || text.includes('petal') || text.includes('spring')) return 'sakura';
  if (text.includes('rain') || text.includes('storm') || text.includes('puddle') || text.includes('droplet') || text.includes('damp')) return 'rain';
  if (text.includes('mountain') || text.includes('peak') || text.includes('cliff') || text.includes('himalaya') || text.includes('valley')) return 'mountain';
  if (text.includes('ocean') || text.includes('sea') || text.includes('wave') || text.includes('tide') || text.includes('shore')) return 'ocean';
  if (text.includes('forest') || text.includes('tree') || text.includes('wood') || text.includes('firefl') || text.includes('pine')) return 'forest';
  if (text.includes('night') || text.includes('moon') || text.includes('star') || text.includes('twilight') || text.includes('midnight') || text.includes('dark')) return 'night';
  if (text.includes('autumn') || text.includes('fall') || text.includes('maple') || text.includes('amber') || text.includes('gold') || text.includes('harvest')) return 'autumn';
  if (text.includes('winter') || text.includes('snow') || text.includes('ice') || text.includes('frost') || text.includes('chill') || text.includes('cold')) return 'winter';
  if (text.includes('sunrise') || text.includes('dawn') || text.includes('morning') || text.includes('ray') || text.includes('sunlight') || text.includes('hope')) return 'sunrise';
  if (text.includes('flower') || text.includes('bloom') || text.includes('garden')) return 'spring';
  return 'minimal';
}

export function resolveAtmosphereProfile(atmosphere, theme = '', mood = '') {
  const profiles = {
    sakura: {
      name: 'Sakura Breeze',
      description: 'Pale pink petals swaying gently in a spring breeze beneath twilight.',
      weather: 'soft wind',
      timeOfDay: 'sunset',
      particleType: 'petals',
      intensity: 'soft'
    },
    rain: {
      name: 'Midnight Rainfall',
      description: 'Cool steady raindrops falling on wet cobblestones and reflective ground.',
      weather: 'rainfall',
      timeOfDay: 'midnight',
      particleType: 'rain',
      intensity: 'medium'
    },
    mountain: {
      name: 'Misty Mountain Peaks',
      description: 'Layered summits veiled in drifting clouds and ancient stone quietude.',
      weather: 'misty',
      timeOfDay: 'morning',
      particleType: 'mist',
      intensity: 'soft'
    },
    ocean: {
      name: 'Luminous Ocean Tide',
      description: 'Silver-crested waves caressing a quiet shore under moonlight.',
      weather: 'sea breeze',
      timeOfDay: 'twilight',
      particleType: 'dust',
      intensity: 'soft'
    },
    forest: {
      name: 'Twilight Forest',
      description: 'Deep pine canopies glowing with gentle wandering fireflies.',
      weather: 'calm',
      timeOfDay: 'dusk',
      particleType: 'fireflies',
      intensity: 'soft'
    },
    night: {
      name: 'Starlight Moon',
      description: 'A velvet indigo sky adorned with celestial constellations and a crescent moon.',
      weather: 'clear',
      timeOfDay: 'night',
      particleType: 'stars',
      intensity: 'soft'
    },
    autumn: {
      name: 'Amber Autumn Breeze',
      description: 'Golden maple leaves tumbling slowly in a warm October gust.',
      weather: 'breezy',
      timeOfDay: 'afternoon',
      particleType: 'leaves',
      intensity: 'medium'
    },
    winter: {
      name: 'Frosted Winter Haven',
      description: 'Crystalline snow flurries drifting softly over sleeping earth.',
      weather: 'snowfall',
      timeOfDay: 'twilight',
      particleType: 'snow',
      intensity: 'soft'
    },
    spring: {
      name: 'Radiant Spring Garden',
      description: 'Floral blossoms awakening under sunbeam bokeh.',
      weather: 'warm sun',
      timeOfDay: 'morning',
      particleType: 'petals',
      intensity: 'soft'
    },
    sunrise: {
      name: 'Golden Dawn',
      description: 'Warm peach light ascending over the horizon with rising dust motes.',
      weather: 'calm breeze',
      timeOfDay: 'dawn',
      particleType: 'dust',
      intensity: 'soft'
    },
    minimal: {
      name: 'Calm Sanctuary',
      description: 'A tranquil pastel atmosphere designed for deep literary reflection.',
      weather: 'peaceful',
      timeOfDay: 'timeless',
      particleType: 'dust',
      intensity: 'soft'
    }
  };

  return profiles[atmosphere] || profiles.minimal;
}

export function calculatePoemStats(content = '', mood = '', emotion = '') {
  const cleanContent = content.trim();
  const words = cleanContent ? cleanContent.split(/\s+/).length : 0;
  const lines = cleanContent ? cleanContent.split('\n').length : 0;
  const characters = cleanContent.length;
  const stanzas = cleanContent ? cleanContent.split(/\n\s*\n/).filter(s => s.trim().length > 0).length : 1;
  const readingSeconds = Math.max(12, Math.round((words / 120) * 60));

  const intensityMap = {
    melancholic: 'Profound & Somber',
    romantic: 'Warm & Lyrical',
    peaceful: 'Gentle Stillness',
    joyful: 'Radiant Energy',
    dark: 'Intense & Gothic',
    hopeful: 'Ascending Light',
    nostalgic: 'Bittersweet Resonance'
  };

  const emotionalIntensity = intensityMap[mood.toLowerCase()] || intensityMap[emotion.toLowerCase()] || 'Harmonic & Measured';

  return {
    words,
    lines,
    characters,
    stanzas,
    readingTime: `${readingSeconds}s read`,
    emotionalIntensity
  };
}

// Multilingual Stanza & Imagery Bank
const LANGUAGE_TEMPLATES = {
  Japanese: {
    titles: ['夕暮れの残響', '雪解けの庭', '月の雫', '川風の歌', '心に咲く花'],
    haiku: `静けさに\n風の通り道\n光差す`,
    stanzas: [
      `木々の葉が\n静かに揺れる\n黄昏に`,
      `語られぬ想い\n露となり消ゆ\n遠き山並み`,
      `月影が映す\n忘れじの面影\n心澄み渡る`
    ],
    words: [
      { word: '黄昏 (Tasogare)', meaning: 'Twilight / golden dusk' },
      { word: '面影 (Omokage)', meaning: 'A lingering memory of someone’s face' },
      { word: '木漏れ日 (Komorebi)', meaning: 'Sunlight filtering through trees' }
    ]
  },
  French: {
    titles: ['L\'Heure Dorée', 'Le Miroir des Brumes', 'Le Vent des Souvenirs', 'Étoile d\'Automne'],
    haiku: `Un rayon d'argent\nGlisse sur l'onde claire\nLe silence naît`,
    stanzas: [
      `Dans le silence blanc des allées oubliées,\nLe vent dépose un chant que nul ne peut bannir.\nLes heures coulent lentes, doucement déliées,\nEt portent le fardeau fragile d'un soupir.`,
      `Sous la voûte d'azur où dorment les colombes,\nUne clarté nouvelle embrasse l'horizon.\nChaque ombre se dissipe et loin des froides tombes,\nL'espérance renaît au seuil de la maison.`
    ],
    words: [
      { word: 'Déliées', meaning: 'Unbound / gently untied' },
      { word: 'Lueur', meaning: 'A soft glimmer of comforting light' },
      { word: 'Voûte', meaning: 'The expansive arched vault of the sky' }
    ]
  },
  Spanish: {
    titles: ['Susurros del Alba', 'La Canción del Mar', 'Caminos de Sal y Viento', 'Luz entre la Niebla'],
    haiku: `Viento en la rama\nLa luz tibia del alba\nCanta la tarde`,
    stanzas: [
      `Entre la brisa suave que roza la colina,\nUn eco de campanas despierta la quietud.\nEl cielo se deshoja como una flor marina,\nY el alma halla su cauce de paz y gratitud.`,
      `No temas al silencio cuando la tarde cae,\nHay fuegos invisibles velando el corazón;\nLa noche con su manto estrellas siempre trae,\nY cada herida aprende su propia redención.`
    ],
    words: [
      { word: 'Quietud', meaning: 'Deep stillness and tranquility' },
      { word: 'Cauce', meaning: 'The natural path or riverbed' },
      { word: 'Alba', meaning: 'The first luminous crack of dawn' }
    ]
  },
  Hindi: {
    titles: ['सांझ की पाती', 'बूंदों की झंकार', 'चांदनी का आँचल', 'पहाड़ों का मौन', 'यादों का दीप'],
    haiku: `भीगी सी हवा\nसांझ की दहलीज पे\nदीप मुस्कुराए`,
    stanzas: [
      `धूप ढली तो यादों ने फिर दस्तक दी दीवारों पर,\nएक सुहानी शाम सजी है दिल के पुराने तारों पर।\nबहती नदियां कह जाती हैं सदियों का अफ़साना,\nमंजिल वही पुरानी है बस नया हुआ ठिकाना।`,
      `खामोशी में भी गूंज रही है मिट्टी की सोंधी खुशबू,\nरात के पहलू में जैसे बैठा हो कोई रूबरू।\nचांद गवाह बना बैठा है जागती हुई आंखों का,\nदर्द किनारा पा लेता है इन बहती सांसों का।`
    ],
    words: [
      { word: 'दस्तक (Dastak)', meaning: 'A gentle knock at the door' },
      { word: 'सोंधी (Sondhi)', meaning: 'Fragrance of rain-drenched parched soil (petrichor)' },
      { word: 'रूबरू (Roobaroo)', meaning: 'Face to face in sacred presence' },
      { word: 'अफ़साना (Afsana)', meaning: 'A poetic fable or timeless story' }
    ]
  },
  Marathi: {
    titles: ['सांजवेळ', 'स्वप्नांचे गाव', 'पावसाची गाणी', 'शांततेचे डोळे', 'चांदण्याचे तोरण'],
    haiku: `पानांची सळसळ\nपावसाचा मंद गंध\nमन मोहरले`,
    stanzas: [
      `सांजवेळी उंबरठ्यावर दिवे तेवती मंद,\nवाऱ्यावरती पसरत जातो ओल्या मातीचा गंध।\nआठवणींचे पक्षी फिरती आभाळाच्या गावी,\nकवितेमधुनी पुन्हा उमटते साधी गोष्ट नवी।`,
      `डोंगराच्या कुशीत विसावे निळे शांत पाणी,\nऊन सावली खेळत गाते आयुष्याची गाणी।\nमनाच्या कोपऱ्यात जपलेले क्षण सोनेरी झाले,\nरातराणीच्या सुगंधामध्ये सारे दुःख वाहून गेले।`
    ],
    words: [
      { word: 'सांजवेळ (Saanjvel)', meaning: 'Serene evening twilight' },
      { word: 'मोहरले (Moharle)', meaning: 'Blossomed with gentle delight' },
      { word: 'कुशीत (Kushit)', meaning: 'In the warm embrace / lap of nature' }
    ]
  },
  German: {
    titles: ['Lied der Dämmerung', 'Im Schatten der Fichten', 'Stille Wasser', 'Der Wind des Morgens'],
    haiku: `Blatt im Abendwind\nStille legt sich auf das Tal\nEin Stern wacht erwacht`,
    stanzas: [
      `Im tiefen Wald wo alte Eichen schweigen,\nWebt Nebel seinen Schleier durch die Nacht.\nDie Winde sanft im Geäst sich neigen,\nBis fern im Osten neues Licht erwacht.`,
      `Ein leiser Herzschlag hallt im weiten Raume,\nDie Zeit verliert ihr rastlos eilt Geschick.\nWir wandeln staunend wie in einem Traume,\nUnd finden heim in einen Augenblick.`
    ],
    words: [
      { word: 'Schleier', meaning: 'Veil of mist or cloud' },
      { word: 'Rastlos', meaning: 'Restless without pause' },
      { word: 'Augenblick', meaning: 'A brief, sacred moment in time' }
    ]
  },
  Italian: {
    titles: ['Canto della Sera', 'Onde di Luce', 'Il Silenzio dei Mandorli', 'Profumo di Mare'],
    haiku: `Vento tra i pini\nLa luce dell\'orizzonte\nCalma sul mare`,
    stanzas: [
      `L\'aria si tinge di rosa sul colle lontano,\nUn sussurro di foglie accompagna il tramonto sereno.\nIl cuore raccoglie la luce posata sul grano,\nE ogni pensiero si placa nel cielo d\'ebano e lino.`,
      `Oltre le onde che cantano al molo solitario,\nC\'è una speranza che non teme l\'inverno né il gelo;\nOgni respiro compone un intimo diario,\nScritto con gocce di rugiada e stelle nel cielo.`
    ],
    words: [
      { word: 'Tramonto', meaning: 'Sunset' },
      { word: 'Sussurro', meaning: 'A soft whisper of nature' },
      { word: 'Rugiada', meaning: 'Morning dew' }
    ]
  },
  Arabic: {
    titles: ['همس الليل', 'نسيم الفجر', 'ندى الأفق', 'أشرعة الأمل'],
    haiku: `ريحٌ في الشجر\nيسطعُ ضوءُ القمر\nيصحو السكون`,
    stanzas: [
      `تَفيضُ العُيونُ بأسرارِ المساءِ إذا دَنا،\nويَنسابُ في الصَّدرِ هَمْسٌ من النُّورِ قد صَفا.\nلنا في دروبِ الغَيبِ حلْمٌ يَقودُنا،\nكأنَّ الرَّجا بحرٌ يُعانِقُ مَرفَأَ الوَفا.`,
      `سَلِ الرِّيحَ كيفَ تُهَدْهِدُ أوراقَ الشَّجر،\nتُجيبُكَ بالصَّمتِ أبلغَ من طرَبِ الوَتَر.\nفلا تَحزَنَنَّ إن طالَ في الليلِ سُهادٌ،\nفبعدَ الظَّلامِ يُطِلُّ الصَّباحُ بلا كَدَر.`
    ],
    words: [
      { word: 'هَمْس (Hams)', meaning: 'Whisper of the breeze' },
      { word: 'مَرفأ (Marfa)', meaning: 'Safe harbor or peaceful haven' },
      { word: 'سُهاد (Suhad)', meaning: 'Nocturnal wakefulness / sleepless meditation' }
    ]
  },
  English: {
    titles: [
      'Where the Light Enters', 'The Geometry of Clouds', 'A Room Filled with Rain',
      'The Salt of Memory', 'Footsteps Across Amber Wood', 'A Map Made of Starlight'
    ],
    haiku: `Rain on copper leaves\nThe kettle begins to hum\nAll the clocks unwind`,
    sonnet: [
      `When weary shadows lengthen on the floor,\nAnd all the bustling market winds grow still,\nI hear the latch turn at the garden door,\nWhere ivy climbs the weathered window sill.\n\nNo gold was gathered in the heated race,\nNor laurels won beneath the burning noon;\nYet here within this solitary space,\nMy spirit dances with the rising moon.\n\nFor what are kingdoms to a quiet mind,\nThat finds a universe in simple grain?\nThe deepest treasures are not left behind,\nThey blossom gently through the evening rain.\n\nSo let the world spin onward as it must;\nIn quiet faith my heart resumes its trust.`
    ],
    stanzas: [
      `The kettle hums its quiet hymn upon the stove,\nOutside, the cedar branches stoop beneath the shower.\nWe do not speak of what we lost, but what we love:\nThe sudden scent of earth, the opening of a flower.`,
      `There is a stillness that arrives before the dawn,\nWhen every question rests its heavy head in sleep.\nThe fears that seemed like giants in the dark are gone,\nAnd only rivers running toward the sea run deep.`,
      `We leave our footprints on the damp and cedar bark,\nNot seeking monuments to prove that we were here;\nA single lantern carried through the velvet dark\nIs quite enough to make the winding pathway clear.`
    ],
    words: [
      { word: 'Petrichor', meaning: 'The earthy scent produced when rain falls on dry soil' },
      { word: 'Hymn', meaning: 'A song of quiet reverence and peace' },
      { word: 'Velvet', meaning: 'Soft, deep, and enveloping darkness' }
    ]
  }
};

export class DemoEngine {
  static generatePoem({
    theme = 'Nature',
    mood = 'Peaceful',
    emotion = 'Wonder',
    style = 'Free Verse',
    structure = 'Stanzaic',
    length = 'Medium',
    language = 'English',
    tone = 'Contemplative',
    perspective = 'First person',
    customInstructions = ''
  }) {
    const atmosphere = resolveAtmosphere(theme, mood, customInstructions);
    const langKey = LANGUAGE_TEMPLATES[language] ? language : 'English';
    const langData = LANGUAGE_TEMPLATES[langKey];

    let content = '';
    let title = '';
    let chosenWords = [...langData.words];

    if (style.toLowerCase() === 'haiku') {
      content = langData.haiku;
      title = `${theme} — ${mood} Haiku`;
    } else if (style.toLowerCase() === 'sonnet' && langData.sonnet) {
      content = langData.sonnet[0];
      title = `Sonnet of ${theme}`;
    } else {
      const numStanzas = length === 'Tiny' ? 1 : length === 'Short' ? 2 : length === 'Epic' ? 4 : 3;
      const stanzas = [];
      for (let i = 0; i < Math.min(numStanzas, langData.stanzas.length); i++) {
        stanzas.push(langData.stanzas[i]);
      }
      content = stanzas.join('\n\n');
      const randomTitle = langData.titles[Math.floor(Math.random() * langData.titles.length)];
      title = `${randomTitle} (${theme})`;
    }

    const explanation = {
      simpleMeaning: `A delicate verse exploring ${theme.toLowerCase()} through an emotional lens of ${emotion.toLowerCase()} and ${mood.toLowerCase()} stillness.`,
      themeInterpretation: `This poem can be interpreted as an exploration of how ${theme.toLowerCase()} reflects our inner capacity for ${emotion.toLowerCase()} in a fast-moving world.`,
      emotionalInterpretation: `The cadence vibrates with ${mood.toLowerCase()} intimacy, offering the reader sanctuary and space to exhale.`,
      imagery: `Sensory layers of light, natural breeze, ambient rain or starlight, and grounding textures.`,
      metaphors: `Natural elements serve as mirrors for the quiet, enduring motions of the human soul.`,
      symbols: `The wind (unspoken transition), The light (renewal), The quiet path (personal journey).`
    };

    let translation = 'Original written in the target language.';
    if (language !== 'English') {
      translation = `In this quiet moment,\nThe elements whisper of ${theme.toLowerCase()};\nA gentle dawn emerges from the quiet shadow,\nAnd peace returns to where we stand.`;
    }

    const atmosphereProfile = resolveAtmosphereProfile(atmosphere, theme, mood);
    const stats = calculatePoemStats(content, mood, emotion);

    const dna = {
      emotion: emotion.toUpperCase(),
      mood: mood.toUpperCase(),
      theme: theme.toUpperCase(),
      energy: (mood === 'Energetic' || mood === 'Joyful') ? 'RADIANT' : 'GENTLE & SERENE',
      tone: tone.toUpperCase(),
      atmosphere: atmosphere.toUpperCase()
    };

    return {
      title,
      content,
      language,
      theme,
      mood,
      emotion,
      style,
      structure: `${style} • ${length}`,
      tone,
      perspective,
      atmosphere,
      atmosphereProfile,
      dna,
      stats,
      explanation,
      translation,
      vocabulary: chosenWords,
      tags: [theme.toLowerCase(), mood.toLowerCase(), style.toLowerCase(), atmosphere],
      journey: [
        { action: 'Created', timestamp: new Date().toISOString(), detail: `Composed in ${language}` }
      ],
      versions: [
        { version: 1, title, content, timestamp: new Date().toISOString(), action: 'Original Generation' }
      ],
      isDemo: true,
      demoNote: 'Generated via POETICA Intelligent Offline Engine'
    };
  }

  static remixPoem(originalPoem, remixType = 'more_poetic') {
    const atmosphere = resolveAtmosphere(originalPoem.theme, originalPoem.mood, remixType);
    let modifiedContent = originalPoem.content;
    let label = 'Remixed';

    if (remixType === 'shorter') {
      const lines = originalPoem.content.split('\n').filter(l => l.trim().length > 0);
      modifiedContent = lines.slice(0, Math.max(3, Math.floor(lines.length / 2))).join('\n');
      label = 'Condensed & Distilled';
    } else if (remixType === 'longer') {
      modifiedContent = `${originalPoem.content}\n\nAnd when the final candle flickers out,\nThe silence sings what words could never trace;\nNo room remains for sorrow or for doubt,\nWhere memory leaves its luminous embrace.`;
      label = 'Expanded & Deepened';
    } else if (remixType === 'happier') {
      modifiedContent = `${originalPoem.content}\n\nNow laughter dances in the morning beam,\nAnd every sorrow melts into the sun;\nAwake at last within a golden dream,\nA brighter, braver journey has begun.`;
      label = 'Illuminated with Joy';
    } else if (remixType === 'darker') {
      modifiedContent = `${originalPoem.content}\n\nBeneath the obsidian vault of hollow stone,\nThe raven watches what the light conceals;\nWe walk the narrow twilight path alone,\nWhere only time our silent injury heals.`;
      label = 'Cast in Velvet Shadows';
    } else {
      modifiedContent = `${originalPoem.content}\n\nO gentle breath that stirs the slumbering vine,\nBe witness to this fragile grace of ours;\nWhere fleeting earth touches the divine,\nBeneath a sanctuary made of stars.`;
      label = 'Elevated Lyrical Resonance';
    }

    const newTitle = `${originalPoem.title} (${label})`;
    const stats = calculatePoemStats(modifiedContent, originalPoem.mood, originalPoem.emotion);
    const atmosphereProfile = resolveAtmosphereProfile(atmosphere, originalPoem.theme, originalPoem.mood);

    const existingVersions = Array.isArray(originalPoem.versions) ? originalPoem.versions : [];
    const newVersion = {
      version: existingVersions.length + 1,
      title: newTitle,
      content: modifiedContent,
      timestamp: new Date().toISOString(),
      action: `Remix: ${remixType}`
    };

    const existingJourney = Array.isArray(originalPoem.journey) ? originalPoem.journey : [];
    const newJourneyEntry = {
      action: 'Remixed',
      timestamp: new Date().toISOString(),
      detail: label
    };

    return {
      ...originalPoem,
      title: newTitle,
      content: modifiedContent,
      atmosphere,
      atmosphereProfile,
      stats,
      versions: [...existingVersions, newVersion],
      journey: [...existingJourney, newJourneyEntry],
      isDemo: true,
      remixedWith: remixType
    };
  }

  static translatePoem(originalPoem, targetLanguage = 'French') {
    const langKey = LANGUAGE_TEMPLATES[targetLanguage] ? targetLanguage : 'English';
    const langData = LANGUAGE_TEMPLATES[langKey];
    
    return {
      original: originalPoem.content,
      originalLanguage: originalPoem.language,
      targetLanguage,
      translatedTitle: langData.titles[0] || `${originalPoem.title} [${targetLanguage}]`,
      translatedContent: langData.stanzas[0] || `[Poetic translation of "${originalPoem.title}" into ${targetLanguage}]\n\n${langData.haiku}`,
      poeticNotes: `Carefully translated to preserve the ${(originalPoem.mood || 'reflective').toLowerCase()} emotional cadence and imagery rather than literal word-for-word substitution.`
    };
  }

  static generateTitles(poem) {
    const theme = poem.theme || 'Memory';
    return [
      { category: 'Poetic', title: `Where the ${theme} Whispers in Twilight` },
      { category: 'Minimal', title: `${theme}` },
      { category: 'Mysterious', title: `The Shadows Behind the Latch` },
      { category: 'Emotional', title: `All That Remains of Us` },
      { category: 'Modern', title: `The Architecture of ${theme}` }
    ];
  }

  static analyzeLine(line = '', mode = 'improve') {
    const cleanLine = line.trim() || 'The amber light dissolves along the stone';

    switch (mode) {
      case 'softer':
        return {
          mode: 'Make Softer',
          original: cleanLine,
          suggestion: 'A quiet glow drifts gently on the stone, like breath upon glass.',
          nuance: 'Tender, intimate, reducing sharpness in rhythm.'
        };
      case 'deeper':
        return {
          mode: 'Make Deeper',
          original: cleanLine,
          suggestion: 'Time turns to ash upon the ancient sill, where silence drinks the dusk.',
          nuance: 'Metaphysical weight, existential resonance.'
        };
      case 'romantic':
        return {
          mode: 'Make More Romantic',
          original: cleanLine,
          suggestion: 'Your hand within the dusk, where every shadow learns to bloom.',
          nuance: 'Passionate and vulnerable lyricism.'
        };
      case 'mysterious':
        return {
          mode: 'Make More Mysterious',
          original: cleanLine,
          suggestion: 'Beneath the moss, a secret clock still ticks what no mouth will confess.',
          nuance: 'Twilight wonder, gothic intrigue.'
        };
      case 'simplify':
        return {
          mode: 'Simplify',
          original: cleanLine,
          suggestion: 'Light leaves the stone. Night comes.',
          nuance: 'Distilled poetic purity.'
        };
      case 'alternatives':
        return {
          mode: 'Find Alternatives',
          original: cleanLine,
          variants: [
            'The amber light dissolves along the stone,',
            'Where ancient shadows breathe their quiet sigh,',
            'A sudden hush where wandering echoes sleep.'
          ]
        };
      case 'improve':
      default:
        return {
          mode: 'Improve Line',
          original: cleanLine,
          suggestion: 'Through gossamer mist, the amber light dissolves along the stone.',
          nuance: 'Elevated sensory texture and rhythm.'
        };
    }
  }

  static completeThought(seed = '') {
    const cleanSeed = seed.trim() || 'Perhaps we were never meant to stay, only...';
    return {
      seed: cleanSeed,
      continuation: `${cleanSeed}\n\nOnly to leave our names on morning glass,\nTo teach the wind how gently love can pass;\nNot anchored to the shore of what we knew,\nBut flowing onward toward a deeper blue.`
    };
  }

  static assistPoem(action, lineOrStanza = '', context = '') {
    switch (action) {
      case 'improve_line':
        return {
          original: lineOrStanza,
          suggestions: [
            `The amber light dissolves along the stone,`,
            `Where ancient shadows breathe their quiet sigh,`,
            `A sudden hush where wandering echoes sleep.`
          ]
        };
      case 'find_better_word':
        return {
          word: lineOrStanza,
          alternatives: [
            { word: 'Luminous', nuance: 'Giving off a tender, soothing light' },
            { word: 'Ethereal', nuance: 'Extremely delicate and light, not of this world' },
            { word: 'Resonant', nuance: 'Deep, clear, and continuing to echo with feeling' },
            { word: 'Gossamer', nuance: 'Incredibly fine, filmy, like cobwebs in the dawn' }
          ]
        };
      case 'make_more_poetic':
        return {
          original: lineOrStanza,
          refined: `Through gossamer veils of twilight mist,\nThe silent river cradles every falling star.`
        };
      case 'continue_poem':
        return {
          continuation: `We leave no monument behind save this:\nA quiet path where future wanderers meet,\nTo learn that even parting holds its bliss,\nWhen walked with patient and forgiving feet.`
        };
      case 'rewrite_stanza':
      default:
        return {
          original: lineOrStanza,
          rewritten: `The shadows lengthen as the swallows turn,\nAbove the roofs of terracotta clay;\nA solitary lantern starts to burn,\nTo guide the dreamers at the edge of day.`
        };
    }
  }

  static generatePrompt({ theme, emotion, difficulty = 'Medium' }) {
    const prompts = [
      {
        title: `The Letter Kept in the Attic`,
        prompt: `Write about an unsent letter found inside an old violin case, written on yellowed parchment during a forgotten winter.`,
        theme: theme || 'Memories',
        mood: 'Nostalgic',
        emotion: emotion || 'Longing',
        difficulty
      },
      {
        title: `When the Train Missed its Station`,
        prompt: `Describe arriving at an unexpected small countryside station covered in cherry blossoms, deciding not to board the next train.`,
        theme: theme || 'Adventure',
        mood: 'Peaceful',
        emotion: emotion || 'Wonder',
        difficulty
      },
      {
        title: `Dialogue with a River`,
        prompt: `Speak to a fast-flowing mountain river, asking it to carry away a grudge you have held onto for too many years.`,
        theme: theme || 'Freedom',
        mood: 'Serene',
        emotion: emotion || 'Peace',
        difficulty
      }
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
  }
}
