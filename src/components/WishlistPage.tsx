import React from 'react';
import { Heart, ShoppingBag, X, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

interface WishlistPageProps {
  wishlistItems: Product[];
  onRemoveFromWishlist: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistPage({ wishlistItems, onRemoveFromWishlist, onAddToCart }: WishlistPageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center">
              <Heart size={32} className="text-black" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-silver">
              ХҮСЛИЙН ЖАГСААЛТ
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Таны хадгалсан дуртай бүтээгдэхүүнүүд
          </p>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={48} className="text-gray-600" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">Хүслийн жагсаалт хоосон байна</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Дуртай бүтээгдэхүүнээ энд хадгалж, дараа нь худалдан авахаар төлөвлөөрэй
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 hover:scale-105">
              БҮТЭЭГДЭХҮҮН ҮЗЭХ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gold/30 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 animate-float"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
                >
                  <X size={16} />
                </button>

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% ХӨНГӨЛӨЛТ
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-4 left-4 right-4">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
                      >
                        <ShoppingBag size={18} />
                        <span>САГСАНД НЭМЭХ</span>
                      </button>
                    </div>
                  </div>
                </div>

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
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}