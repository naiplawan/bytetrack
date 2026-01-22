'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, User, Ruler, Activity, Target, Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  {
    id: 1,
    title: 'Welcome to Your Wellness Journey!',
    description: 'Let\'s personalize your experience',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  },
  {
    id: 2,
    title: 'Tell Us About Yourself',
    description: 'Basic information to personalize your plan',
    icon: User,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  },
  {
    id: 3,
    title: 'Your Current Stats',
    description: 'Don\'t worry, we\'ll track your progress',
    icon: Ruler,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  },
  {
    id: 4,
    title: 'Activity Level',
    description: 'How active is your lifestyle?',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  },
  {
    id: 5,
    title: 'Your Wellness Goals',
    description: 'What do you want to achieve?',
    icon: Target,
    image: 'https://images.unsplash.com/photo-1526628953301-3e58db880229?w=800&q=80',
  },
];

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', emoji: '🛋️' },
  { id: 'light', label: 'Lightly Active', description: 'Exercise 1-3 days/week', emoji: '🚶' },
  { id: 'moderate', label: 'Moderately Active', description: 'Exercise 3-5 days/week', emoji: '🏃' },
  { id: 'active', label: 'Very Active', description: 'Exercise 6-7 days/week', emoji: '💪' },
  { id: 'extra', label: 'Extra Active', description: 'Very hard exercise/sports', emoji: '🏋️' },
];

const goals = [
  { id: 'lose', label: 'Lose Weight', emoji: '📉', color: 'from-blue-400 to-cyan-400' },
  { id: 'maintain', label: 'Maintain Weight', emoji: '⚖️', color: 'from-green-400 to-teal-400' },
  { id: 'gain', label: 'Gain Muscle', emoji: '💪', color: 'from-orange-400 to-red-400' },
  { id: 'health', label: 'Eat Healthier', emoji: '🥗', color: 'from-purple-400 to-pink-400' },
  { id: 'energy', label: 'More Energy', emoji: '⚡', color: 'from-yellow-400 to-amber-400' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goals: [] as string[],
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 1 && (!formData.name || !formData.age)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep === 2 && (!formData.weight || !formData.height)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep === 3 && !formData.activityLevel) {
      toast.error('Please select your activity level');
      return;
    }
    if (currentStep === 4 && formData.goals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const userData = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        currentWeight: formData.weight,
        height: formData.height,
        activityLevel: formData.activityLevel,
        goals: formData.goals,
        targetCalories: 2000,
        macroTargets: { protein: 120, carbs: 200, fat: 55 },
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('onboardingComplete', 'true');
      toast.success('Welcome to your wellness journey! 🌱');
      router.push('/dashboard');
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Welcome Step */}
              {currentStep === 0 && (
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 text-6xl animate-float">✨</div>
                  </div>
                  <h1 className="heading-font text-4xl sm:text-5xl font-bold text-gray-800">
                    Welcome to Your
                    <span className="text-gradient-vitality"> Wellness Journey!</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-xl mx-auto">
                    We're excited to help you achieve your health and nutrition goals.
                    Let's personalize your experience in just a few quick steps.
                  </p>
                  <img
                    src={steps[0].image}
                    alt="Wellness journey"
                    className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                  />
                </div>
              )}

              {/* Basic Info Step */}
              {currentStep === 1 && (
                <div className="wellness-card p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="heading-font text-3xl font-bold text-gray-800 mb-2">
                      {steps[1].title}
                    </h2>
                    <p className="text-gray-600">{steps[1].description}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Your Name *</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="wellness-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Age *</label>
                        <input
                          type="number"
                          placeholder="25"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="wellness-input"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="wellness-input"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Body Stats Step */}
              {currentStep === 2 && (
                <div className="wellness-card p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Ruler className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="heading-font text-3xl font-bold text-gray-800 mb-2">
                      {steps[2].title}
                    </h2>
                    <p className="text-gray-600">{steps[2].description}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Current Weight (kg) *</label>
                        <input
                          type="number"
                          placeholder="70"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="wellness-input"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Height (cm) *</label>
                        <input
                          type="number"
                          placeholder="170"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="wellness-input"
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-sm text-blue-800">
                        💡 This information helps us calculate your daily calorie needs and track your progress over time.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Level Step */}
              {currentStep === 3 && (
                <div className="wellness-card p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-10 h-10 text-orange-600" />
                    </div>
                    <h2 className="heading-font text-3xl font-bold text-gray-800 mb-2">
                      {steps[3].title}
                    </h2>
                    <p className="text-gray-600">{steps[3].description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activityLevels.map((level) => (
                      <motion.button
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, activityLevel: level.id })}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${
                          formData.activityLevel === level.id
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{level.emoji}</span>
                          <div>
                            <p className="font-semibold text-gray-800">{level.label}</p>
                            <p className="text-sm text-gray-500">{level.description}</p>
                          </div>
                          {formData.activityLevel === level.id && (
                            <Check className="w-6 h-6 text-orange-600 ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals Step */}
              {currentStep === 4 && (
                <div className="wellness-card p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-10 h-10 text-purple-600" />
                    </div>
                    <h2 className="heading-font text-3xl font-bold text-gray-800 mb-2">
                      {steps[4].title}
                    </h2>
                    <p className="text-gray-600">{steps[4].description}</p>
                  </div>

                  <p className="text-center text-gray-600 mb-6">Select all that apply to you</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                      <motion.button
                        key={goal.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          formData.goals.includes(goal.id)
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-purple-200'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl">{goal.emoji}</span>
                          <p className="font-semibold text-gray-800 text-center">{goal.label}</p>
                          {formData.goals.includes(goal.id) && (
                            <Check className="w-6 h-6 text-purple-600" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                )}
                <div className="flex-1" />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="btn-vitality flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Start Journey
                      <Heart className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
