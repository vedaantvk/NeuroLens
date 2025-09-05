/**
 * @description A beautiful floating particle component
 * @category Features
 * @subcategory Floating Particle
 */

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function FloatingParticle({ index }: { index: number }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <motion.div
      key={index}
      className="absolute w-2 h-2 bg-primary/30"
      initial={{
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
      }}
      animate={{
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
        delay: Math.random() * 5,
      }}
    />
  );
}
