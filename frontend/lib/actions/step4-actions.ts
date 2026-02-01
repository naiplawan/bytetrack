'use server';

export interface Step4Data {
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
}

export async function validateStep4(data: Step4Data): Promise<{ valid: boolean; errors?: { [key: string]: string } }> {
  const errors: { [key: string]: string } = {};

  if (!data.activity_level) {
    errors.activity_level = 'Activity level is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

export async function saveStep4Data(data: Step4Data) {
  const validation = await validateStep4(data);

  if (!validation.valid) {
    throw new Error('Validation failed');
  }

  return { success: true, data };
}