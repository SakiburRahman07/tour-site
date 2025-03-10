import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">ট্যুর প্ল্যানার</h3>
            <p className="text-sm">
              আপনার নির্ভরযোগ্য ট্যুর প্ল্যানিং পার্টনার। আমরা আপনার ভ্রমণকে স্মরণীয় করে তুলব।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  প্রাইভেসি পলিসি
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  শর্তাবলী
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  অ্যাডমিন লগইন
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">যোগাযোগ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+8801794-111768</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+8801309-666315</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>rahman2007007@stud.kuet.ac.bd</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">নিউজলেটার</h3>
            <p className="text-sm mb-4">
              সর্বশেষ আপডেট পেতে সাবস্ক্রাইব করুন
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="আপনার ইমেইল"
                className="bg-gray-800 border-gray-700"
              />
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                সাবস্ক্রাইব
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} ট্যুর প্ল্যানার। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
} 