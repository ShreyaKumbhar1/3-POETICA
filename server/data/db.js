import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  users: [
    {
      id: 'usr_poetica_curator',
      username: 'poetica_curator',
      email: 'curator@poetica.art',
      passwordHash: '$2a$10$wT0o3q6k2f3b9c7d1e5a8u9j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8', // poetica2026
      displayName: 'Poetica Studio',
      bio: 'Resident curator crafting timeless verses across languages and dawn-tinted atmospheres.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      favoriteGenres: ['Romantic', 'Free Verse', 'Haiku', 'Spoken Word'],
      favoriteLanguages: ['English', 'Japanese', 'Hindi', 'French', 'Spanish'],
      isPublic: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  poems: [
    {
      id: 'poem_sakura_01',
      userId: 'usr_poetica_curator',
      authorName: 'Poetica Studio',
      authorUsername: 'poetica_curator',
      title: '桜のささやき (Whispers of the Sakura)',
      content: `花びらが\n風にゆられて\n春を待つ\n\n枝を離れし薄紅の\n夢の足音 静かなり\n川面に浮かぶ 月の影\n散りゆく今を 愛おしむ`,
      language: 'Japanese',
      theme: 'Nature',
      mood: 'Peaceful',
      emotion: 'Wonder',
      style: 'Classical',
      structure: 'Haiku & Tanka inspired',
      tone: 'Contemplative',
      atmosphere: 'sakura',
      explanation: {
        simpleMeaning: 'A tranquil meditation on cherry blossoms falling softly onto a river under the moonlight, honoring the beauty of transient moments.',
        themeInterpretation: 'This poem can be interpreted as an ode to mono no aware—the gentle awareness of impermanence in nature and human life.',
        emotionalInterpretation: 'The tone evokes quiet serenity paired with tender nostalgia for moments that cannot last forever.',
        imagery: 'Pale pink petals fluttering in gentle wind, soft shadows cast on rippling river water beneath an evening moon.',
        metaphors: 'Falling petals as "footsteps of a dream", symbolizing ephemeral memories softly passing into memory.',
        symbols: 'Cherry blossom (renewal and impermanence), River (flow of time), Moonlight (quiet witness).'
      },
      translation: 'Petals sway in the wind,\nWaiting for spring.\n\nSoft pink leaves the branch,\nFootsteps of a dream are quiet.\nOn the river\'s face floats the moon\'s shadow;\nTreasuring this fleeting moment as it scatters.',
      vocabulary: [
        { word: '花びら (Hanabira)', meaning: 'Flower petal' },
        { word: 'ゆられて (Yurarete)', meaning: 'Swaying gently' },
        { word: '薄紅 (Usubeni)', meaning: 'Pale delicate pink / blush' },
        { word: '愛おしむ (Itooshimu)', meaning: 'To hold dear / cherish tenderly' }
      ],
      tags: ['sakura', 'japan', 'spring', 'impermanence', 'moon'],
      isPublic: true,
      likesCount: 38,
      favoritesCount: 24,
      createdAt: '2026-02-14T10:00:00.000Z',
      updatedAt: '2026-02-14T10:00:00.000Z'
    },
    {
      id: 'poem_rain_02',
      userId: 'usr_poetica_curator',
      authorName: 'Poetica Studio',
      authorUsername: 'poetica_curator',
      title: 'Midnight Rain on Rue de Rivoli',
      content: `The cobblestones mirror the amber lamps,\nEach droplet a solitary chime upon the slate.\nWe walked between the pauses of the storm,\nYour coat still carrying the scent of damp wool and roasted chicory.\n\nTime dissolved into soft puddles,\nWhere the shadows of gargoyles drank the mist.\nNothing was spoken, yet the night replied\nWith all the verses we had dared not name.`,
      language: 'English',
      theme: 'Rain',
      mood: 'Melancholic',
      emotion: 'Longing',
      style: 'Free Verse',
      structure: 'Two stanzas of unrhymed lyrical imagery',
      tone: 'Wistful',
      atmosphere: 'rain',
      explanation: {
        simpleMeaning: 'Two companions wandering through a quiet, rain-slicked city at night, sharing an unspoken intimacy surrounded by mist and old architecture.',
        themeInterpretation: 'This poem can be interpreted as how rainfall acts as a sanctuary for quiet feelings that daytime conversations leave unexpressed.',
        emotionalInterpretation: 'A tender melancholy laced with comfort in solitude and companionship.',
        imagery: 'Amber gaslamps shimmering across wet stones, mist rising off rooftop slate, steam from roasted chicory.',
        metaphors: '"Time dissolved into soft puddles" suggests moments losing their rigid schedule to emotional depth.',
        symbols: 'The rain (purification and emotional release), The cobblestones (memory and endurance).'
      },
      translation: 'Original written in English.',
      vocabulary: [
        { word: 'Cobblestones', meaning: 'Rounded stones used for ancient street paving' },
        { word: 'Chicory', meaning: 'A fragrant roasted root traditionally brewed in Parisian coffee' },
        { word: 'Gargoyles', meaning: 'Carved stone figures resting upon historic stone cathedrals' }
      ],
      tags: ['rain', 'paris', 'melancholy', 'longing', 'midnight'],
      isPublic: true,
      likesCount: 52,
      favoritesCount: 31,
      createdAt: '2026-02-18T18:30:00.000Z',
      updatedAt: '2026-02-18T18:30:00.000Z'
    },
    {
      id: 'poem_hindi_03',
      userId: 'usr_poetica_curator',
      authorName: 'Poetica Studio',
      authorUsername: 'poetica_curator',
      title: 'पहाड़ों की ओट में (In the Lap of the Mountains)',
      content: `धुंध की चादर ओढ़े पर्वत,\nनीले अंबर से बतियाते हैं।\nनदियों के ठंडे पानी में,\nबीते मौसम बह जाते हैं।\n\nमौन सिखाता गहरा होना,\nहवा सुनाती इक पैग़ाम,\nथक कर जब सूरज ढलता है,\nशाम पहनती तारों का नाम।`,
      language: 'Hindi',
      theme: 'Mountains',
      mood: 'Peaceful',
      emotion: 'Peace',
      style: 'Classical',
      structure: 'Two rhythmic quatrains with rhyming couplets',
      tone: 'Contemplative',
      atmosphere: 'mountain',
      explanation: {
        simpleMeaning: 'The mountains draped in morning mist converse with the blue sky while cold river waters wash away bygone seasons. As dusk settles, silence teaches depth and evening dresses in stars.',
        themeInterpretation: 'This poem can be interpreted as an ode to stillness and timeless endurance, where nature gently teaches humility.',
        emotionalInterpretation: 'Deep calm and grounding peace away from city clamor.',
        imagery: 'Mountains draped in a blanket of mist, cold mountain streams, golden setting sun yielding to a star-studded sky.',
        metaphors: '"धुंध की चादर" (Blanket of mist) and "मौन सिखाता गहरा होना" (Silence teaches how to be deep).',
        symbols: 'Mountain (immutability and strength), Stream (the gentle passing of time).'
      },
      translation: 'Mountains wearing blankets of mist,\nWhisper to the boundless blue sky.\nIn the cold waters of winding rivers,\nPast seasons gently drift away.\n\nSilence teaches the art of becoming deep,\nThe mountain breeze delivers a quiet message;\nWhen the tired sun begins to set,\nThe evening drapes herself in the names of stars.',
      vocabulary: [
        { word: 'ओट (Oat)', meaning: 'Shelter / lap / embrace' },
        { word: 'धुंध (Dhundh)', meaning: 'Misty fog or mountain vapor' },
        { word: 'पैग़ाम (Paigaam)', meaning: 'A message or tidings' },
        { word: 'मौन (Maun)', meaning: 'Profound sacred silence' }
      ],
      tags: ['himalayas', 'peace', 'mountain', 'mist', 'hindi'],
      isPublic: true,
      likesCount: 47,
      favoritesCount: 29,
      createdAt: '2026-03-01T08:15:00.000Z',
      updatedAt: '2026-03-01T08:15:00.000Z'
    },
    {
      id: 'poem_french_04',
      userId: 'usr_poetica_curator',
      authorName: 'Poetica Studio',
      authorUsername: 'poetica_curator',
      title: 'Clair de Lune sur l\'Océan',
      content: `L\'onde d\'argent caresse le rivage endormi,\nUn soupir de marée efface chaque pas.\nDans l\'infini nocturne où tout devient ami,\nL\'étoile solitaire ne s\'éteindra pas.\n\nNous appartenons au ressac et au vent,\nÀ cette lueur douce qui guide l\'errant.`,
      language: 'French',
      theme: 'Ocean',
      mood: 'Dreamy',
      emotion: 'Hope',
      style: 'Romantic',
      structure: 'Alexandrine-inspired lyrical sextet',
      tone: 'Ethereal',
      atmosphere: 'ocean',
      explanation: {
        simpleMeaning: 'Silver waves gently caress a sleeping shore, erasing footprints. In the vast night where solitude turns into peace, a steadfast star continues to shine.',
        themeInterpretation: 'This poem can be interpreted as how the rhythmic ebb and flow of the ocean soothes human grief and restores inner hope.',
        emotionalInterpretation: 'Luminous comfort, dreamy transcendence, and reassurance in the journey of life.',
        imagery: 'Silver waves reflecting the moon, quiet footprints dissolving on wet sand, a solitary bright lighthouse/star.',
        metaphors: '"L\'onde d\'argent" (silver wave as a velvet touch of comfort).',
        symbols: 'Ocean tide (renewal and eternal rhythm), Lone star (hope and inner compass).'
      },
      translation: 'The silver wave caresses the sleeping shore,\nA sigh of tide erases every footprint.\nIn the nocturnal infinity where all things become friend,\nThe solitary star will never fade away.\n\nWe belong to the breaking surf and the wind,\nTo that tender glow which guides the wanderer.',
      vocabulary: [
        { word: 'Ressac', meaning: 'The breaking backwash of sea waves' },
        { word: 'Rivage', meaning: 'The tranquil shore / coastline' },
        { word: 'Errant', meaning: 'The seeker / wanderer traveling without hurry' }
      ],
      tags: ['french', 'ocean', 'moonlight', 'romantic', 'dreamy'],
      isPublic: true,
      likesCount: 61,
      favoritesCount: 45,
      createdAt: '2026-03-05T21:40:00.000Z',
      updatedAt: '2026-03-05T21:40:00.000Z'
    }
  ],
  collections: [
    {
      id: 'col_01',
      userId: 'usr_poetica_curator',
      name: 'Midnight Thoughts',
      description: 'Verses whispered in the quiet hours when the rest of the world has fallen asleep.',
      poemIds: ['poem_rain_02'],
      createdAt: '2026-02-18T19:00:00.000Z',
      updatedAt: '2026-02-18T19:00:00.000Z'
    },
    {
      id: 'col_02',
      userId: 'usr_poetica_curator',
      name: 'Seasons & Solitude',
      description: 'Poetic meditations on cherry blossoms, mountain trails, and moonlit waves.',
      poemIds: ['poem_sakura_01', 'poem_hindi_03', 'poem_french_04'],
      createdAt: '2026-02-20T10:00:00.000Z',
      updatedAt: '2026-02-20T10:00:00.000Z'
    }
  ],
  likes: [
    { id: 'like_01', poemId: 'poem_sakura_01', userId: 'usr_poetica_curator' },
    { id: 'like_02', poemId: 'poem_rain_02', userId: 'usr_poetica_curator' }
  ],
  favorites: [
    { id: 'fav_01', poemId: 'poem_sakura_01', userId: 'usr_poetica_curator' },
    { id: 'fav_02', poemId: 'poem_hindi_03', userId: 'usr_poetica_curator' }
  ],
  drafts: [],
  reports: [],
  prompts: [
    {
      id: 'prm_01',
      title: 'A Goodbye Never Spoken',
      prompt: 'Write about a parting that took place without a single word—where only an empty chair, a cooled cup of tea, or a closing train door delivered the farewell.',
      theme: 'Heartbreak',
      mood: 'Melancholic',
      emotion: 'Longing',
      difficulty: 'Medium'
    },
    {
      id: 'prm_02',
      title: 'First Rain After Months of Drought',
      prompt: 'Describe the scent of petrichor rising from baked clay when sudden drops fall on hot tin roofs after a long, weary summer.',
      theme: 'Rain',
      mood: 'Joyful',
      emotion: 'Gratitude',
      difficulty: 'Easy'
    },
    {
      id: 'prm_03',
      title: 'A Letter to Your Future Self at Eighty',
      prompt: 'Speak to the hands that will one day turn these pages, asking which dreams stood the test of wind and which were gladly surrendered.',
      theme: 'Time',
      mood: 'Philosophical',
      emotion: 'Wonder',
      difficulty: 'Advanced'
    },
    {
      id: 'prm_04',
      title: 'The Secret Life of Fireflies',
      prompt: 'Write in first person from the perspective of an evening ember floating between pine needles, seeking another spark in the darkening forest.',
      theme: 'Nature',
      mood: 'Dreamy',
      emotion: 'Hope',
      difficulty: 'Creative'
    }
  ]
};

class Database {
  constructor() {
    this.data = null;
    this.initPromise = this.init();
  }

  async init() {
    try {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      const exists = await fs.access(DB_PATH).then(() => true).catch(() => false);
      if (exists) {
        const raw = await fs.readFile(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        await this.persist();
      }
    } catch (err) {
      console.error('Error initializing database file:', err);
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  async persist() {
    try {
      const tempPath = `${DB_PATH}.tmp`;
      await fs.writeFile(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      await fs.rename(tempPath, DB_PATH);
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  async ready() {
    await this.initPromise;
  }

  // Users
  async getUsers() {
    await this.ready();
    return this.data.users;
  }

  async findUserById(id) {
    await this.ready();
    return this.data.users.find(u => u.id === id) || null;
  }

  async findUserByUsernameOrEmail(identifier) {
    await this.ready();
    const clean = identifier.toLowerCase().trim();
    return this.data.users.find(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean) || null;
  }

  async createUser(user) {
    await this.ready();
    this.data.users.push(user);
    await this.persist();
    return user;
  }

  async updateUser(id, updates) {
    await this.ready();
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    await this.persist();
    return this.data.users[index];
  }

  // Poems
  async getPoems(filters = {}) {
    await this.ready();
    let poems = [...this.data.poems];

    if (filters.userId) {
      poems = poems.filter(p => p.userId === filters.userId);
    }
    if (filters.isPublic !== undefined) {
      poems = poems.filter(p => p.isPublic === filters.isPublic);
    }
    if (filters.language) {
      poems = poems.filter(p => p.language.toLowerCase() === filters.language.toLowerCase());
    }
    if (filters.mood) {
      poems = poems.filter(p => p.mood.toLowerCase() === filters.mood.toLowerCase());
    }
    if (filters.style) {
      poems = poems.filter(p => p.style.toLowerCase() === filters.style.toLowerCase());
    }
    if (filters.theme) {
      poems = poems.filter(p => p.theme.toLowerCase() === filters.theme.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      poems = poems.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q) ||
        (p.authorName && p.authorName.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    const sort = filters.sort || 'newest';
    if (sort === 'newest') {
      poems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      poems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'alphabetical') {
      poems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'recently_edited') {
      poems.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    } else if (sort === 'likes') {
      poems.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    }

    return poems;
  }

  async getPoemById(id) {
    await this.ready();
    return this.data.poems.find(p => p.id === id) || null;
  }

  async createPoem(poem) {
    await this.ready();
    this.data.poems.unshift(poem);
    await this.persist();
    return poem;
  }

  async updatePoem(id, updates) {
    await this.ready();
    const index = this.data.poems.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.poems[index] = { ...this.data.poems[index], ...updates, updatedAt: new Date().toISOString() };
    await this.persist();
    return this.data.poems[index];
  }

  async deletePoem(id) {
    await this.ready();
    const initialLen = this.data.poems.length;
    this.data.poems = this.data.poems.filter(p => p.id !== id);
    // Also remove from favorites, likes, collections
    this.data.likes = this.data.likes.filter(l => l.poemId !== id);
    this.data.favorites = this.data.favorites.filter(f => f.poemId !== id);
    this.data.collections.forEach(c => {
      c.poemIds = c.poemIds.filter(pid => pid !== id);
    });
    await this.persist();
    return this.data.poems.length < initialLen;
  }

  // Likes & Favorites
  async toggleLike(poemId, userId) {
    await this.ready();
    const existingIndex = this.data.likes.findIndex(l => l.poemId === poemId && l.userId === userId);
    let isLiked = false;
    const poem = await this.getPoemById(poemId);
    if (!poem) return { error: 'Poem not found' };

    if (existingIndex > -1) {
      this.data.likes.splice(existingIndex, 1);
      poem.likesCount = Math.max(0, (poem.likesCount || 1) - 1);
      isLiked = false;
    } else {
      this.data.likes.push({ id: `like_${Date.now()}`, poemId, userId });
      poem.likesCount = (poem.likesCount || 0) + 1;
      isLiked = true;
    }
    await this.persist();
    return { isLiked, likesCount: poem.likesCount };
  }

  async toggleFavorite(poemId, userId) {
    await this.ready();
    const existingIndex = this.data.favorites.findIndex(f => f.poemId === poemId && f.userId === userId);
    let isFavorited = false;
    const poem = await this.getPoemById(poemId);
    if (!poem) return { error: 'Poem not found' };

    if (existingIndex > -1) {
      this.data.favorites.splice(existingIndex, 1);
      poem.favoritesCount = Math.max(0, (poem.favoritesCount || 1) - 1);
      isFavorited = false;
    } else {
      this.data.favorites.push({ id: `fav_${Date.now()}`, poemId, userId });
      poem.favoritesCount = (poem.favoritesCount || 0) + 1;
      isFavorited = true;
    }
    await this.persist();
    return { isFavorited, favoritesCount: poem.favoritesCount };
  }

  async isLikedByUser(poemId, userId) {
    await this.ready();
    return this.data.likes.some(l => l.poemId === poemId && l.userId === userId);
  }

  async isFavoritedByUser(poemId, userId) {
    await this.ready();
    return this.data.favorites.some(f => f.poemId === poemId && f.userId === userId);
  }

  async getUserFavoritePoemIds(userId) {
    await this.ready();
    return this.data.favorites.filter(f => f.userId === userId).map(f => f.poemId);
  }

  // Collections
  async getCollections(userId) {
    await this.ready();
    return this.data.collections.filter(c => c.userId === userId);
  }

  async createCollection(collection) {
    await this.ready();
    this.data.collections.push(collection);
    await this.persist();
    return collection;
  }

  async updateCollection(id, userId, updates) {
    await this.ready();
    const index = this.data.collections.findIndex(c => c.id === id && c.userId === userId);
    if (index === -1) return null;
    this.data.collections[index] = { ...this.data.collections[index], ...updates, updatedAt: new Date().toISOString() };
    await this.persist();
    return this.data.collections[index];
  }

  async deleteCollection(id, userId) {
    await this.ready();
    const initialLen = this.data.collections.length;
    this.data.collections = this.data.collections.filter(c => !(c.id === id && c.userId === userId));
    await this.persist();
    return this.data.collections.length < initialLen;
  }

  // Reports
  async createReport(report) {
    await this.ready();
    this.data.reports.push(report);
    await this.persist();
    return report;
  }

  // Prompts
  async getPrompts() {
    await this.ready();
    return this.data.prompts;
  }
}

export const db = new Database();
