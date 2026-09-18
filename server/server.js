import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🌸 POETICA Studio Backend running at http://localhost:${PORT}`);
  console.log(`📖 Tagline: "Turn feelings into words."`);
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    console.log(`✨ Note: Running with POETICA Intelligent Offline Demo Engine (Add GEMINI_API_KEY or OPENAI_API_KEY in .env for live AI provider)`);
  }
});

export default app;
