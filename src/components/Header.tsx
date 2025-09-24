import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Filter } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartToggle: () => void;
  onWishlistToggle: () => void;
  onProfileToggle: () => void;
  onHomeClick: () => void;
  onProductsClick: () => void;
  onAdminClick: () => void;
}

export default function Header({ cartCount, wishlistCount, onCartToggle, onWishlistToggle, onProfileToggle, onHomeClick, onProductsClick, onAdminClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={onHomeClick}
            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-2xl font-serif text-white tracking-wider">AGo</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={onHomeClick} className="text-gray-300 hover:text-gold transition-colors duration-300">Нүүр хуудас</button>
            <button onClick={onProductsClick} className="text-gray-300 hover:text-gold transition-colors duration-300">Бүтээгдэхүүн</button>
            <button onClick={onAdminClick} className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm">Админ</button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
              <Search size={20} />
            </button>
            <button 
              onClick={onProfileToggle}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <User size={20} />
            </button>
            <button 
              onClick={onWishlistToggle}
              className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={onCartToggle}
              className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4 mt-4">
              <button onClick={onHomeClick} className="text-left text-gray-300 hover:text-gold transition-colors duration-300">Нүүр хуудас</button>
              <button onClick={onProductsClick} className="text-left text-gray-300 hover:text-gold transition-colors duration-300">Бүтээгдэхүүн</button>
              <button onClick={onAdminClick} className="text-left text-gray-300 hover:text-gold transition-colors duration-300 text-sm">Админ</button>
            </nav>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
                  <Search size={20} />
                </button>
                <button 
                  onClick={onProfileToggle}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <User size={20} />
                </button>
                <button 
                  onClick={onWishlistToggle}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </div>
              <button 
                onClick={onCartToggle}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}