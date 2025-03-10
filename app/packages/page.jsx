'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, Clock, Train, Hotel, Bus, Utensils, Sun, Moon, 
  Camera, Waves, Coffee, ChevronUp, Share2, Facebook, 
  Instagram, Twitter, Mail 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function TourDetails() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const days = [
    {
      day: "১ম দিন",
      events: [
        {
          title: "ঢাকা থেকে কক্সবাজার যাত্রা",
          time: "রাত ১০:০০",
          cost: "৭১৫৳",
          icon: <Train className="h-6 w-6 text-purple-600" />,
          description: [
            "ঢাকা থেকে কক্সবাজারের ননস্টপ ট্রেনে যাত্রা",
            "ট্রেন স্টেশনে সময়মতো পৌঁছানো",
            "ট্রেনে রাতের খাবার নেওয়া (প্রয়োজনে বাড়ি থেকে নিয়ে যেতে পারেন)",
            "রাতের যাত্রা, বিশ্রাম নেওয়া ট্রেনে"
          ],
          note: "ট্রেনে খাবার নিয়ে যাওয়া ভালো"
        }
      ]
    },
    {
      day: "২য় দিন",
      events: [
        {
          title: "কক্সবাজার আগমন",
          time: "সকাল ৬:০০",
          cost: "১৫০৳",
          icon: <MapPin className="h-6 w-6 text-purple-600" />,
          description: [
            "কক্সবাজার রেলস্টেশনে পৌঁছানো",
            "স্টেশন থেকে হোটেলে যাওয়া (রিকশা/অটোরিকশা ৫০-১০০৳ জনপ্রতি)",
            "ফ্রেশ হয়ে সকালের নাস্তা (পরোটা, ভাজি, ডিম, চা — আনুমানিক ১০০৳)"
          ],
          note: "হোটেল আগে থেকে বুক করা ভালো"
        },
        {
          title: "সমুদ্র সৈকত ভ্রমণ",
          time: "সকাল ৮:৩০ - দুপুর ১২:০০",
          cost: "৩০০৳",
          icon: <Waves className="h-6 w-6 text-purple-600" />,
          description: [
            "লাবনী পয়েন্ট থেকে পাটুয়ারটেক বিচ ঘোরাঘুরি",
            "বিচে ঘোরাঘুরি, ছবি তোলা, স্থানীয় দোকান ঘোরাঘুরি",
            "চাইলে বিচ বাইক ভাড়া নিয়ে ঘোরার সুযোগ (৫০০-৭০০৳/ঘণ্টা)",
            "সাগরে নামার প্ল্যান থাকলে বাড়তি কাপড় নেওয়া জরুরি"
          ],
          note: "সকাল বেলায় বিচে কম ভিড় থাকে"
        },
        {
          title: "দুপুরের খাবার",
          time: "দুপুর ১২:৩০ - ২:০০",
          cost: "৩৫০৳",
          icon: <Utensils className="h-6 w-6 text-purple-600" />,
          description: [
            "স্থানীয় রেস্টুরেন্টে ফ্রেশ সীফুড ট্রাই করতে পারেন",
            "ভাত, মাছ, গরুর মাংস, ভর্তা বা যে কোনো পছন্দমতো খাবার"
          ],
          note: "ফ্রেশ সীফুড খাওয়ার সেরা সময়"
        },
        {
          title: "সন্ধ্যার সৈকত",
          time: "বিকাল ৩:০০ - ৬:০০",
          cost: "৫০০-১৫০০৳",
          icon: <Sun className="h-6 w-6 text-purple-600" />,
          description: [
            "বিচে সানসেট দেখা",
            "বিচের বিভিন্ন রাইড (জেট স্কি, প্যারাসেইলিং) করতে পারেন",
            "নারকেল/ডাব পান করা (৫০-১০০৳)"
          ],
          note: "সানসেট দেখার সেরা স্পট"
        },
        {
          title: "রাতের খাবার ও বিশ্রাম",
          time: "রাত ৮:০০ - ১০:৩০",
          cost: "৪০০৳",
          icon: <Hotel className="h-6 w-6 text-purple-600" />,
          description: [
            "বাহারি সীফুড বা কক্সবাজারের জনপ্রিয় খাবার (২৫০-৩০০৳)",
            "বুফে ডিনার অপশন (৬০০-১০০০৳)",
            "হোটেলে চেক-ইন (জনপ্রতি ৪০০৳ শেয়ারিং)",
            "সাধারণ সময়ে রুম ভাড়া ২০০০৳, রোজার সময় ১০০০৳"
          ],
          note: "হোটেল বুকিং আগে থেকে করা ভালো"
        }
      ]
    },
    {
      day: "৩য় দিন",
      events: [
        {
          title: "সেহেরি",
          time: "রাত ৩:৩০",
          cost: "১৫০-২০০৳",
          icon: <Coffee className="h-6 w-6 text-purple-600" />,
          description: [
            "হোটেল বা স্থানীয় কোনো রেস্টুরেন্ট থেকে সেহেরির ব্যবস্থা",
            "প্রয়োজনীয় খাবার ও পানি সঙ্গে রাখা"
          ],
          note: "সেহেরির জায়গা আগে থেকে খোঁজ নেওয়া ভালো"
        },
        {
          title: "বান্দরবান যাত্রা",
          time: "ভোর ৪:৩০",
          cost: "২৫০৳",
          icon: <Bus className="h-6 w-6 text-purple-600" />,
          description: [
            "কক্সবাজার থেকে বান্দরবানের বাসে যাত্রা",
            "বাস টিকিট আগে থেকে বুক করা ভালো",
            "ভোরের শান্ত পরিবেশে বাসে আরামদায়ক যাত্রা"
          ],
          note: "ভোরের বাসে কম ট্রাফিক"
        },
        {
          title: "বান্দরবান আগমন",
          time: "সকাল ৮:০০",
          cost: "১৫০৳",
          icon: <MapPin className="h-6 w-6 text-purple-600" />,
          description: [
            "বাসস্ট্যান্ড থেকে হোটেলে বা চান্দের গাড়ির স্ট্যান্ডে যাওয়া (৫০-১০০৳)",
            "সকালের নাস্তা (পরোটা, ডিম, সবজি — ১০০৳)"
          ]
        },
        {
          title: "পাহাড়ি ভ্রমণ",
          time: "সকাল ৯:০০ - দুপুর ১২:০০",
          cost: "৮০০৳",
          icon: <Camera className="h-6 w-6 text-purple-600" />,
          description: [
            "চান্দের গাড়ি ভাড়া ৫০০৳ (৮-১০ জনের শেয়ারিং)",
            "প্রবেশ ফি মোট ৩০০৳ (নীলগিরি, নীলাচল, মেঘলা)",
            "নীলগিরিতে পাহাড়ি সৌন্দর্য উপভোগ, ফটোসেশন",
            "মেঘলার ঝুলন্ত ব্রিজ ও নৌকা ভ্রমণ"
          ],
          note: "সকালের দৃশ্য সবচেয়ে সুন্দর"
        },
        {
          title: "দুপুরের খাবার",
          time: "দুপুর ১:০০ - ২:০০",
          cost: "২০০-৩০০৳",
          icon: <Utensils className="h-6 w-6 text-purple-600" />,
          description: [
            "স্থানীয় রেস্টুরেন্টে পাহাড়ি খাবার",
            "বাঁশের মুরগি, পাহাড়ি ভর্তা, ভাতের আইটেমস"
          ]
        },
        {
          title: "অতিরিক্ত দর্শনীয় স্থান",
          time: "বিকাল ৩:০০ - ৬:০০",
          cost: "৩০০-৫০০৳",
          icon: <MapPin className="h-6 w-6 text-purple-600" />,
          description: [
            "শৈলপ্রপাত ঝর্ণা, স্বর্ণমন্দির দর্শন",
            "রুমা বাজার বা বগালেক ভ্রমণ",
            "স্থানীয় বাজারে শপিং"
          ]
        },
        {
          title: "ঢাকা প্রত্যাবর্তন",
          time: "রাত ৮:০০",
          cost: "৯০০৳",
          icon: <Bus className="h-6 w-6 text-purple-600" />,
          description: [
            "বান্দরবান থেকে ঢাকার বাসে যাত্রা",
            "নন-এসি বা এসি বাসের অপশন",
            "রাত্রিযাত্রার জন্য প্রয়োজনীয় স্ন্যাকস ও পানি"
          ],
          note: "রাতের বাসে আরামদায়ক যাত্রা"
        }
      ]
    },
    {
      day: "৪র্থ দিন",
      events: [
        {
          title: "ঢাকা আগমন",
          time: "সকাল ৬:০০",
          cost: "১০০-২০০৳",
          icon: <MapPin className="h-6 w-6 text-purple-600" />,
          description: [
            "ঢাকা পৌঁছানো",
            "বাসস্ট্যান্ড থেকে বাসায় ফেরা (রিকশা/সিএনজি/উবার)",
            "বাড়ি ফিরে বিশ্রাম"
          ]
        }
      ]
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-b from-purple-50 to-white'}`}>
      <Navbar />
      
      <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto h-full flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1 
            {...fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            কক্সবাজার ও বান্দরবান ট্যুর প্ল্যান
          </motion.h1>
          <motion.p 
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            ৩ দিনের অসাধারণ ভ্রমণ অভিজ্ঞতা
          </motion.p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: "মোট দিন", value: "৩ দিন", color: "from-purple-500 to-purple-600" },
            { title: "মোট খরচ", value: "৪৩৬৫৳", color: "from-blue-500 to-blue-600" },
            { title: "দর্শনীয় স্থান", value: "৮+", color: "from-green-500 to-green-600" },
            { title: "খাবার", value: "৬ বেলা", color: "from-orange-500 to-orange-600" }
          ].map((item, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${item.color} rounded-lg p-6 text-white`}
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-3xl font-bold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="day1" className="mb-12">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="day1">১ম দিন</TabsTrigger>
            <TabsTrigger value="day2">২য় দিন</TabsTrigger>
            <TabsTrigger value="day3">৩য় দিন</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {days.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={`day${dayIndex + 1}`}>
                <motion.div
                  {...fadeIn}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold"
                    >
                      {day.day}
                    </motion.div>
                    <div className="h-1 flex-grow bg-purple-200 ml-4"></div>
                  </div>

                  <div className="space-y-6 ml-16">
                    {day.events.map((event, eventIndex) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: eventIndex * 0.1 }}
                        key={eventIndex}
                      >
                        <Card className="transform transition-all hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                {event.icon}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                                      {event.title}
                                    </h3>
                                    <p className="text-purple-600 dark:text-purple-300 font-medium">
                                      {event.time}
                                    </p>
                                  </div>
                                  <span className="text-lg font-bold text-purple-800 dark:text-purple-200">
                                    {event.cost}
                                  </span>
                                </div>
                                <ul className="mt-3 space-y-2">
                                  {event.description.map((desc, i) => (
                                    <li key={i} className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                      {desc}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

        <Card className="mt-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white dark:from-purple-700 dark:to-purple-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">মোট খরচ (আনুমানিক)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm">পরিবহন খরচ</p>
                <p className="text-2xl font-bold">১৮৬৫৳</p>
                <ul className="mt-2 text-xs space-y-1 text-white/80">
                  <li>• ট্রেন: ৭১৫৳</li>
                  <li>• বান্দরবান বাস: ২৫০৳</li>
                  <li>• ঢাকা রিটার্ন: ৯০০৳</li>
                </ul>
              </div>
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm">বিচ ও ট্যুর খরচ</p>
                <p className="text-2xl font-bold">১১০০৳</p>
                <ul className="mt-2 text-xs space-y-1 text-white/80">
                  <li>• বিচ ভ্রমণ: ৩০০৳</li>
                  <li>• চান্দের গাড়ি: ৫০০৳</li>
                  <li>• প্রবেশ ফি: ৩০০৳</li>
                </ul>
              </div>
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm">হোটেল</p>
                <p className="text-2xl font-bold">৪০০৳</p>
                <ul className="mt-2 text-xs space-y-1 text-white/80">
                  <li>• শেয়ারিং রুম</li>
                  <li>• রোজার স্পেশাল রেট</li>
                </ul>
              </div>
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm">খাওয়া (৬ বেলা)</p>
                <p className="text-2xl font-bold">১০০০-১২০০৳</p>
                <ul className="mt-2 text-xs space-y-1 text-white/80">
                  <li>• সকাল: ১০০৳/বেলা</li>
                  <li>• দুপুর: ৩০০৳/বেলা</li>
                  <li>• রাত: ২৫০৳/বেলা</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">সর্বমোট</p>
                  <p className="text-sm text-white/80">সাধারণ প্যাকেজ</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">৪৩৬৫৳</p>
                  <p className="text-sm text-white/80">জনপ্রতি</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                <p>* খরচ পরিবর্তনশীল, সময় ও পরিস্থিতির উপর নির্ভরশীল</p>
                <p>* ১০-১৫ জনের গ্রুপের জন্য উপযুক্ত</p>
                <p>* সাধারণ সময়ে ৬০০০৳, বিশেষ সময়ে ৪০০০-৫০০০৳ সম্ভব</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 flex justify-center space-x-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Instagram className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Mail className="h-5 w-5" />
          </Button>
        </div>

        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="fixed top-24 right-8"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </main>

      <Footer />
    </div>
  );
} 