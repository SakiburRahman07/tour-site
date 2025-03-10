'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const emergencyNumbers = [
  {
    title: 'কক্সবাজার ট্যুরিস্ট পুলিশ',
    number: '01898906585',
  },
  {
    title: 'কক্সবাজার ট্যুরিস্ট পুলিশ',
    number: '01320159087',
  },
  {
    title: 'বান্দরবান আর্মি ক্যাম্প',
    number: '01602051816',
  },
  {
    title: 'বান্দরবান ট্যুরিস্ট পুলিশ',
    number: '01769690737',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function EmergencyNumbers() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-center mb-8">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                জরুরি ফোন নম্বর
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                এই নম্বরগুলো সংরক্ষণ করে রাখলে নিরাপত্তা বা যেকোনো জরুরি প্রয়োজনে খুবই উপকার হবে।
              </motion.p>
            </div>
            
            <motion.div
              className="space-y-4"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              {emergencyNumbers.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * (index + 1) }}
                >
                  <Card className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {contact.title}
                          </h3>
                          <p className="text-lg text-gray-600">
                            {contact.number}
                          </p>
                        </div>
                        <a 
                          href={`tel:${contact.number}`}
                          className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <PhoneCall className="h-6 w-6" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <motion.div
                className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-yellow-800 text-center text-lg">
                  এই নম্বরগুলো দরকারি মনে হচ্ছে, এগুলো ট্যুরের সময় কাজে লাগতে পারে।
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 