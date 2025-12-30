'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { WheelPickerOption } from '@/components/wheel-picker';
import { WheelPicker, WheelPickerWrapper } from '@/components/wheel-picker';

const formSchema = z.object({
  height: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

// Generate height options from 100cm to 250cm
const heightOptions: WheelPickerOption[] = Array.from({ length: 151 }, (_, i) => {
  const height = 100 + i;
  return {
    label: `${height} cm`,
    value: height.toString(),
  };
});

interface WheelHeightInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function WheelHeightInput({ value, onChange, placeholder }: WheelHeightInputProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: value || '170',
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = (values) => {
    if (onChange) {
      onChange(values.height);
    }
    toast('Height selected:', {
      description: `${values.height} cm`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-full space-y-4">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>

              <FormControl>
                <WheelPickerWrapper>
                  <WheelPicker
                    options={heightOptions}
                    value={field.value}
                    onValueChange={(value) => {
                      const stringValue = String(value);
                      field.onChange(stringValue);
                      if (onChange) {
                        onChange(stringValue);
                      }
                    }}
                  />
                </WheelPickerWrapper>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
