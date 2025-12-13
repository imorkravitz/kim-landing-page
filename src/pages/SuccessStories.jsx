import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import StoryCard from '@/components/success-stories/StoryCard';
import SubmitStoryForm from '@/components/success-stories/SubmitStoryForm';
import SEOHead from '@/components/SEOHead';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function SuccessStories() {
  const [showForm, setShowForm] = useState(false);

  const { data: stories = [], isLoading, refetch } = useQuery({
    queryKey: ['success-stories'],
    queryFn: () => base44.entities.SuccessStory.filter({ status: 'approved' }, '-created_date'),
  });

  const featuredStories = stories.filter(s => s.is_featured);
  const regularStories = stories.filter(s => !s.is_featured);

  // Stats
  const totalWeightLost = stories.reduce((sum, s) => sum + (s.weight_lost || 0), 0);
  const avgDuration = stories.length > 0 
    ? Math.round(stories.reduce((sum, s) => sum + (s.duration_months || 0), 0) / stories.filter(s => s.duration_months).length)
    : 0;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F5F3ED] to-white">
      <SEOHead 
        title="סיפורי הצלחה | קים גפסון - תזונה מאפשרת"
        description="קראי סיפורי הצלחה מעוררי השראה של נשים שהצליחו לשנות את אורח החיים שלהן, לרדת במשקל ולשפר את הבריאות עם ליווי תזונתי אישי בגישת 80:20."
      />

      {/* Back Button */}
      <div className="px-6 pt-6">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="text-[#8B7F4B] hover:bg-[#8B7F4B]/10">
            <ArrowRight className="w-4 h-4 ml-2" />
            חזרה לדף הראשי
          </Button>
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920')] bg-cover bg-center opacity-5" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#8B7F4B]/10 text-[#8B7F4B] px-4 py-2 rounded-full font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              סיפורי הצלחה אמיתיים
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              הן <span className="text-[#8B7F4B]">הצליחו</span> – ואת יכולה גם
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              מאות נשים כבר שינו את אורח החיים שלהן עם הליווי של קים. 
              הנה כמה מהסיפורים המעוררי השראה שלהן.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-[#8B7F4B]">
                  <Users className="w-8 h-8" />
                  {stories.length}+
                </div>
                <p className="text-gray-600">סיפורי הצלחה</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-green-600">
                  <TrendingUp className="w-8 h-8" />
                  {totalWeightLost}
                </div>
                <p className="text-gray-600">ק"ג שירדו</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-[#8B7F4B]">
                  <Award className="w-8 h-8" />
                  {avgDuration || 4}
                </div>
                <p className="text-gray-600">חודשים בממוצע</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://wa.link/ntdrz1" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20BA5C] text-white px-8 py-6 text-lg rounded-full">
                  <WhatsAppIcon className="w-5 h-5 ml-2" />
                  רוצה להיות הסיפור הבא?
                </Button>
              </a>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowForm(!showForm)}
                className="px-8 py-6 text-lg rounded-full border-2 border-[#8B7F4B] text-[#8B7F4B] hover:bg-[#8B7F4B] hover:text-white"
              >
                <Plus className="w-5 h-5 ml-2" />
                שתפי את הסיפור שלך
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Submit Form */}
      {showForm && (
        <section className="py-12 px-6 bg-white border-y border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">שתפי את סיפור ההצלחה שלך</h2>
            <SubmitStoryForm onSuccess={() => { refetch(); setShowForm(false); }} />
          </div>
        </section>
      )}

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#8B7F4B]" />
              סיפורים מומלצים
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">כל סיפורי ההצלחה</h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl">
              <p className="text-gray-500 mb-4">עדיין אין סיפורי הצלחה מאושרים</p>
              <Button onClick={() => setShowForm(true)} className="bg-[#8B7F4B] hover:bg-[#6d6339]">
                היי הראשונה לשתף!
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#8B7F4B]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            מוכנה לכתוב את הסיפור שלך?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            התחילי את המסע שלך היום וצטרפי למאות הנשים שכבר הצליחו
          </p>
          <a href="https://wa.link/ntdrz1" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-white text-[#8B7F4B] hover:bg-gray-100 px-10 py-6 text-lg rounded-full">
              <WhatsAppIcon className="w-5 h-5 ml-2" />
              בואי נתחיל
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}