import React, { useState } from 'react';
import { User, Edit3, Save, X } from 'lucide-react';

interface UserData {
  name: string;
  phone: string;
  address: string;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onUpdateUser: (userData: UserData) => void;
}

export default function UserProfile({ isOpen, onClose, userData, onUpdateUser }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Profile Panel */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl border-l border-gray-800 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-black" />
            </div>
            <h2 className="text-2xl font-serif text-white">Хэрэглэгчийн мэдээлэл</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-gray-800 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Avatar */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-black" />
            </div>
            <h3 className="text-xl font-semibold text-white">{userData.name || 'Хэрэглэгч'}</h3>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gold mb-2">Нэр</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                  placeholder="Нэрээ оруулна уу"
                />
              ) : (
                <div className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white">
                  {userData.name || 'Нэр оруулаагүй'}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gold mb-2">Утасны дугаар</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300"
                  placeholder="Утасны дугаараа оруулна уу"
                />
              ) : (
                <div className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white">
                  {userData.phone || 'Утасны дугаар оруулаагүй'}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gold mb-2">Хаяг</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                  placeholder="Хаягаа оруулна уу"
                />
              ) : (
                <div className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white min-h-[80px]">
                  {userData.address || 'Хаяг оруулаагүй'}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
                >
                  <Save size={18} />
                  <span>Хадгалах</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 border border-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  Цуцлах
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
              >
                <Edit3 size={18} />
                <span>Засах</span>
              </button>
            )}
          </div>

          {/* Account Stats */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h4 className="text-lg font-serif text-white mb-4">Данс</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gold mb-1">0</div>
                <div className="text-sm text-gray-400">Захиалга</div>
              </div>
              <div className="text-center bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-silver mb-1">0</div>
                <div className="text-sm text-gray-400">Хүслийн жагсаалт</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}