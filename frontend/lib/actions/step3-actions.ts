'use server';

export interface Step3Data {
  height?: number;
  weight?: number;
  target_weight?: number;
}

export async function validateStep3(data: Step3Data): Promise<{ valid: boolean; errors?: { [key: string]: string } }> {
  const errors: { [key: string]: string } = {};

  if (!data.height || data.height < 50 || data.height > 300) {
    errors.height = 'Please enter a valid height (50-300 cm)';
  }

  if (!data.weight || data.weight < 20 || data.weight > 300) {
    errors.weight = 'Please enter a valid weight (20-300 kg)';
  }

  if (data.target_weight && (data.target_weight < 20 || data.target_weight > 300)) {
    errors.target_weight = 'Please enter a valid target weight (20-300 kg)';
  }

  if (data.target_weight && data.target_weight === data.weight) {
    errors.target_weight = 'Target weight should be different from current weight';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

export async function saveStep3Data(data: Step3Data) {
  const validation = await validateStep3(data);

  if (!validation.valid) {
    throw new Error('Validation failed');
  }

  return { success: true, data };
}