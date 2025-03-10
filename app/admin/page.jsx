'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  DollarSign,
  Users,
  History,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Menu,
  Ticket,
  Link,
  Calendar,
  Edit,
  Trash2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Encryption key for added security
const ENCRYPTION_KEY = 'tour_planner_admin';

// Simple encryption function
const encrypt = (text) => {
  return btoa(text + ENCRYPTION_KEY);
};

// Simple decryption function
const decrypt = (encoded) => {
  const decoded = atob(encoded);
  return decoded.replace(ENCRYPTION_KEY, '');
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [expenses, setExpenses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ticketLink, setTicketLink] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityTime, setActivityTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [activityLocation, setActivityLocation] = useState('');
  const [activities, setActivities] = useState([]);
  const [isActivityFormSubmitting, setIsActivityFormSubmitting] = useState(false);
  const [registrationFilter, setRegistrationFilter] = useState('ALL');
  const [isUpdatingRegistration, setIsUpdatingRegistration] = useState(null);
  const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(null);
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(null);
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const session = localStorage.getItem('adminSession');
        if (session) {
          const decrypted = decrypt(session);
          if (decrypted === 'bolajabena') {
            setIsAuthenticated(true);
            fetchData();
          }
        }
      } catch (error) {
        console.error('Session error:', error);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      if (password === 'bolajabena') {
        const encrypted = encrypt(password);
        localStorage.setItem('adminSession', encrypted);
        setIsAuthenticated(true);
        await fetchData();
      } else {
        alert('Invalid password');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('adminSession');
      setIsAuthenticated(false);
      setPassword('');
      setDescription('');
      setAmount('');
      setCategory('');
      setNote('');
      setExpenseDate(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
      });
      setExpenses([]);
      setRegistrations([]);
      setPendingTransactions([]);
      setActiveTab('dashboard');
      setTicketLink('');
      setSelectedRegistration(null);
      setActivityTitle('');
      setActivityDescription('');
      setActivityTime(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
      });
      setActivityLocation('');
      setActivities([]);
      setRegistrationFilter('ALL');
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const fetchData = async () => {
    setIsFetchingData(true);
    try {
      await Promise.all([
        fetchExpenses(),
        fetchRegistrations(),
        fetchPendingTransactions(),
        fetchActivities()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetchingData(false);
    }
  };

  const fetchExpenses = async () => {
    const response = await fetch('/api/expenses');
    const data = await response.json();
    setExpenses(data);
  };

  const fetchRegistrations = async () => {
    const response = await fetch('/api/tour-registration');
    const data = await response.json();
    setRegistrations(data);
  };

  const fetchPendingTransactions = async () => {
    const response = await fetch('/api/transactions');
    const data = await response.json();
    setPendingTransactions(data);
  };

  const fetchActivities = async () => {
    const response = await fetch('/api/activities');
    const data = await response.json();
    setActivities(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category) {
      alert('Please select a category');
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          category: category,
          note: note || null,
          createdAt: expenseDate ? new Date(expenseDate).toISOString() : new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setDescription('');
        setAmount('');
        setCategory('');
        setNote('');
        setExpenseDate(() => {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          return now.toISOString().slice(0, 16);
        });
        fetchExpenses();
      } else {
        const error = await response.json();
        alert('Error adding expense: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdatingRegistration(id);
    try {
      const response = await fetch(`/api/tour-registration/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error updating registration:', error);
    } finally {
      setIsUpdatingRegistration(null);
    }
  };

  const handleTransactionApproval = async (transactionId, action) => {
    setIsUpdatingTransaction(transactionId);
    try {
      const response = await fetch('/api/transactions/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId, action }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setIsUpdatingTransaction(null);
    }
  };

  const handleTicketAssign = async (registrationId) => {
    if (!ticketLink) {
      alert('টিকেটের লিংক দিন');
      return;
    }

    setIsUpdatingTicket(registrationId);
    try {
      const response = await fetch(`/api/tour-registration/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketLink }),
      });

      if (response.ok) {
        setTicketLink('');
        setSelectedRegistration(null);
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
    } finally {
      setIsUpdatingTicket(null);
    }
  };

  const handleTicketDelete = async (registrationId) => {
    setIsUpdatingTicket(registrationId);
    try {
      const response = await fetch(`/api/tour-registration/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketLink: null }),
      });

      if (response.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    } finally {
      setIsUpdatingTicket(null);
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setIsActivityFormSubmitting(true);
    
    try {
      // Format the datetime string to ISO-8601
      const formattedTime = new Date(activityTime).toISOString();

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: activityTitle,
          description: activityDescription,
          time: formattedTime,
          location: activityLocation,
        }),
      });

      if (response.ok) {
        setActivityTitle('');
        setActivityDescription('');
        setActivityTime(() => {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          return now.toISOString().slice(0, 16);
        });
        setActivityLocation('');
        fetchActivities();
      } else {
        const error = await response.json();
        alert('Error adding activity: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity');
    } finally {
      setIsActivityFormSubmitting(false);
    }
  };

  const handleActivityStatusUpdate = async (id, newStatus) => {
    setIsUpdatingActivity(id);
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchActivities();
      }
    } catch (error) {
      console.error('Error updating activity status:', error);
      alert('Error updating activity status');
    } finally {
      setIsUpdatingActivity(null);
    }
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

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      APPROVED: "bg-green-100 text-green-800 hover:bg-green-200",
      REJECTED: "bg-red-100 text-red-800 hover:bg-red-200",
    };
    
    const labels = {
      PENDING: "পেন্ডিং",
      APPROVED: "অনুমোদিত",
      REJECTED: "বাতিল",
    };

    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: CreditCard },
    { id: 'expenses', label: 'খরচ', icon: DollarSign },
    { id: 'registrations', label: 'রেজিস্ট্রেশন', icon: Users },
    { id: 'transactions', label: 'লেনদেন', icon: History },
    { id: 'tickets', label: 'টিকেট', icon: Ticket },
    { id: 'activities', label: 'কার্যক্রম', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // Calculate total collections and dues
        const totalToCollect = registrations.reduce((sum, reg) => sum + reg.totalAmount, 0);
        const totalCollected = registrations.reduce((sum, reg) => sum + reg.paidAmount, 0);
        const totalDue = totalToCollect - totalCollected;

        // Calculate categorical expenses
        const categoryTotals = expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {});

        // Calculate recent expenses (last 24 hours)
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentExpenses = expenses.filter(exp => new Date(exp.createdAt) > last24Hours);
        const recentExpenseTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Calculate today's expenses
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayExpenses = expenses.filter(exp => new Date(exp.createdAt) > today);
        const todayExpenseTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        return (
          <div className="space-y-6">
            {/* Registration and Transaction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">মোট রেজিস্ট্রেশন</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{registrations.length}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">অনুমোদিত: {registrations.filter(r => r.status === 'APPROVED').length}</p>
                    <p className="text-sm text-gray-600">পেন্ডিং: {registrations.filter(r => r.status === 'PENDING').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">পেন্ডিং পেমেন্ট</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{pendingTransactions.length}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    মোট পরিমাণ: {formatCurrency(pendingTransactions.reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">মোট খরচ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">গত ২৪ ঘন্টা: {formatCurrency(recentExpenseTotal)}</p>
                    <p className="text-sm text-gray-600">আজ: {formatCurrency(todayExpenseTotal)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collection Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">মোট সংগ্রহ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(totalCollected)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">বাকি আছে</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(totalDue)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">মোট পাওনা</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(totalToCollect)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Categorical Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>ক্যাটাগরি অনুযায়ী খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryTotals).map(([category, total]) => (
                    <div key={category} className="p-4 border rounded-lg">
                      <Badge variant="outline">{category}</Badge>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(total)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>সাম্প্রতিক খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-start p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{expense.category}</Badge>
                          <p className="text-sm text-gray-500">
                            {formatDate(expense.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">{formatCurrency(expense.amount)}</p>
                    </div>
                  ))}
                  {recentExpenses.length === 0 && (
                    <p className="text-center text-gray-500">কোন সাম্প্রতিক খরচ নেই</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>নতুন খরচ যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">বিবরণ</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="খরচের বিবরণ লিখুন"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">ক্যাটাগরি</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ক্যাটাগরি বাছাই করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRANSPORT">পরিবহন</SelectItem>
                        <SelectItem value="FOOD">খাবার</SelectItem>
                        <SelectItem value="ACCOMMODATION">থাকার খরচ</SelectItem>
                        <SelectItem value="ACTIVITIES">কার্যক্রম</SelectItem>
                        <SelectItem value="OTHERS">অন্যান্য</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">পরিমাণ</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="টাকার পরিমাণ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
                    <Input
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="অতিরিক্ত তথ্য লিখুন"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenseDate">সময়</Label>
                    <Input
                      id="expenseDate"
                      type="datetime-local"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                    />
                  </div>
                  <Button type="submit" isLoading={isSubmittingExpense}>যোগ করুন</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>সাম্প্রতিক খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-start p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{expense.category}</Badge>
                          <p className="text-sm text-gray-500">
                            {formatDate(expense.createdAt)}
                          </p>
                        </div>
                        {expense.note && (
                          <p className="text-sm text-gray-600 mt-1">{expense.note}</p>
                        )}
                      </div>
                      <p className="font-bold">{formatCurrency(expense.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'registrations':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>মোট রেজিস্ট্রেশন</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{registrations.length}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">অনুমোদিত: {registrations.filter(r => r.status === 'APPROVED').length}</p>
                    <p className="text-sm text-gray-600">পেন্ডিং: {registrations.filter(r => r.status === 'PENDING').length}</p>
                    <p className="text-sm text-gray-600">বাতিল: {registrations.filter(r => r.status === 'REJECTED').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>মোট সংগ্রহ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(registrations.reduce((sum, reg) => sum + reg.paidAmount, 0))}</p>
                  <p className="text-sm text-gray-600 mt-2">বাকি: {formatCurrency(registrations.reduce((sum, reg) => sum + reg.dueAmount, 0))}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>রেজিস্ট্রেশন ফিল্টার</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={registrationFilter}
                    onValueChange={setRegistrationFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="সব রেজিস্ট্রেশন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">সব রেজিস্ট্রেশন</SelectItem>
                      <SelectItem value="PENDING">পেন্ডিং</SelectItem>
                      <SelectItem value="APPROVED">অনুমোদিত</SelectItem>
                      <SelectItem value="REJECTED">বাতিল</SelectItem>
                      <SelectItem value="WITH_DUE">বাকি আছে</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>রেজিস্ট্রেশন তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {renderRegistrationList()}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'transactions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>পেন্ডিং লেনদেন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renderTransactionList()}
              </div>
            </CardContent>
          </Card>
        );

      case 'tickets':
        return (
          <Card>
            <CardHeader>
              <CardTitle>টিকেট ব্যবস্থাপনা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.filter(reg => reg.status === 'APPROVED').map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{reg.name}</p>
                        <p className="text-sm text-gray-500">{reg.phone}</p>
                        <p className="text-sm">তারিখ: {formatDate(reg.date)}</p>
                        {reg.ticketLink && (
                          <div className="mt-2 space-y-2">
                            <a 
                              href={reg.ticketLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                            >
                              <Link className="h-4 w-4 mr-1" />
                              টিকেট লিংক
                            </a>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                onClick={() => {
                                  setSelectedRegistration(reg.id);
                                  setTicketLink(reg.ticketLink);
                                }}
                                isLoading={isUpdatingTicket === reg.id}
                                disabled={isUpdatingTicket === reg.id}
                              >
                                আপডেট
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-100 text-red-800 hover:bg-red-200"
                                onClick={() => handleTicketDelete(reg.id)}
                                isLoading={isUpdatingTicket === reg.id}
                                disabled={isUpdatingTicket === reg.id}
                              >
                                ডিলিট
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(!reg.ticketLink || selectedRegistration === reg.id) && (
                          <>
                            <Input
                              placeholder="টিকেটের লিংক দিন"
                              value={selectedRegistration === reg.id ? ticketLink : ''}
                              onChange={(e) => {
                                setSelectedRegistration(reg.id);
                                setTicketLink(e.target.value);
                              }}
                              className="w-64"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                handleTicketAssign(reg.id);
                                setSelectedRegistration(null);
                              }}
                              className="w-full"
                              isLoading={isUpdatingTicket === reg.id}
                              disabled={isUpdatingTicket === reg.id}
                            >
                              {reg.ticketLink ? 'আপডেট করুন' : 'টিকেট যোগ করুন'}
                            </Button>
                            {selectedRegistration === reg.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRegistration(null);
                                  setTicketLink('');
                                }}
                                className="w-full"
                                disabled={isUpdatingTicket === reg.id}
                              >
                                বাতিল
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'activities':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>নতুন কার্যক্রম যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleActivitySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">শিরোনাম</Label>
                    <Input
                      id="title"
                      value={activityTitle}
                      onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder="কার্যক্রমের শিরোনাম"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">বিবরণ</Label>
                    <Input
                      id="description"
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      placeholder="কার্যক্রমের বিবরণ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">সময়</Label>
                    <Input
                      id="time"
                      type="datetime-local"
                      value={activityTime}
                      onChange={(e) => setActivityTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">স্থান</Label>
                    <Input
                      id="location"
                      value={activityLocation}
                      onChange={(e) => setActivityLocation(e.target.value)}
                      placeholder="কার্যক্রমের স্থান"
                      required
                    />
                  </div>
                  <Button type="submit" isLoading={isActivityFormSubmitting}>
                    যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>কার্যক্রম তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {renderActivityList()}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRegistrationList = () => (
    <div className="space-y-4">
      {[...registrations]
        .filter(reg => {
          if (registrationFilter === 'ALL') return true;
          if (registrationFilter === 'WITH_DUE') return reg.dueAmount > 0;
          return reg.status === registrationFilter;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((reg) => (
          <div
            key={reg.id}
            className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-lg">{reg.name}</p>
                  {getStatusBadge(reg.status)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ফোন নম্বর</p>
                    <p className="font-medium">{reg.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ঠিকানা</p>
                    <p className="font-medium">{reg.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">রেজিস্ট্রেশন তারিখ</p>
                    <p className="font-medium">{formatDate(reg.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">অংশগ্রহণকারী</p>
                    <p className="font-medium">{reg.participants} জন</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">মোট টাকা</p>
                    <p className="font-medium">{formatCurrency(reg.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">জমা</p>
                    <p className="font-medium">{formatCurrency(reg.paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">বাকি</p>
                    <p className="font-medium">{formatCurrency(reg.dueAmount)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        সম্পাদনা
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>রেজিস্ট্রেশন সম্পাদনা</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>নাম</Label>
                          <Input
                            defaultValue={reg.name}
                            onChange={(e) => setEditingRegistration({
                              ...editingRegistration,
                              name: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ফোন</Label>
                          <Input
                            defaultValue={reg.phone}
                            onChange={(e) => setEditingRegistration({
                              ...editingRegistration,
                              phone: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ঠিকানা</Label>
                          <Input
                            defaultValue={reg.address}
                            onChange={(e) => setEditingRegistration({
                              ...editingRegistration,
                              address: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>অংশগ্রহণকারী সংখ্যা</Label>
                          <Input
                            type="number"
                            defaultValue={reg.participants}
                            onChange={(e) => setEditingRegistration({
                              ...editingRegistration,
                              participants: parseInt(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => handleRegistrationUpdate(reg.id, editingRegistration)}
                          isLoading={isUpdatingRegistration === reg.id}
                        >
                          আপডেট করুন
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        মুছুন
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                        <AlertDialogDescription>
                          এই রেজিস্ট্রেশন মুছে ফেলা হবে। এই ক্রিয়া অপরিবর্তনীয়।
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRegistrationDelete(reg.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          মুছে ফেলুন
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {reg.status === 'PENDING' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => handleStatusUpdate(reg.id, 'APPROVED')}
                      isLoading={isUpdatingRegistration === reg.id}
                      disabled={isUpdatingRegistration === reg.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      অনুমোদন
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                      onClick={() => handleStatusUpdate(reg.id, 'REJECTED')}
                      isLoading={isUpdatingRegistration === reg.id}
                      disabled={isUpdatingRegistration === reg.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      বাতিল
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderTransactionList = () => (
    <div className="space-y-4">
      {pendingTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 border rounded-lg space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-lg">
                {transaction.tourRegistration.name}
              </p>
              <p className="text-sm text-gray-500">
                {transaction.tourRegistration.phone}
              </p>
              <p className="text-sm font-medium">
                পরিমাণ: {formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm">
                পেমেন্ট মাধ্যম: {transaction.paymentMethod}
              </p>
              <p className="text-sm text-gray-500">
                তারিখ: {formatDate(transaction.paymentDate)}
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                অপেক্ষমান
              </Badge>
              <div className="space-x-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  onClick={() => handleTransactionApproval(transaction.id, 'APPROVED')}
                  isLoading={isUpdatingTransaction === transaction.id}
                  disabled={isUpdatingTransaction === transaction.id}
                >
                  অনুমোদন
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                  onClick={() => handleTransactionApproval(transaction.id, 'REJECTED')}
                  isLoading={isUpdatingTransaction === transaction.id}
                  disabled={isUpdatingTransaction === transaction.id}
                >
                  বাতিল
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivityList = () => (
    <div className="space-y-4">
      {[...activities]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .map((activity) => (
          <div
            key={activity.id}
            className="p-4 border rounded-lg space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-lg">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-sm">সময়: {formatDate(activity.time)}</p>
                <p className="text-sm">স্থান: {activity.location}</p>
              </div>
              <div className="space-y-2">
                <Badge className={`${
                  activity.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                  activity.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                  activity.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.status === 'UPCOMING' ? 'আসন্ন' :
                   activity.status === 'ONGOING' ? 'চলমান' :
                   activity.status === 'COMPLETED' ? 'সম্পন্ন' :
                   'বাতিল'}
                </Badge>
                <div className="space-x-2">
                  {activity.status === 'UPCOMING' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => handleActivityStatusUpdate(activity.id, 'ONGOING')}
                      isLoading={isUpdatingActivity === activity.id}
                      disabled={isUpdatingActivity === activity.id}
                    >
                      শুরু করুন
                    </Button>
                  )}
                  {activity.status === 'ONGOING' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                      onClick={() => handleActivityStatusUpdate(activity.id, 'COMPLETED')}
                      isLoading={isUpdatingActivity === activity.id}
                      disabled={isUpdatingActivity === activity.id}
                    >
                      সম্পন্ন করুন
                    </Button>
                  )}
                  {(activity.status === 'UPCOMING' || activity.status === 'ONGOING') && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                      onClick={() => handleActivityStatusUpdate(activity.id, 'CANCELLED')}
                      isLoading={isUpdatingActivity === activity.id}
                      disabled={isUpdatingActivity === activity.id}
                    >
                      বাতিল করুন
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">অ্যাডমিন লগইন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  required
                />
              </div>
              <Button type="submit" className="w-full" isLoading={isLoggingIn}>
                লগইন
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">অ্যাডমিন প্যানেল</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>মেনু</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-8">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 text-purple-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full p-2 rounded-lg text-red-600 hover:bg-red-50"
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span>{isLoggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold">অ্যাডমিন প্যানেল</h1>
          </div>
          <div className="flex-1 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full text-red-600 hover:bg-red-50"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              লগআউট
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {/* Loading Overlay */}
      {isFetchingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-lg">লোড হচ্ছে...</p>
          </div>
        </div>
      )}
    </div>
  );
} 