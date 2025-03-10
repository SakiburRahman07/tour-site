'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Phone, User, Calendar, MapPin, CreditCard, History, Ticket, Receipt, Link } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function UserInfo() {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paymentNote, setPaymentNote] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Fetch registered users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/tour-registration?status=APPROVED');
        if (response.ok) {
          const data = await response.json();
          setRegisteredUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      setError('ফোন নাম্বার দিন');
      return;
    }

    setLoading(true);
    setError('');
    setUserInfo(null);
    setTransactions([]);

    try {
      const response = await fetch(`/api/tour-registration/search?phone=${phoneNumber}`);
      const data = await response.json();

      if (response.ok && data) {
        setUserInfo(data);
        // Fetch transactions for this registration
        const transResponse = await fetch(`/api/transactions/${data.id}`);
        if (transResponse.ok) {
          const transData = await transResponse.json();
          setTransactions(transData);
        }
      } else {
        setError('কোন তথ্য পাওয়া যায়নি');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('তথ্য খোঁজার সময় সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!userInfo || !paymentAmount || !paymentMethod) {
      setError('সব তথ্য দিন');
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: userInfo.id,
          amount: parseFloat(paymentAmount),
          paymentMethod,
          note: paymentNote,
          description: `Payment via ${paymentMethod}`,
        }),
      });

      if (response.ok) {
        // Refresh user info and transactions
        handleSearch();
        setPaymentAmount('');
        setPaymentNote('');
      } else {
        setError('পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className="shadow-lg border-t-4 border-t-purple-600">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center text-purple-900">আপনার তথ্য খুঁজুন</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">নাম বাছাই করুন</label>
                      <Select
                        value={selectedName}
                        onValueChange={setSelectedName}
                      >
                        <SelectTrigger className="border-gray-200 focus:ring-purple-500 focus:border-purple-500">
                          <SelectValue placeholder="নাম সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {registeredUsers.map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ফোন নম্বর</label>
                      <div className="relative">
                        <Input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="আপনার ফোন নম্বর দিন"
                          className="pl-10 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-purple-500" />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-600 text-center font-medium">{error}</p>
                    )}

                    <Button
                      onClick={handleSearch}
                      disabled={loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          খোঁজা হচ্ছে...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Search className="mr-2 h-5 w-5" />
                          তথ্য খুঁজুন
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {userInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-900">
                        <User className="h-5 w-5 mr-2 text-purple-600" />
                        ব্যক্তিগত তথ্য
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-700">নাম</p>
                            <p className="text-gray-900">{userInfo.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-700">ফোন নম্বর</p>
                            <p className="text-gray-900">{userInfo.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-700">ঠিকানা</p>
                            <p className="text-gray-900">{userInfo.address}</p>
                          </div>
                        </div>

                        {userInfo.ticketLink && (
                          <div className="flex items-start space-x-3">
                            <Ticket className="h-5 w-5 text-purple-600 mt-1" />
                            <div>
                              <p className="font-medium text-gray-700">টিকেট</p>
                              <a 
                                href={userInfo.ticketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                              >
                                <Link className="h-4 w-4 mr-1" />
                                টিকেট ডাউনলোড করুন
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="font-medium text-gray-700">মোট টাকা</p>
                            <p className="text-xl font-semibold text-purple-600">
                              {formatCurrency(userInfo.totalAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">জমা দেওয়া</p>
                            <p className="text-xl font-semibold text-green-600">
                              {formatCurrency(userInfo.paidAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">বাকি টাকা</p>
                            <p className="text-xl font-semibold text-red-600">
                              {formatCurrency(userInfo.dueAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          {userInfo && (
            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Payment Section */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                      টাকা জমা দিন
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">টাকার পরিমাণ</label>
                      <Input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="টাকার পরিমাণ দিন"
                        className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">পেমেন্ট মাধ্যম</label>
                      <Select
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <SelectTrigger className="border-gray-200 focus:ring-purple-500 focus:border-purple-500">
                          <SelectValue placeholder="পেমেন্ট মাধ্যম বাছাই করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">ক্যাশ</SelectItem>
                          <SelectItem value="BKASH">বিকাশ</SelectItem>
                          <SelectItem value="NAGAD">নগদ</SelectItem>
                          <SelectItem value="ROCKET">রকেট</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">নোট (ঐচ্ছিক)</label>
                      <Input
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="পেমেন্ট সম্পর্কে নোট লিখুন"
                        className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      isLoading={isSubmittingPayment}
                      disabled={isSubmittingPayment}
                    >
                      {isSubmittingPayment ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'টাকা জমা দিন'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <History className="h-5 w-5 mr-2 text-purple-600" />
                      লেনদেনের ইতিহাস
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all ${
                            transaction.status === 'PENDING'
                              ? 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100'
                              : transaction.status === 'APPROVED'
                              ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                              : 'bg-red-50 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(transaction.paymentDate)}
                            </p>
                            {transaction.note && (
                              <p className="text-sm text-gray-700 mt-1">
                                {transaction.note}
                              </p>
                            )}
                            <p className={`text-sm font-medium mt-1 ${
                              transaction.status === 'PENDING'
                                ? 'text-yellow-700'
                                : transaction.status === 'APPROVED'
                                ? 'text-green-700'
                                : 'text-red-700'
                            }`}>
                              {transaction.status === 'PENDING' && 'অপেক্ষমান'}
                              {transaction.status === 'APPROVED' && 'অনুমোদিত'}
                              {transaction.status === 'REJECTED' && 'বাতিল'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-purple-600">{transaction.paymentMethod}</p>
                          </div>
                        </div>
                      ))}
                      {transactions.length === 0 && (
                        <p className="text-center text-gray-500 py-4">কোন লেনদেন নেই</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Ticket Information */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <Ticket className="h-5 w-5 mr-2 text-purple-600" />
                      টিকেট তথ্য
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">টিকেট নম্বর</span>
                        <span className="font-medium text-purple-600">#{userInfo.id.toString().padStart(4, '0')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">স্ট্যাটাস</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {userInfo.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 