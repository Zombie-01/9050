import React, { useState, useEffect } from 'react';
import { supabase, Product, getProducts } from './lib/supabase';
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
import AdminRoute from './components/AdminRoute';
import AuthModal from './components/AuthModal';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'product' | 'products' | 'admin'>('home');
  const [filters, setFilters] = useState<FilterState>({
    category: '', priceRange: [0, 10000000], brand: '', rating: 0, sortBy: 'featured'
  });
  const [userData, setUserData] = useState<UserData>({ name: '', phone: '', address: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [profileInitialEditing, setProfileInitialEditing] = useState<boolean>(false);

  useEffect(() => {
    loadProducts();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // fetch user profile to determine admin status whenever user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setUserData({ name: '', phone: '', address: '' });
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_admin, name, phone, address')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch profile:', error);
        setIsAdmin(false);
        setUserData({ name: '', phone: '', address: '' });
        return;
      }

      setIsAdmin(Boolean(data?.is_admin));
      setUserData({
        name: data?.name ?? '',
        phone: data?.phone ?? '',
        address: data?.address ?? ''
      });
    };

    fetchProfile();
  }, [user]);

  const loadProducts = async () => {
    const { data, error } = await getProducts();
    if (data && !error) {
      setProducts(data);
    }
  };

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

  // Change id type to string to match product IDs
  const handleUpdateQuantity = (id: string, quantity: number) => {
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

  const handleRemoveItem = (id: string) => {
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('products');
    }
  };

  const handleAdminClick = () => {
    // only allow admin users to go to admin dashboard
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      // Optionally prompt to login as admin
      setShowAuthModal(true);
    }
  };

  const handleProfileToggle = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setShowAuthModal(true);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error', err);
    } finally {
      // Clear local state
      setUser(null);
      setIsAdmin(false);
      setUserData({ name: '', phone: '', address: '' });
      setIsProfileOpen(false);
      setCurrentView('home');
    }
  };

  // Create order in Supabase from current cart
  const handleCreateOrder = async (items: CartItem[]) => {
    // compute total (integer)
    const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);

    // ensure user is signed in
    const sessionResp = await supabase.auth.getSession();
    const userSession = sessionResp?.data?.session?.user;
    if (!userSession) {
      setShowAuthModal(true);
      return { error: new Error('Not authenticated') };
    }

    const orderPayload = {
      user_id: userSession.id,
      total_amount: total,
      status: 'pending',
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (error) {
      console.error('Create order error', error);
      return { error };
    }

    // clear cart & close panel on success
    setCartItems([]);
    setIsCartOpen(false);
    return { data };
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
      case 'admin':
        // extra guard in case someone tries to navigate directly
        if (!isAdmin) {
          // deny access, fallback to home
          return (
            <div className="p-6 text-center text-red-500">
              Access denied — admin only.
            </div>
          );
        }
        return (
          <AdminRoute>
            <AdminDashboard onClose={() => setCurrentView('home')} />
          </AdminRoute>
        );
      case 'products':
        return (
          <ProductsPage
            products={products}
            onAddToCart={(product) => handleAddToCart(product)}
            onProductClick={handleProductClick}
            onAddToWishlist={handleAddToWishlist}
            wishlistItems={wishlistItems}
            searchQuery={searchQuery}
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

  // Save profile updates to Supabase and update local state
  const handleUpdateUser = async (profile: UserData) => {
    // update local immediately for optimistic UI
    setUserData(profile);

    if (!user?.id) {
      // not signed in — nothing to persist
      return;
    }

    const updates = {
      name: profile.name || null,
      phone: profile.phone || null,
      address: profile.address || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update profile:', error);
      // revert or notify user — for now revert local state to previous (refetch)
      // refetch profile
      const { data: fresh, error: err } = await supabase
        .from('user_profiles')
        .select('name, phone, address, is_admin')
        .eq('id', user.id)
        .single();
      if (!err && fresh) {
        setUserData({ name: fresh.name ?? '', phone: fresh.phone ?? '', address: fresh.address ?? '' });
        setIsAdmin(Boolean(fresh.is_admin));
      }
      // optionally surface error to UI — here we console.error
    } else {
      // update local with canonical data from DB
      setUserData({
        name: data?.name ?? '',
        phone: data?.phone ?? '',
        address: data?.address ?? ''
      });
      setIsAdmin(Boolean(data?.is_admin));
    }
  };

  // Open profile panel and optionally start editing
  const openProfileForEdit = (startEditing: boolean = false) => {
    setProfileInitialEditing(startEditing);
    setIsProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onWishlistToggle={() => setCurrentView('wishlist')}
        onProfileToggle={handleProfileToggle}
        onHomeClick={() => setCurrentView('home')}
        onProductsClick={() => setCurrentView('products')}
        onAdminClick={handleAdminClick}
        onSearch={handleSearch}
        isAdmin={isAdmin}
      />
      
      {renderCurrentView()}
      
      <Footer />
      
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCreateOrder={handleCreateOrder}
        userData={userData}
        onOpenProfile={openProfileForEdit}
      />
      
      <ProductFilter
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        onFilterChange={setFilters}
      />
      
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setProfileInitialEditing(false);
        }}
        userData={userData}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        initialEditing={profileInitialEditing}
      />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          // after successful auth, open profile if now logged in
          // session change is handled via auth listener which updates `user`
          // slight delay to allow auth state to propagate
          setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              // rely on onAuthStateChange to set `user`, open profile if set
              if (session?.user) {
                setIsProfileOpen(true);
              }
            });
          }, 100);
        }}
      />
    </div>
  );
}

export default App;