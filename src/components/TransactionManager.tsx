import React, { useState } from 'react';
import { Transaction, categories } from '../data/dummyData';
import { formatMoney, formatDate } from '../utils/storage';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

interface TransactionManagerProps {
  transactions: Transaction[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onEdit: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  transactions,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'орлого' | 'зарлага'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>('');   // YYYY-MM-DD
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'орлого' as 'орлого' | 'зарлага',
    category: '',
    amount: '',
    description: ''
  });

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.description) {
      alert('Бүх талбарыг бөглөнө үү!');
      return;
    }

    const transactionData = {
      date: formData.date,
      type: formData.type,
      category: formData.category,
      amount: parseInt(formData.amount),
      description: formData.description
    };

    if (editingId) {
      onEdit(editingId, transactionData);
      setEditingId(null);
    } else {
      onAdd(transactionData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'орлого',
      category: '',
      amount: '',
      description: ''
    });
    setShowForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      date: transaction.date,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    // Date range filter (inclusive). If startDate/endDate empty => ignore that bound.
    const txDate = new Date(transaction.date + 'T00:00:00');
    const startOk = !startDate || txDate >= new Date(startDate + 'T00:00:00');
    const endOk = !endDate || txDate <= new Date(endDate + 'T23:59:59');
    
    return matchesSearch && matchesType && matchesCategory && startOk && endOk;
  });

  const allCategories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Гүйлгээний удирдлага</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Шинэ гүйлгээ
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Гүйлгээ засах' : 'Шинэ гүйлгээ нэмэх'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Огноо</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Төрөл</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'орлого' | 'зарлага', category: ''})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="орлого">Орлого</option>
                  <option value="зарлага">Зарлага</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ангилал</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Ангилал сонгоно уу</option>
                  {categories[formData.type].map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дүн (₮)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тайлбар</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Тайлбар бичнэ үү..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
                >
                  {editingId ? 'Засах' : 'Нэмэх'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md transition-colors"
                >
                  Цуцлах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Бүх төрөл</option>
            <option value="орлого">Орлого</option>
            <option value="зарлага">Зарлага</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Бүх ангилал</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Date range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Эхлэх огноо"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Дуусах огноо"
            />
          </div>

           <div className="flex items-center gap-2">
             <Filter className="w-4 h-4 text-gray-400" />
             <span className="text-sm text-gray-600">
               {filteredTransactions.length} гүйлгээ
             </span>
           </div>
         </div>
       </div>

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {/* Reordered columns: Price (colored) | Type | Тайлбар | Огноо | Ангилал | Үйлдэл */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дүн
                </th>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тайлбар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ангилал
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  {/* Price (colored based on type) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      transaction.type === 'орлого' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {formatMoney(transaction.amount)}
                    </span>
                  </td>


                  {/* Description */}
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {transaction.description}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>

                  {/* Actions - stop propagation so row click doesn't trigger */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(transaction); }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        type="button"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Энэ гүйлгээг устгахдаа итгэлтэй байна уу?')) {
                            onDelete(transaction.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Гүйлгээ олдсонгүй
          </div>
        )}
      </div>

      {/* Detail Modal for selected transaction */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Гүйлгээний дэлгэрэнгүй</h2>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">Дүн</div>
              <div className={`text-lg font-bold ${selectedTransaction.type === 'орлого' ? 'text-green-600' : 'text-red-600'}`}>
                {formatMoney(selectedTransaction.amount)}
              </div>

              <div className="text-sm text-gray-600">Төрөл</div>
              <div className="mb-2">{selectedTransaction.type}</div>

              <div className="text-sm text-gray-600">Тайлбар</div>
              <div className="mb-2">{selectedTransaction.description}</div>

              <div className="text-sm text-gray-600">Огноо</div>
              <div className="mb-2">{formatDate(selectedTransaction.date)}</div>

              <div className="text-sm text-gray-600">Ангилал</div>
              <div className="mb-2">{selectedTransaction.category}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleEdit(selectedTransaction);
                  setSelectedTransaction(null);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
                type="button"
              >
                Засах
              </button>
              <button
                onClick={() => {
                  if (confirm('Энэ гүйлгээг устгахдаа итгэлтэй байна уу?')) {
                    onDelete(selectedTransaction.id);
                    setSelectedTransaction(null);
                  }
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors"
                type="button"
              >
                Устгах
              </button>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md transition-colors"
                type="button"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManager;