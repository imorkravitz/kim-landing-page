import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Check, User, BarChart3, Clock, Zap } from 'lucide-react';
import CardSwap, { Card } from '@/components/ui/card-swap';

const appImages = [
  {
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/03fd56ba1_app_1.png",
    alt: "מעקב צעדים ויעדים יומיים"
  },
  {
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/7b8e2dc17_app_2.png",
    alt: "יומן אוכל מצולם"
  },
  {
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/4f0d4bec3_app_3.png",
    alt: "מעקב צעדים וגרפים"
  },
  {
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/77c6ca764_app_4.png",
    alt: "מחשבון BMR"
  },
  {
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/cbbd3e3fd_app_5.png",
    alt: "מעקב משקל"
  },
  {
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/6a00d70d8_app_6.png",
    alt: "יומן אוכל יומי"
  }
];

const features = [
  {
    icon: Check,
    title: "מעקב חכם ופשוט",
    description: "צילום מנות, מעקב מים ופעילות יומית"
  },
  {
    icon: User,
    title: "ליווי אישי מתמיד",
    description: "קשר ישיר עם קים דרך האפליקציה"
  },
  {
    icon: BarChart3,
    title: "דוחות מפורטים",
    description: "גרפים ומדדים למעקב אחר ההתקדמות"
  },
  {
    icon: Clock,
    title: "מעקב BMR ומטבוליזם",
    description: "חישוב מדויק של קצב חילוף החומרים"
  },
  {
    icon: Zap,
    title: "מעקב משקל חכם",
    description: "גרף התקדמות עם ניתוח מגמות"
  }
];

export default function AppSection() {
  const appRef = useRef(null);
  const isInView = useInView(appRef, { once: true, margin: "-100px" });

  return (
    <section
      id="app"
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          ref={appRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">הכירו את אפליקציית Liveat</h2>
          <div className="w-16 h-1 bg-[#8B7F4B] mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            האפליקציה הייחודית שפותחה במיוחד עבור המטופלות שלי
          </p>
        </motion.div>

        <div className="text-center mb-16 relative z-20">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-gray-100">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/4a45529a3_app-icon.png" 
              alt="Liveat App Icon" 
              className="w-20 h-20 rounded-xl" 
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">אפליקציית Liveat</h3>
          <p className="text-lg text-gray-600">הכלי המושלם למסע התזונתי שלך</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Left Side - Phone Mockups */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-2 lg:order-1 mt-16 lg:mt-0 lg:pr-8"
          >


            <div className="relative h-[600px] flex items-center justify-center lg:justify-end lg:pr-8">
              <CardSwap
                width={280}
                height={500}
                cardDistance={50}
                verticalDistance={60}
                delay={4000}
                pauseOnHover={true}
                skewAmount={4}
              >
                {appImages.map((image, index) => (
                  <Card key={index}>
                    <div className="w-full h-full bg-black rounded-[3rem] p-2.5 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10"></div>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>

            <div className="text-center mt-8 space-y-4">
              <a href="https://onelink.to/zter3n" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-[#8B7F4B] text-white font-medium px-8 py-6 text-lg rounded-2xl shadow-[0_4px_6px_-1px_rgba(139,127,75,0.4)] hover:bg-[#6d6339] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
                >
                  הורידי את האפליקציה בחינם
                </Button>
              </a>

              <div className="flex justify-center items-center gap-4 pt-4">
                <a
                  href="https://apps.apple.com/il/app/liveat-%D7%9C%D7%97%D7%99%D7%99%D7%9D-%D7%91%D7%A8%D7%99%D7%90%D7%99%D7%9D-%D7%99%D7%95%D7%AA%D7%A8/id1559762957?platform=iphone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                    alt="הורידי מ-App Store" 
                    className="h-12 w-auto" 
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.levelapp.liveat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                    alt="הורידי מ-Google Play" 
                    className="h-12 w-auto" 
                  />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-right">איך האפליקציה עוזרת לי בתהליך?</h3>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4 text-right">
                    <div className="w-12 h-12 bg-[#8B7F4B]/10 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-[#8B7F4B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}