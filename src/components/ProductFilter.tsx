import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  sortBy: string;
}

export default function ProductFilter({ onFilterChange, isOpen, onToggle }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 10000000],
    rating: 0,
    sortBy: 'featured'
  });

  const categories = [
    'Бүгд',
    'Гинж',
    'Бугуйвч',
    'Бөгж',
    'Хослол',
  ];



  const sortOptions = [
    { value: 'featured', label: 'Онцлох' },
    { value: 'price-low', label: 'Үнэ: Бага -> Их' },
    { value: 'price-high', label: 'Үнэ: Их -> Бага' },
    { value: 'rating', label: 'Үнэлгээ' },
    { value: 'newest', label: 'Шинэ' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      category: '',
      priceRange: [0, 10000000],
      rating: 0,
      sortBy: 'featured'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onToggle}></div>
      
      {/* Filter Panel */}
      <div className={`absolute left-0 top-0 h-full w-full max-w-sm bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl border-r border-gray-800 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center">
              <Filter size={16} className="text-black" />
            </div>
            <h2 className="text-2xl font-serif text-white">Шүүлтүүр</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-gray-800 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Sort By */}
          <div>
            <h3 className="text-lg font-serif text-gold mb-4">Эрэмбэлэх</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-lg font-serif text-gold mb-4">Ангилал</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', category === 'Бүгд' ? '' : category)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    (category === 'Бүгд' && !filters.category) || filters.category === category
                      ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>


          {/* Price Range */}
          <div>
            <h3 className="text-lg font-serif text-gold mb-4">Үнийн хязгаар</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  placeholder="Доод"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Дээд"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 10000000])}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  [0, 500000],
                  [500000, 1000000],
                  [1000000, 3000000],
                  [3000000, 10000000]
                ].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => handleFilterChange('priceRange', [min, max])}
                    className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 text-sm"
                  >
                    {min === 0 ? '< 500K' : max === 10000000 ? '> 3M' : `${min/1000}K - ${max/1000}K`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-serif text-gold mb-4">Үнэлгээ</h3>
            <div className="space-y-2">
              {[0, 4, 4.5, 4.8, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', rating)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    filters.rating === rating
                      ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {rating === 0 ? 'Бүгд' : `${rating}+ одтой`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-6">
          <button
            onClick={clearFilters}
            className="w-full border border-gray-600 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 mb-3"
          >
            Шүүлтүүр цэвэрлэх
          </button>
        </div>
      </div>
    </div>
  );
}