'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VALID_CATEGORIES = ['TRANSPORT', 'FOOD', 'ACCOMMODATION', 'ACTIVITIES', 'OTHERS'];

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, category, startDate, endDate, minAmount, maxAmount]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (category && category !== 'ALL') {
      filtered = filtered.filter(expense => expense.category === category);
    }

    if (startDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.createdAt) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.createdAt) <= endDate
      );
    }

    if (minAmount) {
      filtered = filtered.filter(expense => 
        expense.amount >= parseFloat(minAmount)
      );
    }

    if (maxAmount) {
      filtered = filtered.filter(expense => 
        expense.amount <= parseFloat(maxAmount)
      );
    }

    setFilteredExpenses(filtered);
  };

  const resetFilters = () => {
    setCategory('ALL');
    setStartDate(null);
    setEndDate(null);
    setMinAmount('');
    setMaxAmount('');
    setFilteredExpenses(expenses);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastHour = new Date(now.getTime() - (60 * 60 * 1000));

    const stats = {
      total: 0,
      byCategory: {},
      today: 0,
      lastHour: 0,
    };

    // Initialize categories
    VALID_CATEGORIES.forEach(cat => {
      stats.byCategory[cat] = 0;
    });

    filteredExpenses.forEach(expense => {
      const expenseDate = new Date(expense.createdAt);
      
      // Total amount
      stats.total += expense.amount;
      
      // By category
      stats.byCategory[expense.category] += expense.amount;
      
      // Today's total
      if (expenseDate >= today) {
        stats.today += expense.amount;
      }
      
      // Last hour total
      if (expenseDate >= lastHour) {
        stats.lastHour += expense.amount;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">মোট খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.total)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">আজকের খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.today)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">গত ১ ঘন্টার খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.lastHour)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">মোট লেনদেন</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredExpenses.length}টি
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category-wise Stats */}
          <Card>
            <CardHeader>
              <CardTitle>ক্যাটাগরি অনুযায়ী খরচ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(stats.byCategory).map(([category, amount]) => (
                  <div key={category} className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-600">
                      {category === 'TRANSPORT' && 'পরিবহন'}
                      {category === 'FOOD' && 'খাবার'}
                      {category === 'ACCOMMODATION' && 'থাকার খরচ'}
                      {category === 'ACTIVITIES' && 'কার্যক্রম'}
                      {category === 'OTHERS' && 'অন্যান্য'}
                    </p>
                    <p className="text-lg font-bold mt-1">{formatCurrency(amount)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                ফিল্টার
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>ক্যাটাগরি</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="সব ক্যাটাগরি" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">সব</SelectItem>
                      <SelectItem value="TRANSPORT">পরিবহন</SelectItem>
                      <SelectItem value="FOOD">খাবার</SelectItem>
                      <SelectItem value="ACCOMMODATION">থাকার খরচ</SelectItem>
                      <SelectItem value="ACTIVITIES">কার্যক্রম</SelectItem>
                      <SelectItem value="OTHERS">অন্যান্য</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>শুরুর তারিখ ও সময়</Label>
                  <Input
                    type="datetime-local"
                    value={startDate ? new Date(startDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>শেষের তারিখ ও সময়</Label>
                  <Input
                    type="datetime-local"
                    value={endDate ? new Date(endDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>টাকার পরিসীমা</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="সর্বনিম্ন"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="সর্বোচ্চ"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                >
                  রিসেট
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expense List */}
          <Card>
            <CardHeader>
              <CardTitle>খরচের তালিকা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-start p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {expense.category === 'TRANSPORT' && 'পরিবহন'}
                          {expense.category === 'FOOD' && 'খাবার'}
                          {expense.category === 'ACCOMMODATION' && 'থাকার খরচ'}
                          {expense.category === 'ACTIVITIES' && 'কার্যক্রম'}
                          {expense.category === 'OTHERS' && 'অন্যান্য'}
                        </Badge>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.createdAt).toLocaleString('bn-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {expense.note && (
                        <p className="text-sm text-gray-600 mt-1">{expense.note}</p>
                      )}
                    </div>
                    <p className="font-bold">{formatCurrency(expense.amount)}</p>
                  </div>
                ))}
                {filteredExpenses.length === 0 && (
                  <p className="text-center text-gray-500">কোন খরচ পাওয়া যায়নি</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
} 