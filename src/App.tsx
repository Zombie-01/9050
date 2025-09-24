import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Features from './components/Features';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';
import ProductFilter, { FilterState } from './components/ProductFilter';
import WishlistPage from './components/WishlistPage';
import ProductDetail from './components/ProductDetail';
import UserProfile from './components/UserProfile';
import ProductsPage from './components/ProductsPage';
import AdminDashboard from './components/AdminDashboard';

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

interface UserData {
  name: string;
  phone: string;
  address: string;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'product' | 'products'>('home');
  const [filters, setFilters] = useState<FilterState>({
    category: '', priceRange: [0, 10000000], brand: '', rating: 0, sortBy: 'featured'
  });
  const [userData, setUserData] = useState<UserData>({ name: '', phone: '', address: '' });
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Apple iPhone 15 Pro Max 256GB",
      price: 2890000,
      originalPrice: 3200000,
      image: "https://images.pexels.com/photos/1454178/pexels-photo-1454178.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 5.0,
      reviews: 124,
      category: "Утас",
      description: "Хамгийн сүүлийн үеийн iPhone 15 Pro Max нь A17 Pro чип, титан корпус, 48MP камертай.",
      features: ["A17 Pro чип", "Титан корпус", "48MP камер", "USB-C порт"],
      specifications: {
        "Дэлгэц": "6.7 инч Super Retina XDR",
        "Чип": "A17 Pro",
        "Камер": "48MP + 12MP + 12MP",
        "Батарей": "29 цаг видео тоглуулах"
      }
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra 512GB",
      price: 2650000,
      image: "https://images.pexels.com/photos/1927130/pexels-photo-1927130.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 4.9,
      reviews: 89,
      category: "Утас",
      description: "Galaxy S24 Ultra нь S Pen-тэй хамт ирдэг хамгийн хүчирхэг Android утас.",
      features: ["S Pen дэмжлэг", "200MP камер", "AI функцууд", "5000mAh батарей"],
      specifications: {
        "Дэлгэц": "6.8 инч Dynamic AMOLED 2X",
        "Чип": "Snapdragon 8 Gen 3",
        "Камер": "200MP + 50MP + 12MP + 10MP",
        "Батарей": "5000mAh"
      }
    },
    {
      id: 3,
      name: "MacBook Pro 16-inch M3 Max",
      price: 6890000,
      originalPrice: 7500000,
      image: "https://images.pexels.com/photos/1456737/pexels-photo-1456737.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 5.0,
      reviews: 203,
      category: "Компьютер",
      description: "M3 Max чиптэй MacBook Pro нь мэргэжлийн ажилд зориулсан хамгийн хүчирхэг лаптоп.",
      features: ["M3 Max чип", "Liquid Retina XDR дэлгэц", "22 цаг батарей", "6 спикер"],
      specifications: {
        "Чип": "Apple M3 Max",
        "Дэлгэц": "16.2 инч Liquid Retina XDR",
        "Санах ой": "36GB unified memory",
        "Хадгалах сан": "1TB SSD"
      }
    },
    {
      id: 4,
      name: "Sony WH-1000XM5 Чихэвч",
      price: 890000,
      image: "https://images.pexels.com/photos/1454176/pexels-photo-1454176.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 4.8,
      reviews: 67,
      category: "Аудио",
      description: "Дэлхийн хамгийн сайн дуу чимээ хасагч чихэвч.",
      features: ["Дуу чимээ хасах", "30 цаг батарей", "Hi-Res Audio", "Мультипойнт холболт"],
      specifications: {
        "Драйвер": "30мм",
        "Батарей": "30 цаг",
        "Жин": "250г",
        "Холболт": "Bluetooth 5.2"
      }
    },
    {
      id: 5,
      name: "Apple Watch Ultra 2 49mm",
      price: 1890000,
      image: "https://images.pexels.com/photos/1464204/pexels-photo-1464204.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 4.9,
      reviews: 156,
      category: "Ухаалаг цаг",
      description: "Хамгийн бат бөх Apple Watch спорт болон адал явдалд зориулагдсан.",
      features: ["Титан корпус", "36 цаг батарей", "GPS + Cellular", "Усны эсэргүүцэл"],
      specifications: {
        "Дэлгэц": "49мм Always-On Retina",
        "Чип": "S9 SiP",
        "Батарей": "36 цаг",
        "Усны эсэргүүцэл": "100м"
      }
    },
    {
      id: 6,
      name: "iPad Pro 12.9-inch M2 1TB",
      price: 3290000,
      originalPrice: 3650000,
      image: "https://images.pexels.com/photos/1456735/pexels-photo-1456735.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 4.7,
      reviews: 93,
      category: "Таблет",
      description: "M2 чиптэй iPad Pro нь лаптопын хүчин чадалтай таблет.",
      features: ["M2 чип", "Liquid Retina XDR", "Apple Pencil дэмжлэг", "5G холболт"],
      specifications: {
        "Чип": "Apple M2",
        "Дэлгэц": "12.9 инч Liquid Retina XDR",
        "Санах ой": "16GB",
        "Хадгалах сан": "1TB"
      }
    },
    {
      id: 7,
      name: "Nintendo Switch OLED 64GB",
      price: 890000,
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 4.8,
      reviews: 234,
      category: "Тоглоом",
      description: "OLED дэлгэцтэй Nintendo Switch нь гэр болон гадаа тоглох боломжтой.",
      features: ["7 инч OLED дэлгэц", "64GB санах ой", "Гар болон суурин горим", "Joy-Con удирдлага"],
      specifications: {
        "Дэлгэц": "7 инч OLED",
        "Санах ой": "64GB",
        "Батарей": "4.5-9 цаг",
        "Жин": "420г"
      }
    },
    {
      id: 8,
      name: "Canon EOS R5 Камер",
      price: 4890000,
      originalPrice: 5200000,
      image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 4.9,
      reviews: 145,
      category: "Камер",
      description: "45MP full-frame мирроргүй камер 8K видео бичлэгтэй.",
      features: ["45MP сенсор", "8K видео", "Дуал пиксел автофокус", "5-тэнхлэгийн стабилизатор"],
      specifications: {
        "Сенсор": "45MP Full-Frame CMOS",
        "Видео": "8K RAW, 4K 120p",
        "Автофокус": "1053 цэг",
        "Батарей": "490 зураг"
      }
    },
    {
      id: 9,
      name: "Tesla Model Y Performance",
      price: 89000000,
      image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      rating: 5.0,
      reviews: 89,
      category: "Автомашин",
      description: "Цахилгаан SUV хамгийн дээд гүйцэтгэлтэй загвар.",
      features: ["Dual Motor AWD", "456км зай", "3.5с 0-100км/ц", "Autopilot"],
      specifications: {
        "Хүчин чадал": "456км",
        "Хурдатгал": "3.5с (0-100км/ц)",
        "Дээд хурд": "250км/ц",
        "Суудал": "7 хүн"
      }
    }
  ]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...product, quantity }];
    });
    
    // Briefly show cart
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setCurrentView('home');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add smooth scrolling
  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleScroll);
      });
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return (
          <ProductsPage
            products={products}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onAddToWishlist={handleAddToWishlist}
            wishlistItems={wishlistItems}
          />
        );
      case 'wishlist':
        return (
          <WishlistPage
            wishlistItems={wishlistItems}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
          />
        );
      case 'product':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onBack={handleBackToHome}
            isInWishlist={wishlistItems.some(item => item.id === selectedProduct.id)}
          />
        ) : null;
      default:
        return (
          <>
            <Hero />
            <ProductGrid 
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
              onAddToWishlist={handleAddToWishlist}
              onFilterToggle={() => setIsFilterOpen(true)}
              filters={filters}
              wishlistItems={wishlistItems}
              products={products}
            />
            <Features />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onWishlistToggle={() => setCurrentView('wishlist')}
        onProfileToggle={() => setIsProfileOpen(true)}
        onHomeClick={() => setCurrentView('home')}
        onProductsClick={() => setCurrentView('products')}
        onAdminClick={() => setIsAdminOpen(true)}
      />
      
      {renderCurrentView()}
      
      <Footer />
      
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      
      <ProductFilter
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        onFilterChange={setFilters}
      />
      
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        onUpdateUser={setUserData}
      />
      
      {isAdminOpen && (
        <AdminDashboard
          products={products}
          onUpdateProducts={setProducts}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

export default App;