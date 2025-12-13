import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export default function SubmitStoryForm({ onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight_lost: '',
    duration_months: '',
    testimonial: '',
    journey_summary: '',
    challenges: '',
    favorite_tip: ''
  });
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const handleImageUpload = async (file, type) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === 'before') {
        setBeforeImage(file_url);
      } else {
        setAfterImage(file_url);
      }
      toast.success('התמונה הועלתה בהצלחה');
    } catch (error) {
      toast.error('שגיאה בהעלאת התמונה');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.testimonial) {
      toast.error('נא למלא שם והמלצה');
      return;
    }

    setIsSubmitting(true);
    
    await base44.entities.SuccessStory.create({
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      weight_lost: formData.weight_lost ? parseFloat(formData.weight_lost) : null,
      duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
      before_image: beforeImage,
      after_image: afterImage,
      status: 'pending'
    });
    
    setSubmitted(true);
    setIsSubmitting(false);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">תודה על השיתוף!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          הסיפור שלך נשלח בהצלחה ויפורסם לאחר אישור. 
          אנחנו שמחים לשמוע על ההצלחה שלך! 💚
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">שם (יוצג באתר) *</Label>
            <Input
              id="name"
              placeholder="לדוגמה: שרה כ."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="age">גיל</Label>
              <Input
                id="age"
                type="number"
                placeholder="35"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight">ירידה בק"ג</Label>
              <Input
                id="weight"
                type="number"
                placeholder="12"
                value={formData.weight_lost}
                onChange={(e) => setFormData({ ...formData, weight_lost: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="duration">חודשים</Label>
              <Input
                id="duration"
                type="number"
                placeholder="4"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Image Uploads */}
        <div className="space-y-4">
          <div>
            <Label>תמונת לפני</Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#8B7F4B] transition-colors">
              {beforeImage ? (
                <img src={beforeImage} alt="לפני" className="w-full h-24 object-cover rounded-lg" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">העלי תמונה</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'before')}
                  />
                </label>
              )}
            </div>
          </div>
          <div>
            <Label>תמונת אחרי</Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#8B7F4B] transition-colors">
              {afterImage ? (
                <img src={afterImage} alt="אחרי" className="w-full h-24 object-cover rounded-lg" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">העלי תמונה</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'after')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div>
        <Label htmlFor="testimonial">ההמלצה שלך *</Label>
        <Textarea
          id="testimonial"
          placeholder="ספרי על החוויה שלך עם קים והתהליך שעברת..."
          value={formData.testimonial}
          onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
          className="mt-1 h-24"
        />
      </div>

      {/* Journey Summary */}
      <div>
        <Label htmlFor="journey">סיכום התהליך</Label>
        <Textarea
          id="journey"
          placeholder="תארי את המסע שלך - איך התחלת, מה עשית, ואיך הגעת לתוצאות..."
          value={formData.journey_summary}
          onChange={(e) => setFormData({ ...formData, journey_summary: e.target.value })}
          className="mt-1 h-20"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="challenges">אתגרים שהתגברת עליהם</Label>
          <Textarea
            id="challenges"
            placeholder="מה היה הכי קשה? איך התמודדת?"
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            className="mt-1 h-20"
          />
        </div>
        <div>
          <Label htmlFor="tip">הטיפ שלך לאחרות</Label>
          <Textarea
            id="tip"
            placeholder="מה העצה שהיית נותנת למי שמתחילה?"
            value={formData.favorite_tip}
            onChange={(e) => setFormData({ ...formData, favorite_tip: e.target.value })}
            className="mt-1 h-20"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#8B7F4B] hover:bg-[#6d6339] text-white py-6 text-lg rounded-xl"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
        ) : (
          <Send className="w-5 h-5 ml-2" />
        )}
        שלחי את הסיפור שלי
      </Button>

      <p className="text-xs text-gray-500 text-center">
        * הסיפור יפורסם לאחר אישור. פרטיך האישיים נשמרים בסודיות.
      </p>
    </form>
  );
}