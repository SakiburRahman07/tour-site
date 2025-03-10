'use client';

import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Clock, User, DollarSign, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "বিখ্যাত স্পট সমূহ",
      description: "কক্সবাজার সমুদ্র সৈকত, বান্দরবান পাহাড়, নীলগিরি, নীলাচল এবং আরও অনেক কিছু"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "সুবিধাজনক সময়",
      description: "আপনার পছন্দের তারিখে ট্যুর প্ল্যান করুন"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "গ্রুপ ট্যুর",
      description: "১০-১৫ জনের গ্রুপের জন্য আকর্ষণীয় প্যাকেজ"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "৩ দিনের ট্যুর",
      description: "পরিপূর্ণ ৩ দিনের ট্যুর প্যাকেজ সকল খরচ সহ"
    }
  ];

  const cards = [
    {
      href: "/user-info",
      icon: <User className="w-6 h-6" />,
      title: "ব্যক্তিগত তথ্য",
      description: "আপনার ব্যক্তিগত তথ্য দেখুন এবং আপডেট করুন",
      color: "purple",
      delay: 0.1
    },
    {
      href: "/upcoming",
      icon: <Calendar className="w-6 h-6" />,
      title: "আমাদের পরবর্তী কার্যক্রম",
      description: "আসন্ন ট্যুর এবং ইভেন্টের তথ্য জানুন",
      color: "green",
      delay: 0.2
    },
    {
      href: "/expenses",
      icon: <DollarSign className="w-6 h-6" />,
      title: "খরচের হিসাব",
      description: "সকল খরচের বিস্তারিত হিসাব দেখুন",
      color: "blue",
      delay: 0.3
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            আমাদের বৈশিষ্ট্য সমূহ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              আপনার সুবিধার্থে
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: card.delay }}
                >
                  <Link href={card.href}>
                    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-${card.color}-100 hover:border-${card.color}-200`}>
                      <CardHeader className={`bg-${card.color}-50 transition-colors duration-300 group-hover:bg-${card.color}-100`}>
                        <div className={`p-3 bg-${card.color}-100 rounded-full text-${card.color}-600 w-fit group-hover:scale-110 transition-transform duration-300`}>
                          {card.icon}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors duration-300">
                          {card.title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mb-4">
                          {card.description}
                        </p>
                        <div className={`flex items-center text-${card.color}-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                          <span>আরও দেখুন</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 