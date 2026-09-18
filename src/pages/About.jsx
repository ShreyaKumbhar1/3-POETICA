import React from 'react';
import { Feather, Heart, Globe, BookOpen, Sparkles, Shield, Compass } from 'lucide-react';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Story Intro */}
        <section className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#633367] via-[#854479] to-[#B06086] flex items-center justify-center text-white mx-auto shadow-md">
            <Feather className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
            The Story of POETICA
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-[#4D3652] dark:text-[#EBD8EE] italic max-w-xl mx-auto">
            "Turn feelings into words."
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#35233F] dark:text-[#FDFBF7] max-w-2xl mx-auto leading-relaxed pt-2">
            In an age of endless instant messaging, we realized that the quietest, deepest human feelings often struggle to find voice. POETICA was born as a digital sanctuary—where artificial intelligence collaborates with human vulnerability to give shape to silence.
          </p>
        </section>

        {/* Pillars */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-3">
            <div className="flex items-center gap-3 text-[#854479] dark:text-[#EBD8EE]">
              <Globe className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                Poetry Across World Languages
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#3E2745] dark:text-[#F5EEF7] leading-relaxed">
              Poetry is not monolithic. A haiku in Japanese carries a stillness unlike a Hindi ghazal or a French alexandrine. POETICA respects cultural cadence, sentence architecture, and vernacular idioms across over 60 world languages—refusing clumsy word-for-word machine translation in favor of poetic cadence.
            </p>
          </div>

          <div className="p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-3">
            <div className="flex items-center gap-3 text-[#854479] dark:text-[#EBD8EE]">
              <BookOpen className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                Deconstructing Meaning: Understand This Poem
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#3E2745] dark:text-[#F5EEF7] leading-relaxed">
              Every verse generated is paired with deep literary deconstruction: thematic interpretations, emotional landscapes, underlying metaphors, and vocabulary glossaries. We approach interpretation humbly—inviting multiple readings rather than proclaiming a singular absolute truth.
            </p>
          </div>

          <div className="p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-3">
            <div className="flex items-center gap-3 text-[#854479] dark:text-[#EBD8EE]">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                Atmospheres and Living Canvases
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#3E2745] dark:text-[#F5EEF7] leading-relaxed">
              Words do not exist in a vacuum; they belong to raindrops on cobblestones, cherry blossoms swaying in the dusk wind, and waves reflecting moonlit shores. POETICA dynamically crafts atmospheric 3D environments that harmonize with the mood of your verse.
            </p>
          </div>

          <div className="p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-3">
            <div className="flex items-center gap-3 text-[#854479] dark:text-[#EBD8EE]">
              <Shield className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                Ethical Creativity & AI Boundaries
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#3E2745] dark:text-[#F5EEF7] leading-relaxed">
              We view generative AI not as a replacement for human soul, but as a tender mirror. If an API provider key is not present, our intelligent offline demo engine steps in seamlessly to keep your creative sanctuary alive without interruption.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
