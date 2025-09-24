import React, { useState } from 'react';
import { BarChart3, Package, Users, Settings, Plus, Edit, Trash2, Eye, X, Save } from 'lucide-react';

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

interface AdminDashboardProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onClose: () => void;
}

export default function AdminDashboard({ products, onUpdateProducts, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products'>('dashboard');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 5,
    reviews: 0,
    category: '',
    description: '',
    features: [],
    specifications: {}
  });

  const categories = ['Утас', 'Компьютер', 'Аудио', 'Ухаалаг цаг', 'Таблет', 'Тоглоом', 'Камер', 'Автомашин'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      image: '',
      rating: 5,
      reviews: 0,
      category: categories[0],
      description: '',
      features: [],
      specifications: {}
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      onUpdateProducts(updatedProducts);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      alert('Заавал бөглөх талбаруудыг бөглөнө үү');
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now(),
      name: formData.name!,
      price: formData.price!,
      originalPrice: formData.originalPrice || undefined,
      image: formData.image!,
      rating: formData.rating || 5,
      reviews: formData.reviews || 0,
      category: formData.category!,
      description: formData.description,
      features: formData.features || [],
      specifications: formData.specifications || {}
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
    } else {
      updatedProducts = [...products, productData];
    }

    onUpdateProducts(updatedProducts);
    setIsProductModalOpen(false);
  };

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.reviews), 0);
  const totalProducts = products.length;
  const averageRating = products.reduce((sum, product) => sum + product.rating, 0) / products.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="h-full flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif text-gold">Админ самбар</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <BarChart3 size={20} />
              <span>Хяналтын самбар</span>
            </button>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Package size={20} />
              <span>Бүтээгдэхүүн</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="p-8">
              <h1 className="text-4xl font-serif text-white mb-8">Хяналтын самбар</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Нийт орлого</p>
                      <p className="text-2xl font-bold text-gold">{formatPrice(totalRevenue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Нийт бүтээгдэхүүн</p>
                      <p className="text-2xl font-bold text-gold">{totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                      <Package size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Дундаж үнэлгээ</p>
                      <p className="text-2xl font-bold text-gold">{averageRating.toFixed(1)}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-serif text-white mb-4">Сүүлийн бүтээгдэхүүнүүд</h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{product.name}</h4>
                        <p className="text-gray-400 text-sm">{product.category}</p>
                      </div>
                      <div className="text-gold font-bold">{formatPrice(product.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-serif text-white">Бүтээгдэхүүн удирдах</h1>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
                >
                  <Plus size={20} />
                  <span>Шинэ бүтээгдэхүүн</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700">
                      <tr>
                        <th className="text-left p-4 text-gray-300 font-semibold">Бүтээгдэхүүн</th>
                        <th className="text-left p-4 text-gray-300 font-semibold">Ангилал</th>
                        <th className="text-left p-4 text-gray-300 font-semibold">Үнэ</th>
                        <th className="text-left p-4 text-gray-300 font-semibold">Үнэлгээ</th>
                        <th className="text-left p-4 text-gray-300 font-semibold">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-300">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div>
                                <h4 className="text-white font-semibold">{product.name}</h4>
                                <p className="text-gray-400 text-sm">{product.reviews} үнэлгээ</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{product.category}</td>
                          <td className="p-4">
                            <div className="text-gold font-bold">{formatPrice(product.price)}</div>
                            {product.originalPrice && (
                              <div className="text-gray-500 text-sm line-through">{formatPrice(product.originalPrice)}</div>
                            )}
                          </td>
                          <td className="p-4 text-gold font-semibold">{product.rating}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-300"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif text-white">
                  {editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн нэмэх'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gold mb-2">Нэр *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="Бүтээгдэхүүний нэр"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gold mb-2">Ангилал *</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gold mb-2">Үнэ *</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gold mb-2">Хуучин үнэ</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || undefined })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gold mb-2">Үнэлгээ</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gold mb-2">Үнэлгээний тоо</label>
                  <input
                    type="number"
                    value={formData.reviews || ''}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gold mb-2">Зургийн URL *</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gold mb-2">Тайлбар</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                  placeholder="Бүтээгдэхүүний тайлбар..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 border border-gray-600 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
                >
                  <Save size={18} />
                  <span>Хадгалах</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}