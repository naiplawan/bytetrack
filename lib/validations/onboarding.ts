import { z } from 'zod';

export const onboardingSchema = z.object({
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 18 && num <= 100;
    }, 'Age must be between 18 and 100'),

  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),

  height: z
    .string()
    .min(1, 'Height is required')
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 100 && num <= 250;
    }, 'Height must be between 100 and 250 cm'),

  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 30 && num <= 300;
    }, 'Weight must be between 30 and 300 kg'),

  goalWeight: z
    .string()
    .min(1, 'Goal weight is required')
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 30 && num <= 300;
    }, 'Goal weight must be between 30 and 300 kg'),

  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very', 'extreme'], {
    required_error: 'Activity level is required',
  }),

  goal: z.enum(['lose', 'maintain', 'gain'], {
    required_error: 'Goal is required',
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Step-specific validation schemas
export const step1Schema = onboardingSchema.pick({
  age: true,
  gender: true,
});

export const step2Schema = onboardingSchema.pick({
  height: true,
  weight: true,
  goalWeight: true,
});

export const step3Schema = onboardingSchema.pick({
  activityLevel: true,
});

export const step4Schema = onboardingSchema.pick({
  goal: true,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
