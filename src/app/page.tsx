'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, Edit2, Plus, Moon, Sun, TrendingUp, DollarSign, List, BarChart3, Zap } from 'lucide-react';

const CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other'];
const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#6366F1', '#EF4444'];

export default function SmartSpendAI() {
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Coffee', amount: 150, category: 'Food & Dining', date: '2024-01-15', description: 'Morning coffee' },
    { id: 2, title: 'Auto Ride', amount: 250, category: 'Transportation', date: '2024-01-14', description: 'Morning commute' },
    { id: 3, title: 'Movie Tickets', amount: 600, category: 'Entertainment', date: '2024-01-13', description: 'Cinema with friends' },
  ]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], description: '' });
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const nextId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;

  const handleAddExpense = () => {
    if (!formData.title || !formData.amount) {
      alert('Please fill in title and amount');
      return;
    }

    if (editingId) {
      setExpenses(expenses.map(exp => exp.id === editingId ? { ...formData, id: editingId, amount: parseFloat(formData.amount) } : exp));
      setEditingId(null);
    } else {
      setExpenses([...expenses, { id: nextId, ...formData, amount: parseFloat(formData.amount) }]);
    }
    
    setFormData({ title: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], description: '' });
    setShowForm(false);
  };

  const handleEditExpense = (expense) => {
    setFormData(expense);
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    setTimeout(() => {
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      const avg = expenses.length > 0 ? total / expenses.length : 0;
      const grouped = {};
      expenses.forEach(e => { grouped[e.category] = (grouped[e.category] || 0) + e.amount; });
      const topCat = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0];
      
      const currencySymbol = currency === 'INR' ? '₹' : '$';
      const insights = [
        `Your total spending is ${currencySymbol}${total.toFixed(2)} across ${expenses.length} transactions.`,
        `Your average expense is ${currencySymbol}${avg.toFixed(2)}.`,
        `${topCat ? `Your highest spending category is ${topCat[0]} with ${currencySymbol}${topCat[1].toFixed(2)}.` : ''}`,
        `Consider setting a budget limit to better control your ${topCat?.[0] || 'spending'}.`,
        `Track your expenses regularly to identify spending patterns and save more effectively.`
      ].filter(Boolean).join(' ');
      
      setAiInsight(insights);
      setLoadingInsight(false);
    }, 800);
  };

  const formatCurrency = (value) => {
    if (currency === 'INR') {
      return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    } else {
      return `$${parseFloat(value).toFixed(2)}`;
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  const grouped = {};
  expenses.forEach(e => { grouped[e.category] = (grouped[e.category] || 0) + e.amount; });
  const categoryData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  const dailyData = {};
  expenses.forEach(e => {
    const date = new Date(e.date).toLocaleDateString();
    dailyData[date] = (dailyData[date] || 0) + e.amount;
  });
  const trendData = Object.entries(dailyData).map(([date, amount]) => ({ date, amount })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const bgClass = darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
  const cardClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors`}>
      <header className={`border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">SmartSpend AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 font-semibold transition-all ${
                  currency === 'INR'
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 font-semibold transition-all ${
                  currency === 'USD'
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                $ USD
              </button>
            </div>
            
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} hover:opacity-80`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
            { id: 'expenses', label: '📝 Expenses', icon: List },
            { id: 'insights', label: '🤖 AI Insights', icon: Zap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                currentPage === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`rounded-lg border p-6 ${cardClass}`}>
                <p className="text-sm opacity-75">Total Spent</p>
                <p className="text-3xl font-bold text-blue-500 mt-2">{formatCurrency(totalSpent)}</p>
                <p className="text-xs opacity-50 mt-2">{expenses.length} transactions</p>
              </div>
              <div className={`rounded-lg border p-6 ${cardClass}`}>
                <p className="text-sm opacity-75">Average Expense</p>
                <p className="text-3xl font-bold text-purple-500 mt-2">{formatCurrency(averageExpense)}</p>
                <p className="text-xs opacity-50 mt-2">Per transaction</p>
              </div>
              <div className={`rounded-lg border p-6 ${cardClass}`}>
                <p className="text-sm opacity-75">Categories</p>
                <p className="text-3xl font-bold text-green-500 mt-2">{Object.keys(grouped).length}</p>
                <p className="text-xs opacity-50 mt-2">Active categories</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {trendData.length > 0 && (
                <div className={`rounded-lg border p-6 ${cardClass}`}>
                  <h3 className="text-lg font-bold mb-4">Spending Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="date" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                      <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {categoryData.length > 0 && (
                <div className={`rounded-lg border p-6 ${cardClass}`}>
                  <h3 className="text-lg font-bold mb-4">By Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {categoryData.length > 0 && (
              <div className={`rounded-lg border p-6 ${cardClass}`}>
                <h3 className="text-lg font-bold mb-4">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke={darkMode ? '#94a3b8' : '#64748b'} />
                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {currentPage === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">My Expenses</h2>
              <button
                onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], description: '' }); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={18} /> Add Expense
              </button>
            </div>

            {showForm && (
              <div className={`rounded-lg border p-6 ${cardClass}`}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                    <div className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'} flex items-center font-semibold`}>
                      {currency === 'INR' ? '₹' : '$'}
                    </div>
                  </div>
                  <select
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input
                    type="date"
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none`}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddExpense}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Add'} Expense
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); setFormData({ title: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], description: '' }); }}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {expenses.length === 0 ? (
                <p className="text-center py-12 opacity-50">No expenses yet. Add one to get started!</p>
              ) : (
                expenses.map(expense => (
                  <div key={expense.id} className={`rounded-lg border p-4 flex items-center justify-between ${cardClass}`}>
                    <div className="flex-1">
                      <h3 className="font-semibold">{expense.title}</h3>
                      <p className="text-sm opacity-75">{expense.category} • {formatDate(expense.date)}</p>
                      {expense.description && <p className="text-sm opacity-60 mt-1">{expense.description}</p>}
                    </div>
                    <p className="font-bold text-lg text-blue-500 mr-4">{formatCurrency(expense.amount)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditExpense(expense)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentPage === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">AI-Powered Insights</h2>
            
            <button
              onClick={handleGenerateInsight}
              disabled={loadingInsight || expenses.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Zap size={18} /> {loadingInsight ? 'Generating...' : 'Generate Insights'}
            </button>

            {expenses.length === 0 && !aiInsight && (
              <div className={`rounded-lg border p-8 text-center ${cardClass}`}>
                <p className="opacity-50">Add some expenses first to get AI insights!</p>
              </div>
            )}

            {aiInsight && (
              <div className={`rounded-lg border p-8 bg-gradient-to-br ${darkMode ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-purple-50'}`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🤖</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Your Spending Insights ({currency})</h3>
                    <p className="text-lg leading-relaxed opacity-90">{aiInsight}</p>
                  </div>
                </div>
              </div>
            )}

            {expenses.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className={`rounded-lg border p-6 text-center ${cardClass}`}>
                  <p className="text-sm opacity-75">Total Spent</p>
                  <p className="text-3xl font-bold text-blue-500 mt-2">{formatCurrency(totalSpent)}</p>
                </div>
                <div className={`rounded-lg border p-6 text-center ${cardClass}`}>
                  <p className="text-sm opacity-75">Average Expense</p>
                  <p className="text-3xl font-bold text-purple-500 mt-2">{formatCurrency(averageExpense)}</p>
                </div>
                <div className={`rounded-lg border p-6 text-center ${cardClass}`}>
                  <p className="text-sm opacity-75">Top Category</p>
                  <p className="text-xl font-bold text-green-500 mt-2">
                    {Object.entries(grouped).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}