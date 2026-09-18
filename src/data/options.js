export const THEMES = [
  'Love', 'Friendship', 'Nature', 'Rain', 'Mountains', 'Ocean',
  'Childhood', 'Memories', 'Dreams', 'Hope', 'Heartbreak', 'Solitude',
  'Adventure', 'Family', 'Success', 'Failure', 'Freedom', 'Time',
  'Life', 'Death', 'New beginnings', 'Long distance', 'College life',
  'Festivals', 'Travel', 'Night', 'Sunrise', 'Seasons'
];

export const MOODS = [
  'Peaceful', 'Romantic', 'Melancholic', 'Joyful', 'Nostalgic',
  'Mysterious', 'Hopeful', 'Dreamy', 'Calm', 'Dark', 'Energetic',
  'Lonely', 'Playful', 'Inspirational', 'Bittersweet', 'Serene'
];

export const EMOTIONS = [
  'Love', 'Happiness', 'Sadness', 'Anger', 'Fear', 'Hope',
  'Longing', 'Gratitude', 'Nostalgia', 'Excitement', 'Peace',
  'Wonder', 'Regret', 'Belonging', 'Loneliness'
];

export const POETRY_STYLES = [
  { id: 'Free Verse', desc: 'No strict meter or rhyme, organic flow' },
  { id: 'Haiku', desc: '5-7-5 syllable essence capturing a moment' },
  { id: 'Sonnet', desc: '14-line lyrical meditation with classic rhyme' },
  { id: 'Limerick', desc: 'Witty, rhythmic 5-line AABBA form' },
  { id: 'Narrative', desc: 'Storytelling verse following a journey' },
  { id: 'Romantic', desc: 'Passionate exploration of beauty, love & nature' },
  { id: 'Minimalist', desc: 'Few profound words with heavy resonance' },
  { id: 'Modern', desc: 'Contemporary voice, fresh metaphors, free cadence' },
  { id: 'Classical', desc: 'Elevated diction, rhythmic poise, timeless themes' },
  { id: 'Epic', desc: 'Heroic, sweeping scale and monumental drama' },
  { id: 'Spoken Word', desc: 'Rhythmic, intimate, crafted for vocal impact' },
  { id: 'Prose Poetry', desc: 'Paragraph form infused with deep poetic imagery' },
  { id: 'Nature Poetry', desc: 'Sensory celebration of earth, sky, flora & fauna' },
  { id: 'Dark Poetry', desc: 'Shadows, twilight, gothic wonder and deep introspection' },
  { id: 'Philosophical', desc: 'Existential wonder, metaphysical musings' },
  { id: 'Inspirational', desc: 'Uplifting, empowering, igniting courage and hope' },
  { id: 'Children’s Poetry', desc: 'Whimsical, innocent, playful rhymes and joy' },
  { id: 'Experimental', desc: 'Unconventional rhythms, fragmented syntax, avant-garde' }
];

export const LENGTHS = [
  { id: 'Tiny', lines: '1–4 lines', desc: 'Whisper-short epigram' },
  { id: 'Short', lines: '4–8 lines', desc: 'Single poignant stanza' },
  { id: 'Medium', lines: '8–16 lines', desc: 'Classic lyrical development' },
  { id: 'Long', lines: '16–30 lines', desc: 'Multi-stanza unfolding' },
  { id: 'Epic', lines: '30+ lines', desc: 'Expansive poetic canvas' }
];

export const TONES = [
  'Intimate', 'Lyrical', 'Whimsical', 'Somber', 'Ethereal',
  'Passionate', 'Wistful', 'Contemplative', 'Triumphant', 'Reverent'
];

export const PERSPECTIVES = [
  'First person ("I")', 'Second person ("You")', 'Third person ("They / It")', 'Omniscient chorus'
];

