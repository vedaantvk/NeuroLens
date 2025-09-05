"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import RatingStars from "@/components/nextbunny/RatingStars";
import Waves from "@/components/backgrounds/Waves";
const avatars = [{
  src: "/images/Rating1.webp",
  alt: "User testimonial 1"
}, {
  src: "/images/Rating2.jpg",
  alt: "User testimonial 2"
}, {
  src: "/images/Rating3.png",
  alt: "User testimonial 3"
}];
const stars = Array.from({
  length: 5
}, (_, i) => i + 1);
const particles = Array.from({
  length: 100
}, (_, i) => i);
export default function BlueHero() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);
  return <div className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
      <Waves />

      {}
      <div className="absolute inset-0">
        {}
        <div className="absolute top-0 left-0 w-[40%] h-[70%] bg-primary/15 blur-[120px] rounded-full transform -rotate-12 translate-x-[-30%] translate-y-[-90%]" />

        {}
        <div className="absolute bottom-0 right-0 w-[40%] h-[70%] bg-primary/15 blur-[120px] rounded-full transform rotate-12 translate-x-[30%] translate-y-[90%]" />
      </div>

      {}
      <div className="absolute inset-0">
        {isClient && particles.map(i => <motion.div key={i} className="absolute h-1 w-1 bg-primary/40 rounded-full" initial={{
        opacity: 0.1,
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height
      }} animate={{
        opacity: [0.1, 0.6, 0.1],
        scale: [1, 1.5, 1]
      }} transition={{
        duration: Math.random() * 4 + 2,
        repeat: Infinity,
        ease: "easeInOut"
      }} />)}
      </div>

      {}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="max-w-5xl mx-auto z-10">
        {}
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          NeuroLens
          <br />
          Market Leader Tomorrow.
        </motion.h1>

        {}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="text-muted-foreground text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Stop perfecting. Start launching.
          <br />
          Build your MVP in 24 hours and let the market guide you.
        </motion.p>

        {}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} className="flex flex-col items-center gap-4 mb-12">
          <div className="flex -space-x-4">
            {avatars.map((avatar, i) => <Image key={i} src={avatar.src} alt={avatar.alt} width={48} height={48} className="rounded-full border-2 border-border object-cover transition-transform duration-200 hover:scale-110 hover:z-10" />)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {stars.map(i => <RatingStars key={i} i={i} />)}
            </div>
            <span className="text-muted-foreground text-sm">
              Trusted by 70,000+ customers
            </span>
          </div>
        </motion.div>

        {}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1
      }}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-8 py-6 text-lg">
            Start Free Trial →
          </Button>
        </motion.div>
      </motion.div>
    </div>;
}