import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-silver/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-sm text-gray-300 tracking-wide">ШИНЭ ЦУГЛУУЛГА</span>
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-wider leading-tight">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-silver animate-gradient">
            AGO STORE
          </span>
          <span className="block text-4xl md:text-6xl mt-2 text-gray-300">
            ОНЛАЙН ДЭЛГҮҮР
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Дэлхийн шилдэг брэндүүдийн бүтээгдэхүүнийг танд хүргэх онлайн дэлгүүр
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold/25">
            <span className="relative z-10 flex items-center space-x-2">
              <span>ЦУГЛУУЛГА ҮЗЭХ</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
          
          <button className="group px-8 py-4 border border-white/20 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/5 transition-all duration-500 hover:scale-105 hover:border-white/40">
            <span className="flex items-center space-x-2">
              <span>ЗАХИАЛГАТ ДИЗАЙН</span>
            </span>
          </button>
        </div>

        {/* Floating Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-4xl font-serif text-gold mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Бүтээгдэхүүн</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-4xl font-serif text-silver mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Сэтгэл хангалуун үйлчлүүлэгч</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-4xl font-serif text-gold mb-2 group-hover:scale-110 transition-transform duration-300">25+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Жилийн туршлага</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}