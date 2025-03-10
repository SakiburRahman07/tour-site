'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
            আমাদের সম্পর্কে
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Us */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  আমাদের পরিচয়
                </h2>
                <p className="text-gray-600 mb-4">
                  আমরা একটি অভিজ্ঞ ট্যুর প্ল্যানিং সংস্থা। আমাদের লক্ষ্য হল আপনার ভ্রমণকে স্মরণীয় ও আনন্দদায়ক করে তোলা।
                </p>
                <p className="text-gray-600">
                  আমরা বিগত কয়েক বছর ধরে সফলতার সাথে বিভিন্ন ট্যুর প্যাকেজ পরিচালনা করে আসছি। আমাদের রয়েছে দক্ষ গাইড এবং সুনিপুণ ব্যবস্থাপনা টিম।
                </p>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  কেন আমাদের বেছে নেবেন?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-purple-600 mt-1" />
                    <span className="text-gray-600">অভিজ্ঞ ট্যুর গাইড</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                    <span className="text-gray-600">সেরা ট্যুর প্ল্যান</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-purple-600 mt-1" />
                    <span className="text-gray-600">২৪/৭ সাপোর্ট</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-purple-600 mt-1" />
                    <span className="text-gray-600">দ্রুত রিস্পন্স</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="mt-8 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                যোগাযোগ করুন
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">ফোন</p>
                    <p className="text-gray-600">+8801794-111768</p>
                    <p className="text-gray-600">+8801309-666315</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">ইমেইল</p>
                    <p className="text-gray-600">rahman2007007@stud.kuet.ac.bd</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">ঠিকানা</p>
                    <p className="text-gray-600">টাঙ্গাইল, ঢাকা</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
} 