export const ATMOSPHERES = [
  { id: 'auto', label: 'Auto (From Poem)', icon: 'Sparkles', color: '#E8E4F3' },
  { id: 'sakura', label: 'Sakura Breeze', icon: 'Flower2', color: '#F7D6D0' },
  { id: 'rain', label: 'Midnight Rain', icon: 'CloudRain', color: '#E2EAF4' },
  { id: 'mountain', label: 'Misty Mountains', icon: 'Mountain', color: '#DCE7E1' },
  { id: 'ocean', label: 'Luminous Ocean', icon: 'Waves', color: '#DBE9EE' },
  { id: 'forest', label: 'Twilight Forest', icon: 'Trees', color: '#D7E5D5' },
  { id: 'night', label: 'Starlight Moon', icon: 'Moon', color: '#2B2544' },
  { id: 'autumn', label: 'Amber Autumn', icon: 'Wind', color: '#F4DECB' },
  { id: 'winter', label: 'Frosted Winter', icon: 'Snowflake', color: '#E9EEF4' },
  { id: 'spring', label: 'Radiant Spring', icon: 'Sun', color: '#F8E6E8' },
  { id: 'sunrise', label: 'Golden Dawn', icon: 'Sunrise', color: '#FBE8D3' },
  { id: 'minimal', label: 'Calm Sanctuary', icon: 'Feather', color: '#FAF7F2' }
];

export const REMIX_OPTIONS = [
  { id: 'happier', label: 'Make it happier', icon: 'Sun' },
  { id: 'sadder', label: 'Make it sadder & more melancholic', icon: 'CloudRain' },
  { id: 'darker', label: 'Make it darker & deeper', icon: 'Moon' },
  { id: 'more_romantic', label: 'Make it more romantic', icon: 'Heart' },
  { id: 'simpler', label: 'Make it simpler & purer', icon: 'Feather' },
  { id: 'deeper', label: 'Make it deeper & philosophical', icon: 'Compass' },
  { id: 'shorter', label: 'Make it shorter & concise', icon: 'Minimize2' },
  { id: 'longer', label: 'Make it longer & detailed', icon: 'Maximize2' },
  { id: 'more_poetic', label: 'Elevate poetic diction & imagery', icon: 'Sparkles' },
  { id: 'more_modern', label: 'Make it modern & contemporary', icon: 'Zap' },
  { id: 'more_classical', label: 'Make it classical & formal', icon: 'BookOpen' },
  { id: 'more_dramatic', label: 'Infuse high drama & intensity', icon: 'Flame' }
];

export const ROTATING_LOADING_MESSAGES = [
  'Listening to your idea...',
  'Finding the right words...',
  'Following the rhythm...',
  'Painting the atmosphere...',
  'Writing between the lines...',
  'Gathering the metaphors...',
  'Polishing the cadence...',
  'Almost there...'
];

// Poem Seeds (Small creative starting ideas)
export const POEM_SEEDS = [
  'the last train home',
  'a letter I never sent',
  'rain on an empty street',
  'the smell of my childhood home',
  'someone I almost met',
  'the moon remembering the sea',
  'an umbrella left on the tram',
  'whispers in an empty museum',
  'coffee steam at dawn',
  'footsteps on autumn moss',
  'a key to a room that no longer exists',
  'the quiet after the music stops'
];

// Feeling of the Day
export const FEELING_WORDS = [
  { word: 'Longing', nuance: 'A tender ache for what is distant or tenderly remembered.' },
  { word: 'Serenity', nuance: 'The calm surface of mountain water before morning wind.' },
  { word: 'Wonder', nuance: 'The quiet gasp when the night sky reveals its stars.' },
  { word: 'Nostalgia', nuance: 'Sunlight filtering through old lace curtains of memory.' },
  { word: 'Belonging', nuance: 'Arriving at a doorstep where the light was kept on.' },
  { word: 'Hope', nuance: 'A solitary green shoot pushing through stone pavement.' },
  { word: 'Solitude', nuance: 'The rich, peaceful sanctuary of one’s own quiet company.' },
  { word: 'Joy', nuance: 'Spontaneous laughter echoing across open fields.' },
  { word: 'Tenderness', nuance: 'The gentle manner in which dusk embraces the sleeping hills.' }
];

// Complete the Thought prompts
export const COMPLETE_THOUGHT_PROMPTS = [
  'Perhaps we were never meant to stay, only...',
  'In the silence between the clock strikes, I realized...',
  'If the river could speak in human tongue, it would confess that...',
  'We kept our promises not in words, but in the way we...',
  'There is a quiet corner in the twilight where all lost things...',
  'Before the season ended, you turned to me and whispered...'
];
