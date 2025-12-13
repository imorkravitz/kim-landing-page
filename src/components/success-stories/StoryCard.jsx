import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import LazyImage from '@/components/ui/LazyImage';

export default function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState('after');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Before/After Images */}
      {(story.before_image || story.after_image) && (
        <div className="relative">
          <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
            {activeImage === 'before' && story.before_image ? (
              <LazyImage
                src={story.before_image}
                alt={`${story.name} - לפני`}
                className="w-full h-full"
              />
            ) : story.after_image ? (
              <LazyImage
                src={story.after_image}
                alt={`${story.name} - אחרי`}
                className="w-full h-full"
              />
            ) : null}
          </div>
          
          {story.before_image && story.after_image && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveImage('before')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeImage === 'before' 
                    ? 'bg-[#8B7F4B] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                לפני
              </button>
              <button
                onClick={() => setActiveImage('after')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeImage === 'after' 
                    ? 'bg-[#8B7F4B] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                אחרי
              </button>
            </div>
          )}

          {story.is_featured && (
            <Badge className="absolute top-4 right-4 bg-[#8B7F4B] text-white">
              סיפור מומלץ
            </Badge>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
            {story.age && <p className="text-gray-500 text-sm">בת {story.age}</p>}
          </div>
          <div className="flex gap-2">
            {story.weight_lost && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <TrendingDown className="w-4 h-4" />
                {story.weight_lost} ק"ג
              </div>
            )}
            {story.duration_months && (
              <div className="flex items-center gap-1 bg-[#8B7F4B]/10 text-[#8B7F4B] px-3 py-1.5 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                {story.duration_months} חודשים
              </div>
            )}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative bg-gray-50 rounded-2xl p-4 mb-4">
          <Quote className="absolute top-3 right-3 w-6 h-6 text-[#8B7F4B]/30" />
          <p className="text-gray-700 leading-relaxed pr-6">{story.testimonial}</p>
        </div>

        {/* Expandable Content */}
        {(story.journey_summary || story.challenges || story.favorite_tip) && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-[#8B7F4B] font-medium hover:text-[#6d6339] transition-colors w-full justify-center py-2"
            >
              {expanded ? 'הסתר פרטים' : 'קראי עוד על התהליך'}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 mt-4 pt-4 border-t border-gray-100"
              >
                {story.journey_summary && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">סיכום התהליך</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{story.journey_summary}</p>
                  </div>
                )}
                {story.challenges && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">אתגרים שהתגברתי עליהם</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{story.challenges}</p>
                  </div>
                )}
                {story.favorite_tip && (
                  <div className="bg-[#8B7F4B]/5 rounded-xl p-4">
                    <h4 className="font-semibold text-[#8B7F4B] mb-2">💡 הטיפ שלי</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{story.favorite_tip}</p>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}