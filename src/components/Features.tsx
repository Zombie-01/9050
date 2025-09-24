import React from 'react';
import { Shield, Truck, Award, Headphones, Sparkles, Clock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Баталгаат чанар",
      description: "Бүх бүтээгдэхүүн нь үнэнч алт, мөнгө, эрдэнэт чулуугаар хийгдсэн",
      color: "from-blue-600 to-blue-500"
    },
    {
      icon: Truck,
      title: "Үнэгүй хүргэлт",
      description: "Улаанбаатар хот даяар 24 цагийн дотор үнэгүй хүргэх үйлчилгээ",
      color: "from-green-600 to-green-500"
    },
    {
      icon: Award,
      title: "Олон улсын сертификат",
      description: "ISO 9001 стандартын дагуу үйлдвэрлэсэн сертификаттай бүтээгдэхүүн",
      color: "from-purple-600 to-purple-500"
    },
    {
      icon: Headphones,
      title: "24/7 дэмжлэг",
      description: "Туслах хэрэгтэй үед үйлчлүүлэгчийн үйлчилгээний баг таны хажууд",
      color: "from-orange-600 to-orange-500"
    },
    {
      icon: Sparkles,
      title: "Захиалгат дизайн",
      description: "Таны хүсэл зүйлийн дагуу онцгой дизайнтай зүүлт бэлтгэх үйлчилгээ",
      color: "from-pink-600 to-pink-500"
    },
    {
      icon: Clock,
      title: "Үндэсний баялаг",
      description: "Монголын уламжлалт урлаг, соёлыг харуулсан өв залгамжлагч дизайн",
      color: "from-yellow-600 to-yellow-500"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/20 via-transparent to-silver/20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-silver">
              ЯАГААД БИДНИЙГ СОНГОХ ВЭ?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            25 жилийн туршлага, олон мянган сэтгэл хангалуун үйлчлүүлэгч, дэлхийн стандартын чанар
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gold/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold/10"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <IconComponent size={32} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-silver/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 pt-12 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold mb-2">99.9%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Чанарын баталгаа</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-silver mb-2">ISO 9001</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Олон улсын сертификат</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold mb-2">10,000+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Амжилттай захиалга</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-silver mb-2">24/7</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Үйлчлүүлэгчийн дэмжлэг</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}