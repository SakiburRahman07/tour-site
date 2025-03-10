'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Schedule() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ONGOING':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
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
      default:
        return 'বাতিল';
    }
  };

  const getTimeRemaining = (activityTime) => {
    const now = new Date();
    const time = new Date(activityTime);
    const diff = time - now;

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let remaining = '';
    if (days > 0) remaining += `${days} দিন `;
    if (hours > 0) remaining += `${hours} ঘন্টা `;
    if (minutes > 0) remaining += `${minutes} মিনিট`;

    return remaining.trim() || 'কয়েক মুহূর্ত';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-purple-600 mx-auto" />
          <p className="text-sm sm:text-base text-purple-600 animate-pulse">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-base sm:text-lg text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  const upcomingActivities = activities.filter(
    activity => activity.status === 'UPCOMING' || activity.status === 'ONGOING'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            আমাদের পরবর্তী কার্যক্রম
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            আমাদের আসন্ন ও চলমান কার্যক্রমসমূহ দেখুন
          </p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {upcomingActivities.map((activity) => {
            const timeRemaining = getTimeRemaining(activity.time);
            
            return (
              <motion.div key={activity.id} variants={item}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4 hover:border-l-8 border-l-purple-500">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3 sm:gap-4">
                      <div className="space-y-2 sm:space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">{activity.title}</h2>
                          <Badge className={`${getStatusColor(activity.status)} border text-xs sm:text-sm`}>
                            {getStatusText(activity.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{activity.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-purple-500" />
                            <span className="text-xs sm:text-sm">{formatDate(activity.time)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-purple-500" />
                            <span className="text-xs sm:text-sm">{activity.location}</span>
                          </div>
                        </div>

                        {activity.status === 'UPCOMING' && timeRemaining && (
                          <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600 bg-purple-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full w-fit">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium">বাকি আছে: {timeRemaining}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          
          {upcomingActivities.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300"
            >
              <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
              <p className="text-base sm:text-lg text-gray-500">এই মুহূর্তে কোন আসন্ন কার্যক্রম নেই</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">নতুন কার্যক্রম যোগ হলে এখানে দেখা যাবে</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 