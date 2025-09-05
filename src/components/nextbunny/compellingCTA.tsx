"use client";

import { motion } from "framer-motion";
import Waitlist from "@/components/nextbunny/waitlist";
import FloatingParticle from "@/components/nextbunny/FloatingParticle";
import StatCard from "@/components/nextbunny/StatCard";
const STATS_DATA = [{
  value: "73%",
  text: "of successful startups launched MVP in under 7 days"
}, {
  value: "10x",
  text: "faster time-to-market with our components"
}, {
  value: "10k+",
  text: "developers already building faster"
}];
export default function CallToAction() {
  return <div className="relative py-32 overflow-hidden">
      {}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      {}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({
        length: 20
      }).map((_, i) => <FloatingParticle key={i} index={i} />)}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="relative">
          {}
          <div className="rounded-2xl border border-border/50 bg-background/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 [box-shadow:inset_1px_1px_0px_0px_rgba(255,255,255,0.1)] dark:[box-shadow:inset_1px_1px_0px_0px_rgba(255,255,255,0.05)]">
            <div className="space-y-8">
              {}
              <motion.div className="w-fit mx-auto" animate={{
              scale: [1, 1.02, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }}>
                <span className="relative inline-flex">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                    THE RACE TO LAUNCH IS ON
                  </span>
                  <span className="absolute inset-0 rounded-full blur-md bg-primary/20 animate-pulse" />
                </span>
              </motion.div>

              <h2 className="md:text-6xl font-bold leading-tight text-center text-2xl">
                In the AI Era,{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
                    Speed is Your Superpower
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-primary/0 via-primary to-primary/0" />
                </span>
              </h2>

              <div className="space-y-4 text-muted-foreground max-w-2xl mx-auto text-center">
                <p className="sm:text-lg">
                  Launch your idea 10x faster with Nextbunny and beat the
                  competition.{new Date().getFullYear()}
                </p>
                <p className="text-sm font-medium">
                  Every day of delay is a missed opportunity in the AI gold
                  rush.
                </p>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
                {STATS_DATA.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
              </div>

              {}
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/20 to-secondary/20 blur-xl" />
                <Waitlist />
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Join thousands of developers who are already building the
                future.
                <br />
                <span className="text-primary font-medium">
                  Your competition isn&apos;t waiting. Why should you?
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
}