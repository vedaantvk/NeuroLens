"use client";

import { motion } from "framer-motion";
export default function HardToResist() {
  const benefits = [{
    title: "No Signup Required",
    description: "Jump right in and start creating. Everything runs in your browser - no accounts, no hassle.",
    icon: "🎯"
  }, {
    title: "Browser Powered",
    description: "Lightning-fast performance with client-side magic. No waiting, just instant creation.",
    icon: "⚡"
  }, {
    title: "Zero Cost Forever",
    description: "Built to run entirely in your browser. No servers means no costs, so we keep it free forever.",
    icon: "💫"
  }, {
    title: "Pure Visual Magic",
    description: "The only visual editor you'll need. Create unlimited projects with zero restrictions.",
    icon: "✨"
  }];
  return <section className="relative py-24">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-center mb-16">
          <h2 className="md:text-5xl font-bold mb-6 sm:text-3xl text-[1.6rem]">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Pure Value
            </span>{" "}
            for Developers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto sm:text-lg">
            We&apos;ve reimagined what&apos;s possible in your browser. Start
            creating instantly, with no barriers between you and your next great
            project.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {benefits.map((benefit, index) => <motion.div key={benefit.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: index * 0.2
        }} className="flex items-start space-x-6 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-secondary/20 rounded-full blur-lg transition-all duration-500 group-hover:opacity-100 opacity-0" />
                <div className="relative text-4xl bg-background/50 p-4 rounded-full">
                  {benefit.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}