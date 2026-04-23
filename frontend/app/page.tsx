'use client';

import Link from 'next/link';
import {
  Apple,
  BarChart3,
  Target,
  ArrowRight,
  Check,
} from 'lucide-react';

const features = [
  {
    icon: Apple,
    title: 'Nutrition Tracking',
    description: 'Log meals with detailed macro and calorie breakdowns',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Weekly and monthly charts with trend analysis',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Personalized calorie and macro targets based on your profile',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">ByteTrack</span>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/onboarding"
              className="btn-brand text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="main-content" className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary mb-4">Calorie tracking, simplified</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Know what you eat.
            <br />
            <span className="text-muted-foreground">Track everything else.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
            Log meals, monitor macros, and track your progress with precise
            nutritional data. Built for consistency, not motivation.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/onboarding">
              <button className="btn-brand">
                Start Tracking
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Precise data, not guesswork
            </h2>
            <p className="text-muted-foreground">
              Every calorie counted. Every macro tracked. The numbers don&apos;t lie.
            </p>
          </div>
          <ul className="space-y-4 max-w-lg">
            {[
              'Detailed nutritional breakdowns for every meal',
              'Personalized targets based on your body and goals',
              'Weekly reports with actionable insights',
              'Thai and international food database',
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Start tracking today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Set up your profile in 2 minutes. No credit card required.
          </p>
          <Link href="/onboarding">
            <button className="btn-brand text-base px-8 py-4">
              Create Profile
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">ByteTrack</span>
          <span className="text-xs text-muted-foreground">Calorie tracking and nutrition analysis</span>
        </div>
      </footer>
    </div>
  );
}
