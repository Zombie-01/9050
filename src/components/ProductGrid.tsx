import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Filter } from 'lucide-react';
import { FilterState } from './ProductFilter';

import { Product } from '../lib/supabase';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onFilterToggle: () => void;
  filters: FilterState;
  wishlistItems: Product[];
  products: Product[];
}

export default function ProductGrid({ onAddToCart, onProductClick, onAddToWishlist, onFilterToggle, filters, wishlistItems, products }: ProductGridProps) {

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) return false;
    
    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    
    // Brand filter (simplified - checking if product name contains brand)
    if (filters.brand && !product.name.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    
    // Rating filter
    if (filters.rating > 0 && product.rating < filters.rating) return false;
    
    return true;
  });

  // Sort products based on sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
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
    <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-silver">
              ШИЛДЭГ БҮТЭЭГДЭХҮҮН
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Дэлхийн шилдэг брэндүүдийн хамгийн сүүлийн үеийн бүтээгдэхүүнүүд
          </p>
        </div>

        {/* Filter Button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onFilterToggle}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover:from-gold hover:to-yellow-500 hover:text-black transition-all duration-300 hover:scale-105"
          >
            <Filter size={20} />
            <span>Шүүлтүүр</span>
          </button>
          <div className="text-gray-400">
            {sortedProducts.length} бүтээгдэхүүн олдлоо
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gold/30 transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:shadow-gold/20 hover:-translate-y-2 animate-float"
              style={{
                animationDelay: `${product.id * 0.1}s`
              }}
            >
              {/* Product Image */}
              <button
                onClick={() => onProductClick(product)}
                className="relative aspect-square overflow-hidden w-full"
              >
                <img
                  src={product.image_url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-2"
                />
                
                {/* Discount Badge */}
                {product.original_price && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% ХӨНГӨЛӨЛТ
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-8 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(product);
                    }}
                    className={`w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 hover:rotate-12 ${
                      isInWishlist(product.id) ? 'text-red-500 bg-red-500/20' : 'text-white hover:bg-gold hover:text-black'
                    }`}
                  >
                    <Heart size={16} />
                  </button>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      onAddToCart(product)
                      }}
                      className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:shadow-lg hover:shadow-gold/25 hover:scale-105 active:scale-95"
                    >
                      <ShoppingBag size={18} />
                      <span>САГСАНД НЭМЭХ</span>
                    </button>
                  </div>
                </div>
              </button>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-gold uppercase tracking-wider font-semibold">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Rating */}
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

                {/* Price */}
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

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="px-12 py-4 border-2 border-gold text-gold font-semibold rounded-full hover:bg-gold hover:text-black transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-gold/25">
            БҮГДИЙГ ХАРАХ
          </button>
        </div>
      </div>
    </section>
  );
}