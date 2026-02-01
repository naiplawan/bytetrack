'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, User, Ruler, Activity, Target, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacroTargets,
  calculateWaterIntake,
  type Gender,
} from '@/lib/calorie-calculator';
import { getProfileAction, completeOnboardingAction, getOnboardingStatusAction } from '@/lib/actions/profile-actions';
import { saveStep2Data } from '@/lib/actions/onboarding-actions';
import { saveStep3Data } from '@/lib/actions/step3-actions';
import { saveStep4Data } from '@/lib/actions/step4-actions';
import { saveStep5Data } from '@/lib/actions/step5-actions';
import { cacheOnboardingData, getAllCachedData } from '@/lib/actions/onboarding-utils';

interface OnboardingData {
  name?: string;
  email?: string;
  age?: number;
  gender?: Gender;
  height?: number;
  weight?: number;
  target_weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
}

interface FormErrors {
  [key: string]: string;
}

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
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Check onboarding status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getOnboardingStatusAction();
        if (status.completed) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    checkStatus();
  }, [router]);

  const updateOnboardingData = (step: number, data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    // For step 1, just go to next step
    if (currentStep === 1) {
      setCurrentStep(prev => prev + 1);
    }
    // For steps 2-4, they will handle navigation via form submission
    // For step 5, it's handled by the form submit
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const Step1Content = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-brand flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-text-primary">
        {steps[0].title}
      </h2>
      <p className="text-xl text-text-secondary max-w-2xl mx-auto">
        {steps[0].description}
      </p>
    </div>
  );

  const Step2Content = () => (
    <form id="step-2" className="space-y-6" action={async (formData: FormData) => {
      setIsSubmitting(true);
      try {
        const data = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          age: parseInt(formData.get('age') as string),
          gender: formData.get('gender') as 'male' | 'female' | 'other',
        };

        await saveStep2Data(data);
        await cacheOnboardingData(2, data);
        updateOnboardingData(2, data);
        setCurrentStep(3);
      } catch (error: any) {
        console.error('Step 2 submission error:', error);
        toast.error(error.message || 'Please check your inputs and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }}>
      <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center">
        <User className="w-12 h-12 text-brand" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-text-primary">
        {steps[1].title}
      </h2>
      <p className="text-xl text-text-secondary">
        {steps[1].description}
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={onboardingData.name || ''}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Enter your name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={onboardingData.email || ''}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Age</label>
          <input
            type="number"
            name="age"
            defaultValue={onboardingData.age || ''}
            min="1"
            max="120"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Enter your age"
            required
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Gender</label>
          <select
            name="gender"
            defaultValue={onboardingData.gender || ''}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>
    </form>
  );

  const Step3Content = () => (
    <form id="step-3" className="space-y-6" action={async (formData: FormData) => {
      setIsSubmitting(true);
      try {
        const data = {
          height: parseInt(formData.get('height') as string),
          weight: parseInt(formData.get('weight') as string),
          target_weight: formData.get('target_weight') ? parseInt(formData.get('target_weight') as string) : undefined,
        };

        await saveStep3Data(data);
        await cacheOnboardingData(3, data);
        updateOnboardingData(3, data);
        setCurrentStep(4);
      } catch (error: any) {
        console.error('Step 3 submission error:', error);
        toast.error(error.message || 'Please check your inputs and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }}>
      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
        <Ruler className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-text-primary">
        {steps[2].title}
      </h2>
      <p className="text-xl text-text-secondary">
        {steps[2].description}
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Height (cm)</label>
          <input
            type="number"
            name="height"
            defaultValue={onboardingData.height || ''}
            min="50"
            max="300"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Enter your height"
            required
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Current Weight (kg)</label>
          <input
            type="number"
            name="weight"
            defaultValue={onboardingData.weight || ''}
            min="20"
            max="300"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Enter your current weight"
            required
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Target Weight (kg) - Optional</label>
          <input
            type="number"
            name="target_weight"
            defaultValue={onboardingData.target_weight || ''}
            min="20"
            max="300"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Enter your target weight"
          />
          {errors.target_weight && <p className="text-red-500 text-sm mt-1">{errors.target_weight}</p>}
        </div>
      </div>
    </form>
  );

  const Step4Content = () => (
    <form id="step-4" className="space-y-6" action={async (formData: FormData) => {
      setIsSubmitting(true);
      try {
        const data = {
          activity_level: formData.get('activity_level') as any,
        };

        await saveStep4Data(data);
        await cacheOnboardingData(4, data);
        updateOnboardingData(4, data);
        setCurrentStep(5);
      } catch (error: any) {
        console.error('Step 4 submission error:', error);
        toast.error(error.message || 'Please select an activity level and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }}>
      <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center">
        <Activity className="w-12 h-12 text-warning" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-text-primary">
        {steps[3].title}
      </h2>
      <p className="text-xl text-text-secondary">
        {steps[3].description}
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Activity Level</label>
          <select
            name="activity_level"
            defaultValue={onboardingData.activity_level || ''}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            required
          >
            <option value="">Select your activity level</option>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="lightly_active">Lightly active (1-3 days/week)</option>
            <option value="moderately_active">Moderately active (3-5 days/week)</option>
            <option value="very_active">Very active (6-7 days/week)</option>
            <option value="extra_active">Extra active (physical job)</option>
          </select>
          {errors.activity_level && <p className="text-red-500 text-sm mt-1">{errors.activity_level}</p>}
        </div>
      </div>
    </form>
  );

  const Step5Content = () => (
    <form id="step-5" className="space-y-6" action={async (formData: FormData) => {
      setIsSubmitting(true);
      try {
        const goal = formData.get('goal') as 'lose_weight' | 'maintain_weight' | 'gain_weight';

        // Get all cached data
        const allData = await getAllCachedData();

        await saveStep5Data(goal, allData);
        setCompleted(true);
        toast.success('Welcome to ByteTrack! Your profile has been created.');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (error: any) {
        console.error('Step 5 submission error:', error);
        toast.error(error.message || 'Please select a goal and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }}>
      <div className="w-24 h-24 rounded-full bg-cta/10 flex items-center justify-center">
        <Target className="w-12 h-12 text-cta" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-text-primary">
        {steps[4].title}
      </h2>
      <p className="text-xl text-text-secondary">
        {steps[4].description}
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Your Goal</label>
          <select
            name="goal"
            defaultValue={onboardingData.goal || ''}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent"
            required
          >
            <option value="">Select your goal</option>
            <option value="lose_weight">Lose weight</option>
            <option value="maintain_weight">Maintain weight</option>
            <option value="gain_weight">Gain weight</option>
          </select>
          {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
        </div>
      </div>
    </form>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Content />;
      case 2:
        return <Step2Content />;
      case 3:
        return <Step3Content />;
      case 4:
        return <Step4Content />;
      case 5:
        return <Step5Content />;
      default:
        return null;
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto rounded-full bg-gradient-brand flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl font-bold text-text-primary"
          >
            Getting you ready...
          </motion.h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id
                      ? 'bg-brand text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {step.id < steps.length && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-brand' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px] flex flex-col items-center justify-center"
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            {currentStep > 1 && currentStep < 5 ? (
              // For steps 2-4, show a regular button that goes back
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrevious}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl font-medium ${
                  isSubmitting
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-brand hover:bg-brand/10'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2 inline" />
                Previous
              </motion.button>
            ) : (
              // For step 1 and step 5 (form), no previous button needed
              <div></div>
            )}

            {currentStep === 1 ? (
              // Step 1 has a regular Next button
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="btn-brand text-lg px-8 py-3"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </motion.button>
            ) : currentStep < 5 ? (
              // Steps 2-4 have Next buttons that advance the step
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                form={`step-${currentStep}`}
                disabled={isSubmitting}
                className="btn-brand text-lg px-8 py-3"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </motion.button>
            ) : (
              // Step 5 is handled by the form submit button
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                form={`step-${currentStep}`}
                disabled={isSubmitting}
                className="btn-brand text-lg px-8 py-3"
              >
                Complete Setup
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Step Images */}
        <div className="mt-12 text-center">
          <Image
            src={steps[currentStep - 1].image}
            alt={steps[currentStep - 1].title}
            width={600}
            height={300}
            className="rounded-2xl shadow-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
}