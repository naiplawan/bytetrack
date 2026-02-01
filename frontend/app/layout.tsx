import type { Metadata } from 'next';
import { Lora, Raleway } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ConditionalLayout } from '@/components/conditional-layout';
import LanguageToggle from '@/components/language-toggle';
import { LangProvider } from '@/components/lang-provider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

// NEW: Vibrant & Block-based typography
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ByteTrack - Track Your Health Journey',
  description:
    'A modern calorie tracking and wellness application with Thai language support. Track calories, monitor activity, and achieve your health goals.',
  keywords: ['calorie tracker', 'health', 'wellness', 'diet', 'fitness', 'thai food'],
  authors: [{ name: 'ByteTrack Team' }],
  openGraph: {
    title: 'ByteTrack',
    description: 'Track your health journey with our comprehensive calorie and wellness app',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${raleway.variable} font-sans antialiased`}>
        <LangProvider>
          <LanguageProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <ConditionalLayout>{children}</ConditionalLayout>
                <LanguageToggle />
                <Toaster />
              </ThemeProvider>
            </AuthProvider>
          </LanguageProvider>
        </LangProvider>
      </body>
    </html>
  );
}
