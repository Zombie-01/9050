import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Transaction } from '../data/dummyData';
import { formatMoney } from '../utils/storage';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  period?: '1d' | '7d' | '1m' | '1y';
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, period = '7d' }) => {
  // Determine reference "now": use latest transaction date if it's newer than real now
  const getLatestTransactionDate = () => {
    if (!transactions || transactions.length === 0) return null;
    return transactions.reduce((max, t) => (t.date > max ? t.date : max), transactions[0].date);
  };
  const latestDateStr = getLatestTransactionDate();
  // referenceNow is end of latest transaction day (so future-dated txns are included)
  const referenceNow = latestDateStr ? new Date(latestDateStr + 'T23:59:59') : new Date();

  // compute start date according to selected period using referenceNow
  const getStartDate = (p: string, ref: Date) => {
    const d = new Date(ref);
    d.setHours(0, 0, 0, 0);
    switch (p) {
      case '1d':
        d.setDate(ref.getDate() - 1);
        break;
      case '7d':
        d.setDate(ref.getDate() - 6); // last 7 days including ref date
        break;
      case '1m':
        d.setMonth(ref.getMonth() - 1);
        break;
      case '1y':
        d.setFullYear(ref.getFullYear() - 1);
        break;
      default:
        d.setMonth(ref.getMonth() - 1);
    }
    return d;
  };

  const startDate = getStartDate(period, referenceNow);
  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false;
    const td = new Date(t.date + 'T00:00:00'); // normalize to start of day
    return td >= startDate && td <= referenceNow;
  });

  // helper to show human label for period
  const periodLabel = period === '1d' ? '1 өдөр' : period === '7d' ? '7 хоног' : period === '1m' ? '1 сар' : '1 жил';

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'орлого')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'зарлага')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpense;

  // Prepare monthly data
  const monthlyData = filteredTransactions.reduce((acc, transaction) => {
    const monthKey = transaction.date.slice(0, 7); // YYYY-MM
    const monthLabel = new Date(transaction.date + 'T00:00:00').toLocaleDateString('mn-MN', { month: 'short', year: '2-digit' });
    const existing = acc.find(item => item.monthKey === monthKey);
    if (existing) {
      if (transaction.type === 'орлого') existing.орлого += transaction.amount;
      else existing.зарлага += transaction.amount;
    } else {
      acc.push({
        monthKey,
        month: monthLabel,
        орлого: transaction.type === 'орлого' ? transaction.amount : 0,
        зарлага: transaction.type === 'зарлага' ? transaction.amount : 0
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  // Prepare category data for pie chart
  const categoryData = filteredTransactions
    .filter(t => t.type === 'зарлага')
    .reduce((acc, transaction) => {
      const existing = acc.find(item => item.category === transaction.category);
      if (existing) {
        existing.amount += transaction.amount;
      } else {
        acc.push({
          category: transaction.category,
          amount: transaction.amount
        });
      }
      return acc;
    }, [] as any[]);

  // Prepare daily data for bar chart
  const dailyData = filteredTransactions.reduce((acc, transaction) => {
    const dayKey = transaction.date; // YYYY-MM-DD for reliable sorting
    const dayLabel = new Date(transaction.date + 'T00:00:00').toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.dayKey === dayKey);

    if (existing) {
      if (transaction.type === 'орлого') existing.орлого += transaction.amount;
      else existing.зарлага += transaction.amount;
    } else {
      acc.push({
        dayKey,
        day: dayLabel,
        орлого: transaction.type === 'орлого' ? transaction.amount : 0,
        зарлага: transaction.type === 'зарлага' ? transaction.amount : 0
      });
    }
    return acc;
  }, [] as any[])
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey))
    .slice(-7)
    .map(({ day, орлого, зарлага }) => ({ day, орлого, зарлага })); // remove dayKey for chart consumer

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {formatMoney(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Дашбоард</h1>
        <div className="text-sm text-gray-600"> хугацаа: <span className="font-medium text-gray-900">{periodLabel}</span></div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Нийт орлого</p>
              <p className="text-2xl font-bold text-green-600">{formatMoney(totalIncome)}</p>
            </div>
            <TrendingUp className="text-green-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Нийт зарлага</p>
              <p className="text-2xl font-bold text-red-600">{formatMoney(totalExpense)}</p>
            </div>
            <TrendingDown className="text-red-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Цэвэр ашиг</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatMoney(netProfit)}
              </p>
            </div>
            <DollarSign className={`w-8 h-8 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Сарын орлого ба зарлага</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => (value / 1000000).toFixed(1) + 'М'} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="орлого" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="зарлага" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Зарлагын ангиллаар харьцуулалт</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatMoney(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Сүүлийн долоо хоногийн өөрчлөлт</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => (value / 1000000).toFixed(1) + 'М'} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="орлого" fill="#10B981" />
            <Bar dataKey="зарлага" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;