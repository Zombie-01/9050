import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import Reports from './components/Reports';
import { Transaction, dummyTransactions } from './data/dummyData';
import { saveTransactions, loadTransactions } from './utils/storage';
import { BarChart3, CreditCard, FileText, Wifi, WifiOff } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '1m' | '1y'>('7d');

  useEffect(() => {
    // Load transactions from localStorage or use dummy data
    const stored = loadTransactions();
    if (stored.length > 0) {
      setTransactions(stored);
    } else {
      setTransactions(dummyTransactions);
      saveTransactions(dummyTransactions);
    }

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleEditTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...transaction, id } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Дашбоард', icon: BarChart3 },
    { id: 'transactions', label: 'Гүйлгээ', icon: CreditCard },
    { id: 'reports', label: 'Тайлан', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo + online status + PWA install */}
      <header className="bg-white fixed z-50 top-0 w-screen shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">9050</h1>

              {/* Period selector */}
              <div className="ml-4 flex items-center gap-2">
                {[
                  { key: '1d', label: '1 өдөр' },
                  { key: '7d', label: '7 хоног' },
                  { key: '1m', label: '1 сар' },
                  { key: '1y', label: '1 жил' }
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPeriod(p.key as any)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors border ${
                      selectedPeriod === p.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    type="button"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* PWA Install Button */}
              {deferredPrompt && (
                <button
                  onClick={installPWA}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Суулгах
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* spacer so fixed header doesn't cover content */}
      <div className="h-16" />

      {/* Content */}
      <main className="flex-1">
        {activeTab === 'dashboard' && <Dashboard transactions={transactions} period={selectedPeriod} />}
        {activeTab === 'transactions' && (
          <TransactionManager
            transactions={transactions}
            onAdd={handleAddTransaction}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}
        {activeTab === 'reports' && <Reports transactions={transactions} />}
      </main>

      {/* Sticky Bottom Navbar (navigation only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-center h-16">
            {/* Desktop / tablet tab buttons (hidden on small screens) */}
            <div className="flex items-center gap-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${
                      activeTab === tab.id ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile tabs row (visible on small screens) */}
          <div className="md:hidden grid grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center py-3 px-1 text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* spacer so content isn't hidden behind fixed bottom bar */}
      <div className="h-20"></div>
    </div>
  );
}

export default App;