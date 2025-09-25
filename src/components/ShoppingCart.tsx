import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCreateOrder: (items: CartItem[]) => Promise<{ data?: any; error?: any }>;
  userData: { name: string; phone: string; address: string };
  onOpenProfile: (startEditing?: boolean) => void;
}

export default function ShoppingCart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCreateOrder, userData, onOpenProfile }: ShoppingCartProps) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [confirmError, setConfirmError] = React.useState<string | null>(null);

  const handleConfirmPay = async () => {
    setConfirmError(null);
    setConfirmLoading(true);
    try {
      const { data, error } = await onCreateOrder(cartItems);
      if (error) {
        setConfirmError(error.message || 'Order creation failed');
      } else {
        // success: close confirm modal (cart already cleared by parent)
        setShowConfirm(false);
      }
    } catch (err: any) {
      setConfirmError(err?.message || 'Unknown error');
    } finally {
      setConfirmLoading(false);
    }
  };

  // open payment flow: check profile fields first
  const startPaymentFlow = () => {
    // require name, phone, address
    const missing = !userData?.name?.trim() || !userData?.phone?.trim() || !userData?.address?.trim();
    if (missing) {
      // open profile for editing
      onOpenProfile?.(true);
      // close cart so user can edit profile, or keep it open depending on UX preference
      // here we close cart to surface the profile panel
      onClose();
      return;
    }
    setShowConfirm(true);
  };

  // prevent background scroll when cart or confirm modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen || showConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev;
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, showConfirm]);

  return (
    <>
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Cart Panel */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl border-l border-gray-800 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center">
                <ShoppingBag size={16} className="text-black" />
              </div>
              <h2 className="text-2xl font-serif text-white">Худалдан авах сагс</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-gray-800 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Сагс хоосон байна</h3>
                <p className="text-gray-400">Бүтээгдэхүүн нэмэж эхлээрэй</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 transform transition-all duration-700 hover:border-gold/30 hover:scale-105 hover:shadow-lg hover:shadow-gold/10 ${
                      index === cartItems.length - 1 ? 'animate-slide-in' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate mb-1">{item.name}</h3>
                      <p className="text-gold font-bold">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                        <Minus size={14} className="text-white" />
                      </button>
                      <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                        <Plus size={14} className="text-white" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-800 p-6 bg-gradient-to-t from-black to-gray-900">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Дэд дүн:</span>
                  <span className="text-white text-lg">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Хүргэлт:</span>
                  <span className="text-green-400">Үнэгүй</span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold border-t border-gray-700 pt-4">
                  <span className="text-white">Нийт:</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
              
              <button
                onClick={startPaymentFlow}
                className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-gold/25 hover:scale-105 mb-3"
                type="button"
              >
                ТӨЛБӨР ТӨЛӨХ
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-600 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                ХУДАЛДАН АВАЛТ ҮРГЭЛЖЛҮҮЛЭХ
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed z-50 inset-0 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 z-70">
            <h3 className="text-lg font-semibold mb-4">Төлбөр баталгаажуулалт</h3>
            <p className="mb-4">Данс уруу {formatPrice(total)} төгрөг хийхийг зөвшөөрч байна уу?</p>
            {confirmError && <div className="text-sm text-red-600 mb-2">{confirmError}</div>}
            <div className="flex gap-2">
              <button
                onClick={handleConfirmPay}
                disabled={confirmLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
              >
                {confirmLoading ? 'Ачааллаж байна...' : 'Төлөх'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md"
              >
                Буцах
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
 }