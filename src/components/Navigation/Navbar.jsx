import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Feather, Compass, Sparkles, BookOpen, Settings, LogIn, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Feather },
    { name: 'Create', path: '/create', icon: Sparkles },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Prompts', path: '/prompts', icon: BookOpen },
    { name: 'About', path: '/about', icon: Feather },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="bg-[#FFF9F5]/80 dark:bg-[#1E1428]/85 border border-[#D9B8CB]/35 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm hover:border-[#D9B8CB]/50 transition-all">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#633367] via-[#854479] to-[#B06086] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-white text-base font-serif font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-wider font-bold text-[#2B1630] dark:text-[#FDFBF7] group-hover:text-[#854479] dark:group-hover:text-[#EBD8EE] transition-colors">
                POETICA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#5C3A5F] dark:text-[#D9C4DC] font-bold hidden sm:block">
                Turn feelings into words
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                      : 'text-[#3E2442] dark:text-[#E8DCEB] hover:text-[#633367] hover:bg-[#FBEBF0]/70 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/library"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive('/library')
                    ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                    : 'text-[#3E2442] dark:text-[#E8DCEB] hover:text-[#633367] hover:bg-[#FBEBF0]/70 dark:hover:bg-white/10'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>My Library</span>
              </Link>
            )}
          </nav>

          {/* User / Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  title="Sanctuary Settings"
                  className="p-2 rounded-full text-[#3E2442] dark:text-[#E8DCEB] hover:bg-[#FBEBF0]/70 dark:hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-[#D9B8CB]/35 hover:bg-white transition-all text-xs font-bold text-[#2B1630] dark:text-[#FDFBF7]"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                    alt={user?.displayName}
                    className="w-6 h-6 rounded-full object-cover border border-[#854479]/30"
                  />
                  <span className="max-w-[100px] truncate">{user?.displayName || user?.username}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#3E2442] dark:text-[#E8DCEB] hover:text-[#633367] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-xs hover:scale-105 transition-all"
                >
                  Become Author
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#FBEBF0]/70"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 my-2 p-5 rounded-3xl bg-[#FFF9F5]/96 dark:bg-[#1E1428]/96 backdrop-blur-xl shadow-2xl border border-[#D9B8CB]/40 animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                    : 'text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#FBEBF0]/70'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/library"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold ${
                    isActive('/library') ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white' : 'text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#FBEBF0]/70'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>My Library</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#FBEBF0]/70"
                >
                  <span className="w-4 h-4 text-center font-bold">@</span>
                  <span>Author Profile ({user?.displayName})</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#FBEBF0]/70"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-3 border-t border-[#D9B8CB]/25 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-2xl text-sm font-bold border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center py-2.5 rounded-2xl text-sm font-bold shadow-xs"
                >
                  Become an Author
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
