/**
 * @description A waitlist component
 * @category Waitlist
 * @subcategory Waitlist
 */

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubscribed) {
      timer = setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isSubscribed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement email subscription logic
      setEmail("");
      setIsSubscribed(true);
    } catch (error) {
      console.error("Error subscribing:", error);
      setIsSubscribed(true);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-2 sm:px-0">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Input
            type="email"
            placeholder="Enter your email to join waitlist"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 sm:h-12 bg-background border-2 border-primary/40 focus:border-primary placeholder:text-muted-foreground/70 text-foreground text-sm sm:text-base flex-grow"
          />
          <Button
            type="submit"
            size="lg"
            className="h-11 sm:h-12 rounded-md sm:rounded-full px-5 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex-shrink-0 text-sm sm:text-base w-full sm:w-auto"
          >
            Join Now
          </Button>
        </div>
      </form>
      {isSubscribed && (
        <div className="absolute mt-1 sm:mt-2 text-green-500 text-sm sm:text-base font-medium">
          Successfully subscribed! 🎉
        </div>
      )}
    </div>
  );
}
