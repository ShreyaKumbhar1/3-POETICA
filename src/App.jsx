import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AtmosphereProvider } from './context/AtmosphereContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import Home from './pages/Home';
import CreateStudio from './pages/CreateStudio';
import Explore from './pages/Explore';
import Library from './pages/Library';
import Prompts from './pages/Prompts';
import About from './pages/About';
import Settings from './pages/Settings';
import AuthorProfile from './pages/AuthorProfile';
import PoemDetail from './pages/PoemDetail';
import ReadingMode from './pages/ReadingMode';
import PoemEditor from './pages/PoemEditor';
import Auth from './pages/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AtmosphereProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateStudio />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/library" element={<Library />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<AuthorProfile />} />
              <Route path="/poem/:id" element={<PoemDetail />} />
              <Route path="/reading/:id" element={<ReadingMode />} />
              <Route path="/edit/:id" element={<PoemEditor />} />
              <Route path="/editor" element={<PoemEditor />} />
              <Route path="/login" element={<Auth initialMode="login" />} />
              <Route path="/register" element={<Auth initialMode="register" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AtmosphereProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
