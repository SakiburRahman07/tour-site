import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Train, Hotel, Bus, Utensils } from "lucide-react";

export default function TourDetails() {
  const tourDetails = [
    {
      icon: <Train className="w-5 h-5" />,
      title: "ঢাকা টু কক্সবাজার",
      description: "ননস্টপ ট্রেন (রাতে উঠব)",
      cost: 715,
      note: "রাতের ট্রেনে যাত্রা"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "লাবনী পয়েন্ট থেকে পাটুয়ারটেক বিচ",
      description: "সকালে নেমে বিচ ভ্রমণ",
      cost: 300,
      note: "জনপ্রতি"
    },
    {
      icon: <Hotel className="w-5 h-5" />,
      title: "হোটেল ভাড়া",
      description: "রাতের থাকার ব্যবস্থা",
      cost: 500,
      note: "জনপ্রতি (সাধারণ সময়ে ২০০০ টাকা, রোজায় ১০০০ টাকা)"
    },
    {
      icon: <Bus className="w-5 h-5" />,
      title: "কক্সবাজার থেকে বান্দরবান",
      description: "পরের দিন সেহেরি খেয়ে যাত্রা",
      cost: 150,
      note: "বাস ভাড়া"
    },
    {
      icon: <Bus className="w-5 h-5" />,
      title: "বান্দরবান থেকে ঢাকা",
      description: "রাতের বাসে ফেরত",
      cost: 900,
      note: "বাস ভাড়া"
    },
    {
      icon: <Bus className="w-5 h-5" />,
      title: "চান্দের গাড়ি ভাড়া",
      description: "বান্দরবান লোকাল ট্যুর",
      cost: 500,
      note: "জনপ্রতি (৮-১০ জন)"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "নীলগিরি + নীলাচল + মেঘলা",
      description: "প্রবেশ মূল্য",
      cost: 300,
      note: "সব স্পটে ঢোকার খরচ"
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "খাবার খরচ",
      description: "৬ বেলার খাবার",
      cost: 1000,
      note: "প্রতি ব্যক্তির জন্য (আনুমানিক)"
    }
  ];

  const totalCost = tourDetails.reduce((acc, item) => acc + item.cost, 0);

  return (
    <Card className="shadow-lg border-t-4 border-t-purple-500">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-purple-800">ট্যুর প্ল্যান বিস্তারিত</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {tourDetails.map((detail, index) => (
              <Card key={index} className="bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {detail.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-purple-900">{detail.title}</h3>
                      <p className="text-sm text-gray-600">{detail.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-purple-600">৳{detail.cost}</span>
                        <span className="text-xs text-gray-500">{detail.note}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-purple-50 mt-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-purple-800">মোট খরচ (আনুমানিক)</span>
                  <span className="text-2xl font-bold text-purple-900">৳{totalCost}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• ১০-১৫ জনের গ্রুপের জন্য উপযুক্ত</p>
                  <p>• খাবার খরচ ব্যক্তিগত পছন্দ অনুযায়ী ভিন্ন হতে পারে</p>
                  <p>• সাধারণ সময়ে ৬০০০ টাকা, বিশেষ সময়ে ৪০০০-৫০০০ টাকায় সম্ভব</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 