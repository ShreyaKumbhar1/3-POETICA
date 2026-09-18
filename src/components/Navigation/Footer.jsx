import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#D9B8CB]/35 bg-[#FFF9F5]/80 dark:bg-[#1E1428]/85 backdrop-blur-md py-12 px-4 sm:px-6 relative z-10 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#633367] via-[#854479] to-[#B06086] flex items-center justify-center shadow-xs">
              <Feather className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl tracking-wider font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              POETICA
            </span>
          </Link>
          <p className="text-sm font-serif italic text-[#4F3354] dark:text-[#E8D8EE] font-medium">
            "Turn feelings into words."
          </p>
          <p className="text-xs font-semibold text-[#5C3A5F] dark:text-[#D9C4DC] mt-1">
            Every feeling has a poem waiting to be written.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#2B1630] dark:text-[#FDFBF7] font-bold">
          <Link to="/" className="hover:text-[#854479] dark:hover:text-[#EBD8EE] transition-colors">Home</Link>
          <Link to="/create" className="hover:text-[#854479] dark:hover:text-[#EBD8EE] transition-colors">Create</Link>
          <Link to="/explore" className="hover:text-[#854479] dark:hover:text-[#EBD8EE] transition-colors">Explore</Link>
          <Link to="/prompts" className="hover:text-[#854479] dark:hover:text-[#EBD8EE] transition-colors">Prompts</Link>
          <Link to="/about" className="hover:text-[#854479] dark:hover:text-[#EBD8EE] transition-colors">About</Link>
          <Link to="/settings" className="hover:text-[#854479] dark:hover:text-[#EBD8EE] transition-colors">Settings</Link>
        </div>

        {/* Copyright & Warmth */}
        <div className="text-xs text-[#5C3A5F] dark:text-[#D9C4DC] font-semibold text-center md:text-right flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#854479] dark:text-[#EBD8EE] inline fill-current" />
          <span>for poets & dreamers worldwide. © {new Date().getFullYear()} POETICA</span>
        </div>
      </div>
    </footer>
  );
}
