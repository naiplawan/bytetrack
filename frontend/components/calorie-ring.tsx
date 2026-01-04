'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { t } from '@/lib/translations';

interface CalorieRingProps {
  consumed: number;
  target: number;
}

export default function CalorieRing({ consumed, target }: CalorieRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Calculate dimensions
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Calculate progress
    const progress = Math.min(consumed / target, 1);
    const remaining = 1 - progress;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw progress ring with animation
    if (progress > 0) {
      // Animate the progress ring
      let currentProgress = 0;
      const animationDuration = 1000; // ms
      const startTime = performance.now();

      const animateRing = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        currentProgress = Math.min(elapsed / animationDuration, 1) * progress;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * currentProgress);
        ctx.strokeStyle = '#c2e8d7';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw dashed ring overlay
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw text
        ctx.fillStyle = 'black';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(currentProgress * target).toString(), centerX, centerY - 10);

        ctx.fillStyle = 'gray';
        ctx.font = '14px sans-serif';
        ctx.fillText(t('dashboard_kcal_i18n'), centerX, centerY + 15);

        if (elapsed < animationDuration) {
          requestAnimationFrame(animateRing);
        }
      };

      requestAnimationFrame(animateRing);
    } else {
      // Draw dashed ring overlay
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw text
      ctx.fillStyle = 'black';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('0', centerX, centerY - 10);

      ctx.fillStyle = 'gray';
      ctx.font = '14px sans-serif';
      ctx.fillText(t('dashboard_kcal_i18n'), centerX, centerY + 15);
    }
  }, [consumed, target]);

  return (
    <motion.div
      className="relative w-48 h-48 mx-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </motion.div>
  );
}
