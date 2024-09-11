"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FlipWords } from "@/components/ui/flip-words";
import Footer from "@/components/functions/Footer";
import Auth from "@/components/functions/AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/functions/Header";

export default function Landing() {
  const words = ["Growth", "Innovation", "Technology"];
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 sm:pt-20 lg:pt-0">
        <HeroHighlight>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -5, 0] }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-700 dark:text-white leading-tight sm:leading-snug lg:leading-relaxed w-full text-left max-w-fit px-4 sm:px-6 lg:px-8"
          >
            Transforming India&apos;s Cities:<br className="hidden sm:inline" /> Accelerating{" "}
            <FlipWords className="p-0" words={words} />
            <br className="hidden sm:inline" /> For a smarter tomorrow.
          </motion.h1>
        </HeroHighlight>
      </main>

      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="w-11/12 max-w-md sm:w-96">
          <Auth />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}