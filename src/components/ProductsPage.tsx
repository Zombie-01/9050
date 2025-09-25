import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Filter, Grid, List } from 'lucide-react';
import ProductFilter, { FilterState } from './ProductFilter';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  description?: string;
  features?: string[];
  specifications?: { [key: string]: string };
  images?: string[];
}

interface ProductsPageProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistItems: Product[];
  products: Product[];
  searchQuery?: string;
}

export default function ProductsPage({ onAddToCart, onProductClick, onAddToWishlist, wishlistItems, products, searchQuery = '' }: ProductsPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    category: '', priceRange: [0, 10000000], brand: '', rating: 0, sortBy: 'featured'
  });

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.category && product.category !== filters.category) return false;
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    if (filters.brand && !product.name.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.rating > 0 && product.rating < filters.rating) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const isInWishlist = (productId: number) => wishlistItems.some(item => item.id === productId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide">
            {searchQuery ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-silver">
                "{searchQuery}" ХАЙЛТЫН ҮР ДҮН
              </span>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-silver">
                БҮТЭЭГДЭХҮҮН
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {searchQuery ? 
              `"${searchQuery}" хайлтаар ${sortedProducts.length} бүтээгдэхүүн олдлоо` :
              'Дэлхийн шилдэг брэндүүдийн бүтээгдэхүүнүүдийг нэг дороос'
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover:from-gold hover:to-yellow-500 hover:text-black transition-all duration-300 hover:scale-105"
            >
              <Filter size={20} />
              <span>Шүүлтүүр</span>
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gold text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gold text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
          
          <div className="text-gray-400">
            {sortedProducts.length} бүтээгдэхүүн олдлоо
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gold/30 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 animate-float"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => onProductClick(product)}
                  className="relative aspect-square overflow-hidden w-full"
                >
                  <img
                    src={product.image_url || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                  />
                  
                  {product.original_price && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% ХӨНГӨЛӨЛТ
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToWishlist(product);
                      }}
                      className={`w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 ${
                        isInWishlist(product.id) ? 'text-red-500 bg-red-500/20' : 'text-white hover:bg-gold hover:text-black'
                      }`}
                    >
                      <Heart size={16} />
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-4 left-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
                      >
                        <ShoppingBag size={18} />
                        <span>САГСАНД НЭМЭХ</span>
                      </button>
                    </div>
                  </div>
                </button>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-gold uppercase tracking-wider font-semibold">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'text-gold fill-current' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gold">{formatPrice(product.price)}</span>
                      {product.original_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold/10"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row">
                  <button
                    onClick={() => onProductClick(product)}
                    className="relative w-full md:w-64 h-64 overflow-hidden"
                  >
                    <img
                      src={product.image_url || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.original_price && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% ХӨНГӨЛӨЛТ
                      </div>
                    )}
                  </button>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="mb-2">
                        <span className="text-xs text-gold uppercase tracking-wider font-semibold">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                        {product.name}
                      </h3>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.floor(product.rating) ? 'text-gold fill-current' : 'text-gray-600'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">({product.reviews} үнэлгээ)</span>
                      </div>

                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {product.description || `${product.name} нь дэлхийн шилдэг технологийг ашиглан бүтээгдсэн өндөр чанартай бүтээгдэхүүн юм.`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gold">{formatPrice(product.price)}</span>
                        {product.original_price && (
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => onAddToWishlist(product)}
                          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                            isInWishlist(product.id) 
                              ? 'text-red-500 bg-red-500/20' 
                              : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                          }`}
                        >
                          <Heart size={20} />
                        </button>
                        <button
                          onClick={() => onAddToCart(product)}
                          className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-xl flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
                        >
                          <ShoppingBag size={18} />
                          <span>САГСАНД НЭМЭХ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <Filter size={48} className="text-gray-600" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">Бүтээгдэхүүн олдсонгүй</h2>
            <p className="text-gray-400 mb-8">Шүүлтүүрээ өөрчилж дахин оролдоно уу</p>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 hover:scale-105"
            >
              Шүүлтүүр засах
            </button>
          </div>
        )}
      </div>

      <ProductFilter
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        onFilterChange={setFilters}
      />
    </div>
  );
}