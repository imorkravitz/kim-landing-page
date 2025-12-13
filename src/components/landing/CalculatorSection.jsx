import React, { useState } from 'react';
import { Calculator, Scale, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CalculatorSection() {
  const [activeTab, setActiveTab] = useState('calories');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  
  // Form states
  const [gender, setGender] = useState('female');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('lose');

  const activityMultipliers = {
    sedentary: { value: 1.2, label: 'יושבנית (ללא פעילות)' },
    light: { value: 1.375, label: 'קלה (1-3 פעמים בשבוע)' },
    moderate: { value: 1.55, label: 'בינונית (3-5 פעמים בשבוע)' },
    active: { value: 1.725, label: 'גבוהה (6-7 פעמים בשבוע)' },
    veryActive: { value: 1.9, label: 'אינטנסיבית (פעמיים ביום)' }
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return null;
    
    const bmi = w / (h * h);
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
      category = 'תת משקל';
      color = 'text-blue-500';
    } else if (bmi < 25) {
      category = 'משקל תקין';
      color = 'text-green-500';
    } else if (bmi < 30) {
      category = 'עודף משקל';
      color = 'text-yellow-500';
    } else {
      category = 'השמנה';
      color = 'text-red-500';
    }
    
    return { bmi: bmi.toFixed(1), category, color };
  };

  const calculateCalories = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w) return null;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'female') {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    }

    const tdee = bmr * activityMultipliers[activityLevel].value;
    
    let targetCalories;
    let goalText;
    
    switch (goal) {
      case 'lose':
        targetCalories = tdee - 500;
        goalText = 'ירידה במשקל';
        break;
      case 'maintain':
        targetCalories = tdee;
        goalText = 'שמירה על משקל';
        break;
      case 'gain':
        targetCalories = tdee + 300;
        goalText = 'עלייה במשקל';
        break;
      default:
        targetCalories = tdee;
        goalText = 'שמירה על משקל';
    }

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories),
      goalText,
      protein: Math.round(w * 2.0), // גרם חלבון ליום
      water: Math.round(w * 0.033 * 10) / 10 // ליטר מים ליום
    };
  };

  const handleCalculate = () => {
    if (activeTab === 'bmi') {
      const bmiResult = calculateBMI();
      if (bmiResult) {
        setResults({ type: 'bmi', ...bmiResult });
        setShowResults(true);
      }
    } else {
      const caloriesResult = calculateCalories();
      if (caloriesResult) {
        setResults({ type: 'calories', ...caloriesResult });
        setShowResults(true);
      }
    }
  };

  const resetCalculator = () => {
    setShowResults(false);
    setResults(null);
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-gradient-to-b from-white to-[#F5F3ED]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            מחשבון תזונה <span className="text-[#8B7F4B]">אישי</span>
          </h2>
          <p className="text-xl text-gray-500">גלי את הצרכים התזונתיים שלך בכמה צעדים פשוטים</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { setActiveTab('calories'); resetCalculator(); }}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${
                  activeTab === 'calories' 
                    ? 'bg-[#8B7F4B] text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Flame className="w-5 h-5" />
                מחשבון קלוריות
              </button>
              <button
                onClick={() => { setActiveTab('bmi'); resetCalculator(); }}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${
                  activeTab === 'bmi' 
                    ? 'bg-[#8B7F4B] text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Scale className="w-5 h-5" />
                מחשבון BMI
              </button>
            </div>

            <div className="p-6 md:p-8">
              {!showResults ? (
                <div className="space-y-6">
                  {/* Gender */}
                  {activeTab === 'calories' && (
                    <div>
                      <Label className="text-gray-700 font-medium mb-3 block">מין</Label>
                      <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">נקבה</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">זכר</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Age */}
                  {activeTab === 'calories' && (
                    <div>
                      <Label htmlFor="age" className="text-gray-700 font-medium mb-2 block">גיל</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="לדוגמה: 30"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="text-right"
                      />
                    </div>
                  )}

                  {/* Height & Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height" className="text-gray-700 font-medium mb-2 block">גובה (ס"מ)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="לדוגמה: 165"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-gray-700 font-medium mb-2 block">משקל (ק"ג)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="לדוגמה: 65"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="text-right"
                      />
                    </div>
                  </div>

                  {/* Activity Level */}
                  {activeTab === 'calories' && (
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">רמת פעילות גופנית</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger className="text-right">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(activityMultipliers).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Goal */}
                  {activeTab === 'calories' && (
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">מטרה</Label>
                      <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger className="text-right">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose">ירידה במשקל</SelectItem>
                          <SelectItem value="maintain">שמירה על משקל</SelectItem>
                          <SelectItem value="gain">עלייה במשקל (בניית שריר)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button 
                    onClick={handleCalculate}
                    className="w-full bg-[#8B7F4B] text-white py-6 text-lg rounded-xl shadow-[0_4px_6px_-1px_rgba(139,127,75,0.4)] hover:bg-[#6d6339] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
                  >
                    <Calculator className="w-5 h-5 ml-2" />
                    חישוב
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Results */}
                  {results.type === 'bmi' ? (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-[#8B7F4B]/10 flex items-center justify-center mx-auto mb-4">
                        <Scale className="w-12 h-12 text-[#8B7F4B]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">ה-BMI שלך</h3>
                      <div className="text-6xl font-black text-[#8B7F4B] mb-2">{results.bmi}</div>
                      <div className={`text-xl font-semibold ${results.color}`}>{results.category}</div>
                      
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-right">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          מדד ה-BMI הוא הערכה ראשונית בלבד. לתמונה מלאה יותר על מצב הבריאות שלך, 
                          מומלץ להתייעץ עם דיאטנית קלינית שתבנה עבורך תוכנית מותאמת אישית.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-[#8B7F4B]/10 flex items-center justify-center mx-auto mb-4">
                        <Flame className="w-12 h-12 text-[#8B7F4B]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">ההמלצה שלך ל{results.goalText}</h3>
                      <div className="text-6xl font-black text-[#8B7F4B] mb-1">{results.target}</div>
                      <div className="text-xl text-gray-600 mb-6">קלוריות ביום</div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#8B7F4B]/5 rounded-xl p-4">
                          <div className="text-2xl font-bold text-[#8B7F4B]">{results.bmr}</div>
                          <div className="text-xs text-gray-500">מטבוליזם בסיסי</div>
                        </div>
                        <div className="bg-[#8B7F4B]/5 rounded-xl p-4">
                          <div className="text-2xl font-bold text-[#8B7F4B]">{results.protein} גרם</div>
                          <div className="text-xs text-gray-500">חלבון ליום</div>
                        </div>
                        <div className="bg-[#8B7F4B]/5 rounded-xl p-4">
                          <div className="text-2xl font-bold text-[#8B7F4B]">{results.water} ליטר</div>
                          <div className="text-xs text-gray-500">מים ליום</div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl text-right">
                        <p className="text-gray-600 text-s leading-relaxed">
                          אלו הערכות כלליות בלבד. כל גוף שונה, ולכן ליווי אישי של דיאטנית קלינית 
                          יעזור לך להגיע לתוצאות מדויקות ומותאמות אישית.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-[#8B7F4B]/10 to-[#8B7F4B]/5 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#8B7F4B] font-semibold mb-3">
                      <CheckCircle2 className="w-5 h-5" />
                      רוצה תוכנית מותאמת אישית?
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      קבלי ליווי צמוד מדיאטנית קלינית עם תפריט אישי, מעקב יומי ותמיכה מלאה
                    </p>
                    <a 
                      href="https://wa.link/ntdrz1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-green-500 text-white px-8 py-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(34,197,94,0.4)] hover:bg-green-600 hover:shadow-[0_10px_15px_-3px_rgba(34,197,94,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200">
                        <WhatsAppIcon className="w-5 h-5 ml-2" />
                        דברי איתי בוואטסאפ
                      </Button>
                    </a>
                  </div>

                  <Button 
                    variant="outline"
                    onClick={resetCalculator}
                    className="w-full py-5 shadow-none hover:-translate-y-[2px] hover:shadow-md active:translate-y-[1px] active:shadow-none transition-all duration-200"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    חזרה למחשבון
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}