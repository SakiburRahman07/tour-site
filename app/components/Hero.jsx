import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative min-h-[550px] sm:h-[600px] bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: "url('/images/coxs-bazar.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-8"
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            আপনার স্বপ্নের ট্যুর প্ল্যান করুন
          </h1>
          
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            কক্সবাজার থেকে বান্দরবান - একটি অবিস্মরণীয় অভিজ্ঞতার জন্য আজই যোগাযোগ করুন
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button 
              onClick={() => router.push('/registration')}
              size="lg"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>রেজিস্ট্রেশন করুন</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              onClick={() => router.push('/schedule')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full transform transition-all duration-300 hover:scale-105"
            >
              আমাদের কার্যক্রম
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-8 mt-6 sm:mt-8 max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">১০০+</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200">সফল ট্যুর</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">৫০০+</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200">সন্তুষ্ট গ্রাহক</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-6 col-span-2 sm:col-span-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">২৪/৭</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200">সাপোর্ট</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
} 