# POETICA — AI Poem Generator

> **"Turn feelings into words."**  
> *Every feeling has a poem waiting to be written.*

An immersive AI-powered poetry studio where users can create, understand, save, organize, edit, share, and revisit poems generated from themes, emotions, moods, styles, structures, and 60+ world languages.

---

## Key Features

- **Multilingual Verse Generation (60+ World Languages)**:
  - English, Spanish, French, German, Italian, Portuguese, Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Gujarati, Urdu, Nepali, Sanskrit, Japanese, Chinese, Korean, Arabic, Persian, Hebrew, Turkish, Russian, and more + Custom language input.
  - Generates culturally coherent, grammatically structured verse rather than literal translation.

- **"Understand This Poem" Deep Explanation**:
  - Unpacks simple meaning, thematic interpretation (*"This poem can be interpreted as..."*), emotional landscapes, sensory imagery, metaphors, symbols, and difficult words glossary.
  - Provides full English poetic translation whenever a poem is composed in another world language.

- **Atmospheric 3D Canvas Background System**:
  - 11 procedural visual environments: **Sakura**, **Rain**, **Mountain**, **Ocean**, **Forest**, **Night**, **Autumn**, **Winter**, **Spring**, **Sunrise**, and **Minimal Sanctuary**.
  - **Auto-Environment Detection**: Derives atmosphere from generated poem.
  - **Ambient Sound Synthesizer**: Pure Web Audio API procedural synthesis of gentle rain, pine wind, night resonance, and singing bowls (strictly user-toggled, never auto-plays).
  - Built-in reduced-motion accessibility support.

- **Advanced Creation Studio & "Surprise Me"**:
  - Simple and Advanced Studio modes (Tone, Perspective, Rhyme scheme, Audience, Custom instructions).
  - One-click **Surprise Me** mode delivering instant inspiration combinations.
  - Rotating poetic loading experience (*"Listening to your idea...", "Finding the right words...", "Following the rhythm..."*).
  - Line-by-line reveal animation.

- **Poetic Actions**:
  - **Remix Studio**: 12 tonal/cadence transforms (happier, sadder, darker, more romantic, shorter, deeper, more poetic, etc.).
  - **Poetic Translate**: Preserves emotional weight and imagery into target languages.
  - **Text-to-Speech**: Web Speech API assistant reading poems in their designated world languages.
  - **Printable Keepsake Export**: Formatted printable poem card (`window.print()`), `.txt` download, and native Web Share.

- **Distraction-Free Poem Editor**:
  - In-place title and verse editor with live word, line, and character count.
  - Undo / Redo history stack.
  - Auto-save draft system with *"You have an unfinished poem"* recovery banner.
  - AI Assistant toolbelt (*"Improve this line"*, *"Find a better word"*, *"Make this more poetic"*, *"Continue this poem"*, *"Rewrite this stanza"*).

- **Personal Poem Sanctuary (Library & Collections)**:
  - Tabs: All Poems, Favorites, Published, Drafts.
  - Custom Collections (*"Love Letters"*, *"Midnight Thoughts"*, *"Rain Collection"*).
  - Search, filter by language/mood/style/theme, and sort (Newest, Oldest, Alphabetical, Most Appreciated).

- **Author Profiles & Accounts**:
  - Sign in, Sign up, Forgot Password.
  - JWT authentication with secure pure JS bcrypt password hashing.
  - Author dashboard with visual literary stats.
  - Public / Private profile privacy controls.

- **Public Poetry Explore Showcase & Prompts**:
  - Community gallery of public poems with likes and moderation reporting.
  - "Today's Inspiration" daily prompt & Interactive Writing Prompt Generator with "Write From This" routing.

---

## Architecture

```text
Frontend (React 19 + Vite + Tailwind CSS)
   │
   ├─► Contexts: Auth, Atmosphere, Toast
   ├─► Atmospheric Canvas Engine & Web Audio Synthesizer
   └─► API Client (/api)
         │
         ▼
Backend (Node.js + Express)
   │
   ├─► Auth Middleware (JWT)
   ├─► Transactional JSON Database Engine (server/data/db.json)
   └─► AI Service Abstraction
         ├── Gemini 1.5 Flash (via GEMINI_API_KEY)
         ├── OpenAI GPT-4o-mini (via OPENAI_API_KEY)
         └── POETICA Intelligent Offline Demo Engine (Automatic Fallback)
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ (tested on Node v24.19)
- npm v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=poetica_super_secret_jwt_key_2026_artistic_calm

# Optional: Add live AI provider keys.
# If omitted, POETICA seamlessly runs using the Intelligent Offline Demo Engine!
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 4. Run Development Servers
```bash
npm run dev
```
- **Frontend Studio**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001` (proxied automatically)

---

## Production Build & Run

```bash
# Build Vite production assets into dist/
npm run build

# Start production server (serves built dist/ and API)
node server/server.js
```
Open `http://localhost:3001` in your browser.

---

## Seed Accounts

The database comes pre-seeded with community poems in Japanese, Hindi, French, and English, along with an initial curator author:
- **Username / Email**: `poetica_curator` or `curator@poetica.art`
- **Password**: `poetica2026`

You can also sign up immediately with any new username and password directly from the UI.
