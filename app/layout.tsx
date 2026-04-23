import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ConditionalLayout } from '@/components/conditional-layout';
import LanguageToggle from '@/components/language-toggle';
import { LangProvider } from '@/components/lang-provider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ByteTrack',
  description:
    'Calorie tracking and nutrition analysis. Log meals, monitor macros, track progress.',
  authors: [{ name: 'ByteTrack' }],
  openGraph: {
    title: 'ByteTrack',
    description: 'Calorie tracking and nutrition analysis.',
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
      <body className={`${onest.variable} font-sans antialiased`}>
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
