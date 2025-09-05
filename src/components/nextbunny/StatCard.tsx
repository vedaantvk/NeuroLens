/**
 * @description A stat card component
 * @category Stat
 * @subcategory Card
 */

"use client";
import { motion } from "framer-motion";

interface StatCardProps {
  stat: {
    value: string;
    text: string;
  };
  index: number;
}

export default function StatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      key={index}
      className="group relative bg-background/50 backdrop-blur-xs border border-border/50 rounded-xl p-6 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
        <div className="text-sm text-muted-foreground">{stat.text}</div>
      </div>
    </motion.div>
  );
}
