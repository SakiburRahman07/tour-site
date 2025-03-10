'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: new Date(),
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'নাম আবশ্যক';
    if (!formData.phone.trim()) errors.phone = 'ফোন নাম্বার আবশ্যক';
    if (!formData.address.trim()) errors.address = 'ঠিকানা আবশ্যক';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/tour-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          phone: '',
          address: '',
          date: new Date(),
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const data = await response.json();
        if (response.status === 400 && data.error === 'PHONE_EXISTS') {
          setError('এই ফোন নাম্বারটি ইতিমধ্যে ব্যবহার করা হয়েছে।');
        } else {
          setError('রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div 
            className="max-w-xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-center mb-8">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ট্যুর রেজিস্ট্রেশন
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                আপনার তথ্য দিয়ে রেজিস্ট্রেশন করুন
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-xl border-t-4 border-t-purple-500 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div 
                      className="space-y-2"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="name" className="text-lg font-medium">নাম</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        placeholder="আপনার নাম লিখুন"
                        className={cn(
                          "border-2 h-12 text-lg transition-all duration-200",
                          fieldErrors.name ? "border-red-500 focus:border-red-500" : "border-purple-200 focus:border-purple-500"
                        )}
                      />
                      {fieldErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                      )}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="phone" className="text-lg font-medium">ফোন নাম্বার</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setFieldErrors({ ...fieldErrors, phone: '' });
                        }}
                        placeholder="আপনার ফোন নাম্বার লিখুন"
                        className={cn(
                          "border-2 h-12 text-lg transition-all duration-200",
                          fieldErrors.phone ? "border-red-500 focus:border-red-500" : "border-purple-200 focus:border-purple-500"
                        )}
                      />
                      {fieldErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
                      )}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.7 }}
                    >
                      <Label htmlFor="address" className="text-lg font-medium">ঠিকানা</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          setFieldErrors({ ...fieldErrors, address: '' });
                        }}
                        placeholder="আপনার ঠিকানা লিখুন"
                        className={cn(
                          "border-2 h-12 text-lg transition-all duration-200",
                          fieldErrors.address ? "border-red-500 focus:border-red-500" : "border-purple-200 focus:border-purple-500"
                        )}
                      />
                      {fieldErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
                      )}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.8 }}
                    >
                      <Label className="text-lg font-medium">তারিখ</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 text-lg justify-start font-normal border-2 border-purple-200 hover:border-purple-500",
                              !formData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            {formData.date ? format(formData.date, "PPP") : "তারিখ নির্বাচন করুন"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => setFormData({ ...formData, date })}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </motion.div>

                    {error && (
                      <motion.div 
                        className="p-4 bg-red-100 text-red-700 rounded-md text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error}
                      </motion.div>
                    )}

                    <motion.div
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.9 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            প্রক্রিয়াকরণ হচ্ছে...
                          </>
                        ) : (
                          'রেজিস্ট্রেশন করুন'
                        )}
                      </Button>
                    </motion.div>

                    {showSuccess && (
                      <motion.div 
                        className="p-4 bg-green-100 text-green-700 rounded-md text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        আপনার রেজিস্ট্রেশন সফল হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।
                      </motion.div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 