'use client';

import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function DashboardHeader() {
  return (
    <motion.div className="mb-12" variants={fadeIn} initial="hidden" animate="visible">
      <h1 className="spotify-text-hero text-4xl lg:text-5xl mb-4">Good morning! 👋</h1>
      <p className="spotify-text-body text-xl">Let's track your health journey today</p>
    </motion.div>
  );
}
