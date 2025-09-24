import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Minus, Plus, Shield, Truck, Award, ArrowLeft } from 'lucide-react';

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

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddToWishlist: (product: Product) => void;
  onBack: () => void;
  isInWishlist: boolean;
}

export default function ProductDetail({ product, onAddToCart, onAddToWishlist, onBack, isInWishlist }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const productImages = product.images || [product.image, product.image, product.image];

  const features = product.features || [
    'Дэлхийн стандартын чанар',
    'Олон улсын баталгаа',
    'Үнэгүй хүргэлт',
    '24/7 дэмжлэг'
  ];

  const specifications = product.specifications || {
    'Брэнд': product.category,
    'Баталгаа': '2 жил',
    'Хүргэлт': 'Үнэгүй',
    'Дэмжлэг': '24/7'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-gold transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Буцах</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-gold shadow-lg shadow-gold/25'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Category */}
            <div>
              <span className="text-sm text-gold uppercase tracking-wider font-semibold">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'text-gold fill-current' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-gray-400">({product.reviews} үнэлгээ)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-gold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <div className="text-green-400 font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% хөнгөлөлт хэмнэлээ!
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-gray-300 leading-relaxed">
              <p>
                {product.description || `${product.name} нь дэлхийн шилдэг технологийг ашиглан бүтээгдсэн өндөр чанартай бүтээгдэхүүн юм. Энэхүү бүтээгдэхүүн нь таны хэрэгцээг бүрэн хангах боломжтой.`}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Онцлог шинж чанарууд</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">Тоо ширхэг:</span>
                <div className="flex items-center space-x-3 bg-gray-800 rounded-xl p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Minus size={16} className="text-white" />
                  </button>
                  <span className="w-12 text-center text-white font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Plus size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/25 hover:scale-105 active:scale-95"
              >
                <ShoppingBag size={20} />
                <span>САГСАНД НЭМЭХ</span>
              </button>
              
              <button
                onClick={() => onAddToWishlist(product)}
                className={`px-6 py-4 border-2 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 ${
                  isInWishlist
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-gray-600 text-gray-300 hover:border-gold hover:text-gold'
                }`}
              >
                <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                <span className="hidden sm:inline">{isInWishlist ? 'ХАДГАЛСАН' : 'ХАДГАЛАХ'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-800">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-400">Баталгаатай</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-400">Үнэгүй хүргэлт</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-400">Чанарын баталгаа</div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-2xl font-serif text-white mb-6">Техникийн үзүүлэлт</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3 border-b border-gray-700/50">
                <span className="text-gray-400">{key}:</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}