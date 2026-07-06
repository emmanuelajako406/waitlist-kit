'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the interface for the component Props
interface CountdownProps {
  launchDate: string;
}

// Sub-component to handle smooth vertical rolling animation for numbers
function AnimatedDigit({ value }: { value: number }) {
  return (
    <div className="relative h-9 overflow-hidden flex justify-center items-center px-1">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-2xl font-bold text-foreground tabular-nums block"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Main Countdown Component
export function CountdownTimer({ launchDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(launchDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  // Prevents Hydration mismatch errors between server and client build
  if (!isMounted) {
    return (
      <div className="flex justify-center gap-4 my-6 opacity-0 animate-pulse">
        <div className="h-20 w-16 bg-foreground rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 my-6 text-center">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div 
          key={label} 
          className="bg-background border border-foreground/10 
          rounded-lg p-3 min-w-19 shadow-md flex flex-col justify-center"
        >
          {/* Animated counter display */}
          <AnimatedDigit value={value} />
          
          {/* Label under the number */}
          <div className="text-xs text-foreground/80 
          uppercase tracking-wider mt-1 font-medium">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}