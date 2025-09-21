import React, { useState, useEffect } from 'react';
import { Transaction } from '../data/dummyData';
import { formatMoney, formatDate } from '../utils/storage';
import { Download, Calendar, FileText } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  // Default to the most recent transaction month/year when available,
  // otherwise fallback to the current month/year.
  const getLatestDate = (): string | null => {
    if (!transactions || transactions.length === 0) return null;
    return transactions.reduce((max, t) => (t.date > max ? t.date : max), transactions[0].date);
  };

  const latestDate = getLatestDate();
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    latestDate ? latestDate.slice(0, 7) : new Date().toISOString().slice(0, 7)
  );
  const [selectedYear, setSelectedYear] = useState<string>(() =>
    latestDate ? latestDate.slice(0, 4) : new Date().getFullYear().toString()
  );

  // If transactions prop changes and current selection doesn't match any transaction,
  // update selection to the latest available month/year (do not override user selections otherwise).
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    const months = new Set(transactions.map(t => (t.date || '').slice(0, 7)));
    const years = new Set(transactions.map(t => (t.date || '').slice(0, 4)));

    if (!months.has(selectedMonth)) {
      const latest = getLatestDate();
      if (latest) setSelectedMonth(latest.slice(0, 7));
    }
    if (!years.has(selectedYear)) {
      const latest = getLatestDate();
      if (latest) setSelectedYear(latest.slice(0, 4));
    }
  }, [transactions, selectedMonth, selectedYear]);

  // Filter transactions by month
  const monthlyTransactions = transactions.filter(t => 
    t.date.slice(0, 7) === selectedMonth
  );

  // Filter transactions by year
  const yearlyTransactions = transactions.filter(t => 
    t.date.slice(0, 4) === selectedYear
  );

  const calculateSummary = (txns: Transaction[]) => {
    const income = txns.filter(t => t.type === 'орлого').reduce((sum, t) => sum + t.amount, 0);
    const expense = txns.filter(t => t.type === 'зарлага').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, profit: income - expense };
  };

  const monthlySummary = calculateSummary(monthlyTransactions);
  const yearlySummary = calculateSummary(yearlyTransactions);

  // Group by category
  const groupByCategory = (txns: Transaction[]) => {
    const groups = txns.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { count: 0, total: 0 };
      }
      acc[t.category].count += 1;
      acc[t.category].total += t.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return Object.entries(groups).map(([category, data]) => ({
      category,
      count: data.count,
      total: data.total
    }));
  };

  const monthlyCategories = groupByCategory(monthlyTransactions);
  const yearlyCategories = groupByCategory(yearlyTransactions);

  const exportToCSV = (data: Transaction[], filename: string) => {
    const headers = ['Огноо', 'Төрөл', 'Ангилал', 'Дүн', 'Тайлбар'];

    // Escape a value for CSV: wrap in double quotes and escape internal quotes
    const escape = (v: any) => {
      const s = v == null ? '' : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };

    // Summary lines
    const income = data.filter(t => t.type === 'орлого').reduce((sum, t) => sum + t.amount, 0);
    const expense = data.filter(t => t.type === 'зарлага').reduce((sum, t) => sum + t.amount, 0);
    const profit = income - expense;

    // Category aggregation
    const categories = data.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const rows = data.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount.toString(),
      t.description
    ]);

    // Build CSV: header, blank, summary, blank, category summary, blank, table header + rows
    const csvLines: string[] = [];
    csvLines.push(headers.map(escape).join(','));
    csvLines.push(''); // blank line
    csvLines.push(escape('Нийт орлого') + ',' + escape(formatMoney(income)));
    csvLines.push(escape('Нийт зарлага') + ',' + escape(formatMoney(expense)));
    csvLines.push(escape('Цэвэр ашиг') + ',' + escape(formatMoney(profit)));
    csvLines.push(''); // blank line
    csvLines.push(escape('Ангилал') + ',' + escape('Нийт дүн'));
    Object.entries(categories).forEach(([cat, total]) => {
      csvLines.push(`${escape(cat)},${escape(formatMoney(total))}`);
    });
    csvLines.push(''); // blank line
    // Table header and rows
    csvLines.push(headers.map(escape).join(','));
    rows.forEach(row => {
      csvLines.push(row.map(escape).join(','));
    });

    // Use CRLF for line endings
    const csvContent = csvLines.join('\r\n');

    // Prepend UTF-8 BOM so Excel detects UTF-8 encoding correctly
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generatePDFReport = (data: Transaction[], summary: any, period: string) => {
    // Build category aggregation for this dataset
    const categories = data.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    // Simple printable HTML report — user can choose "Save as PDF" in browser print dialog
    const rowsHtml = data.map(t => `<tr>
      <td style="padding:6px;border:1px solid #e5e7eb">${formatDate(t.date)}</td>
      <td style="padding:6px;border:1px solid #e5e7eb">${t.type}</td>
      <td style="padding:6px;border:1px solid #e5e7eb">${t.category}</td>
      <td style="padding:6px;border:1px solid #e5e7eb;text-align:right">${formatMoney(t.amount)}</td>
      <td style="padding:6px;border:1px solid #e5e7eb">${t.description}</td>
    </tr>`).join('');

    const categoriesHtml = Object.entries(categories).map(([cat, total]) =>
      `<tr><td style="padding:6px;border:1px solid #e5e7eb">${cat}</td><td style="padding:6px;border:1px solid #e5e7eb;text-align:right">${formatMoney(total)}</td></tr>`
    ).join('');

    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Report - ${period}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 20px; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          .summary { display:flex; gap:12px; margin-bottom:12px; }
          .card { padding:10px; border-radius:6px; background:#f3f4f6; min-width:120px; }
          table { border-collapse: collapse; width:100%; margin-top:8px; }
          th { text-align:left; padding:8px; border-bottom:1px solid #e5e7eb; background:#f9fafb; }
        </style>
      </head>
      <body>
        <h1>ДУГУЙ БИЗНЕСИЙН САНХҮҮГИЙН ТАЙЛАН</h1>
        <div style="margin-bottom:8px"><strong>${period}</strong></div>

        <div class="summary">
          <div class="card"><div style="font-size:12px;color:#6b7280">Нийт орлого</div><div style="font-weight:700;color:#059669">${formatMoney(summary.income)}</div></div>
          <div class="card"><div style="font-size:12px;color:#6b7280">Нийт зарлага</div><div style="font-weight:700;color:#dc2626">${formatMoney(summary.expense)}</div></div>
          <div class="card"><div style="font-size:12px;color:#6b7280">Цэвэр ашиг</div><div style="font-weight:700;color:${summary.profit>=0? '#059669' : '#dc2626'}">${formatMoney(summary.profit)}</div></div>
        </div>

        <h3>Ангиллын нэгтгэл</h3>
        <table>
          <thead><tr><th>Ангилал</th><th style="text-align:right">Нийт дүн</th></tr></thead>
          <tbody>${categoriesHtml}</tbody>
        </table>

        <h3 style="margin-top:12px">Гүйлгээний жагсаалт</h3>
        <table>
          <thead>
            <tr>
              <th>Огноо</th><th>Төрөл</th><th>Ангилал</th><th style="text-align:right">Дүн</th><th>Тайлбар</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>`;

    const newWin = window.open('', '_blank');
    if (newWin) {
      newWin.document.write(html);
      newWin.document.close();
      newWin.focus();
      // Slight delay to ensure content renders before print
      setTimeout(() => newWin.print(), 500);
    } else {
      // Fallback: download HTML file which can be opened and printed/saved as PDF
      const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `report-${period}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Тайлан</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Report */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Сарын тайлан
            </h2>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Орлого</p>
                <p className="text-lg font-bold text-green-600">{formatMoney(monthlySummary.income)}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Зарлага</p>
                <p className="text-lg font-bold text-red-600">{formatMoney(monthlySummary.expense)}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Ашиг</p>
                <p className={`text-lg font-bold ${monthlySummary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatMoney(monthlySummary.profit)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Ангиллын нэгтгэл</h3>
              <div className="space-y-2">
                {monthlyCategories.map((cat, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{cat.category}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatMoney(cat.total)}</div>
                      <div className="text-xs text-gray-500">{cat.count} гүйлгээ</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(monthlyTransactions, `monthly-report-${selectedMonth}.csv`)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => generatePDFReport(monthlyTransactions, monthlySummary, `Сар: ${selectedMonth}`)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Yearly Report */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Жилийн тайлан
            </h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Орлого</p>
                <p className="text-lg font-bold text-green-600">{formatMoney(yearlySummary.income)}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Зарлага</p>
                <p className="text-lg font-bold text-red-600">{formatMoney(yearlySummary.expense)}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Ашиг</p>
                <p className={`text-lg font-bold ${yearlySummary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatMoney(yearlySummary.profit)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Ангиллын нэгтгэл</h3>
              <div className="space-y-2">
                {yearlyCategories.map((cat, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{cat.category}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatMoney(cat.total)}</div>
                      <div className="text-xs text-gray-500">{cat.count} гүйлгээ</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(yearlyTransactions, `yearly-report-${selectedYear}.csv`)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => generatePDFReport(yearlyTransactions, yearlySummary, `Жил: ${selectedYear}`)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;