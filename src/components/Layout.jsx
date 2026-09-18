import React from 'react';
import Navbar from './Navigation/Navbar';
import Footer from './Navigation/Footer';
import AtmosphericCanvas from './Atmosphere/AtmosphericCanvas';
import AtmosphereControls from './Atmosphere/AtmosphereControls';

export default function Layout({ children, hideFooter = false }) {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[#EED9DB] selection:text-[#3B2C52]">
      {/* 3D Atmospheric Canvas Background */}
      <AtmosphericCanvas />

      {/* Atmospheric & Ambient Audio Controls */}
      <AtmosphereControls />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-1 pt-20 sm:pt-24 z-10 relative">
        {children}
      </main>

      {/* Optional Literary Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}
