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
  Trash2,
  User,
  Phone,
  MapPin,
  Search,
  Receipt,
  ArrowUpRight
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
import { Textarea } from "@/components/ui/textarea";
import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.min.css';                   // core css
import 'primeicons/primeicons.css';                                 // icons

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

// Add these helper functions near the top of your component, after the encrypt/decrypt functions
const getStatusColor = (status) => {
  switch (status) {
    case 'UPCOMING':
      return 'bg-blue-100 text-blue-800';
    case 'ONGOING':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'UPCOMING':
      return 'আসন্ন';
    case 'ONGOING':
      return 'চলমান';
    case 'COMPLETED':
      return 'সম্পন্ন';
    case 'CANCELLED':
      return 'বাতিল';
    default:
      return 'অজানা';
  }
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
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [searchingUser, setSearchingUser] = useState(false);
  const [userSearchError, setUserSearchError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paymentNote, setPaymentNote] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  // Add these new loading state variables at the top with other state declarations
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Add this to the state declarations at the top
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);

  // Add this state variable with the other state declarations at the top
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Add these state variables with the other state declarations at the top
  const [editingTicket, setEditingTicket] = useState(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [newTicketLink, setNewTicketLink] = useState('');

  // Add these state variables at the top with other state declarations
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [newActivityData, setNewActivityData] = useState({
    title: '',
    description: '',
    time: '',
    location: ''
  });

  // Add these state variables at the top with other state declarations
  const [isActivityDeleteDialogOpen, setIsActivityDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  // Add these state variables at the top with other state declarations
  const [editingExpense, setEditingExpense] = useState(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isExpenseDeleteDialogOpen, setIsExpenseDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [newExpenseData, setNewExpenseData] = useState({
    description: '',
    amount: '',
    category: '',
    note: '',
    createdAt: ''
  });

  // Add this state variable at the top with other state declarations
  const [isUpdatingExpense, setIsUpdatingExpense] = useState(null);

  // Add these state variables at the top
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [isDeletingRegistration, setIsDeletingRegistration] = useState(null);
  const [newRegistrationData, setNewRegistrationData] = useState({
    name: '',
    phone: '',
    address: '',
    status: ''
  });

  // Add this state variable at the top
  const [isApprovingRegistration, setIsApprovingRegistration] = useState(null);

  // Add these state variables at the top
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [registrationToApprove, setRegistrationToApprove] = useState(null);

  // Add these state variables at the top
  const [isDeleteRegistrationDialogOpen, setIsDeleteRegistrationDialogOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState(null);

  // Add this to your state declarations at the top of the AdminPanel component
  const [transactions, setTransactions] = useState([]);

  // Add these new state variables at the top of your component with other states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add this state at the top with other states
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Add this state variable at the top with other state declarations
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        fetchAllTransactions(),
        fetchActivities(),
        fetchAllUsers(),
        fetchTransactions(), // Add this new function call
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetchingData(false);
    }
  };

  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const fetchRegistrations = async () => {
    setIsLoadingRegistrations(true);
    try {
      const response = await fetch('/api/tour-registration');
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const fetchAllTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await fetch('/api/transactions/all');
      const data = await response.json();
      setPendingTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchActivities = async () => {
    setIsLoadingActivities(true);
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const fetchAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/tour-registration?status=APPROVED');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions/all');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
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

  const handleTicketAssign = async (registrationId, ticketLink) => {
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
        // Close the dialog first if it's open
        setIsTicketDialogOpen(false);
        setEditingTicket(null);
        setNewTicketLink('');
        // Then refresh the data
        await fetchRegistrations();
      } else {
        alert('টিকেট লিংক আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert('টিকেট লিংক আপডেট করতে সমস্যা হয়েছে');
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
        await fetchRegistrations();
      } else {
        alert('টিকেট মুছতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('টিকেট মুছতে সমস্যা হয়েছে');
    } finally {
      setIsUpdatingTicket(null);
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    
    if (!activityTitle || !activityTime || !activityLocation) {
      alert('সব ফিল্ড পূরণ করুন');
      return;
    }
    
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
          description: activityDescription, // PrimeReact Editor already provides HTML content
          time: formattedTime,
          location: activityLocation,
          status: 'UPCOMING',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create activity');
      }
      
      const newActivity = await response.json();
      
      // Add to activities in state
      setActivities([newActivity, ...activities]);
      
      // Reset form
        setActivityTitle('');
        setActivityDescription('');
        setActivityTime(() => {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          return now.toISOString().slice(0, 16);
        });
        setActivityLocation('');
      
      // Replace alert with success dialog
      setSuccessMessage('কার্যক্রম সফলভাবে যোগ করা হয়েছে');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('কার্যক্রম যোগ করতে সমস্যা হয়েছে');
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
        body: JSON.stringify({
          status: newStatus,
          // Send the existing activity data to preserve it
          ...activities.find(a => a.id === id),
          // Override the status with the new one
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update activity status');
      }

      const updatedActivity = await response.json();

      // Update the activity in state
      setActivities(activities.map(activity => 
        activity.id === id ? updatedActivity : activity
      ));

      // Show success message
      setSuccessMessage(
        newStatus === 'ONGOING' ? 'কার্যক্রম সফলভাবে শুরু করা হয়েছে' :
        newStatus === 'COMPLETED' ? 'কার্যক্রম সফলভাবে সম্পন্ন করা হয়েছে' :
        newStatus === 'CANCELLED' ? 'কার্যক্রম সফলভাবে বাতিল করা হয়েছে' :
        'কার্যক্রমের অবস্থা আপডেট করা হয়েছে'
      );
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error updating activity status:', error);
      alert('কার্যক্রমের অবস্থা আপডেট করতে সমস্যা হয়েছে');
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    { id: 'userinfo', label: 'ব্যবহারকারী তথ্য', icon: User },
  ];

  const handleUserSearch = async () => {
    if (!selectedUserInfo) {
      setUserSearchError('ব্যবহারকারী নির্বাচন করুন');
      return;
    }

    // Extract phone from the selected user info (format: "Name - Phone")
    const phone = selectedUserInfo.split(' - ')[1];
    
    setSearchingUser(true);
    setUserSearchError('');
    setUserInfo(null);
    setUserTransactions([]);

    try {
      const response = await fetch(`/api/tour-registration/search?phone=${phone}`);
      const data = await response.json();

      if (response.ok && data) {
        setUserInfo(data);
        // Fetch transactions for this registration
        const transResponse = await fetch(`/api/transactions/${data.id}`);
        if (transResponse.ok) {
          const transData = await transResponse.json();
          setUserTransactions(transData);
        }
      } else {
        setUserSearchError('কোন তথ্য পাওয়া যায়নি');
      }
    } catch (error) {
      console.error('Error:', error);
      setUserSearchError('তথ্য খোঁজার সময় সমস্যা হয়েছে');
    } finally {
      setSearchingUser(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!userInfo || !paymentAmount || !paymentMethod) {
      setUserSearchError('সব তথ্য দিন');
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
          status: 'APPROVED', // Auto-approve payments made by admin
        }),
      });

      if (response.ok) {
        // Clear form
        setPaymentAmount('');
        setPaymentMethod('CASH');
        setPaymentNote('');
        
        // Refresh user info and transactions
        await handleUserSearch();
      } else {
        const error = await response.json();
        setUserSearchError(error.message || 'পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setUserSearchError('পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    setIsUpdatingTransaction(updatedTransaction.id);
    try {
      const response = await fetch(`/api/transactions/${updatedTransaction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: updatedTransaction.amount,
          paymentMethod: updatedTransaction.paymentMethod,
          note: updatedTransaction.note,
          status: updatedTransaction.status,
        }),
      });

      if (response.ok) {
        // Close the dialog first
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
        // Then refresh the data
        await fetchAllTransactions();
        // Scroll to top after update
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('লেনদেন আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('লেনদেন আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsUpdatingTransaction(null);
    }
  };

  // Update the handleDeleteTransaction function
  const handleDeleteTransaction = async (transactionId) => {
    setDeletingTransactionId(transactionId);
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the data first
        await fetchAllTransactions();
        // Then close the dialog only after successful deletion
        setIsDeleteDialogOpen(false);
        setTransactionToDelete(null);
        // Scroll to top after delete
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('লেনদেন মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('লেনদেন মুছে ফেলতে সমস্যা হয়েছে');
    } finally {
      setDeletingTransactionId(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">মোট রেজিস্ট্রেশন</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{registrations.length}</div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600 font-medium">
                        {registrations.filter(r => r.status === 'APPROVED').length}
                      </span> অনুমোদিত
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-yellow-600 font-medium">
                        {registrations.filter(r => r.status === 'PENDING').length}
                      </span> অপেক্ষমান
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-red-600 font-medium">
                        {registrations.filter(r => r.status === 'REJECTED').length}
                      </span> বাতিল
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">মোট আয়</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      (transactions || [])
                        .filter(t => t.status === 'APPROVED')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </div>
                  <div className="flex items-center mt-4 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    গত ৭ দিনে{' '}
                    {formatCurrency(
                      (transactions || [])
                        .filter(t => 
                          t.status === 'APPROVED' && 
                          new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        )
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">মোট খরচ</CardTitle>
                  <Receipt className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {Object.entries(
                      expenses.reduce((acc, exp) => {
                        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                        return acc;
                      }, {})
                    ).map(([category, amount]) => (
                      <div key={category} className="text-xs text-muted-foreground">
                        {category}: {formatCurrency(amount)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* New Cash in Hand card */}
              <Card className="bg-gradient-to-br from-amber-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">হাতে নগদ</CardTitle>
                  <CreditCard className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      (transactions || [])
                        .filter(t => t.status === 'APPROVED')
                        .reduce((sum, t) => sum + t.amount, 0) - 
                      expenses.reduce((sum, exp) => sum + exp.amount, 0)
                    )}
                  </div>
                  <div className="flex items-center mt-4 text-xs text-muted-foreground">
                    {((transactions || [])
                        .filter(t => t.status === 'APPROVED')
                        .reduce((sum, t) => sum + t.amount, 0) - 
                      expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 ? 
                      <span className="text-green-600">বাকি আছে</span> : 
                      <span className="text-red-600">ঘাটতি আছে</span>
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">কার্যক্রম</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-muted-foreground">
                      <span className="text-blue-600 font-medium">
                        {activities.filter(a => a.status === 'UPCOMING').length}
                      </span> আসন্ন
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600 font-medium">
                        {activities.filter(a => a.status === 'ONGOING').length}
                      </span> চলমান
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-gray-600 font-medium">
                        {activities.filter(a => a.status === 'COMPLETED').length}
                      </span> সম্পন্ন
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    সাম্প্রতিক কার্যক্রম
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities
                      .sort((a, b) => new Date(b.time) - new Date(a.time))
                      .slice(0, 5)
                      .map(activity => (
                        <div key={activity.id} className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'UPCOMING' ? 'bg-blue-600' :
                            activity.status === 'ONGOING' ? 'bg-green-600' :
                            activity.status === 'COMPLETED' ? 'bg-gray-600' :
                            'bg-red-600'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(activity.time)} • {activity.location}
                            </p>
                          </div>
                          <Badge variant="outline" className={
                            activity.status === 'UPCOMING' ? 'border-blue-200 text-blue-800' :
                            activity.status === 'ONGOING' ? 'border-green-200 text-green-800' :
                            activity.status === 'COMPLETED' ? 'border-gray-200 text-gray-800' :
                            'border-red-200 text-red-800'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-purple-600" />
                    সাম্প্রতিক খরচ
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    {expenses
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map(expense => (
                        <div key={expense.id} className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            expense.category === 'FOOD' ? 'bg-green-100 text-green-600' :
                            expense.category === 'TRANSPORT' ? 'bg-blue-100 text-blue-600' :
                            expense.category === 'ACCOMMODATION' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {expense.category.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(expense.createdAt)} • {expense.category}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            {formatCurrency(expense.amount)}
                          </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Recent Registrations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  সাম্প্রতিক রেজিস্ট্রেশন
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrations
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map(reg => (
                      <div key={reg.id} className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          {reg.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{reg.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {reg.phone} • {reg.address}
                          </p>
                        </div>
                        <Badge variant="outline" className={
                          reg.status === 'APPROVED' ? 'border-green-200 text-green-800' :
                          reg.status === 'PENDING' ? 'border-yellow-200 text-yellow-800' :
                          'border-red-200 text-red-800'
                        }>
                          {reg.status === 'APPROVED' ? 'অনুমোদিত' :
                           reg.status === 'PENDING' ? 'অপেক্ষমান' :
                           'বাতিল'}
                        </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add these in your renderContent method after the current dashboard cards */}

            {/* 1. Add a new section for Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Per Person Metrics Card */}
              <Card className="bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">জনপ্রতি হিসাব</CardTitle>
                  <User className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">জনপ্রতি খরচ</p>
                      <p className="text-lg font-semibold text-indigo-600">
                        {formatCurrency(
                          registrations.filter(r => r.status === 'APPROVED').length > 0 
                            ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / 
                              registrations.filter(r => r.status === 'APPROVED').length
                            : 0
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">গড় আয়</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(
                          registrations.filter(r => r.status === 'APPROVED').length > 0
                            ? (transactions || [])
                                .filter(t => t.status === 'APPROVED')
                                .reduce((sum, t) => sum + t.amount, 0) / 
                                registrations.filter(r => r.status === 'APPROVED').length
                            : 0
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Analysis */}
              <Card className="bg-gradient-to-br from-cyan-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">পেমেন্ট পদ্ধতি</CardTitle>
                  <CreditCard className="h-4 w-4 text-cyan-600" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      (transactions || [])
                        .filter(t => t.status === 'APPROVED')
                        .reduce((acc, t) => {
                          acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
                          return acc;
                        }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([method, amount]) => (
                        <div key={method} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              method === 'CASH' ? 'bg-green-500' :
                              method === 'BKASH' ? 'bg-pink-500' :
                              method === 'NAGAD' ? 'bg-orange-500' :
                              'bg-blue-500'
                            } mr-2`}></div>
                            <span className="text-sm">{method}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Registration Statistics */}
              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">রেজিস্ট্রেশন স্ট্যাটিস্টিকস</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">অনুমোদনের হার</p>
                      <p className="text-lg font-semibold text-purple-600">
                        {registrations.length > 0 
                          ? Math.round((registrations.filter(r => r.status === 'APPROVED').length / registrations.length) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">গত ৭ দিনে রেজিস্ট্রেশন</p>
                      <p className="text-lg font-semibold text-purple-600">
                        {registrations.filter(r => 
                          new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-6">
            {/* Existing expense form card */}
            <Card>
              <CardHeader>
                <CardTitle>খরচ যোগ করুন</CardTitle>
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

            {/* Expenses List */}
            <Card>
              <CardHeader>
                <CardTitle>খরচের তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingExpenses ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="ml-2">লোড হচ্ছে...</p>
                    </div>
                  ) : (
                    expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-lg">{expense.description}</p>
                            <p className="text-sm font-medium">পরিমাণ: {formatCurrency(expense.amount)}</p>
                            <p className="text-sm">ক্যাটাগরি: {expense.category}</p>
                            {expense.note && (
                              <p className="text-sm text-gray-600">নোট: {expense.note}</p>
                            )}
                            <p className="text-sm text-gray-500">{formatDateTime(expense.createdAt)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              onClick={() => {
                                setEditingExpense(expense);
                                setNewExpenseData({
                                  description: expense.description,
                                  amount: expense.amount.toString(),
                                  category: expense.category,
                                  note: expense.note || '',
                                  createdAt: new Date(expense.createdAt).toISOString().slice(0, 16)
                                });
                                setIsExpenseDialogOpen(true);
                              }}
                              disabled={deletingExpenseId === expense.id}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              এডিট
                            </Button>
                            <AlertDialog
                              open={isExpenseDeleteDialogOpen && expenseToDelete === expense.id}
                              onOpenChange={(open) => {
                                if (!open) {
                                  setIsExpenseDeleteDialogOpen(false);
                                  setExpenseToDelete(null);
                                }
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-100 text-red-800 hover:bg-red-200"
                                  onClick={() => {
                                    setExpenseToDelete(expense.id);
                                    setIsExpenseDeleteDialogOpen(true);
                                  }}
                                  disabled={deletingExpenseId === expense.id}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  মুছুন
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    এই খরচটি মুছে ফেলা হবে। এই ক্রিয়াটি অপরিবর্তনীয়।
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel disabled={deletingExpenseId === expense.id}>
                                    বাতিল
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleExpenseDelete(expense.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deletingExpenseId === expense.id}
                                  >
                                    {deletingExpenseId === expense.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        মুছে ফেলা হচ্ছে...
                                      </>
                                    ) : (
                                      'মুছে ফেলুন'
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Expense Edit Dialog */}
                  <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>খরচ সম্পাদনা</DialogTitle>
                        <DialogDescription>
                          খরচের তথ্য আপডেট করুন
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="description">বিবরণ</Label>
                            <Input
                              id="description"
                              value={newExpenseData.description}
                              onChange={(e) => setNewExpenseData({
                                ...newExpenseData,
                                description: e.target.value
                              })}
                              placeholder="খরচের বিবরণ"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">পরিমাণ</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={newExpenseData.amount}
                              onChange={(e) => setNewExpenseData({
                                ...newExpenseData,
                                amount: e.target.value
                              })}
                              placeholder="টাকার পরিমাণ"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">ক্যাটাগরি</Label>
                            <Select
                              value={newExpenseData.category}
                              onValueChange={(value) => setNewExpenseData({
                                ...newExpenseData,
                                category: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="ক্যাটাগরি বাছাই করুন" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FOOD">খাবার</SelectItem>
                                <SelectItem value="TRANSPORT">পরিবহন</SelectItem>
                                <SelectItem value="ACCOMMODATION">আবাসন</SelectItem>
                                <SelectItem value="ACTIVITIES">কার্যক্রম</SelectItem>
                                <SelectItem value="OTHERS">অন্যান্য</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="note">নোট</Label>
                            <Input
                              id="note"
                              value={newExpenseData.note}
                              onChange={(e) => setNewExpenseData({
                                ...newExpenseData,
                                note: e.target.value
                              })}
                              placeholder="অতিরিক্ত নোট"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="createdAt">তারিখ ও সময়</Label>
                            <Input
                              id="createdAt"
                              type="datetime-local"
                              value={newExpenseData.createdAt}
                              onChange={(e) => setNewExpenseData({
                                ...newExpenseData,
                                createdAt: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsExpenseDialogOpen(false);
                            setEditingExpense(null);
                            setNewExpenseData({
                              description: '',
                              amount: '',
                              category: '',
                              note: '',
                              createdAt: ''
                            });
                          }}
                          disabled={isUpdatingExpense === editingExpense?.id}
                        >
                          বাতিল
                        </Button>
                        <Button
                          onClick={() => handleExpenseUpdate(editingExpense.id, newExpenseData)}
                          disabled={isUpdatingExpense === editingExpense?.id}
                          isLoading={isUpdatingExpense === editingExpense?.id}
                        >
                          আপডেট করুন
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                {isLoadingRegistrations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="ml-2">লোড হচ্ছে...</p>
                  </div>
                ) : (
                  registrations.filter(reg => reg.status === 'APPROVED').map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
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
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            {reg.ticketLink ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  onClick={() => {
                                    setEditingTicket(reg);
                                    setNewTicketLink(reg.ticketLink);
                                    setIsTicketDialogOpen(true);
                                  }}
                                  disabled={isUpdatingTicket === reg.id}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  এডিট
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-100 text-red-800 hover:bg-red-200"
                                  onClick={() => handleTicketDelete(reg.id)}
                                  disabled={isUpdatingTicket === reg.id}
                                >
                                  {isUpdatingTicket === reg.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <Trash2 className="h-4 w-4 mr-1" />
                                  )}
                                  মুছুন
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-green-100 text-green-800 hover:bg-green-200"
                                onClick={() => {
                                  setEditingTicket(reg);
                                  setNewTicketLink('');
                                  setIsTicketDialogOpen(true);
                                }}
                                disabled={isUpdatingTicket === reg.id}
                              >
                                <Link className="h-4 w-4 mr-1" />
                                টিকেট যোগ করুন
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Ticket Edit Dialog */}
                <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTicket?.ticketLink ? 'টিকেট আপডেট করুন' : 'টিকেট যোগ করুন'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingTicket?.name} এর জন্য টিকেট লিংক {editingTicket?.ticketLink ? 'আপডেট' : 'যোগ'} করুন
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ticketLink">টিকেট লিংক</Label>
                          <Input
                            id="ticketLink"
                            value={newTicketLink}
                            onChange={(e) => setNewTicketLink(e.target.value)}
                            placeholder="টিকেটের লিংক দিন"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsTicketDialogOpen(false);
                          setEditingTicket(null);
                          setNewTicketLink('');
                        }}
                        disabled={isUpdatingTicket === editingTicket?.id}
                      >
                        বাতিল
                      </Button>
                      <Button
                        onClick={() => handleTicketAssign(editingTicket.id, newTicketLink)}
                        disabled={!newTicketLink || isUpdatingTicket === editingTicket?.id}
                        isLoading={isUpdatingTicket === editingTicket?.id}
                      >
                        {editingTicket?.ticketLink ? 'আপডেট করুন' : 'যোগ করুন'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {registrations.filter(reg => reg.status === 'APPROVED').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    কোন অনুমোদিত রেজিস্ট্রেশন নেই
                  </div>
                )}
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
                    <Editor
                      id="description"
                      value={activityDescription}
                      onTextChange={(e) => setActivityDescription(e.htmlValue)}
                      style={{ height: '200px' }}
                      placeholder="কার্যক্রমের বিবরণ লিখুন..."
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

      case 'userinfo':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ব্যবহারকারীর তথ্য খুঁজুন</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userSelect">ব্যবহারকারী নির্বাচন করুন</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Select
                          value={selectedUserInfo}
                          onValueChange={setSelectedUserInfo}
                          disabled={isLoadingUsers}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={
                              isLoadingUsers 
                                ? "ব্যবহারকারী লোড হচ্ছে..." 
                                : "ব্যবহারকারী নির্বাচন করুন"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {allUsers
                              .filter(user => user.status === 'APPROVED') // This is optional since we're already filtering in the API
                              .map((user) => (
                              <SelectItem key={user.id} value={`${user.name} - ${user.phone}`}>
                                {user.name} - {user.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleUserSearch}
                        isLoading={searchingUser}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        খুঁজুন
                      </Button>
                    </div>
                  </div>
                  
                  {userSearchError && (
                    <p className="text-red-600 text-center font-medium">{userSearchError}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {userInfo && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
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
                          <p className="font-medium text-gray-700">জনপ্রতি খরচ</p>
                          <p className="text-xl font-semibold text-purple-600">
                            {formatCurrency(userInfo.perPersonExpense)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">জমা দেওয়া</p>
                          <p className="text-xl font-semibold text-green-600">
                            {formatCurrency(userInfo.paidAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            {userInfo.balance >= 0 ? 'টাকা পাওনা' : 'টাকা দেনা'}
                          </p>
                          <p className={`text-xl font-semibold ${userInfo.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(userInfo.balance))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                        টাকা জমা দিন
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>টাকার পরিমাণ</Label>
                        <Input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="টাকার পরিমাণ দিন"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>পেমেন্ট মাধ্যম</Label>
                        <Select
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                        >
                          <SelectTrigger>
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
                        <Label>নোট (ঐচ্ছিক)</Label>
                        <Input
                          value={paymentNote}
                          onChange={(e) => setPaymentNote(e.target.value)}
                          placeholder="পেমেন্ট সম্পর্কে নোট লিখুন"
                        />
                      </div>
                      <Button
                        onClick={handlePaymentSubmit}
                        className="w-full"
                        isLoading={isSubmittingPayment}
                      >
                        টাকা জমা দিন
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Transaction History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <History className="h-5 w-5 mr-2 text-purple-600" />
                        লেনদেনের ইতিহাস
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {userTransactions.map((transaction) => (
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
                        {userTransactions.length === 0 && (
                          <p className="text-center text-gray-500 py-4">কোন লেনদেন নেই</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderRegistrationList = () => (
    <div className="space-y-4">
      {isLoadingRegistrations ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="ml-2">লোড হচ্ছে...</p>
        </div>
      ) : (
        [...registrations]
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
                    {reg.status === 'PENDING' && (
                      <AlertDialog open={isApproveDialogOpen && registrationToApprove === reg.id}>
                        <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                            onClick={() => {
                              setRegistrationToApprove(reg.id);
                              setIsApproveDialogOpen(true);
                            }}
                        disabled={
                          isApprovingRegistration === reg.id || 
                          isUpdatingRegistration === reg.id || 
                          isDeletingRegistration === reg.id
                        }
                      >
                        {isApprovingRegistration === reg.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-800"></div>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            অনুমোদন
                          </>
                        )}
                      </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>রেজিস্ট্রেশন অনুমোদন</AlertDialogTitle>
                            <AlertDialogDescription>
                              আপনি কি নিশ্চিত যে আপনি এই রেজিস্ট্রেশন অনুমোদন করতে চান?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => {
                                setIsApproveDialogOpen(false);
                                setRegistrationToApprove(null);
                              }}
                              disabled={isApprovingRegistration === reg.id}
                            >
                              না
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRegistrationApprove(reg.id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={isApprovingRegistration === reg.id}
                            >
                              {isApprovingRegistration === reg.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  অনুমোদন হচ্ছে...
                                </>
                              ) : (
                                'হ্যাঁ, অনুমোদন করুন'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      onClick={() => {
                        setEditingRegistration(reg);
                        setNewRegistrationData({
                          name: reg.name,
                          phone: reg.phone,
                          address: reg.address,
                          status: reg.status
                        });
                        setIsRegistrationDialogOpen(true);
                      }}
                      disabled={
                        isApprovingRegistration === reg.id || 
                        isUpdatingRegistration === reg.id || 
                        isDeletingRegistration === reg.id
                      }
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      এডিট
                    </Button>

                    <AlertDialog 
                      open={isDeleteRegistrationDialogOpen && registrationToDelete === reg.id}
                    >
                      <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                          onClick={() => {
                            setRegistrationToDelete(reg.id);
                            setIsDeleteRegistrationDialogOpen(true);
                          }}
                      disabled={
                        isApprovingRegistration === reg.id || 
                        isUpdatingRegistration === reg.id || 
                        isDeletingRegistration === reg.id
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      মুছুন
                    </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>রেজিস্ট্রেশন মুছে ফেলা</AlertDialogTitle>
                          <AlertDialogDescription>
                            আপনি কি নিশ্চিত যে আপনি এই রেজিস্ট্রেশন মুছে ফেলতে চান? এই কাজটি অপরিবর্তনীয়।
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              setIsDeleteRegistrationDialogOpen(false);
                              setRegistrationToDelete(null);
                            }}
                            disabled={isDeletingRegistration === reg.id}
                          >
                            না
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRegistrationDelete(reg.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeletingRegistration === reg.id}
                          >
                            {isDeletingRegistration === reg.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                মুছে ফেলা হচ্ছে...
                              </>
                            ) : (
                              'হ্যাঁ, মুছে ফেলুন'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );

  const renderTransactionList = () => (
    <div className="space-y-4">
      {isLoadingTransactions ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="ml-2">লোড হচ্ছে...</p>
        </div>
      ) : (
        pendingTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`p-4 border rounded-lg space-y-3 ${
              transaction.status === 'PENDING'
                ? 'bg-yellow-50'
                : transaction.status === 'APPROVED'
                ? 'bg-green-50'
                : 'bg-red-50'
            }`}
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
                <p className="text-sm text-gray-600">
                  {formatDateTime(transaction.paymentDate)}
                </p>
                {transaction.note && (
                  <p className="text-sm text-gray-600">
                    নোট: {transaction.note}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Badge className={`${
                  transaction.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : transaction.status === 'APPROVED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.status === 'PENDING' && 'অপেক্ষমান'}
                  {transaction.status === 'APPROVED' && 'অনুমোদিত'}
                  {transaction.status === 'REJECTED' && 'বাতিল'}
                </Badge>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setIsEditDialogOpen(true);
                    }}
                    disabled={deletingTransactionId === transaction.id}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    এডিট
                  </Button>
                  <AlertDialog open={isDeleteDialogOpen && transactionToDelete === transaction.id} onOpenChange={(open) => {
                    if (!open) {
                      setIsDeleteDialogOpen(false);
                      setTransactionToDelete(null);
                    }
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                        onClick={() => {
                          setTransactionToDelete(transaction.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={deletingTransactionId === transaction.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        মুছুন
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                        <AlertDialogDescription>
                          এই লেনদেনটি মুছে ফেলা হবে। এই ক্রিয়াটি অপরিবর্তনীয়।
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingTransactionId === transaction.id}>
                          বাতিল
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deletingTransactionId === transaction.id}
                        >
                          {deletingTransactionId === transaction.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              মুছে ফেলা হচ্ছে...
                            </>
                          ) : (
                            'মুছে ফেলুন'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderActivityList = () => {
    if (activities.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">কোন কার্যক্রম নেই</p>
        </div>
      );
    }

    return activities.map((activity) => (
      <div key={activity.id} className="border rounded-lg p-4 flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <p className="font-medium text-lg">{activity.title}</p>
          {/* Replace the simple text rendering with proper HTML rendering */}
          <div 
            className="text-sm text-gray-500 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: activity.description }}
          />
          <p className="text-sm">সময়: {formatDateTime(activity.time)}</p>
          <p className="text-sm">স্থান: {activity.location}</p>
        </div>
        <div className="space-y-2">
          {/* Rest of the code remains the same */}
          <Badge className={`${getStatusColor(activity.status)}`}>
            {getStatusText(activity.status)}
          </Badge>
          {/* Rest of your buttons and dialogs */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              onClick={() => handleEditClick(activity)}
              disabled={isUpdatingActivity === activity.id}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              সম্পাদনা
            </Button>
            <AlertDialog 
              open={isActivityDeleteDialogOpen && activityToDelete === activity.id} 
              onOpenChange={(open) => {
                if (!open) {
                  setIsActivityDeleteDialogOpen(false);
                  setActivityToDelete(null);
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                  onClick={() => {
                    setActivityToDelete(activity.id);
                    setIsActivityDeleteDialogOpen(true);
                  }}
                  disabled={isUpdatingActivity === activity.id}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  মুছুন
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                  <AlertDialogDescription>
                    এই কার্যক্রমটি মুছে ফেলা হবে। এই ক্রিয়াটি অপরিবর্তনীয়।
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isUpdatingActivity === activity.id}>
                    বাতিল
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleActivityDelete(activity.id)}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isUpdatingActivity === activity.id}
                  >
                    {isUpdatingActivity === activity.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        মুছে ফেলা হচ্ছে...
                      </>
                    ) : (
                      'মুছে ফেলুন'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="space-x-2">
            {activity.status === 'UPCOMING' && (
              <Button
                size="sm"
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200"
                onClick={() => handleActivityStatusUpdate(activity.id, 'ONGOING')}
                disabled={isUpdatingActivity === activity.id}
              >
                {isUpdatingActivity === activity.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-800" />
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                শুরু করুন
                  </>
                )}
              </Button>
            )}
            
            {(activity.status === 'UPCOMING' || activity.status === 'ONGOING') && (
              <Button
                size="sm"
                variant="outline"
                className="bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => handleActivityStatusUpdate(activity.id, 'CANCELLED')}
                disabled={isUpdatingActivity === activity.id}
              >
                {isUpdatingActivity === activity.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-800" />
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    বাতিল করুন
                  </>
                )}
              </Button>
            )}
            
            {activity.status === 'ONGOING' && (
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => handleActivityStatusUpdate(activity.id, 'COMPLETED')}
                disabled={isUpdatingActivity === activity.id}
              >
                {isUpdatingActivity === activity.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800" />
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    সম্পন্ন করুন
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  // Update the handleActivityUpdate function
  const handleActivityUpdate = async (id, updatedData) => {
    setIsUpdatingActivity(id);
    
    try {
      // Ensure we have a valid date object before converting to ISO string
      let formattedTime;
      try {
        // Parse the date string and adjust for timezone
        const dateObj = new Date(updatedData.time);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Invalid date');
        }
        formattedTime = dateObj.toISOString();
      } catch (error) {
        console.error('Date parsing error:', error);
        alert('অবৈধ তারিখ ফরম্যাট');
        return;
      }
      
      const response = await fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedData,
          time: formattedTime
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update activity');
      }
      
      const updatedActivity = await response.json();
      
      // Update the activity in state
      setActivities(activities.map(activity => 
        activity.id === id ? updatedActivity : activity
      ));
      
      // Close the dialog
      setIsActivityDialogOpen(false);
      setEditingActivity(null);
      
      // Replace alert with success dialog
      setSuccessMessage('কার্যক্রম সফলভাবে আপডেট করা হয়েছে');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('কার্যক্রম আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsUpdatingActivity(null);
    }
  };

  // Add this function to handle activity deletion
  const handleActivityDelete = async (activityId) => {
    setIsUpdatingActivity(activityId);
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchActivities();
        // Close the dialog after successful deletion
        setIsActivityDeleteDialogOpen(false);
        setActivityToDelete(null);
      } else {
        alert('কার্যক্রম মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('কার্যক্রম মুছে ফেলতে সমস্যা হয়েছে');
    } finally {
      setIsUpdatingActivity(null);
    }
  };

  // Add these functions to handle expense updates and deletion
  const handleExpenseUpdate = async (expenseId, updatedData) => {
    setIsUpdatingExpense(expenseId);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Close the dialog first
        setIsExpenseDialogOpen(false);
        setEditingExpense(null);
        // Then refresh the data
        await fetchExpenses();
      } else {
        alert('খরচ আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('খরচ আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsUpdatingExpense(null);
    }
  };

  const handleExpenseDelete = async (expenseId) => {
    setDeletingExpenseId(expenseId);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExpenses();
        // Close the dialog after successful deletion
        setIsExpenseDeleteDialogOpen(false);
        setExpenseToDelete(null);
      } else {
        alert('খরচ মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('খরচ মুছে ফেলতে সমস্যা হয়েছে');
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // Add these functions to handle registration updates and deletion
  const handleRegistrationUpdate = async (registrationId, updatedData) => {
    setIsUpdatingRegistration(registrationId);
    try {
      const response = await fetch(`/api/tour-registration/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistrationDialogOpen(false);
        setEditingRegistration(null);
        await fetchRegistrations();
      } else {
        // Show the specific error message from the server
        alert(data.error || 'রেজিস্ট্রেশন আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('রেজিস্ট্রেশন আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsUpdatingRegistration(null);
    }
  };

  const handleRegistrationDelete = async (registrationId) => {
    setIsDeletingRegistration(registrationId);
    try {
      const response = await fetch(`/api/tour-registration/${registrationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRegistrations();
      } else {
        alert('রেজিস্ট্রেশন মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('রেজিস্ট্রেশন মুছে ফেলতে সমস্যা হয়েছে');
    } finally {
      setIsDeletingRegistration(null);
      setIsDeleteRegistrationDialogOpen(false);
      setRegistrationToDelete(null);
    }
  };

  // Add this function to handle registration approval
  const handleRegistrationApprove = async (registrationId) => {
    setIsApprovingRegistration(registrationId);
    try {
      const response = await fetch(`/api/tour-registration/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchRegistrations();
      } else {
        alert(data.error || 'রেজিস্ট্রেশন অনুমোদন করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('রেজিস্ট্রেশন অনুমোদন করতে সমস্যা হয়েছে');
    } finally {
      setIsApprovingRegistration(null);
      setIsApproveDialogOpen(false);
      setRegistrationToApprove(null);
    }
  };

  // Add this function near your other handler functions
  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    
    // Format the time properly for the datetime-local input
    const formattedTime = new Date(activity.time);
    formattedTime.setMinutes(formattedTime.getMinutes() - formattedTime.getTimezoneOffset());
    const timeString = formattedTime.toISOString().slice(0, 16);
    
    setNewActivityData({
      title: activity.title,
      description: activity.description, // PrimeReact Editor will handle HTML content
      time: timeString,
      location: activity.location
    });
    
    setIsActivityDialogOpen(true);
  };

  // Add this new Dialog component near your other dialogs
  const SuccessDialog = ({ message, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            সফল হয়েছে
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-gray-600">{message}</p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          >
            ঠিক আছে
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Modify your tab change handler
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Close the mobile nav when a tab is selected
    setIsMobileNavOpen(false);
  };

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
      {/* Mobile Header - modify the Sheet component */}
      <div className="lg:hidden bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">অ্যাডমিন প্যানেল</h1>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSheetOpen(false); // Close the sheet when a menu item is clicked
                    }}
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
                  onClick={() => {
                    handleLogout();
                    setIsSheetOpen(false); // Close the sheet when logout is clicked
                  }}
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

      {/* Registration Edit Dialog */}
      <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>রেজিস্ট্রেশন সম্পাদনা</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">নাম</Label>
                <Input
                  id="name"
                  value={newRegistrationData.name}
                  onChange={(e) => setNewRegistrationData({
                    ...newRegistrationData,
                    name: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">ফোন</Label>
                <Input
                  id="phone"
                  value={newRegistrationData.phone}
                  onChange={(e) => setNewRegistrationData({
                    ...newRegistrationData,
                    phone: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Input
                  id="address"
                  value={newRegistrationData.address}
                  onChange={(e) => setNewRegistrationData({
                    ...newRegistrationData,
                    address: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">স্টেটাস</Label>
                <Select
                  value={newRegistrationData.status}
                  onValueChange={(value) => setNewRegistrationData({
                    ...newRegistrationData,
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="স্টেটাস বাছাই করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">অপেক্ষমান</SelectItem>
                    <SelectItem value="APPROVED">অনুমোদিত</SelectItem>
                    <SelectItem value="REJECTED">বাতিল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRegistrationDialogOpen(false);
                setEditingRegistration(null);
              }}
              disabled={isUpdatingRegistration === editingRegistration?.id}
            >
              বাতিল
            </Button>
            <Button
              onClick={() => handleRegistrationUpdate(editingRegistration.id, newRegistrationData)}
              disabled={isUpdatingRegistration === editingRegistration?.id}
              isLoading={isUpdatingRegistration === editingRegistration?.id}
            >
              আপডেট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Edit Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>কার্যক্রম সম্পাদনা</DialogTitle>
            <DialogDescription>
              কার্যক্রমের তথ্য আপডেট করুন
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">শিরোনাম</Label>
                <Input
                  id="title"
                  value={newActivityData.title}
                  onChange={(e) => setNewActivityData({
                    ...newActivityData,
                    title: e.target.value
                  })}
                  placeholder="কার্যক্রমের শিরোনাম"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">বিবরণ</Label>
                <Editor
                  id="description"
                  value={newActivityData.description}
                  onTextChange={(e) => setNewActivityData({
                    ...newActivityData,
                    description: e.htmlValue
                  })}
                  style={{ height: '200px' }}
                  placeholder="কার্যক্রমের বিবরণ লিখুন..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">সময়</Label>
                <Input
                  id="time"
                  type="datetime-local"
                  value={newActivityData.time}
                  onChange={(e) => setNewActivityData({
                    ...newActivityData,
                    time: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">স্থান</Label>
                <Input
                  id="location"
                  value={newActivityData.location}
                  onChange={(e) => setNewActivityData({
                    ...newActivityData,
                    location: e.target.value
                  })}
                  placeholder="কার্যক্রমের স্থান"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsActivityDialogOpen(false);
                setEditingActivity(null);
              }}
              disabled={isUpdatingActivity === editingActivity?.id}
            >
              বাতিল
            </Button>
            <Button
              onClick={() => handleActivityUpdate(editingActivity.id, newActivityData)}
              disabled={isUpdatingActivity === editingActivity?.id}
            >
              {isUpdatingActivity === editingActivity?.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  আপডেট হচ্ছে...
                </>
              ) : (
                'আপডেট করুন'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add this near the end, before the closing div */}
      <SuccessDialog 
        message={successMessage}
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  );
} 