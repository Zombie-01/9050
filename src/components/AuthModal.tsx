import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authType, setAuthType] = useState<'user' | 'admin'>('user');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message || 'Sign in failed');
        } else {
          onAuthSuccess();
          onClose();
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message || 'Sign up failed');
        } else {
          onAuthSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailAuth();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-700 w-full max-w-md">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-white">
              {authType === 'user' ? (isLogin ? 'Хэрэглэгч нэвтрэх' : 'Хэрэглэгч бүртгүүлэх') : (isLogin ? 'Админ нэвтрэх' : 'Админ бүртгүүлэх')}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Auth Type Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-4">
            <button
              onClick={() => { setAuthType('user'); setIsLogin(true); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-300 ${
                authType === 'user'
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <User size={18} />
              <span>Хэрэглэгч</span>
            </button>
            <button
              onClick={() => { setAuthType('admin'); setIsLogin(true); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-300 ${
                authType === 'admin'
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Lock size={18} />
              <span>Админ</span>
            </button>
          </div>

          {/* Sign in / Sign up toggle */}
          <div className="flex gap-2 justify-center mb-4 text-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-3 py-1 rounded-md ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              type="button"
            >
              Нэвтрэх
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-3 py-1 rounded-md ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              type="button"
            >
              Бүртгүүлэх
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Password for both user and admin */}
            <div>
              <label className="block text-sm font-semibold text-gold mb-2">Имэйл</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gold mb-2">Нууц үг</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Түр хүлээнэ үү...' : (isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх')}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-4">
            {authType === 'admin' ? 'Админ хандалт нь тусгай эрх шаардна.' : 'Имэйлээр нэвтэрч, үйлчилгээ ашиглана уу.'}
          </p>
        </div>
      </div>
    </div>
  );
}