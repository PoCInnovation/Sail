"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PixelStars() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random stars
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.5 ? 16 : 20, // Two sizes - increased from 10/15 to 16/20
    duration: Math.random() * 2 + 2, // 2-4s duration
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-walrus-mint/40 font-pixel leading-none select-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${star.size}px`,
          }}
          animate={{
            scale: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
            rotate: [0, 0, 90, 90],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            times: [0, 0.1, 0.9, 1],
            ease: "easeInOut",
          }}
        >
          +
        </motion.div>
      ))}
    </div>
  );
}
