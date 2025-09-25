import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <img src='/ago.jpg'  className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"/>              <span className="text-3xl font-serif tracking-wider">AGO ONLINE STORE</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Дэлхийн шилдэг брэндүүдийн бүтээгдэхүүнийг Монголын хэрэглэгчдэд хүргэдэг тэргүүлэх онлайн дэлгүүр.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a target='_blank' href="https://www.facebook.com/share/1Fi9FN6kSc/?mibextid=wwXIfr" className="w-10 h-10 bg-gray-800 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Facebook size={20} className="text-gray-400 group-hover:text-black transition-colors duration-300" />
              </a>
              <a href="https://www.instagram.com/alungoo_store/" target='_blank' className="w-10 h-10 bg-gray-800 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Instagram size={20} className="text-gray-400 group-hover:text-black transition-colors duration-300" />
              </a>
            </div>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif text-gold mb-6">Холбоо барих</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gold" />
                <span className="text-gray-400">+976 9992-6520</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gold" />
                <span className="text-gray-400">info@ago.mn</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-gold mt-1" />
                <span className="text-gray-400">
                  Сүхбаатарын талбай 3,<br />
                  Чингэлтэй дүүрэг, Улаанбаатар
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-serif text-white mb-2">Шинэ мэдээлэл авах</h3>
              <p className="text-gray-400">Шинэ бүтээгдэхүүн болон хөнгөлөлтийн мэдээлэл авахаар бүртгүүлээрэй</p>
            </div>
            <div className="flex flex-col sm:flex-row space-x-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Имэйл хаягаа оруулна уу"
                className="flex-1 md:w-80 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 hover:scale-105">
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 AGo Online Store. Бүх эрх хуулиар хамгаалагдсан.
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <span>Монголоор</span>
              <Heart size={14} className="text-red-500 mx-1" />
              <span>бүтээгдсэн</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}