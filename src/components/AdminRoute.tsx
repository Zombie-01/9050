import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check for static admin login
    const staticAdmin = localStorage.getItem('isAdmin');
    if (staticAdmin === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.is_admin) {
        setIsAuthenticated(true);
      } else {
        setShowAuthModal(true);
      }
    } else {
      setShowAuthModal(true);
    }
    
    setIsLoading(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Түр хүлээнэ үү...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-black font-bold text-2xl">A</span>
            </div>
            <h1 className="text-3xl font-serif text-white mb-4">Админ хэсэг</h1>
            <p className="text-gray-400 mb-8">Энэ хэсэгт нэвтрэхийн тулд админ эрхтэй байх шаардлагатай</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 hover:scale-105"
            >
              Нэвтрэх
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return <>{children}</>;
}