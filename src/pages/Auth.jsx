import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Feather, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Auth({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState(searchParams.get('mode') || initialMode); // 'login' | 'register' | 'forgot'
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(identifier, password);
        toast.success('Welcome back to the sanctuary');
        navigate('/library');
      } else if (mode === 'register') {
        await register({ username, email, password, displayName });
        toast.success('Author account created');
        navigate('/library');
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword(email);
        toast.info(res.message);
        setMode('login');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="p-8 sm:p-10 rounded-3xl hero-glass-surface border border-[#D9B8CB]/50 shadow-2xl relative backdrop-blur-xl">
          {/* Top Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#542F5C] flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <Feather className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              {mode === 'login' ? 'Author Sign In' : mode === 'register' ? 'Become an Author' : 'Recover Account'}
            </h2>
            <p className="text-xs font-semibold text-[#542F5C] dark:text-[#D9B8CB] mt-1 font-serif italic">
              "Turn feelings into words."
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7E5E85] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. poetica_curator"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-[#542F5C] dark:text-[#D9B8CB] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7E5E85] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7E5E85] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. wandering_bard"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. S. Kumbhar"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7E5E85] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="poet@domain.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7E5E85] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'forgot' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7E5E85] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="poet@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none focus:border-[#542F5C]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 rounded-2xl text-xs font-bold shadow-md disabled:opacity-50 transition-opacity"
            >
              {isLoading
                ? 'Connecting to sanctuary...'
                : mode === 'login'
                ? 'Sign In to Studio'
                : mode === 'register'
                ? 'Create Author Account'
                : 'Send Reset Instructions'}
            </button>
          </form>

          {/* Switcher Footnote */}
          <div className="mt-6 pt-4 border-t border-[#D9B8CB]/30 text-center text-xs text-[#542F5C] dark:text-[#D9B8CB]">
            {mode === 'login' ? (
              <p>
                New to POETICA?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#542F5C] dark:text-[#EBD8EE] font-bold hover:underline"
                >
                  Become an Author
                </button>
              </p>
            ) : (
              <p>
                Already have an author profile?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#542F5C] dark:text-[#EBD8EE] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
